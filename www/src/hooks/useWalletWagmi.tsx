import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { metaMask, injected, walletConnect, coinbaseWallet } from '@wagmi/connectors'
import { useCallback } from 'react'

function detectInstalledWallets() {
  const anyWindow = window as any
  const wallets: Record<string, boolean> = {
    metamask: false,
    coinbase: false,
    injected: false,
  }
  if (anyWindow.ethereum) {
    wallets.injected = true
    if (anyWindow.ethereum.isMetaMask) wallets.metamask = true
    if (anyWindow.ethereum.isCoinbaseWallet || anyWindow.ethereum.isCoinbaseBrowser) wallets.coinbase = true
  }
  return wallets
}

export function useWalletWagmi() {
  const account = useAccount()
  const connectHook = useConnect()
  const disconnectHook = useDisconnect()

  const connectMetaMask = useCallback(async () => {
    try {
  await connectHook.connect({ connector: metaMask() })
    } catch (err) {
      throw err
    }
  }, [connectHook])

  const connectInjected = useCallback(async () => {
    try {
  await connectHook.connect({ connector: injected() })
    } catch (err) {
      throw err
    }
  }, [connectHook])

  const connectWalletConnect = useCallback(async () => {
    try {
  await connectHook.connect({ connector: walletConnect({ options: { projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID } }) })
    } catch (err) {
      throw err
    }
  }, [connectHook])

  const connectCoinbase = useCallback(async () => {
    try {
      await connectHook.connect({ connector: coinbaseWallet() })
    } catch (err) {
      throw err
    }
  }, [connectHook])

  return {
    ...account,
    connectMetaMask,
    connectInjected,
    connectWalletConnect,
  connectCoinbase,
    disconnect: disconnectHook.disconnect,
  detectInstalledWallets,
  }
}

export default useWalletWagmi
