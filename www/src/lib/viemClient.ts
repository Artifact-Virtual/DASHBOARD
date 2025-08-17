import { createPublicClient, createWalletClient, http, webSocket } from 'viem'
import { mainnet, polygon, arbitrum } from 'viem/chains'
import { WalletClient } from 'viem'

const RPC_MAINNET = String(import.meta.env.VITE_RPC_MAINNET || import.meta.env.VITE_RPC_URL || 'https://cloudflare-eth.com')
const RPC_POLYGON = String(import.meta.env.VITE_RPC_POLYGON || '')
const RPC_ARBITRUM = String(import.meta.env.VITE_RPC_ARBITRUM || '')

// create a default public client for mainnet (used for reads)
export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(RPC_MAINNET),
})

// helpers to get public clients per chain (fallback to mainnet)
export function getPublicClient(chainName?: 'mainnet' | 'polygon' | 'arbitrum') {
  switch (chainName) {
    case 'polygon':
      return RPC_POLYGON ? createPublicClient({ chain: polygon, transport: http(RPC_POLYGON) }) : publicClient
    case 'arbitrum':
      return RPC_ARBITRUM ? createPublicClient({ chain: arbitrum, transport: http(RPC_ARBITRUM) }) : publicClient
    default:
      return publicClient
  }
}

// create a wallet client from a provided transport (wagmi exposes a connector's transport)
export function getWalletClient(transport: any): WalletClient {
  // transport is expected to be a wagmi connector-compatible transport (window.ethereum or similar)
  // viem's createWalletClient will accept the transport directly
  return createWalletClient({ transport })
}

export default publicClient
