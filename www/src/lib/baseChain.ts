import { base as viemBase, mainnet, polygon, arbitrum } from 'viem/chains';

export const BASE_CHAIN = {
  ...viemBase,
  rpcUrls: {
    default: {
      http: [String(import.meta.env.VITE_RPC_BASE || 'https://mainnet.base.org')],
    },
    public: {
      http: [String(import.meta.env.VITE_RPC_BASE || 'https://mainnet.base.org')],
    },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://basescan.org' },
    etherscan: { name: 'Basescan', url: 'https://basescan.org' },
  },
  contracts: {},
};
