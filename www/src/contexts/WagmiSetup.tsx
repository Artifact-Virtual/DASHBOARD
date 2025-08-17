import React from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, goerli } from 'wagmi/chains'

// Enterprise-grade provider setup
const RPC_MAINNET = (import.meta.env.VITE_RPC_MAINNET as string) || 'https://cloudflare-eth.com'
const RPC_GOERLI = (import.meta.env.VITE_RPC_GOERLI as string) || 'https://rpc.ankr.com/eth_goerli'

const wagmiConfig = createConfig({
  // Chains chosen for initial multi-chain support; expand as needed
  chains: [mainnet, goerli],
  transports: {
    [mainnet.id]: http(RPC_MAINNET),
    [goerli.id]: http(RPC_GOERLI),
  },
})

export const AppWagmiProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
}

export default AppWagmiProvider
