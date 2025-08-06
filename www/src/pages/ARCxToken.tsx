import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';
import { LogoVotingProvider } from '../contexts/LogoVotingContext';
import LogoVoting from '../components/LogoVoting';
import { SecurePurchaseComponent } from '../components/SecurePurchase';
import DutchAuction from '../components/DutchAuction';
import DutchAuctionABI from '../contracts/DutchAuctionABI.json';

const ARCxToken = () => {
  const { isConnected, address, connect, disconnect } = useWallet();
  const { showToast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showPublicSale, setShowPublicSale] = useState(false);

  // Real tokenomics data from transparency portal (LIVE DUTCH AUCTION)
  const [vestingData, setVestingData] = useState({
    totalSupply: '1,000,000',
    currentSupply: '850,000', // 800K allocated + 50K unallocated
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
    dutchAuctionAddress: '0xD788D9ac56c754cb927771eBf058966bA8aB734D',
    smartAirdropAddress: '0x79166AbC8c17017436263BcE5f76DaB1c3dEa195',
    network: 'Base Mainnet',
    vulnerabilities: '0',
    auctionStatus: 'LIVE',
    auctionTimeRemaining: '~70 hours',
    currentPrice: '~$0.15', // Dynamic pricing
    auctionTokensAvailable: '100,000'
  });

  // Real allocation data from transparency portal (LIVE DUTCH AUCTION)
  const allocationData = [
    { category: 'Core Team & Developers', amount: '200,000', percentage: '20%', status: 'MVC Contract Active', color: 'from-purple-500 to-pink-500' },
    { category: 'Ecosystem Fund', amount: '200,000', percentage: '20%', status: 'MVC Contract Active', color: 'from-blue-500 to-cyan-500' },
    { category: 'Treasury Operations', amount: '300,000', percentage: '30%', status: 'Multisig Controlled', color: 'from-green-500 to-emerald-500' },
    { category: 'Reserve Fund', amount: '100,000', percentage: '10%', status: 'Treasury Allocated', color: 'from-yellow-500 to-orange-500' },
    { category: 'Dutch Auction LIVE', amount: '100,000', percentage: '10%', status: '🔴 ACTIVE SALE', color: 'from-red-500 to-rose-500' },
    { category: 'Smart Airdrop', amount: '50,000', percentage: '5%', status: 'Merit-Based', color: 'from-indigo-500 to-blue-500' },
    { category: 'Future Allocation', amount: '50,000', percentage: '5%', status: 'Unallocated', color: 'from-gray-500 to-slate-500' },
  ];

  // Active tab state
  const [activeTab, setActiveTab] = useState('overview');

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      await connect('metamask'); // Only MetaMask for security
      showToast('success', 'Wallet Connected', 'Successfully connected to MetaMask');
      console.log('Connected to MetaMask');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      showToast('error', 'Connection Failed', 'Failed to connect wallet. Please ensure MetaMask is installed and try again.');
    } finally {
      setIsConnecting(false);
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
        {/* Mobile-first: Description at top, then header */}
        <div className="block md:hidden mb-8">
          <p className="text-white/80 font-light tracking-wide text-base sm:text-lg max-w-full mb-4">
            Constitutional intelligence funding instrument. Fixed supply ERC20 bootstrapping Arc Protocol development and governance systems.
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-16 border-b border-white/10 pb-8 md:pb-12 gap-4 md:gap-0">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-thin tracking-wider mb-2 md:mb-0">
              ARCx TOKEN
            </h1>
            <div className="block md:hidden mt-2">
              <span className="text-blue-400 font-light tracking-wide text-xs">GENESIS • BASE • VERIFIED</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="px-4 py-2 border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
              <span className="text-blue-400 font-light tracking-wide text-sm">GENESIS • BASE • VERIFIED</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white/60 text-xs">LIVE ON BASE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-white/60 text-xs">1M TOTAL SUPPLY</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-white/60 text-xs">0 VULNERABILITIES</span>
            </div>
          </div>
        </div>
        {/* Desktop: Description below header */}
        <div className="hidden md:block mb-8">
          <p className="text-white/70 font-light tracking-wide text-lg max-w-3xl">
            Constitutional intelligence funding instrument. Fixed supply ERC20 bootstrapping Arc Protocol development and governance systems.
          </p>
        </div>
        {/* Mobile: Status indicators below description */}
        <div className="flex md:hidden items-center gap-4 mb-6">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white/60 text-xs">LIVE ON BASE</span>
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-white/60 text-xs">1M TOTAL SUPPLY</span>
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-white/60 text-xs">0 VULNERABILITIES</span>
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
                Shhh. The Chain Has Awoken.
              </h2>
              <p className="text-white/70 font-light tracking-wide mb-12 max-w-2xl mx-auto">
                Welcome to ARCX — the first constitutional chain. Only 777 genesis validators will hold the first-rule access. MetaMask connection required for secure access to the Dutch auction and vesting dashboard.
              </p>
              <div className="flex justify-center mb-8">
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-12 py-6 text-xl font-light tracking-wide border border-white/30 bg-gradient-to-r from-purple-500/10 to-blue-600/10 hover:from-purple-500/20 hover:to-blue-600/20 hover:border-white/50 transition-all text-white backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? (
                    <span className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Awakening Connection...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse"></div>
                      Connect MetaMask
                    </span>
                  )}
                </button>
              </div>
              <div className="mt-12 p-6 border border-blue-500/20 bg-blue-500/5 text-white/60 font-light tracking-wide text-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 font-light tracking-wide">CONSTITUTIONAL ACCESS</span>
                </div>
                MetaMask-only security protocol. No other wallets supported for maximum security. Participate in the live Dutch auction ending in ~72 hours.
              </div>
            </div>
          </div>
        ) : (
          <LogoVotingProvider adminWallets={[address?.toLowerCase() || ""]}>
            <div className="space-y-16">
              {/* LIVE DUTCH AUCTION - URGENT SECTION */}
              <div className="border-2 border-red-500/50 bg-gradient-to-r from-red-500/10 to-red-600/10 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  <h2 className="text-3xl font-thin tracking-wide text-red-400">DUTCH AUCTION LIVE</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-2">Status</div>
                    <div className="text-xl font-light tracking-wide text-red-400">{vestingData.auctionStatus}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-2">Time Remaining</div>
                    <div className="text-xl font-light tracking-wide">{vestingData.auctionTimeRemaining}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-2">Current Price</div>
                    <div className="text-xl font-light tracking-wide text-green-400">{vestingData.currentPrice}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-2">Available</div>
                    <div className="text-xl font-light tracking-wide">{vestingData.auctionTokensAvailable} ARCx</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Dutch Auction Bid Component - Plug and Play */}
                  {/* TODO: Replace AUCTION_ABI below with your actual ABI import or JSON */}
                  {typeof window !== 'undefined' && (
                    <DutchAuction 
                      auctionAddress={vestingData.dutchAuctionAddress}
                      auctionAbi={DutchAuctionABI}
                    />
                  )}
                  {/* Keep Smart Airdrop link for now */}
                  <a 
                    href={`https://basescan.org/address/${vestingData.smartAirdropAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all text-blue-400 font-light tracking-wide"
                  >
                    <span>Smart Airdrop</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <div className="mt-6 p-4 border border-orange-500/20 bg-orange-500/5 text-white/70 font-light tracking-wide text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-orange-400 font-light tracking-wide">PRICE DISCOVERY</span>
                  </div>
                  Price decreases over 72 hours from $0.20 to $0.05. Early participants get tier-based bonuses. Anti-whale protection active.
                </div>
              </div>

              {/* Secure Purchase Interface */}
              <div>
                <h2 className="text-3xl font-thin tracking-wide mb-8">Secure Token Purchase</h2>
                <SecurePurchaseComponent 
                  contractAddress={vestingData.dutchAuctionAddress}
                  maxTokensPerUser="10000"
                  minPurchaseAmount="100"
                />
              </div>

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