// Lightweight shim for the missing `artifactvirtual` OnchainKit package used during development.
// This provides minimal stub components so the site can build while you add real keys or the real package.

import React from 'react'

export const base = { id: 8453, name: 'base' } as any

export const OnchainKitProvider: React.FC<any> = ({ children }) => {
  return <>{children}</>
}

export const FundCard: React.FC<any> = (props) => (
  <div className="p-3 rounded bg-black/60 text-white text-sm">FundCard stub — props: {JSON.stringify(props)}</div>
)

export const SwapDefault: React.FC<any> = (props) => (
  <div className="p-3 rounded bg-black/60 text-white text-sm">SwapDefault stub — props: {JSON.stringify(props)}</div>
)

export const NftMintCardDefault: React.FC<any> = (props) => (
  <div className="p-3 rounded bg-black/60 text-white text-sm">NftMintCardDefault stub — props: {JSON.stringify(props)}</div>
)

export const ConnectWallet: React.FC<any> = (props) => (
  <button className="px-3 py-2 bg-green-600 rounded text-black text-sm">Connect (OnchainKit stub)</button>
)

export default {
  base,
  OnchainKitProvider,
  FundCard,
  SwapDefault,
  NftMintCardDefault,
  ConnectWallet,
}
