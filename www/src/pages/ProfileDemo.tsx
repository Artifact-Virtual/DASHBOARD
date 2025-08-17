import React, { useState } from 'react'
import useWalletWagmi from '@/hooks/useWalletWagmi'
import { uploadJsonToIpfs, readProfileFromIpfs } from '@/lib/onchainProfile'

const ProfileDemo: React.FC = () => {
  const { address, isConnected } = useWalletWagmi()
  const [cid, setCid] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const createProfile = async () => {
    if (!isConnected || !address) return
    setLoading(true)
    try {
      const obj = { address, name: 'New Profile', createdAt: new Date().toISOString() }
      const ipfs = await uploadJsonToIpfs(obj)
      setCid(ipfs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProfile = async () => {
    if (!cid) return
    setLoading(true)
    try {
      const p = await readProfileFromIpfs(cid)
      setProfile(p)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Profile Demo</h2>
      <p className="mb-4">Connected: {isConnected ? address : 'No'}</p>
      <div className="flex gap-2 mb-4">
        <button onClick={createProfile} disabled={!isConnected || loading} className="px-4 py-2 border rounded">Create Profile</button>
        <button onClick={fetchProfile} disabled={!cid || loading} className="px-4 py-2 border rounded">Fetch Profile</button>
      </div>
      {cid && <div className="mb-2">CID: {cid}</div>}
      {profile && <pre className="text-sm bg-black/10 p-2 rounded">{JSON.stringify(profile, null, 2)}</pre>}
    </div>
  )
}

export default ProfileDemo
