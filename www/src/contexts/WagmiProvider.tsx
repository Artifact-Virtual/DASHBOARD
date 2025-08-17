import React from 'react'

import { WagmiConfig, createConfig } from 'wagmi'
import { InjectedConnector } from '@wagmi/connectors'

// Minimal wagmi config using injected connector only (avoids deep provider imports)
const config = createConfig({
  connectors: [new InjectedConnector({ options: { shimDisconnect: true } })],
})

export const WagmiProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}

export default WagmiProvider
