# Onchain Architecture & Smart Contracts

This document provides a comprehensive overview of all blockchain logic, smart contracts, and onchain infrastructure for the Artifact Virtual platform. It is maintained to the same standard as the root project documentation. For tokenomics and deployment details, see `data/information-sheet.md`.

---

## Overview

The onchain layer consists of:
- **ProfileRegistry**: A minimal, gas-efficient registry mapping user addresses to profile CIDs (IPFS).
- **SimpleSwap**: A basic automated market maker (AMM) DEX for ERC20 swaps, liquidity pools, and fee management.
- **Deployment & Scripts**: Hardhat-based scripts for deployment, pool initialization, and e2e testing.

All contracts are written in Solidity ^0.8.x, use OpenZeppelin libraries, and are designed for security, extensibility, and low gas.

---

## Contracts

### 1. ProfileRegistry

- **Purpose**: Maps Ethereum addresses to profile CIDs (IPFS hashes).
- **Key Functions**:
  - `setProfile(string cid)`: Sets the profile CID for the sender. Emits `ProfileSet` event.
  - `getProfile(address owner)`: Returns the profile CID for a given address.
- **Events**:
  - `ProfileSet(address owner, string cid)`
- **Security**: Only the address owner can set their profile. No admin or privileged roles.
- **Gas**: Extremely efficient, single mapping, no iteration.

### 2. SimpleSwap

- **Purpose**: Minimal AMM DEX for ERC20 swaps, liquidity pools, and fee management.
- **Key Features**:
  - **Pools**: Create pools for any two supported tokens, with configurable fees (max 5%).
  - **Liquidity**: Add liquidity to pools, update reserves.
  - **Swaps**: Swap tokens with slippage protection and deadline.
  - **Quotes**: Get output amount for a given input (off-chain quoting supported).
  - **Emergency Controls**: Owner can withdraw stuck tokens.
- **Key Functions**:
  - `createPool(address tokenA, address tokenB, uint256 fee)`
  - `addSupportedToken(address token)`
  - `addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB)`
  - `swap(SwapParams params)`
  - `getQuote(address tokenIn, address tokenOut, uint256 amountIn)`
  - `emergencyWithdraw(address token, uint256 amount)`
- **Security**:
  - Uses OpenZeppelin `Ownable`, `ReentrancyGuard`, and `SafeERC20`.
  - Only owner can create pools and add supported tokens.
  - All user funds are non-custodial except during swaps/liquidity events.

---

## Deployment & Testing

- **Framework**: Hardhat
- **Deployment Scripts**:
  - `deploy.js`: Deploys ProfileRegistry
  - `deploy-swap.js`: Deploys SimpleSwap, adds supported tokens, creates pools
- **E2E Test**:
  - `e2e-setprofile.js` and `e2e-setprofile.test.js`: Sets and verifies a profile on a local chain
- **Artifacts**: Full ABI and bytecode in `contracts/artifacts/`

---

## Security & Best Practices

- **Audited**: All contracts use OpenZeppelin standards and are designed for auditability.
- **Role Management**: Only owner can perform admin actions in SimpleSwap; ProfileRegistry is fully user-controlled.
- **Emergency Controls**: Owner can withdraw tokens in emergencies.
- **Testing**: E2E and unit tests for all critical flows.

---

## References

- **Tokenomics, addresses, and deployment**: See `data/information-sheet.md`
- **Contract ABIs**: See `contracts/artifacts/`
- **Deployment scripts**: See `contracts/scripts/`
- **Tests**: See `contracts/test/`

---

For any architectural or operational changes, update this document and the information sheet. This file is the single source of truth for all onchain logic in Artifact Virtual.
