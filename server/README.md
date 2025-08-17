AV Aggregator Proxy

This is a small proxy service that queries multiple DEX aggregator APIs and returns the first successful quote or swap payload. It intentionally does not brand responses with upstream provider names in the public API — the `source` field is included for diagnostics only.

Endpoints

- GET /api/aggregator/quote?sellToken=&buyToken=&sellAmount=
  - Queries 0x → 1inch → OKX → DexFlow and returns the first working quote as JSON.

- POST /api/aggregator/prepare-swap
  - Body: { sellToken, buyToken, sellAmount, takerAddress }
  - Returns a normalized payload (provider response) which can be used to construct a wallet transaction.

Run locally:

1. cd server
2. npm install
3. npm run dev

Notes

- Some upstream providers may require API keys or block server-side requests depending on CORS and rate limits.
- This proxy helps avoid CORS issues in the browser and consolidates provider logic.
