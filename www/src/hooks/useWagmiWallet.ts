import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'
import { metaMask, injected, walletConnect } from '@wagmi/connectors'
import { useCallback } from 'react'

export function useWagmiWallet() {
  const account = useAccount()
  const connectHook = useConnect()
  const disconnectHook = useDisconnect()
  const network = useNetwork()

  const connectMetaMask = useCallback(async () => {
    try {
      await connectHook.connect({ connector: metaMask() as any })
    } catch (err) {
      console.error('connectMetaMask error', err)
      throw err
    }
  }, [connectHook])

  const connectInjected = useCallback(async () => {
    try {
      await connectHook.connect({ connector: injected() as any })
    } catch (err) {
      console.error('connectInjected error', err)
      throw err
    }
  }, [connectHook])

  const connectWalletConnect = useCallback(async () => {
    try {
      await connectHook.connect({ connector: walletConnect() as any })
    } catch (err) {
      console.error('connectWalletConnect error', err)
      throw err
    }
  }, [connectHook])

  const disconnect = useCallback(() => {
    try {
      disconnectHook.disconnect()
    } catch (err) {
      console.error('disconnect error', err)
    }
  }, [disconnectHook])

  return {
    account,
    network,
    connectMetaMask,
    connectInjected,
    connectWalletConnect,
    disconnect,
    connectHook,
    disconnectHook,
  }
}

export default useWagmiWallet
