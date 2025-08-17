import React from 'react'
import useWalletWagmi from '@/hooks/useWalletWagmi'

const WagmiConnectButton: React.FC = () => {
  const { address, isConnected, disconnect } = useWalletWagmi()
  return isConnected ? (
    <div className="flex items-center gap-3">
      <div className="text-sm font-mono">{address}</div>
      <button onClick={() => disconnect()} className="px-3 py-1 border rounded text-sm">Disconnect</button>
    </div>
  ) : (
    <div className="text-sm">Not connected</div>
  )
}

export default WagmiConnectButton
