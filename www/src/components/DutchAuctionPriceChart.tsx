import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PriceChartProps {
  currentPrice: string;
  auctionEndTime: number;
  auctionStartPrice?: number;
  auctionEndPrice?: number;
  className?: string;
}

interface ChartDataPoint {
  time: string;
  price: number;
  timestamp: number;
  status: 'past' | 'current' | 'future';
  label: string;
}

const DutchAuctionPriceChart: React.FC<PriceChartProps> = ({
  currentPrice,
  auctionEndTime,
  auctionStartPrice = 0.20, // $0.20 start price
  auctionEndPrice = 0.05,   // $0.05 end price
  className = ""
}) => {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));
  
  // Update current time every minute for smooth animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Generate price chart data
  const chartData = useMemo(() => {
    const now = currentTime;
    const auctionDuration = 72 * 60 * 60; // 72 hours in seconds
    const auctionStartTime = auctionEndTime - auctionDuration;
    
    const data: ChartDataPoint[] = [];
    const intervals = 144; // Data point every 30 minutes (72 hours / 0.5 hours)
    
    for (let i = 0; i <= intervals; i++) {
      const timestamp = auctionStartTime + (i * auctionDuration / intervals);
      const progress = i / intervals;
      
      // Linear price decline from start to end
      const price = auctionStartPrice - (progress * (auctionStartPrice - auctionEndPrice));
      
      // Determine status
      let status: 'past' | 'current' | 'future' = 'future';
      if (timestamp <= now) {
        status = 'past';
      } else if (i > 0 && data[i-1]?.timestamp <= now) {
        status = 'current';
      }
      
      // Format time label
      const date = new Date(timestamp * 1000);
      const hoursFromStart = Math.floor((timestamp - auctionStartTime) / 3600);
      
      data.push({
        time: hoursFromStart % 6 === 0 ? `${hoursFromStart}h` : '', // Show label every 6 hours
        price: Number(price.toFixed(4)),
        timestamp,
        status,
        label: date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      });
    }
    
    return data;
  }, [currentTime, auctionEndTime, auctionStartPrice, auctionEndPrice]);

  // Find current price point
  const currentPricePoint = useMemo(() => {
    const now = currentTime;
    return chartData.find((point, index) => 
      point.timestamp <= now && 
      (index === chartData.length - 1 || chartData[index + 1].timestamp > now)
    );
  }, [chartData, currentTime]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 border border-white/20 p-3 backdrop-blur-sm">
          <p className="text-white font-light tracking-wide text-sm">
            {data.label}
          </p>
          <p className="text-green-400 font-light tracking-wide">
            Price: ${data.price.toFixed(4)}
          </p>
          <p className="text-white/60 text-xs mt-1">
            {data.status === 'past' ? 'Historical' : 
             data.status === 'current' ? 'Current' : 'Projected'}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom dot for current price
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.status === 'current') {
      return (
        <g>
          <circle 
            cx={cx} 
            cy={cy} 
            r={6} 
            fill="#10b981" 
            stroke="#fff" 
            strokeWidth={2}
            className="animate-pulse"
          />
          <circle 
            cx={cx} 
            cy={cy} 
            r={10} 
            fill="none" 
            stroke="#10b981" 
            strokeWidth={1}
            opacity={0.5}
            className="animate-ping"
          />
        </g>
      );
    }
    return null;
  };

  // Calculate time remaining
  const timeRemaining = Math.max(0, auctionEndTime - currentTime);
  const hoursRemaining = Math.floor(timeRemaining / 3600);
  const minutesRemaining = Math.floor((timeRemaining % 3600) / 60);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-light tracking-wide text-white mb-2">
            Price Discovery Timeline
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-green-400 font-light tracking-wide">
              Current: ${parseFloat(currentPrice || '0').toFixed(4)}
            </div>
            <div className="text-white/60 text-sm">
              {timeRemaining > 0 ? 
                `${hoursRemaining}h ${minutesRemaining}m remaining` : 
                'Auction Ended'
              }
            </div>
          </div>
        </div>
        
        {/* Price Range Indicators */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-white/60">Start: ${auctionStartPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-white/60">End: ${auctionEndPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 sm:h-80 border border-white/10 bg-black/20 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="futureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#ffffff20"
              strokeWidth={1}
            />
            
            <XAxis 
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#ffffff60', fontSize: 12 }}
              interval="preserveStartEnd"
            />
            
            <YAxis 
              domain={['dataMin - 0.01', 'dataMax + 0.01']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#ffffff60', fontSize: 12 }}
              tickFormatter={(value) => `$${value.toFixed(3)}`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Past prices area */}
            <Area
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#priceGradient)"
              data={chartData.filter(d => d.status === 'past')}
            />
            
            {/* Future prices area (projected) */}
            <Area
              type="monotone"
              dataKey="price"
              stroke="#6b7280"
              strokeWidth={1}
              strokeDasharray="5 5"
              fill="url(#futureGradient)"
              data={chartData.filter(d => d.status === 'future')}
            />
            
            {/* Main price line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#10b981' }}
            />
            
            {/* Current price indicator */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="transparent"
              dot={<CustomDot />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-white/60">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-green-500"></div>
          <span>Historical Prices</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 border-b border-dashed border-gray-500"></div>
          <span>Projected Decline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Current Price</span>
        </div>
      </div>

      {/* Price Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Max Price</div>
          <div className="text-white font-light">${auctionStartPrice.toFixed(3)}</div>
        </div>
        <div className="text-center">
          <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Current</div>
          <div className="text-green-400 font-light">${parseFloat(currentPrice || '0').toFixed(4)}</div>
        </div>
        <div className="text-center">
          <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Min Price</div>
          <div className="text-white font-light">${auctionEndPrice.toFixed(3)}</div>
        </div>
        <div className="text-center">
          <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Decline Rate</div>
          <div className="text-red-400 font-light">
            {(((auctionStartPrice - auctionEndPrice) / 72) * 100).toFixed(2)}%/h
          </div>
        </div>
      </div>
    </div>
  );
};

export default DutchAuctionPriceChart;
