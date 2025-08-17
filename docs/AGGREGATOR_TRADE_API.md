# Aggregator Trade API (Prepare Swap)

This endpoint returns a provider-constructed transaction payload that can be used by a wallet to execute a swap.

POST /api/aggregator/prepare-swap

Request body (JSON):
{
  "sellToken": "0x...",
  "buyToken": "0x...",
  "sellAmount": "1000000000000000000",
  "takerAddress": "0x...",
  "slippage": "1" // optional percent
}

Success response (200):
{
  "source": "providerName",
  "data": {
    "to": "0x...",
    "data": "0x...",
    "value": "0",
    "gas": "210000",
    "estimatedGas": "210000",
    "providerResponse": { /* raw provider JSON payload */ }
  }
}

Errors

- 400 Bad Request — missing fields.
- 402 No Liquidity / 502 Bad Gateway — provider could not construct swap payload.
- 5xx Server Error — internal errors.

Security & UX

- Present the payload to the user for confirmation (to, value, approximate gas and price) before invoking the wallet.
- Do not broadcast the transaction without user confirmation.
- Respect slippage tolerances and safety checks.

Example (curl)

curl -X POST https://your-site.example.com/api/aggregator/prepare-swap -H 'Content-Type: application/json' -d '{"sellToken":"0x4200...","buyToken":"0x8335...","sellAmount":"1000000000000000000","takerAddress":"0xyourAddress"}'
