import { Web3Storage } from 'web3.storage'

export async function uploadJsonToIpfs(obj: any): Promise<string> {
  const token = import.meta.env.VITE_WEB3STORAGE_TOKEN as string | undefined
  const json = JSON.stringify(obj)

  if (!token) {
    throw new Error('Missing Web3.Storage token. Set VITE_WEB3STORAGE_TOKEN in your env.')
  }

  const client = new Web3Storage({ token })
  const blob = new Blob([json], { type: 'application/json' })
  const cid = await client.put([new File([blob], 'profile.json')], { wrapWithDirectory: false })
  return `ipfs://${cid}`
}

export async function readProfileFromIpfs(cid: string): Promise<any> {
  const url = cid.startsWith('ipfs://') ? `https://ipfs.io/ipfs/${cid.slice(7)}` : cid
  const res = await fetch(url)
  if (!res.ok) throw new Error(`IPFS fetch failed: ${res.status}`)
  return res.json()
}

export default { uploadJsonToIpfs, readProfileFromIpfs }
