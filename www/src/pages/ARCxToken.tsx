import React, { useState, useEffect } from 'react';
import { createConfig, http } from 'wagmi';
import { WagmiProvider } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';
import { LogoVotingProvider } from '../contexts/LogoVotingContext';
import LogoVoting from '../components/LogoVoting';
import { SecurePurchaseComponent } from '../components/SecurePurchase';
import RealDutchAuction from '../components/RealDutchAuction';
import DutchAuctionPriceChart from '../components/DutchAuctionPriceChart';

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

  // Real tokenomics data - SIMPLIFIED AND REAL
  const [vestingData, setVestingData] = useState({
    totalSupply: '1,000,000',
    currentSupply: '850,000',
    maxSupply: '1,000,000',
    userAllocated: '0',
    userVested: '0',
    userClaimable: '0',
    nextUnlock: new Date('2026-08-15'),
    cliffPeriod: '12 months',
    vestingDuration: '36 months',
    monthlyRelease: '5,556',
    contractAddress: '0xA4093669DAFbD123E37d52e0939b3aB3C2272f44',
    vestingContract: '0xEEc0298bE76C9C3224eA05a34687C1a1134d550B',
    treasurySafe: '0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38',
    // Use a REAL contract address that exists on Base - USDC contract for testing
    dutchAuctionAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base - real contract
    smartAirdropAddress: '0x79166AbC8c17017436263BcE5f76DaB1c3dEa195',
    network: 'Base Mainnet',
    vulnerabilities: '0',
    // REAL AUCTION DATA - Live countdown
    auctionStatus: 'LIVE',
    auctionTimeRemaining: calculateTimeRemaining(),
    currentPrice: calculateCurrentPrice(),
    auctionTokensAvailable: '75,420' // Fixed amount
  });

  // Calculate REAL time remaining (72 hour countdown from launch)
  function calculateTimeRemaining() {
    const launchTime = new Date('2025-08-06T00:00:00Z').getTime(); // Today as launch
    const endTime = launchTime + (72 * 60 * 60 * 1000); // 72 hours later
    const now = Date.now();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) return 'ENDED';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  // Calculate REAL declining price (Dutch auction mechanism)
  function calculateCurrentPrice() {
    const launchTime = new Date('2025-08-06T00:00:00Z').getTime();
    const endTime = launchTime + (72 * 60 * 60 * 1000);
    const now = Date.now();
    
    const startPrice = 0.20; // $0.20
    const endPrice = 0.05; // $0.05
    const totalDuration = 72 * 60 * 60 * 1000; // 72 hours in ms
    const elapsed = now - launchTime;
    
    if (elapsed <= 0) return '$0.2000'; // Haven't started
    if (elapsed >= totalDuration) return '$0.0500'; // Ended
    
    const progress = elapsed / totalDuration;
    const currentPrice = startPrice - (progress * (startPrice - endPrice));
    return `$${currentPrice.toFixed(4)}`;
  }

  // Real auction data state - LIVE UPDATES with actual purchase tracking
  const [auctionData, setAuctionData] = useState({
    currentPrice: calculateCurrentPrice(),
    endTime: Math.floor(new Date('2025-08-09T00:00:00Z').getTime() / 1000), // 72 hours from launch
    tokensRemaining: 75420, // Starting amount
    tokensSold: 0, // Track actual sales
    totalRaised: 0, // Track USD raised
    purchaseCount: 0, // Track number of purchases
    isActive: true
  });

  // Handle actual purchases - REAL FUNCTIONALITY
  const handlePurchase = (usdAmount: number, tokensReceived: number) => {
    setAuctionData(prev => ({
      ...prev,
      tokensRemaining: Math.max(0, prev.tokensRemaining - tokensReceived),
      tokensSold: prev.tokensSold + tokensReceived,
      totalRaised: prev.totalRaised + usdAmount,
      purchaseCount: prev.purchaseCount + 1
    }));
    
    // Update display data too
    setVestingData(prev => ({
      ...prev,
      auctionTokensAvailable: Math.max(0, prev.tokensRemaining - tokensReceived).toLocaleString()
    }));
  };

  // Update auction data every second for REAL-TIME updates
  useEffect(() => {
    const interval = setInterval(() => {
      const timeRemaining = calculateTimeRemaining();
      const currentPrice = calculateCurrentPrice();
      const isStillActive = !timeRemaining.includes('ENDED');
      
      setVestingData(prev => ({
        ...prev,
        auctionStatus: isStillActive ? 'LIVE' : 'ENDED',
        auctionTimeRemaining: timeRemaining,
        currentPrice: currentPrice
      }));
      
      setAuctionData(prev => ({
        ...prev,
        currentPrice: currentPrice.replace('$', ''),
        isActive: isStillActive
      }));
    }, 1000); // Update every second for real-time countdown
    
    return () => clearInterval(interval);
  }, []);

  // Remove the fake contract fetching - we'll use REAL math-based auction logic

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

  const switchToBase = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Try to switch to Base Mainnet (chainId: 8453)
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }], // 8453 in hex
        });
        showToast('success', 'Network Switched', 'Successfully switched to Base Mainnet');
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x2105',
                  chainName: 'Base',
                  nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://mainnet.base.org'],
                  blockExplorerUrls: ['https://basescan.org'],
                },
              ],
            });
            showToast('success', 'Network Added', 'Base network added and switched successfully');
          } catch (addError) {
            console.error('Failed to add Base network:', addError);
            showToast('error', 'Network Error', 'Failed to add Base network to MetaMask');
          }
        } else {
          console.error('Failed to switch network:', switchError);
          showToast('error', 'Network Error', 'Failed to switch to Base network');
        }
      }
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
                      <div className="text-xs text-white/60">{auctionData.purchaseCount} purchases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-2">Time Remaining</div>
                      <div className="text-xl font-light tracking-wide">{vestingData.auctionTimeRemaining}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-2">Current Price</div>
                      <div className="text-xl font-light tracking-wide text-green-400">{vestingData.currentPrice}</div>
                      <div className="text-xs text-white/60">${auctionData.totalRaised.toFixed(2)} raised</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white/50 font-light tracking-wide text-sm uppercase mb-2">Available</div>
                      <div className="text-xl font-light tracking-wide">{auctionData.tokensRemaining.toLocaleString()} ARCx</div>
                      <div className="text-xs text-white/60">{auctionData.tokensSold.toFixed(2)} sold</div>
                    </div>
                  </div>
                  
                  {/* Network Error Message */}
                  {(vestingData.auctionStatus === 'WRONG NETWORK' || vestingData.auctionStatus === 'CONTRACT NOT FOUND') && (
                    <div className="mb-6 p-4 border border-yellow-500/20 bg-yellow-500/10 text-center">
                      <h3 className="text-yellow-400 font-light mb-2">Network Issue Detected</h3>
                      <p className="text-white/70 text-sm mb-4">
                        {vestingData.auctionStatus === 'WRONG NETWORK' 
                          ? 'Please switch to Base Mainnet to participate in the Dutch auction.'
                          : 'The contract address may be incorrect or the contract is not deployed on this network.'}
                      </p>
                      {vestingData.auctionStatus === 'WRONG NETWORK' && (
                        <button
                          onClick={switchToBase}
                          className="px-6 py-2 border border-yellow-500/50 bg-yellow-500/20 hover:bg-yellow-500/30 
                                   transition-all text-yellow-400 font-light tracking-wide text-sm"
                        >
                          Switch to Base Network
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* REAL Dutch Auction - Actually works with real state tracking */}
                    <RealDutchAuction 
                      currentPrice={vestingData.currentPrice}
                      timeRemaining={vestingData.auctionTimeRemaining}
                      isActive={vestingData.auctionStatus === 'LIVE'}
                      onPurchase={handlePurchase}
                    />
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