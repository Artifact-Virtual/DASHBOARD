# Aggregator Market API (Quote)

This page documents the Aggregator Market API — a simple, endpoint that returns routing and pricing information for token swaps across multiple liquidity sources.

Overview

- Purpose: return a best-effort quote for swapping a specified amount of token A for token B on a target chain. The service aggregates multiple providers and returns the first successful quote or a normalized error.
- Transport: HTTPS JSON over GET for quotes. Use POST when passing large payloads or sensitive data.
- Typical workflow: frontend requests a quote, receives expected buyAmount, estimated gas, and list of liquidity sources; UI displays this to the user before preparing a swap transaction.

Base endpoint

GET /api/aggregator/quote

Query parameters:
- sellToken (required) — token address to sell (hex checksum or lowercase). Example: 0x4200...0006 (WETH on Base).
- buyToken (required) — token address to buy.
- sellAmount (required) — integer amount in token smallest units (wei for 18-decimal tokens).
- Optional: chainId — numeric chain id if not defaulting to the service's configured network.

Success response (200)

A successful response returns a JSON object containing at minimum:

{
  "source": "providerName",
  "data": {
    "buyAmount": "123000000",      // integer string in smallest units
    "sellAmount": "1000000000000000000",
    "price": "0.000123",          // normalized price (optional)
    "estimatedGas": "210000",     // gas estimate in gas units or wei depending on provider
    "sources": [                    // optional: liquidity providers contributing to the quote
      { "name": "LP1", "proportion": "60%" },
      { "name": "LP2", "proportion": "40%" }
    ],
    // provider-specific fields may include transaction payload data used by trade endpoints
    "to": "0x...",
    "data": "0x...",
    "value": "0"
  }
}

Errors

- 400 Bad Request — missing or malformed parameters.
- 402 No Liquidity / 502 Bad Gateway — upstream providers failed to produce a quote.
- 429 Rate Limited — too many requests; backoff and retry later.
- 5xx Server Error — internal errors.

Notes & Best Practices

- Unit handling: always pass amounts in the token's smallest integer units (wei). Convert user-facing decimals to integers client-side using token.decimals.
- Idempotency: quotes are non-binding and time-sensitive. Always validate buyAmount and price before preparing a swap.
- Price impact & slippage: the response may include a priceImpact field. Use a slippage tolerance when preparing the swap.
- CORS & proxy: some upstream providers require API keys or block browser requests. Use a backend proxy (like the local aggregator proxy in this repo) to avoid CORS and unify provider logic.

Example (curl)

curl "https://your-site.example.com/api/aggregator/quote?sellToken=0x4200000000000000000000000000000000000006&buyToken=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&sellAmount=1000000000000000000"

This returns a JSON payload with price and buyAmount; show it to users and use the trade endpoint to prepare a wallet transaction.
