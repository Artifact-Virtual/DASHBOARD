// React Hook for Dutch Auction Integration
import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { DutchAuctionContract } from '../contracts/DutchAuction';

export const useDutchAuction = (contractAddress: string) => {
  const { isConnected, address } = useWallet();
  const [auctionContract, setAuctionContract] = useState<DutchAuctionContract | null>(null);
  const [currentPrice, setCurrentPrice] = useState<string>('0');
  const [tokensRemaining, setTokensRemaining] = useState<string>('0');
  const [auctionEndTime, setAuctionEndTime] = useState<Date | null>(null);
  const [userPurchases, setUserPurchases] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize contract
  useEffect(() => {
    if (isConnected && window.ethereum) {
      try {
        const provider = new window.ethereum.providers.Web3Provider(window.ethereum);
        const contract = new DutchAuctionContract(provider, contractAddress);
        setAuctionContract(contract);
      } catch (err) {
        setError('Failed to initialize auction contract');
        console.error('Contract initialization error:', err);
      }
    }
  }, [isConnected, contractAddress]);

  // Fetch auction data
  const fetchAuctionData = useCallback(async () => {
    if (!auctionContract) return;

    setIsLoading(true);
    try {
      const [price, remaining, endTime, purchases] = await Promise.all([
        auctionContract.getCurrentPrice(),
        auctionContract.getTokensRemaining(),
        auctionContract.getAuctionEndTime(),
        address ? auctionContract.getUserPurchases(address) : Promise.resolve('0')
      ]);

      setCurrentPrice(price);
      setTokensRemaining(remaining);
      setAuctionEndTime(endTime);
      setUserPurchases(purchases);
      setError(null);
    } catch (err) {
      setError('Failed to fetch auction data');
      console.error('Auction data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [auctionContract, address]);

  // Purchase tokens
  const purchaseTokens = async (tokenAmount: string, maxPricePerToken: string) => {
    if (!auctionContract) {
      throw new Error('Auction contract not initialized');
    }

    setIsLoading(true);
    try {
      const tx = await auctionContract.purchaseTokens(tokenAmount, maxPricePerToken);
      
      // Wait for transaction confirmation
      await tx.wait();
      
      // Refresh auction data after purchase
      await fetchAuctionData();
      
      return tx;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh auction data
  useEffect(() => {
    if (auctionContract) {
      fetchAuctionData();
      
      // Refresh every 30 seconds
      const interval = setInterval(fetchAuctionData, 30000);
      
      // Listen for purchase events
      auctionContract.onPurchase((buyer, amount, price, timestamp) => {
        console.log('Purchase event:', { buyer, amount, price, timestamp });
        fetchAuctionData(); // Refresh data on new purchases
      });

      return () => {
        clearInterval(interval);
      };
    }
  }, [auctionContract, fetchAuctionData]);

  return {
    currentPrice,
    tokensRemaining,
    auctionEndTime,
    userPurchases,
    isLoading,
    error,
    purchaseTokens,
    refreshData: fetchAuctionData
  };
};
