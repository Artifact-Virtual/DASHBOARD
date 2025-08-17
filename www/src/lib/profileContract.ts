import publicClient, { getPublicClient, getWalletClient } from './viemClient'
import ABI from '@/contracts/ProfileRegistryABI.json'
import type { WalletClient } from 'viem'

const PROFILE_REGISTRY_ADDRESS = (import.meta.env.VITE_PROFILE_REGISTRY_ADDRESS || '') as string

export async function readProfile(owner: string, chain?: 'mainnet' | 'polygon' | 'arbitrum') {
  if (!PROFILE_REGISTRY_ADDRESS) throw new Error('Profile registry address not set')
  const client = getPublicClient(chain)
  const result = await client.readContract({
    address: PROFILE_REGISTRY_ADDRESS as `0x${string}`,
    abi: ABI as any,
    functionName: 'getProfile',
    args: [owner],
  })
  return result as string
}

/**
 * setProfileOnchain
 * - transport: the wallet transport (for example window.ethereum from wagmi connector)
 * - cid: string (ipfs CID or ipfs://...)
 * Returns tx hash-like object from viem
 */
export async function setProfileOnchain(transport: any, cid: string) {
  if (!PROFILE_REGISTRY_ADDRESS) throw new Error('Profile registry address not set')
  if (!transport) throw new Error('wallet transport is required to send transaction')

  const walletClient: WalletClient = getWalletClient(transport)

  // prepare and send transaction
  const tx = await walletClient.writeContract({
    address: PROFILE_REGISTRY_ADDRESS as `0x${string}`,
    abi: ABI as any,
    functionName: 'setProfile',
    args: [cid],
  })

  return tx
}

export default { readProfile, setProfileOnchain }
