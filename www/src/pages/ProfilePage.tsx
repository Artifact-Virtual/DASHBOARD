
import React, { useState, useRef } from 'react';
import useWalletWagmi from '@/hooks/useWalletWagmi';
import { uploadJsonToIpfs, readProfileFromIpfs } from '@/lib/onchainProfile';
import { setProfileOnchain } from '@/lib/profileContract';
import { useWalletClient } from 'wagmi';

const AVATAR_PLACEHOLDER = 'https://api.dicebear.com/7.x/identicon/svg?seed=artifact';

const ProfilePage: React.FC = () => {
  const { address, isConnected } = useWalletWagmi();
  const [cid, setCid] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [txResult, setTxResult] = useState<any>(null);
  const [networkStatus, setNetworkStatus] = useState<'base' | 'wrong' | 'disconnected'>('disconnected');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: walletClient } = useWalletClient();

  // Simulate network check (replace with actual chainId check if needed)
  React.useEffect(() => {
    if (!isConnected) setNetworkStatus('disconnected');
    else setNetworkStatus('base');
  }, [isConnected]);

  // Load profile from IPFS if CID is present
  const fetchProfile = async () => {
    if (!cid) return;
    setLoading(true);
    try {
      const p = await readProfileFromIpfs(cid);
      setProfile(p);
      setName(p.name || '');
      setAvatar(p.avatar || null);
      setStatus(p.status || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create or update profile
  const saveProfile = async () => {
    if (!isConnected || !address) return;
    setLoading(true);
    try {
      const obj = {
        address,
        name: name || 'New Profile',
        avatar: avatar || AVATAR_PLACEHOLDER,
        status,
        updatedAt: new Date().toISOString(),
      };
      const ipfs = await uploadJsonToIpfs(obj);
      setCid(ipfs);
      if (walletClient) {
        const transport = (walletClient as any).transport || (window as any).ethereum;
        const tx = await setProfileOnchain(transport, ipfs);
        setTxResult(tx);
      } else {
        setTxResult({ dryRun: true, cid: ipfs });
      }
      setProfile(obj);
      setEditing(false);
    } catch (err) {
      console.error(err);
      setTxResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  // Avatar upload handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // UI
  return (
    <section className="min-h-screen flex items-center justify-center bg-black/95 px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl shadow-2xl bg-neutral-950/90 border border-neutral-800/60 p-8 relative overflow-hidden">
        {/* Glowing border effect */}
        <div className="absolute -inset-1 rounded-2xl pointer-events-none z-0 bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/10 to-emerald-400/10 blur-[2px]" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Network status */}
          <div className="flex items-center gap-2 text-xs font-mono-slim text-neutral-400/80 mb-2">
            <span className={`w-2 h-2 rounded-full ${networkStatus==='base' ? 'bg-cyan-400' : networkStatus==='wrong' ? 'bg-yellow-400' : 'bg-red-500'}`}></span>
            {networkStatus==='base' ? 'Base Network Connected' : networkStatus==='wrong' ? 'Wrong Network' : 'Wallet Disconnected'}
          </div>
          {/* Avatar */}
          <div className="relative group">
            <img
              src={avatar || AVATAR_PLACEHOLDER}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-cyan-500/30 shadow-lg object-cover bg-neutral-900"
            />
            {editing && (
              <button
                className="absolute bottom-2 right-2 bg-cyan-600/90 text-white rounded-full p-2 shadow-lg hover:bg-cyan-400 transition"
                onClick={() => fileInputRef.current?.click()}
                title="Change avatar"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M16.5 5.5l2 2a2.121 2.121 0 010 3l-7.5 7.5a2 2 0 01-1.414.586H6a1 1 0 01-1-1v-3.586a2 2 0 01.586-1.414l7.5-7.5a2.121 2.121 0 013 0z"/></svg>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </button>
            )}
          </div>
          {/* ENS/Address */}
          <div className="text-center">
            <div className="text-lg font-semibold text-white tracking-wide">
              {name || 'Unnamed'}
            </div>
            <div className="text-xs text-neutral-400 font-mono-slim mt-1">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
            </div>
          </div>
          {/* Status */}
          <div className="w-full flex flex-col items-center">
            {editing ? (
              <input
                className="w-full max-w-xs px-3 py-2 rounded bg-neutral-900 text-white border border-neutral-700 focus:border-cyan-400 outline-none mb-2"
                value={status}
                onChange={e => setStatus(e.target.value)}
                placeholder="Status (e.g. Building, Exploring, ... )"
                maxLength={64}
              />
            ) : (
              <div className="text-sm text-neutral-300/90 italic min-h-[1.5em]">{status || 'No status set.'}</div>
            )}
          </div>
          {/* Edit fields */}
          {editing && (
            <div className="w-full flex flex-col items-center gap-2">
              <input
                className="w-full max-w-xs px-3 py-2 rounded bg-neutral-900 text-white border border-neutral-700 focus:border-cyan-400 outline-none"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name or handle"
                maxLength={32}
              />
            </div>
          )}
          {/* Action buttons */}
          <div className="flex gap-4 mt-4">
            {editing ? (
              <>
                <button
                  className="px-6 py-2 rounded bg-cyan-500 text-white font-semibold shadow hover:bg-cyan-400 transition"
                  onClick={saveProfile}
                  disabled={loading}
                >{loading ? 'Saving...' : 'Save Profile'}</button>
                <button
                  className="px-6 py-2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 transition"
                  onClick={() => setEditing(false)}
                  disabled={loading}
                >Cancel</button>
              </>
            ) : (
              <>
                <button
                  className="px-6 py-2 rounded bg-cyan-600 text-white font-semibold shadow hover:bg-cyan-400 transition"
                  onClick={() => setEditing(true)}
                  disabled={!isConnected}
                >Edit Profile</button>
                <button
                  className="px-6 py-2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 transition"
                  onClick={fetchProfile}
                  disabled={!cid || loading}
                >{loading ? 'Loading...' : 'Refresh'}</button>
              </>
            )}
          </div>
          {/* CID and TX info */}
          <div className="w-full mt-6 text-xs text-neutral-500 text-center">
            {cid && <div className="mb-1">IPFS CID: <span className="font-mono-slim text-cyan-400">{cid}</span></div>}
            {txResult && txResult.error && <div className="text-red-400">Error: {txResult.error}</div>}
            {txResult && txResult.dryRun && <div className="text-yellow-400">(Dry run: wallet not connected)</div>}
            {txResult && txResult.hash && <div className="text-green-400">TX: {txResult.hash}</div>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
