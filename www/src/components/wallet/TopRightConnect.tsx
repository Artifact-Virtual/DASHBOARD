import React, { useEffect, useState, useRef } from 'react'
import useWalletWagmi from '@/hooks/useWalletWagmi'
import { EthBalance } from './EthBalance';
import { Name } from './Name';

const short = (addr?: string | null) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '')

const TopRightConnect: React.FC = () => {
  const { address, isConnected, connectMetaMask, connectInjected, connectWalletConnect, connectCoinbase, disconnect, detectInstalledWallets } = useWalletWagmi()
  const [open, setOpen] = useState(false)
  const [installed, setInstalled] = useState<Record<string, boolean>>({})
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // wallet detection
    try {
      const w = detectInstalledWallets ? detectInstalledWallets() : {}
      setInstalled(w)
    } catch (e) {
      setInstalled({})
    }
  }, [detectInstalledWallets])

  useEffect(() => {
    // scroll lock when NOT connected
    const orig = document.body.style.overflow
    if (!isConnected) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = orig || ''
    }
    return () => {
      document.body.style.overflow = orig || ''
    }
  }, [isConnected])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (open && ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const handleConnect = async (fn: (() => Promise<any>) | undefined) => {
    if (!fn) return
    try {
      await fn()
    } catch (e) {
      console.error('connect error', e)
    } finally {
      setOpen(false)
    }
  }

  return (
    <div ref={ref} className="fixed top-6 right-6 z-50">
      <div className="relative">
        <button
          onClick={() => setOpen((s) => !s)}
          className="px-4 py-2 rounded-2xl border backdrop-blur-md shadow-lg bg-black/70 border-white/10 text-white flex items-center gap-3"
        >
          {isConnected ? (
            <>
              <span className="inline-flex items-center gap-2">
                {/* Unique monochrome Artifact Virtual SVG icon */}
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-white/80 to-black/80 flex items-center justify-center mr-1">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="16" height="16" rx="5" fill="#fff" fillOpacity="0.12" />
                    <path d="M6 14L10 6L14 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="10" cy="10" r="9" stroke="#fff" strokeWidth="1.2" opacity="0.3"/>
                  </svg>
                </span>
                <span className="font-mono text-sm max-w-[90px] truncate block" title={address}>{short(address)}</span>
              </span>
            </>
          ) : <span>Connect Wallet</span>}
          <span className="ml-2 text-xs opacity-70">{isConnected ? 'Connected' : ''}</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-black/90 border border-white/10 rounded-2xl shadow-2xl p-3 backdrop-blur-md text-white">
            {isConnected ? (
              <div className="flex flex-col gap-2 min-w-0 w-full max-w-xs sm:max-w-sm">
                <div className="flex items-center gap-2 w-full">
                  {/* Profile Icon */}
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-white/80 to-black/80 flex items-center justify-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="16" height="16" rx="5" fill="#fff" fillOpacity="0.12" />
                      <path d="M6 14L10 6L14 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="10" cy="10" r="9" stroke="#fff" strokeWidth="1.2" opacity="0.3"/>
                    </svg>
                  </span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-semibold text-base text-white truncate leading-tight"><Name /></span>
                    <span className="text-xs text-white/70 font-mono truncate leading-tight" title={address}>{short(address)}</span>
                  </div>
                  <button
                    className="ml-2 px-2 py-1 rounded bg-white/10 text-xs text-white/80 hover:bg-white/20 flex-shrink-0"
                    onClick={() => {navigator.clipboard.writeText(address || '');}}
                    title="Copy address"
                  >Copy</button>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <EthBalance className="text-xs text-white/80" />
                </div>
                <button onClick={() => disconnect()} className="px-3 py-2 rounded bg-white/5 mt-1 w-full">Disconnect</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button aria-label="Connect MetaMask" onClick={() => handleConnect(connectMetaMask)} className="flex justify-between items-center px-3 py-2 rounded hover:bg-white/5">
                  <span>MetaMask</span>
                  {installed?.metamask && <span className="text-xs text-green-300">Installed</span>}
                </button>
                <button aria-label="Connect Coinbase Wallet" onClick={() => handleConnect(connectCoinbase)} className="flex justify-between items-center px-3 py-2 rounded hover:bg-white/5">
                  <span>Coinbase Wallet</span>
                  {installed?.coinbase && <span className="text-xs text-green-300">Installed</span>}
                </button>
                <button aria-label="Connect WalletConnect" onClick={() => handleConnect(connectWalletConnect)} className="flex justify-between items-center px-3 py-2 rounded hover:bg-white/5">
                  <span>WalletConnect</span>
                </button>
                <button aria-label="Connect Injected" onClick={() => handleConnect(connectInjected)} className="flex justify-between items-center px-3 py-2 rounded hover:bg-white/5">
                  <span>Injected</span>
                  {installed?.injected && <span className="text-xs text-green-300">Available</span>}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TopRightConnect
