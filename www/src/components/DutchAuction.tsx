import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
// If you want to use ABI directly here, import as needed:
// import DutchAuctionABI from '../contracts/DutchAuctionABI.json';

interface DutchAuctionProps {
  auctionAddress: string;
  auctionAbi: any;
}

export default function DutchAuction({ auctionAddress, auctionAbi }: DutchAuctionProps) {
  const { address, isConnected } = useAccount();
  const [provider, setProvider] = useState<any>();
  const [contract, setContract] = useState<any>();
  const [currentPrice, setCurrentPrice] = useState("-");
  const [bidAmount, setBidAmount] = useState("");
  const [txStatus, setTxStatus] = useState("");

  // Setup provider & contract
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
      setContract(new ethers.Contract(auctionAddress, auctionAbi, p));
    }
  }, [auctionAddress, auctionAbi]);

  // Read current price
  useEffect(() => {
    if (!contract) return;
    async function fetchPrice() {
      try {
        const price = await contract.getCurrentPrice();
        setCurrentPrice(ethers.formatEther(price));
      } catch (err) {
        setCurrentPrice("-");
      }
    }
    fetchPrice();
  }, [contract]);

  // Bid handler
  async function handleBid() {
    setTxStatus("pending");
    try {
      const signer = await provider.getSigner();
      const c = contract.connect(signer);
      const tx = await c.bid({ value: ethers.parseEther(bidAmount) });
      await tx.wait();
      setTxStatus("success");
    } catch (err) {
      setTxStatus("error");
    }
  }

  // Buy Now handler (if supported)
  async function handleBuyNow() {
    setTxStatus("pending");
    try {
      const signer = await provider.getSigner();
      const c = contract.connect(signer);
      const price = await c.getCurrentPrice();
      const tx = await c.buy({ value: price });
      await tx.wait();
      setTxStatus("success");
    } catch (err) {
      setTxStatus("error");
    }
  }

  if (!isConnected) return <div className="text-center text-white/70">Connect wallet to participate in the ARCx Auction</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-black/80 rounded-2xl shadow-xl border border-red-500/30">
      <h2 className="text-2xl font-thin tracking-wide text-red-400 mb-2">ARCx Dutch Auction</h2>
      <div className="mb-2 text-white/80">Current Price: <span className="font-mono text-green-400">{currentPrice} ETH</span></div>
      <input
        type="number"
        min="0"
        placeholder="Your bid (ETH)"
        value={bidAmount}
        onChange={e => setBidAmount(e.target.value)}
        className="mb-2 w-full px-4 py-2 rounded bg-black/40 border border-white/20 text-white font-light tracking-wide"
      />
      <button onClick={handleBid} className="w-full mb-2 px-4 py-2 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 font-light tracking-wide transition-all">
        Place Bid
      </button>
      <button onClick={handleBuyNow} className="w-full px-4 py-2 rounded bg-green-500/20 hover:bg-green-500/40 text-green-400 font-light tracking-wide transition-all">
        Buy Now
      </button>
      {txStatus && <div className="mt-2 text-sm text-white/80">{txStatus === "pending" ? "Transaction pending..." : txStatus === "success" ? "Success!" : "Error."}</div>}
    </div>
  );
}
