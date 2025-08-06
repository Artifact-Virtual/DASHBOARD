// Dutch Auction Contract Integration
import { ethers } from 'ethers';

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeAllListeners: (event: string) => void;
    };
  }
}

// Dutch Auction ABI (simplified - you'll need the full ABI from your contract)
const DUTCH_AUCTION_ABI = [
  "function currentPrice() view returns (uint256)",
  "function buy(uint256 amount) payable",
  "function auctionEndTime() view returns (uint256)",
  "function tokensRemaining() view returns (uint256)",
  "function minimumPrice() view returns (uint256)",
  "function maximumPrice() view returns (uint256)",
  "function priceDecayRate() view returns (uint256)",
  "function userPurchases(address) view returns (uint256)",
  "function maxPurchasePerUser() view returns (uint256)",
  "event Purchase(address indexed buyer, uint256 amount, uint256 price, uint256 timestamp)"
];

export class DutchAuctionContract {
  private contract: ethers.Contract;
  private provider: ethers.providers.Web3Provider;

  constructor(provider: ethers.providers.Web3Provider, contractAddress: string) {
    this.provider = provider;
    this.contract = new ethers.Contract(contractAddress, DUTCH_AUCTION_ABI, provider);
  }

  // Get current auction price
  async getCurrentPrice(): Promise<string> {
    try {
      const price = await this.contract.currentPrice();
      return ethers.utils.formatEther(price);
    } catch (error) {
      console.error('Error fetching current price:', error);
      throw error;
    }
  }

  // Get tokens remaining
  async getTokensRemaining(): Promise<string> {
    try {
      const remaining = await this.contract.tokensRemaining();
      return ethers.utils.formatUnits(remaining, 18); // Assuming 18 decimals
    } catch (error) {
      console.error('Error fetching tokens remaining:', error);
      throw error;
    }
  }

  // Get auction end time
  async getAuctionEndTime(): Promise<Date> {
    try {
      const endTime = await this.contract.auctionEndTime();
      return new Date(endTime.toNumber() * 1000);
    } catch (error) {
      console.error('Error fetching auction end time:', error);
      throw error;
    }
  }

  // Purchase tokens
  async purchaseTokens(tokenAmount: string, maxPricePerToken: string): Promise<ethers.ContractTransaction> {
    try {
      const signer = this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer);
      const currentPrice = await this.getCurrentPrice();
      
      // Safety check: ensure current price doesn't exceed user's max price
      if (parseFloat(currentPrice) > parseFloat(maxPricePerToken)) {
        throw new Error(`Current price (${currentPrice} ETH) exceeds your maximum price (${maxPricePerToken} ETH)`);
      }

      const tokenAmountWei = ethers.utils.parseUnits(tokenAmount, 18);
      const totalCostWei = ethers.utils.parseEther((parseFloat(tokenAmount) * parseFloat(currentPrice)).toString());

      // Execute purchase with slippage protection
      const tx = await contractWithSigner.buy(tokenAmountWei, {
        value: totalCostWei,
        gasLimit: 300000 // Adjust based on your contract
      });

      return tx;
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      throw error;
    }
  }

  // Get user's current purchases
  async getUserPurchases(userAddress: string): Promise<string> {
    try {
      const purchases = await this.contract.userPurchases(userAddress);
      return ethers.utils.formatUnits(purchases, 18);
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      throw error;
    }
  }

  // Listen for purchase events
  onPurchase(callback: (buyer: string, amount: string, price: string, timestamp: number) => void) {
    this.contract.on('Purchase', (buyer, amount, price, timestamp) => {
      callback(
        buyer,
        ethers.utils.formatUnits(amount, 18),
        ethers.utils.formatEther(price),
        timestamp.toNumber()
      );
    });
  }
}
