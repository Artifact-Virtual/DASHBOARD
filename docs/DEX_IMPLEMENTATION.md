# ARCx DEX Implementation

## Overview

This document outlines the implementation of a decentralized exchange (DEX) for the ARCx ecosystem, built for Base network with professional-grade features and security.

## Architecture

### Smart Contracts

#### SimpleSwap.sol
- **Purpose**: Core DEX contract for token swaps with automated market making
- **Location**: `contracts/src/SimpleSwap.sol`
- **Network**: Base Mainnet (Chain ID: 8453)
- **Features**:
  - Automated Market Maker (AMM) with constant product formula
  - Configurable fees per pool (0.1% - 5%)
  - Multi-token support with whitelist
  - Emergency controls for security
  - Gas-optimized operations

#### Key Functions
```solidity
function swap(SwapParams calldata params) external
function createPool(address tokenA, address tokenB, uint256 fee) external
function addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external
function getQuote(address tokenIn, address tokenOut, uint256 amountIn) external view
```

### Frontend Integration

#### Components
- **Swap.tsx**: Main swap interface with professional UI
- **useSimpleSwap.ts**: React hook for DEX operations
- **SimpleSwap.ts**: Contract ABI and type definitions

#### Features
- Real-time price quotes
- Slippage protection
- Network detection (Base)
- Transaction status tracking
- Error handling and user feedback
- Responsive design with dark theme

## Token Support

### Supported Tokens on Base
1. **ETH/WETH** (`0x4200000000000000000000000000000000000006`)
   - Native Ethereum wrapped for Base
   - Primary base pair for liquidity

2. **USDC** (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)
   - USD Coin on Base
   - Stable value reference

3. **ALB** (`0xA4093669DAFbD123E37d52e0939b3aB3C2272f44`)
   - ARCx LP Token
   - Core ecosystem token

### Liquidity Pools
- **WETH/USDC**: 0.3% fee (stable pair)
- **WETH/ALB**: 0.5% fee (ecosystem pair)
- **USDC/ALB**: 0.3% fee (stable/ecosystem bridge)

## Security Features

### Smart Contract Security
- OpenZeppelin imports for battle-tested code
- ReentrancyGuard protection
- Owner controls for emergency situations
- Input validation and bounds checking
- Safe math operations (Solidity 0.8+)

### Frontend Security
- Slippage protection (default 0.5%)
- Deadline enforcement (20 minutes)
- Network validation (Base only)
- Amount validation and limits
- Error handling for all edge cases

## Deployment Guide

### Prerequisites
```bash
npm install
cd contracts
npm install
```

### Environment Setup
Create `.env` file in contracts directory:
```
PRIVATE_KEY=your_private_key_here
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key_here
```

### Deploy Contract
```bash
cd contracts
npx hardhat run scripts/deploy-swap.js --network base
```

### Update Frontend
1. Copy deployed contract address from deployment output
2. Update `CONTRACTS.SIMPLE_SWAP` in `src/hooks/useSimpleSwap.ts`
3. Rebuild frontend: `npm run build`

## Usage Guide

### For Users
1. **Connect Wallet**: MetaMask, Coinbase Wallet, or WalletConnect
2. **Switch to Base**: Automatic network switching prompt
3. **Select Tokens**: Choose from supported token list
4. **Enter Amount**: Input desired swap amount
5. **Review Quote**: Check price, slippage, and fees
6. **Execute Swap**: Confirm transaction in wallet

### For Liquidity Providers
1. **Add Liquidity**: Use `addLiquidity()` function
2. **Earn Fees**: Receive proportional trading fees
3. **Monitor Pools**: Track pool performance and APY

## Integration Examples

### React Component Usage
```typescript
import { useSimpleSwap } from '@/hooks/useSimpleSwap'

function MySwapComponent() {
  const { 
    executeSwap, 
    getQuote, 
    supportedTokens,
    isSwapping 
  } = useSimpleSwap()
  
  const handleSwap = async () => {
    const success = await executeSwap({
      tokenIn: supportedTokens[0], // ETH
      tokenOut: supportedTokens[1], // ALB
      amountIn: '1.0',
      slippageTolerance: 0.5
    })
  }
}
```

### Contract Integration
```javascript
const { ethers } = require('ethers')
const SimpleSwapABI = require('./SimpleSwapABI.json')

const contract = new ethers.Contract(
  SIMPLE_SWAP_ADDRESS,
  SimpleSwapABI,
  signer
)

const quote = await contract.getQuote(tokenIn, tokenOut, amountIn)
```

## Performance Optimizations

### Gas Efficiency
- Batch operations where possible
- Optimized storage patterns
- Minimal external calls
- Efficient math operations

### Frontend Performance
- React.memo for expensive components
- useCallback for stable references
- Lazy loading for heavy components
- Optimistic UI updates

## Monitoring and Analytics

### Key Metrics
- Total Value Locked (TVL)
- Daily/Weekly trading volume
- Fee generation and distribution
- Price impact and slippage
- User acquisition and retention

### Tools Integration
- Dune Analytics dashboards
- Tenderly for transaction monitoring
- OpenZeppelin Defender for security
- Alchemy/Infura for reliable RPC

## Future Enhancements

### V2 Features
- **Concentrated Liquidity**: Uniswap V3 style position management
- **Multi-hop Routing**: Optimal path finding for complex swaps
- **Yield Farming**: Incentive programs for liquidity providers
- **Governance Token**: Community-driven protocol updates

### Advanced Features
- **Limit Orders**: Non-custodial limit order execution
- **Flash Loans**: Arbitrage and liquidation opportunities
- **Cross-chain Bridge**: Integration with other networks
- **NFT Marketplace**: Digital asset trading functionality

## Security Audits

### Completed
- [ ] Internal code review
- [ ] Automated security scanning
- [ ] Gas optimization review

### Planned
- [ ] External security audit
- [ ] Bug bounty program
- [ ] Formal verification (critical functions)

## API Reference

### Swap Interface
```typescript
interface SwapParams {
  tokenIn: Token
  tokenOut: Token
  amountIn: string
  slippageTolerance: number
  recipient?: Address
}

interface SwapQuote {
  amountOut: bigint
  priceImpact: number
  fee: bigint
  route: Token[]
}
```

### Error Codes
- `INSUFFICIENT_LIQUIDITY`: Pool lacks required liquidity
- `EXCESSIVE_SLIPPAGE`: Price moved beyond tolerance
- `EXPIRED_DEADLINE`: Transaction deadline exceeded
- `UNSUPPORTED_TOKEN`: Token not whitelisted
- `INVALID_AMOUNT`: Amount too small or too large

## Support and Community

### Resources
- **Documentation**: [docs.arcx.io](https://docs.arcx.io)
- **Discord**: Community support and discussions
- **GitHub**: Source code and issue tracking
- **Twitter**: Updates and announcements

### Contact
- **Technical Issues**: GitHub Issues
- **Security Concerns**: security@arcx.io
- **Business Inquiries**: partnerships@arcx.io

---

*Built with 💙 for the ARCx ecosystem. Powering the future of decentralized finance on Base.*
