let __fetch = global.fetch
if (!__fetch) {
  try {
    const nf = require('node-fetch')
    __fetch = nf.default || nf
  } catch (e) {
    throw new Error('fetch not available: use Node >=18 or install node-fetch')
  }
}

const crypto = require('crypto')

function getEnv(name, fallback = undefined) {
  const v = process.env[name]
  return v === undefined || v === '' ? fallback : v
}

// Basic OKX API signing (only if fully configured)
function buildOkxHeaders(method, requestPath, body = '') {
  const key = getEnv('OKX_API_KEY') || getEnv('ARCX_EXCHANGE') // support legacy var name
  const secret = getEnv('OKX_API_SECRET')
  const passphrase = getEnv('OKX_API_PASSPHRASE')

  const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'AV-Proxy/1.0' }

  // If we don't have full credentials, return minimal headers and let caller decide to skip OKX
  if (!key || !secret || !passphrase) {
    return { headers, configured: false }
  }

  const timestamp = new Date().toISOString()
  const prehash = timestamp + method.toUpperCase() + requestPath + (body || '')
  const sign = crypto.createHmac('sha256', secret).update(prehash).digest('base64')

  headers['OK-ACCESS-KEY'] = key
  headers['OK-ACCESS-SIGN'] = sign
  headers['OK-ACCESS-TIMESTAMP'] = timestamp
  headers['OK-ACCESS-PASSPHRASE'] = passphrase
  return { headers, configured: true }
}

async function try0xQuote(sellToken, buyToken, sellAmount) {
  try {
    console.log('try0xQuote v2', sellToken, buyToken, sellAmount)
    // Use 0x v2 permit2 endpoint with explicit chainId
    const params = new URLSearchParams({
      sellToken,
      buyToken,
      sellAmount: String(sellAmount),
      chainId: '8453',
      taker: getEnv('QUOTE_TAKER_ADDRESS', '0x0000000000000000000000000000000000000000'),
    })
    const url = `https://api.0x.org/swap/permit2/quote?${params}`
    const headers = { 'Accept': 'application/json', '0x-version': 'v2' }
    const apiKey = getEnv('ZEROX_API_KEY') || getEnv('OX_API_KEY') || getEnv('ZX_API_KEY')
    if (apiKey) headers['0x-api-key'] = apiKey

    const res = await __fetch(url, { headers })
    const text = await res.text()
    console.log('0x status', res.status, text.slice(0, 300))
    if (!res.ok) return null
    try { return JSON.parse(text) } catch { return null }
  } catch (e) { console.warn('0x error', e.message); return null }
}

async function try1inchQuote(sellToken, buyToken, sellAmount) {
  try {
    console.log('try1inchQuote', sellToken, buyToken, sellAmount)
    const url = `https://api.1inch.io/v5.0/8453/quote?fromTokenAddress=${sellToken}&toTokenAddress=${buyToken}&amount=${sellAmount}`
    const headers = { 'Accept': 'application/json' }
    const oneInchKey = getEnv('ONEINCH_API_KEY')
    if (oneInchKey) headers['Authorization'] = `Bearer ${oneInchKey}`
    const res = await __fetch(url, { headers })
    const text = await res.text()
    console.log('1inch status', res.status, text.slice(0, 300))
    if (!res.ok) return null
    try { return JSON.parse(text) } catch { return null }
  } catch (e) { console.warn('1inch error', e.message); return null }
}

async function tryOkxQuote(sellToken, buyToken, sellAmount) {
  const search = new URLSearchParams({ chainId: '8453', amount: String(sellAmount), fromTokenAddress: sellToken, toTokenAddress: buyToken })
  const requestPath = `/api/v5/dex/aggregator/quote?${search}`
  const url = `https://www.okx.com${requestPath}`
  const { headers, configured } = buildOkxHeaders('GET', requestPath)

  if (!configured) {
    console.warn('OKX not fully configured (missing secret/passphrase); skipping OKX provider')
    return null
  }

  // Retry a few times for transient failures
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      console.log('tryOkxQuote attempt', attempt + 1)
      const res = await __fetch(url, { headers })
      const text = await res.text()
      console.log('OKX status', res.status, text.slice(0, 300))
      if (!res.ok) {
        // small backoff
        await new Promise(r => setTimeout(r, 200 * (attempt + 1)))
        continue
      }
      try { return JSON.parse(text) } catch { return { raw: text } }
    } catch (e) {
      await new Promise(r => setTimeout(r, 200 * (attempt + 1)))
      continue
    }
  }
  return null
}

async function tryDexFlowQuote(sellToken, buyToken, sellAmount) {
  try {
    const params = new URLSearchParams({ chainId: '8453', sellToken, buyToken, sellAmount })
    const url = `https://api.dexflow.dev/v1/quote?${params}`
  const res = await __fetch(url)
    if (!res.ok) return null
    return await res.json()
  } catch (e) { return null }
}

async function quoteHandler(params) {
  const { sellToken, buyToken, sellAmount } = params || {}
  if (!sellToken || !buyToken || !sellAmount) {
    return { error: 'missing param' }
  }

  // Try in order: 0x v2 first (usually public), then 1inch (if key), then DexFlow, then OKX (only if fully configured)
  const tryOrder = [try0xQuote, try1inchQuote, tryDexFlowQuote, tryOkxQuote]
  for (const fn of tryOrder) {
    const data = await fn(sellToken, buyToken, sellAmount)
    if (data) {
  // Normalize common fields from different providers
  const payload = data
  const buyAmount = payload.toTokenAmount || payload.buyAmount || payload.toAmount || payload.to_token_amount || payload.receiveAmount
  const sellAmountResp = payload.fromTokenAmount || payload.sellAmount || payload.fromAmount || payload.from_token_amount || payload.sendAmount
  const estimatedGas = payload.estimatedGas || payload.estimatedGasFee || payload.estimated_gas || payload.estimated_gas_fee || '0'
  const sources = payload.protocols || payload.sources || payload.dexRouterList || []
  const price = payload.price || (buyAmount && sellAmountResp ? (parseFloat(String(buyAmount)) / parseFloat(String(sellAmountResp))).toString() : undefined)

      const out = { source: fn.name, data: { buyAmount: String(buyAmount || ''), sellAmount: String(sellAmountResp || ''), price: price || '', estimatedGas: String(estimatedGas), sources, providerRaw: payload } }
      return out
    }
  }

  return { error: 'no liquidity from providers' }
}

async function prepareSwapHandler(body) {
  const { sellToken, buyToken, sellAmount, takerAddress } = body || {}
  if (!sellToken || !buyToken || !sellAmount || !takerAddress) return { error: 'missing body param' }

  const providers = [try0xQuote, try1inchQuote, tryOkxQuote, tryDexFlowQuote]
  for (const fn of providers) {
    const data = await fn(sellToken, buyToken, sellAmount)
    if (!data) continue
    return { source: fn.name, data }
  }
  return { error: 'no swap payload available' }
}

module.exports = { quoteHandler, prepareSwapHandler }
