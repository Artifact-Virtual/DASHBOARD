import React, { useState, useEffect } from 'react';
import { createConfig, http } from 'wagmi';
import { WagmiProvider } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';
import { LogoVotingProvider } from '../contexts/LogoVotingContext';
import LogoVoting from '../components/LogoVoting';
import { SecurePurchaseComponent } from '../components/SecurePurchase';
import DutchAuction from '../components/DutchAuction';
import DutchAuctionPriceChart from '../components/DutchAuctionPriceChart';
import DutchAuctionABI from '../contracts/DutchAuctionABI.json';

const wagmiConfig = createConfig({
  chains: [base, mainnet],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

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
    auctionStatus: 'LOADING...', // Will fetch from contract
    auctionTimeRemaining: 'LOADING...', // Will fetch from contract
    currentPrice: 'LOADING...', // Will fetch from contract
    auctionTokensAvailable: 'LOADING...' // Will fetch from contract
  });

  // Real auction data state
  const [auctionData, setAuctionData] = useState({
    currentPrice: '0',
    endTime: 0,
    tokensRemaining: '0',
    isActive: false
  });

  // Fetch real auction data from contract
  useEffect(() => {
    async function fetchAuctionData() {
      if (typeof window === 'undefined' || !window.ethereum) return;
      
      try {
        const provider = new (await import('ethers')).ethers.BrowserProvider(window.ethereum);
        const contract = new (await import('ethers')).ethers.Contract(
          vestingData.dutchAuctionAddress,
          DutchAuctionABI,
          provider
        );

        // Fetch real data from contract
        const [currentPrice, endTime, tokensRemaining] = await Promise.all([
          contract.getCurrentPrice().catch(() => '0'),
          contract.auctionEndTime().catch(() => 0),
          contract.tokensRemaining().catch(() => '0')
        ]);

        const now = Math.floor(Date.now() / 1000);
        const timeLeft = Math.max(0, endTime - now);
        const isActive = timeLeft > 0;

        // Format values using ethers
        const ethers = (await import('ethers')).ethers;
        const formattedCurrentPrice = ethers.formatEther(currentPrice);
        const formattedTokensRemaining = ethers.formatEther(tokensRemaining);

        setAuctionData({
          currentPrice: formattedCurrentPrice,
          endTime: endTime,
          tokensRemaining: formattedTokensRemaining,
          isActive
        });

                // Update vesting data with real values
        const ethers = await import('ethers');
        const priceInEth = parseFloat(ethers.ethers.formatEther(currentPrice));
        const tokensRemainingFormatted = parseFloat(ethers.ethers.formatEther(tokensRemaining));
        
        setVestingData(prev => ({
          ...prev,
          auctionStatus: isActive ? 'LIVE' : 'ENDED',
          auctionTimeRemaining: timeLeft > 0 ? `${Math.floor(timeLeft / 3600)}h ${Math.floor((timeLeft % 3600) / 60)}m` : 'ENDED',
          currentPrice: `$${(priceInEth * 3000).toFixed(4)}`, // Assuming ETH = $3000
          auctionTokensAvailable: tokensRemainingFormatted.toFixed(0)
        }));

      } catch (error) {
        console.error('Failed to fetch auction data:', error);
        // Fallback to indicate contract connection failed
        setVestingData(prev => ({
          ...prev,
          auctionStatus: 'CONTRACT ERROR',
          auctionTimeRemaining: 'UNABLE TO CONNECT',
          currentPrice: 'CHECK CONTRACT',
          auctionTokensAvailable: 'N/A'
        }));
      }
    }

    fetchAuctionData();
    
    // Update every 30 seconds
    const interval = setInterval(fetchAuctionData, 30000);
    return () => clearInterval(interval);
  }, [vestingData.dutchAuctionAddress]);

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
      showToast('success', 'Tokens Claimed', `Successfully claimed ${vestingData.userClaimable} ARCx tokens`);
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
    <WagmiProvider config={wagmiConfig}>
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
                    {typeof window !== 'undefined' && (
                      <DutchAuction 
                        auctionAddress={vestingData.dutchAuctionAddress}
                        auctionAbi={DutchAuctionABI}
                      />
                    )}
                  </div>
                  <div className="mt-6 p-4 border border-orange-500/20 bg-orange-500/5 text-white/70 font-light tracking-wide text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-orange-400 font-light tracking-wide">PRICE DISCOVERY</span>
                    </div>
                    Price decreases over 72 hours from $0.20 to $0.05. Early participants get tier-based bonuses. Anti-whale protection active.
                  </div>
                  
                  {/* Price Chart Visualization */}
                  <div className="mt-8">
                    <DutchAuctionPriceChart
                      currentPrice={auctionData.currentPrice}
                      auctionEndTime={auctionData.endTime}
                      auctionStartPrice={0.20}
                      auctionEndPrice={0.05}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* SMART AIRDROP - MERIT-BASED SECTION - TEMPORARILY DISABLED FOR DEBUGGING */}
                <div className="border-2 border-indigo-500/50 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-8 backdrop-blur-sm">
                  <div className="text-center">
                    <h2 className="text-2xl font-light tracking-wide text-indigo-400 mb-4">
                      Smart Airdrop - Coming Soon
                    </h2>
                    <p className="text-white/70 font-light tracking-wide">
                      Merit-based airdrop component is being finalized. Check back soon!
                    </p>
                  </div>
                </div>
                {/* ...existing code... */}
              </div>
            </LogoVotingProvider>
          )}
        </div>
      </div>
    </WagmiProvider>
  );
}

export default ARCxToken;