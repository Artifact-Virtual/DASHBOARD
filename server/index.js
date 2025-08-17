// Load environment variables from .env.local if present
try {
	require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') })
} catch (e) {
	// dotenv is optional in runtime environments where env vars are provided by the host
	// Continue silently if dotenv is not available
}

const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const { quoteHandler, prepareSwapHandler } = require('./lib/aggregator')

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

// Basic rate limiting to protect upstream providers
const limiter = rateLimit({
	windowMs: 15 * 1000, // 15 seconds
	max: 20, // limit each IP to 20 requests per windowMs
	standardHeaders: true,
	legacyHeaders: false,
})
app.use('/api/', limiter)

// Simple in-memory cache for short-lived quotes
const cache = new Map()
const CACHE_TTL_MS = 5 * 1000 // 5 seconds

app.get('/api/aggregator/quote', async (req, res) => {
	try {
		console.log('GET /api/aggregator/quote query:', req.query)
		const key = `${req.query.sellToken}|${req.query.buyToken}|${req.query.sellAmount}`
		const now = Date.now()
		if (cache.has(key)) {
			const entry = cache.get(key)
			if (now - entry.ts < CACHE_TTL_MS) return res.json({ cached: true, ...entry.value })
			cache.delete(key)
		}

		const result = await quoteHandler(req.query)
		if (!result) return res.status(502).json({ error: 'no liquidity from providers' })
		if (result.error) {
			const status = result.error === 'missing param' ? 400 : 502
			return res.status(status).json(result)
		}
		cache.set(key, { ts: now, value: result })
		return res.json(result)
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'internal' })
	}
})

app.post('/api/aggregator/prepare-swap', async (req, res) => {
	try {
		const result = await prepareSwapHandler(req.body)
		if (!result) return res.status(502).json({ error: 'no swap payload available' })
		return res.json(result)
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'internal' })
	}
})

// Health endpoint for quick checks
app.get('/health', (req, res) => {
	res.json({ ok: true, pid: process.pid })
})

const PORT = process.env.PORT || 4000
const HOST = process.env.HOST || '127.0.0.1'
// Log whether OKX credentials are loaded (do not print secrets)
try {
	const okxConfigured = !!(process.env.OKX_API_KEY && process.env.OKX_API_SECRET && process.env.OKX_API_PASSPHRASE)
	console.log('OKX credentials present:', okxConfigured)
} catch (e) { /* ignore */ }
const server = app.listen(PORT, HOST, () => {
	console.log(`AV aggregator proxy listening on ${PORT} (${HOST})`)
	try {
		console.log('server.address():', server.address())
	} catch (e) { console.warn('failed to read server.address()', e) }
}).on('error', (err) => console.error('Server listen error', err))

process.on('uncaughtException', (err) => {
	console.error('Uncaught exception in proxy', err)
})
process.on('unhandledRejection', (reason) => {
	console.error('Unhandled rejection in proxy', reason)
})
