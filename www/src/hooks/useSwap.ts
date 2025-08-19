import { useState, useCallback } from 'react'
import { Address, parseUnits, formatUnits } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { getPublicClient } from '../lib/viemClient'

// Base network token addresses (official)
export const BASE_TOKENS = {
  WETH: '0x4200000000000000000000000000000000000006' as Address,
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address,
  USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2' as Address,
  DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' as Address,
}

export interface Token {
  address: Address
  symbol: string
  name: string
  decimals: number
}

export interface SwapQuote {
  buyAmount: string
  sellAmount: string
  price: string
  estimatedGas: string
  sources: Array<{ name: string; proportion: string }>
  priceImpact?: string
  gasPrice?: string
  to?: string
  data?: string
  value?: string
}

// Real Base network tokens from multiple DEXes
export const DEFAULT_TOKENS: Token[] = [
  { address: BASE_TOKENS.WETH, symbol: 'WETH', name: 'Wrapped Ether', decimals: 18 },
  { address: BASE_TOKENS.USDC, symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  { address: BASE_TOKENS.USDT, symbol: 'USDT', name: 'Tether USD', decimals: 6 },
  { address: BASE_TOKENS.DAI, symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18 },
  { address: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed' as Address, symbol: 'DEGEN', name: 'Degen', decimals: 18 },
  { address: '0x532f27101965dd16442E59d40670FaF5eBB142E4' as Address, symbol: 'BRETT', name: 'Brett', decimals: 18 },
  { address: '0x0578d8A44db98B23BF096A382e016e29a5Ce0ffe' as Address, symbol: 'HIGHER', name: 'Higher', decimals: 18 },
  { address: '0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2' as Address, symbol: 'TAO', name: 'Wrapped TAO', decimals: 9 },
  { address: '0x27D2DECb4bFC9C76F0309b8E88dec3a601Fe25a8' as Address, symbol: 'BALD', name: 'Bald', decimals: 18 },
  { address: '0x6985884C4392D348587B19cb9eAAf157F13271cd' as Address, symbol: 'ZRO', name: 'LayerZero', decimals: 18 },
  { address: '0xA88594D404727625A9437C3f886C7643872296AE' as Address, symbol: 'WELL', name: 'Moonwell', decimals: 18 },
  { address: '0x22e6966B799c4D5B13BE962E1D117b56327FDa66' as Address, symbol: 'SEAM', name: 'Seamless', decimals: 18 },
]

export const useSwap = () => {
  const { address, chainId } = useAccount()
  // Use correct public client for Base if on Base chain
  const publicClient = chainId === 8453 ? getPublicClient('base') : usePublicClient()
  const { data: walletClient } = useWalletClient()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tokens] = useState<Token[]>(DEFAULT_TOKENS)

  // Get quote using multiple APIs (OKX DEX API as primary, DexFlow as fallback)
  const getQuote = useCallback(async (
    sellToken: Address,
    buyToken: Address,
    sellAmount: string
  ): Promise<SwapQuote | null> => {
    if (!sellAmount || parseFloat(sellAmount) <= 0) return null
    
    setIsLoading(true)
    setError(null)
    
    try {
      const sellTokenData = tokens.find(t => t.address.toLowerCase() === sellToken.toLowerCase())
      const buyTokenData = tokens.find(t => t.address.toLowerCase() === buyToken.toLowerCase())
      
      if (!sellTokenData || !buyTokenData) {
        throw new Error('Token not found in supported list')
      }
      
      const sellAmountWei = parseUnits(sellAmount, sellTokenData.decimals)
      
      // First, try our local aggregator proxy to avoid CORS/auth issues
      try {
        console.log('Trying local aggregator proxy...')
        const proxyParams = new URLSearchParams({ sellToken: sellToken.toLowerCase(), buyToken: buyToken.toLowerCase(), sellAmount: sellAmountWei.toString() })
        const proxyUrl = `/api/aggregator/quote?${proxyParams}`

        // Use relative URL in-browser; server-side or dev proxy should forward to the local service
        const proxyResponse = await fetch(proxyUrl, { headers: { 'Content-Type': 'application/json' } })
        if (proxyResponse.ok) {
          const proxyData = await proxyResponse.json()
          console.log('Aggregator proxy returned:', proxyData?.source)
          // unbox provider data if present
          const payload = proxyData.data || proxyData
          // try to normalize common fields
          const buyAmount = payload.toTokenAmount || payload.buyAmount || payload.toAmount || payload.to_token_amount || payload.receiveAmount
          const sellAmountResp = payload.fromTokenAmount || payload.sellAmount || payload.fromAmount || payload.from_token_amount || payload.sendAmount
          const estimatedGas = payload.estimatedGas || payload.estimatedGasFee || payload.estimated_gas || '0'
          const sources = payload.protocols || payload.sources || []
          if (buyAmount && sellAmountResp) {
            return {
              buyAmount: String(buyAmount),
              sellAmount: String(sellAmountResp),
              price: (parseFloat(String(buyAmount)) / parseFloat(String(sellAmountResp))).toString(),
              estimatedGas: String(estimatedGas),
              sources: Array.isArray(sources) ? sources : [],
            }
          }
        } else {
          console.warn('Aggregator proxy returned non-ok status', proxyResponse.status)
        }
      } catch (proxyErr) {
        console.warn('Local aggregator proxy failed, falling back to direct providers...', proxyErr)
      }

      // Fallback to DexFlow API
      try {
        console.log('Trying DexFlow API...')
        const dexflowParams = new URLSearchParams({
          chainId: '8453',
          sellToken: sellToken.toLowerCase(),
          buyToken: buyToken.toLowerCase(),
          sellAmount: sellAmountWei.toString(),
          slippagePercentage: '1'
        })

        const dexflowResponse = await fetch(`https://api.dexflow.dev/v1/quote?${dexflowParams}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (dexflowResponse.ok) {
          const dexflowData = await dexflowResponse.json()
          console.log('DexFlow response:', dexflowData)
          
          return {
            buyAmount: dexflowData.buyAmount,
            sellAmount: dexflowData.sellAmount,
            price: dexflowData.price,
            estimatedGas: dexflowData.estimatedGas || '0',
            sources: dexflowData.sources || [],
            priceImpact: dexflowData.priceImpact
          }
        }
      } catch (dexflowError) {
        console.warn('DexFlow API also failed...', dexflowError)
      }

      // Final fallback - 1inch API (widely used)
      try {
        console.log('Trying 1inch API as final fallback...')
        const oneinchParams = new URLSearchParams({
          fromTokenAddress: sellToken.toLowerCase(),
          toTokenAddress: buyToken.toLowerCase(),
          amount: sellAmountWei.toString(),
          fromAddress: address || '0x0000000000000000000000000000000000000000',
          slippage: '1',
          disableEstimate: 'true'
        })

        const oneinchResponse = await fetch(`https://api.1inch.io/v5.0/8453/quote?${oneinchParams}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (oneinchResponse.ok) {
          const oneinchData = await oneinchResponse.json()
          console.log('1inch response:', oneinchData)
          
          return {
            buyAmount: oneinchData.toTokenAmount,
            sellAmount: oneinchData.fromTokenAmount,
            price: (parseFloat(oneinchData.toTokenAmount) / parseFloat(oneinchData.fromTokenAmount)).toString(),
            estimatedGas: oneinchData.estimatedGas || '0',
            sources: oneinchData.protocols ? oneinchData.protocols.flat().map((protocol: any) => ({
              name: protocol.name,
              proportion: `${protocol.part}%`
            })) : []
          }
        }
      } catch (oneinchError) {
        console.warn('1inch API also failed...', oneinchError)
      }

      throw new Error('All DEX APIs failed - no liquidity available')
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to get quote from any DEX API'
      console.error('Quote error:', errorMsg)
      setError(errorMsg)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [address, tokens])

  // Execute swap using the best available API
  const executeSwap = useCallback(async (
    sellToken: Address,
    buyToken: Address,
    sellAmount: string
  ): Promise<string | null> => {
    if (!address || !walletClient) {
      setError('Wallet not connected')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      // For now, just return success message since transaction execution
      // requires more complex wallet integration setup
      setError('Transaction ready - swap execution requires wallet integration setup')
      return 'mock-tx-hash-swap-ready'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Swap execution failed')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [address, walletClient])

  // Add custom token by address
  const addToken = useCallback(async (tokenAddress: Address): Promise<Token | null> => {
    if (!publicClient) return null
    
    try {
      // Fetch token metadata from contract
      const [name, symbol, decimals] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress,
          abi: [{ name: 'name', outputs: [{ type: 'string' }], type: 'function' }],
          functionName: 'name',
        }),
        publicClient.readContract({
          address: tokenAddress,
          abi: [{ name: 'symbol', outputs: [{ type: 'string' }], type: 'function' }],
          functionName: 'symbol',
        }),
        publicClient.readContract({
          address: tokenAddress,
          abi: [{ name: 'decimals', outputs: [{ type: 'uint8' }], type: 'function' }],
          functionName: 'decimals',
        }),
      ])

      return {
        address: tokenAddress,
        name: name as string,
        symbol: symbol as string,
        decimals: decimals as number,
      }
    } catch (err) {
      setError('Failed to fetch token data')
      return null
    }
  }, [publicClient])

  return {
    tokens,
    isLoading,
    error,
    getQuote,
    executeSwap,
    addToken,
    isConnected: !!address,
    chainId,
  }
}
