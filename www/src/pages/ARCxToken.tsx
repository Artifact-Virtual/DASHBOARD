import React, { useState, useEffect } from 'react';
import { Coins, Lock, Unlock, Clock, Shield, AlertTriangle } from 'lucide-react';
import PatternLines from '../components/PatternLines';
import { useWallet } from '../contexts/WalletContext';

const ARCxToken = () => {
  const { isConnected, address, connect, disconnect } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Mock vesting data - replace with actual contract calls
  const [vestingData, setVestingData] = useState({
    totalAllocated: '10,000',
    totalVested: '2,500',
    claimable: '500',
    nextUnlock: new Date('2025-09-01'),
    lockPeriod: '6 months',
  });

  const supportedWallets = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
    { id: 'rainbow', name: 'Rainbow', icon: '🌈' },
  ];

    const connectWallet = async (walletType: string) => {
    setIsConnecting(true);
    setSelectedWallet(walletType);
    
    try {
      await connect(walletType);
      console.log(`Connected to ${walletType}`);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
      setSelectedWallet('');
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const handleClaim = async () => {
    if (!isConnected) return;
    
    try {
      // Implement claiming logic here
      console.log('Claiming tokens...');
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setSelectedWallet('');
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <PatternLines />
      
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Coins className="w-16 h-16 text-cyan-400" />
            <h1 className="text-5xl md:text-7xl font-light text-white tracking-wider">
              ARCx TOKEN
            </h1>
          </div>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Secure vesting and claiming platform for ARCx token holders.
            Connect your wallet to access your allocation.
          </p>
        </div>

        {/* Wallet Connection Section */}
        {!isConnected ? (
          <div className="max-w-2xl mx-auto mb-16">
            <div className="border border-white/10 p-8 rounded-none bg-black/40 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-light">Connect Wallet</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportedWallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => connectWallet(wallet.id)}
                    disabled={isConnecting}
                    className="group p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:bg-cyan-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{wallet.icon}</span>
                      <div className="text-left">
                        <div className="text-lg font-medium text-white group-hover:text-cyan-400 transition-colors">
                          {wallet.name}
                        </div>
                        {isConnecting && selectedWallet === wallet.id && (
                          <div className="text-sm text-white/60">Connecting...</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 p-4 border border-yellow-500/20 bg-yellow-500/5">
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Only connect wallets you trust. Never share your private keys.</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Connected State - Vesting Dashboard */
          <div className="space-y-8">
            {/* Connection Status */}
            <div className="flex items-center justify-between p-6 border border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">Connected: {address}</span>
              </div>
              <button
                onClick={handleDisconnect}
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                Disconnect
              </button>
            </div>

            {/* Vesting Overview */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="border border-white/10 p-6 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Coins className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-medium">Total Allocated</h3>
                </div>
                <div className="text-3xl font-light text-white">{vestingData.totalAllocated}</div>
                <div className="text-sm text-white/60">ARCx Tokens</div>
              </div>

              <div className="border border-white/10 p-6 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Unlock className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-medium">Total Vested</h3>
                </div>
                <div className="text-3xl font-light text-white">{vestingData.totalVested}</div>
                <div className="text-sm text-white/60">ARCx Tokens</div>
              </div>

              <div className="border border-white/10 p-6 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-medium">Claimable Now</h3>
                </div>
                <div className="text-3xl font-light text-white">{vestingData.claimable}</div>
                <div className="text-sm text-white/60">ARCx Tokens</div>
              </div>
            </div>

            {/* Claim Section */}
            <div className="border border-white/10 p-8 bg-black/40 backdrop-blur-sm">
              <h3 className="text-2xl font-light mb-6">Claim Your Tokens</h3>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80">Vesting Progress</span>
                  <span className="text-white/80">25%</span>
                </div>
                <div className="w-full bg-white/10 h-2">
                  <div className="bg-cyan-400 h-2 w-1/4 transition-all duration-500"></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-sm text-white/60 mb-1">Next Unlock Date</div>
                  <div className="text-lg text-white">{vestingData.nextUnlock.toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">Lock Period</div>
                  <div className="text-lg text-white">{vestingData.lockPeriod}</div>
                </div>
              </div>

              <button
                onClick={handleClaim}
                disabled={vestingData.claimable === '0'}
                className="w-full p-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium transition-colors duration-300"
              >
                {vestingData.claimable === '0' ? 'No Tokens Available to Claim' : `Claim ${vestingData.claimable} ARCx`}
              </button>
            </div>
          </div>
        )}

        {/* Public Sale Section (Temporarily Blocked) */}
        <div className="mt-16 border border-red-500/20 p-8 bg-red-500/5">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-light">Public Sale</h2>
          </div>
          
          <div className="text-center">
            <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-4">Currently Unavailable</h3>
            <p className="text-white/70 max-w-2xl mx-auto">
              The public sale is temporarily blocked and will be activated soon. 
              Stay tuned for announcements regarding the public sale launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARCxToken;
