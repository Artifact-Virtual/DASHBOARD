// Secure Purchase Component for Dutch Auction
import React, { useState } from 'react';
import { useDutchAuction } from '../hooks/useDutchAuction';
import { useToast } from '../contexts/ToastContext';

interface PurchaseComponentProps {
  contractAddress: string;
  maxTokensPerUser?: string;
  minPurchaseAmount?: string;
}

export const SecurePurchaseComponent: React.FC<PurchaseComponentProps> = ({
  contractAddress,
  maxTokensPerUser = "10000",
  minPurchaseAmount = "100"
}) => {
  const { showToast } = useToast();
  const {
    currentPrice,
    tokensRemaining,
    auctionEndTime,
    userPurchases,
    isLoading,
    error,
    purchaseTokens
  } = useDutchAuction(contractAddress);

  const [purchaseAmount, setPurchaseAmount] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (!purchaseAmount || !maxPrice) {
      showToast('error', 'Invalid Input', 'Please enter both purchase amount and maximum price');
      return;
    }

    const amount = parseFloat(purchaseAmount);
    const maxPriceNum = parseFloat(maxPrice);
    const currentPriceNum = parseFloat(currentPrice);

    // Validation checks
    if (amount < parseFloat(minPurchaseAmount)) {
      showToast('error', 'Amount Too Small', `Minimum purchase: ${minPurchaseAmount} ARCx`);
      return;
    }

    if (amount > parseFloat(tokensRemaining)) {
      showToast('error', 'Insufficient Supply', `Only ${tokensRemaining} ARCx remaining`);
      return;
    }

    if ((parseFloat(userPurchases) + amount) > parseFloat(maxTokensPerUser)) {
      showToast('error', 'Purchase Limit Exceeded', `Maximum ${maxTokensPerUser} ARCx per user`);
      return;
    }

    if (maxPriceNum < currentPriceNum) {
      showToast('error', 'Price Slippage', `Current price (${currentPrice} ETH) exceeds your max (${maxPrice} ETH)`);
      return;
    }

    setIsPurchasing(true);
    try {
      const tx = await purchaseTokens(purchaseAmount, maxPrice);
      
      showToast('success', 'Purchase Successful!', `Successfully purchased ${purchaseAmount} ARCx tokens`);
      
      // Reset form
      setPurchaseAmount('');
      setMaxPrice('');
      
      // Show transaction details
      console.log('Transaction:', tx);
      
    } catch (error: any) {
      console.error('Purchase failed:', error);
      showToast('error', 'Purchase Failed', error.message || 'Transaction failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const calculateTotalCost = () => {
    if (!purchaseAmount || !currentPrice) return '0';
    return (parseFloat(purchaseAmount) * parseFloat(currentPrice)).toFixed(6);
  };

  const getTimeRemaining = () => {
    if (!auctionEndTime) return 'Loading...';
    
    const now = new Date();
    const timeDiff = auctionEndTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return 'Auction Ended';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (error) {
    return (
      <div className="border border-red-500/20 bg-red-500/5 p-6 text-center">
        <div className="text-red-400 mb-2">⚠️ Auction Connection Error</div>
        <div className="text-white/60 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="border border-white/10 p-8 space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-thin tracking-wide mb-4">Secure Token Purchase</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-white/50 uppercase tracking-wide mb-1">Current Price</div>
            <div className="text-green-400 font-light">{currentPrice} ETH</div>
          </div>
          <div>
            <div className="text-white/50 uppercase tracking-wide mb-1">Remaining</div>
            <div className="text-white font-light">{tokensRemaining} ARCx</div>
          </div>
          <div>
            <div className="text-white/50 uppercase tracking-wide mb-1">Time Left</div>
            <div className="text-orange-400 font-light">{getTimeRemaining()}</div>
          </div>
          <div>
            <div className="text-white/50 uppercase tracking-wide mb-1">Your Purchases</div>
            <div className="text-blue-400 font-light">{userPurchases} ARCx</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white/70 text-sm mb-2">
            Purchase Amount (ARCx)
          </label>
          <input
            type="number"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
            placeholder="Enter amount..."
            min={minPurchaseAmount}
            max={Math.min(parseFloat(tokensRemaining), parseFloat(maxTokensPerUser) - parseFloat(userPurchases))}
            className="w-full px-4 py-3 bg-black/30 border border-white/20 text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
          />
          <div className="text-white/40 text-xs mt-1">
            Min: {minPurchaseAmount} • Max: {(parseFloat(maxTokensPerUser) - parseFloat(userPurchases)).toFixed(0)} ARCx
          </div>
        </div>

        <div>
          <label className="block text-white/70 text-sm mb-2">
            Max Price Per Token (ETH)
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Slippage protection..."
            step="0.001"
            min={currentPrice}
            className="w-full px-4 py-3 bg-black/30 border border-white/20 text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
          />
          <div className="text-white/40 text-xs mt-1">
            Current: {currentPrice} ETH • Recommended: {(parseFloat(currentPrice) * 1.05).toFixed(6)} ETH
          </div>
        </div>
      </div>

      {purchaseAmount && (
        <div className="bg-blue-500/5 border border-blue-500/20 p-4">
          <div className="text-blue-400 font-light mb-2">Purchase Summary</div>
          <div className="text-white/70 text-sm space-y-1">
            <div>Amount: {purchaseAmount} ARCx</div>
            <div>Estimated Cost: {calculateTotalCost()} ETH</div>
            <div>Max Price Protection: {maxPrice} ETH per token</div>
          </div>
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={!purchaseAmount || !maxPrice || isPurchasing || isLoading || parseFloat(tokensRemaining) <= 0}
        className="w-full py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white font-light tracking-wide hover:from-blue-500/30 hover:to-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPurchasing ? (
          <span className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing Purchase...
          </span>
        ) : (
          'Purchase ARCx Tokens'
        )}
      </button>

      <div className="text-center">
        <div className="text-white/40 text-xs space-y-1">
          <div>🔒 Secure smart contract execution</div>
          <div>⚡ Price protection & anti-whale limits</div>
          <div>✅ All transactions verified on Base Mainnet</div>
        </div>
      </div>
    </div>
  );
};
