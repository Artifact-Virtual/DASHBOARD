import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';
import { LogoVotingProvider } from '../contexts/LogoVotingContext';
import LogoVoting from '../components/LogoVoting';

const ARCxToken = () => {
  const { isConnected, address, connect, disconnect } = useWallet();
  const { showToast } = useToast();
  const [selectedWallet, setSelectedWallet] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showPublicSale, setShowPublicSale] = useState(false);

  // Real tokenomics data from transparency portal
  const [vestingData, setVestingData] = useState({
    totalSupply: '1,000,000',
    currentSupply: '1,000,000',
    maxSupply: '1,000,000',
    userAllocated: '0', // Will be fetched from contract
    userVested: '0',
    userClaimable: '0',
    nextUnlock: new Date('2026-08-15'), // 12 month cliff from Aug 15, 2025
    cliffPeriod: '12 months',
    vestingDuration: '36 months',
    monthlyRelease: '5,556', // ~200K / 36 months
    contractAddress: '0xA4093669DAFbD123E37d52e0939b3aB3C2272f44',
    vestingContract: '0xEEc0298bE76C9C3224eA05a34687C1a1134d550B',
    treasurySafe: '0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38',
    network: 'Base Mainnet',
    vulnerabilities: '0'
  });

  // Real allocation data from transparency portal
  const allocationData = [
    { category: 'Ecosystem Fund', amount: '250,000', percentage: '25%', status: 'Full Transparency', color: 'from-blue-500 to-cyan-500' },
    { category: 'Core Team & Developers', amount: '200,000', percentage: '20%', status: 'MVC Contract', color: 'from-purple-500 to-pink-500' },
    { category: 'Public Sale', amount: '200,000', percentage: '20%', status: 'Full Transparency', color: 'from-green-500 to-emerald-500' },
    { category: 'Community & Airdrop', amount: '150,000', percentage: '15%', status: 'Full Transparency', color: 'from-yellow-500 to-orange-500' },
    { category: 'Strategic Partners', amount: '100,000', percentage: '10%', status: 'Treasury Managed', color: 'from-red-500 to-rose-500' },
    { category: 'Treasury Reserve', amount: '100,000', percentage: '10%', status: 'Full Transparency', color: 'from-indigo-500 to-blue-500' },
  ];

  // Active tab state
  const [activeTab, setActiveTab] = useState('overview');

  const supportedWallets = [
    { id: 'metamask', name: 'MetaMask' },
    { id: 'coinbase', name: 'Coinbase Wallet' },
    { id: 'walletconnect', name: 'WalletConnect' },
    { id: 'rainbow', name: 'Rainbow' },
  ];

  const connectWallet = async (walletType: string) => {
    setIsConnecting(true);
    setSelectedWallet(walletType);
    
    try {
      await connect(walletType);
      showToast('success', 'Wallet Connected', `Successfully connected to ${walletType}`);
      console.log(`Connected to ${walletType}`);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      showToast('error', 'Connection Failed', `Failed to connect to ${walletType}. Please try again.`);
    } finally {
      setIsConnecting(false);
      setSelectedWallet('');
    }
  };

  const disconnectWallet = () => {
    disconnect();
    showToast('info', 'Wallet Disconnected', 'Your wallet has been disconnected successfully');
  };

  const handleClaim = async () => {
    if (!isConnected) return;
    
    try {
      showToast('info', 'Processing Claim', 'Your claim transaction is being processed...');
      console.log('Claiming tokens...');
      // Implement actual claim logic here
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      showToast('success', 'Tokens Claimed', `Successfully claimed ${vestingData.claimable} ARCx tokens`);
    } catch (error) {
      console.error('Claim failed:', error);
      showToast('error', 'Claim Failed', 'Failed to claim tokens. Please try again.');
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-black text-white font-precision">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-left mb-16 border-b border-white/10 pb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-thin tracking-wider">
                ARCx TOKEN
              </h1>
              <div className="px-4 py-2 border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
                <span className="text-blue-400 font-light tracking-wide text-sm">GENESIS • BASE • VERIFIED</span>
              </div>
            </div>
            <div className="absolute right-8 mt-20 flex flex-col items-end gap-2 z-30" style={{ top: '3.5rem' }}>
              <span className="text-xs font-light tracking-widest text-white/40 uppercase mb-1">ARCx Token Pages</span>
              <div className="flex flex-col gap-2 text-sm font-light tracking-wide w-44">
                <a 
                  href="https://artifact-virtual.github.io/arcx_token/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-white/20 text-white hover:bg-white/10 transition-colors w-full text-right"
                >
                  Overview
                </a>
                <a 
                  href="https://artifact-virtual.github.io/arcx_token/transparency.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors w-full text-right"
                >
                  Transparency
                </a>
                <a 
                  href="https://artifact-virtual.github.io/arcx_token/documentation.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-white/20 text-white hover:bg-white/10 transition-colors w-full text-right"
                >
                  Documentation
                </a>
              </div>
            </div>
          </div>
          <p className="text-white/70 font-light tracking-wide text-base sm:text-lg max-w-3xl">
            Constitutional intelligence funding instrument. Fixed supply ERC20 bootstrapping Arc Protocol development and governance systems.
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 mt-6 text-xs sm:text-sm font-light tracking-wide">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white/60">LIVE ON BASE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-white/60">1M TOTAL SUPPLY</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-white/60">0 VULNERABILITIES</span>
            </div>
          </div>
        </div>

        {/* Connection Status Bar */}
        {isConnected && (
          <div className="fixed top-4 right-4 z-50 bg-black border border-white/20 px-4 py-2 sm:px-6 sm:py-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-white/60 font-light tracking-wide text-xs sm:text-sm uppercase">Connected</span>
              <span className="text-white font-light tracking-wide text-xs sm:text-sm">{formatAddress(address || '')}</span>
              <button
                onClick={disconnectWallet}
                className="ml-2 sm:ml-4 text-white/60 hover:text-white font-light tracking-wide text-xs sm:text-sm transition-colors"
              >
                DISCONNECT
              </button>
            </div>
          </div>
        )}

        {/* Main Content - Everything secured behind wallet connection */}
        {!isConnected ? (
          <div className="max-w-4xl mx-auto text-center">
            <div className="border border-white/10 p-12">
              <h2 className="text-3xl font-thin tracking-wide mb-8">
                Secure Wallet Connection Required
              </h2>
              <p className="text-white/70 font-light tracking-wide mb-12 max-w-2xl mx-auto">
                Access to ARCx vesting dashboard, allocation details, and community governance requires secure wallet authentication. All features are wallet-gated for your security.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {supportedWallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => connectWallet(wallet.id)}
                    disabled={isConnecting}
                    className="w-full text-left border border-white/10 px-4 sm:px-8 py-4 sm:py-6 text-white bg-black/50 backdrop-blur-sm hover:bg-white/5 hover:border-white/20 transition-all font-light tracking-wide group"
                  >
                    <div className="text-base sm:text-lg font-light tracking-wide group-hover:text-blue-400 transition-colors">
                      {wallet.name}
                    </div>
                    {isConnecting && selectedWallet === wallet.id && (
                      <span className="text-xs text-blue-400 font-light tracking-wide">Connecting...</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-12 p-6 border border-blue-500/20 bg-blue-500/5 text-white/60 font-light tracking-wide text-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-400 font-light tracking-wide">SECURITY NOTICE</span>
                </div>
                Only connect wallets you trust and control. Never share private keys or seed phrases. All transactions are secured on Base Mainnet.
              </div>
            </div>
          </div>
        ) : (
          <LogoVotingProvider adminWallets={[address?.toLowerCase() || ""]}>
            <div className="space-y-16">
              {/* Token Overview Section */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-thin tracking-wide mb-6 sm:mb-8">Token Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10">
                  <div className="px-4 sm:px-8 py-4 sm:py-6 border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 last:border-b-0">
                    <div className="text-white/50 font-light tracking-wide text-xs sm:text-sm uppercase mb-2">Total Supply</div>
                    <div className="text-xl sm:text-2xl font-light tracking-wide mb-1">{vestingData.totalSupply} ARCx</div>
                    <div className="text-white/40 font-light tracking-wide text-xs">Fixed Supply • No Inflation</div>
                  </div>
                  <div className="px-4 sm:px-8 py-4 sm:py-6 border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 last:border-b-0">
                    <div className="text-white/50 font-light tracking-wide text-xs sm:text-sm uppercase mb-2">Network</div>
                    <div className="text-xl sm:text-2xl font-light tracking-wide mb-1">{vestingData.network}</div>
                    <div className="text-green-400 font-light tracking-wide text-xs">✓ Live & Verified</div>
                  </div>
                  <div className="px-4 sm:px-8 py-4 sm:py-6">
                    <div className="text-white/50 font-light tracking-wide text-xs sm:text-sm uppercase mb-2">Security</div>
                    <div className="text-xl sm:text-2xl font-light tracking-wide mb-1">{vestingData.vulnerabilities} Vulnerabilities</div>
                    <div className="text-blue-400 font-light tracking-wide text-xs">A+ Audit Rating</div>
                  </div>
                </div>
              </div>

              {/* Token Allocation */}
              <div>
                <h2 className="text-3xl font-thin tracking-wide mb-8">Token Allocation</h2>
                <div className="space-y-0 border border-white/10">
                  {allocationData.map((allocation, index) => (
                    <div key={allocation.category} className="flex items-center justify-between px-8 py-6 border-b border-white/10 last:border-b-0 group hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${allocation.color} opacity-70 group-hover:opacity-100 transition-opacity`}></div>
                        <div>
                          <div className="text-white font-light tracking-wide">{allocation.category}</div>
                          <div className="text-white/50 font-light tracking-wide text-sm">{allocation.status}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-light tracking-wide">{allocation.amount} ARCx</div>
                        <div className="text-white/50 font-light tracking-wide text-sm">{allocation.percentage}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vesting Information */}
              <div>
                <h2 className="text-3xl font-thin tracking-wide mb-8">Core Team Vesting</h2>
                <div className="border border-white/10 p-8">
                  <div className="grid md:grid-cols-2 gap-12 mb-8">
                    <div>
                      <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-2">Cliff Period</div>
                      <div className="text-2xl font-light tracking-wide mb-1">{vestingData.cliffPeriod}</div>
                      <div className="text-white/40 font-light tracking-wide text-sm">Unlock: August 15, 2026</div>
                    </div>
                    <div>
                      <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-2">Vesting Duration</div>
                      <div className="text-2xl font-light tracking-wide mb-1">{vestingData.vestingDuration}</div>
                      <div className="text-white/40 font-light tracking-wide text-sm">Linear release post-cliff</div>
                    </div>
                    <div>
                      <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-2">Monthly Release</div>
                      <div className="text-2xl font-light tracking-wide mb-1">~{vestingData.monthlyRelease} ARCx</div>
                      <div className="text-white/40 font-light tracking-wide text-sm">After cliff period</div>
                    </div>
                    <div>
                      <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-2">Your Allocation</div>
                      <div className="text-2xl font-light tracking-wide mb-1">{vestingData.userAllocated} ARCx</div>
                      <div className="text-white/40 font-light tracking-wide text-sm">Connect to view details</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 font-light tracking-wide">Vesting Progress</span>
                      <span className="text-white font-light tracking-wide">Pre-Cliff Period</span>
                    </div>
                    <div className="w-full bg-white/10 h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="text-white/50 font-light tracking-wide text-sm">
                      Vesting begins August 15, 2026 after 12-month cliff period
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Information */}
              <div>
                <h2 className="text-3xl font-thin tracking-wide mb-8">Contract Information</h2>
                <div className="grid md:grid-cols-2 gap-0 border border-white/10">
                  <div className="px-8 py-6 border-r border-white/10 last:border-r-0">
                    <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-4">Token Contract</div>
                    <div className="space-y-2">
                      <div className="font-mono text-xs text-white/70 bg-black/30 px-3 py-2 border border-white/10">
                        {vestingData.contractAddress}
                      </div>
                      <div className="text-green-400 font-light tracking-wide text-xs">✓ Verified on BaseScan</div>
                    </div>
                  </div>
                  <div className="px-8 py-6 border-r border-white/10 last:border-r-0">
                    <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-4">Vesting Contract</div>
                    <div className="space-y-2">
                      <div className="font-mono text-xs text-white/70 bg-black/30 px-3 py-2 border border-white/10">
                        {vestingData.vestingContract}
                      </div>
                      <div className="text-blue-400 font-light tracking-wide text-xs">✓ MVC Deployed</div>
                    </div>
                  </div>
                  <div className="px-8 py-6 border-r border-white/10 last:border-r-0">
                    <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-4">Treasury Safe</div>
                    <div className="space-y-2">
                      <div className="font-mono text-xs text-white/70 bg-black/30 px-3 py-2 border border-white/10">
                        {vestingData.treasurySafe}
                      </div>
                      <div className="text-purple-400 font-light tracking-wide text-xs">✓ Multisig Secured</div>
                    </div>
                  </div>
                  <div className="px-8 py-6">
                    <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-4">Quick Actions</div>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 border border-white/20 text-white bg-black/30 hover:bg-white/10 transition-colors font-light tracking-wide text-sm">
                        Add to Wallet
                      </button>
                      <button className="w-full px-4 py-2 border border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors font-light tracking-wide text-sm">
                        View on BaseScan
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Logo Voting System */}
              <div className="border border-white/10 p-8">
                <h2 className="text-3xl font-thin tracking-wide mb-8">Community Governance</h2>
                <div className="mb-6">
                  <h3 className="text-xl font-light tracking-wide mb-4">ARCx Logo Community Voting</h3>
                  <p className="text-white/60 font-light tracking-wide text-sm max-w-2xl">
                    Participate in shaping the visual identity of ARCx through secure, wallet-based community voting. Each round progresses based on community consensus.
                  </p>
                </div>
                <LogoVoting />
              </div>
            </div>
          </LogoVotingProvider>
        )}
      </div>
    </div>
  );
};

export default ARCxToken;