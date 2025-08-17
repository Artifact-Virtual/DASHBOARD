import React from 'react';

type Props = {
  currentPrice: number | string;
  auctionEndTime: number;
  auctionStartPrice: number;
  auctionEndPrice: number;
  className?: string;
};

const DutchAuctionPriceChart: React.FC<Props> = ({ currentPrice, auctionEndTime, auctionStartPrice, auctionEndPrice, className }) => {
  // Minimal placeholder chart: a simple SVG line from startPrice to endPrice
  const width = 800;
  const height = 160;
  const pad = 16;

  const startX = pad;
  const endX = width - pad;
  const startY = pad;
  const endY = height - pad;

  // Map prices to Y coordinate (higher price -> smaller Y)
  const yFor = (p: number) => {
    const max = Math.max(auctionStartPrice, auctionEndPrice);
    const min = Math.min(auctionStartPrice, auctionEndPrice);
    if (max === min) return height / 2;
    const t = (p - min) / (max - min);
    return endY - t * (endY - startY);
  };

  const lineD = `M ${startX} ${yFor(auctionStartPrice)} L ${endX} ${yFor(auctionEndPrice)}`;

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="160" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#ff7a7a" />
            <stop offset="100%" stopColor="#7aa2ff" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
        <path d={lineD} stroke="url(#g)" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={startX} cy={yFor(auctionStartPrice)} r={4} fill="#ff7a7a" />
        <circle cx={endX} cy={yFor(auctionEndPrice)} r={4} fill="#7aa2ff" />
        <text x={startX} y={yFor(auctionStartPrice) - 8} fill="#fff" fontSize={12} fontFamily="Inter, system-ui, sans-serif">Start ${auctionStartPrice}</text>
        <text x={endX - 80} y={yFor(auctionEndPrice) - 8} fill="#fff" fontSize={12} fontFamily="Inter, system-ui, sans-serif">End ${auctionEndPrice}</text>
      </svg>
      <div className="mt-2 text-sm text-white/70">Current price: <span className="text-white">{String(currentPrice)}</span></div>
    </div>
  );
};

export default DutchAuctionPriceChart;
