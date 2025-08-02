import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  PieChart,
  Activity,
  Zap
} from 'lucide-react';

const TradingView = ({ simulationData, controls, connectionStatus }) => {
  const [priceData, setPriceData] = useState([]);
  const [orderBookData, setOrderBookData] = useState({ bids: [], asks: [] });

  useEffect(() => {
    if (simulationData?.tokenomics) {
      const newDataPoint = {
        time: new Date().toISOString(),
        price: simulationData.tokenomics.current_price,
        volume: (simulationData.simulation_state?.total_disputes || 0) * 1000,
        high: simulationData.tokenomics.current_price * 1.02,
        low: simulationData.tokenomics.current_price * 0.98,
        open: simulationData.tokenomics.current_price * 0.99,
        close: simulationData.tokenomics.current_price
      };

      setPriceData(prev => [...prev.slice(-100), newDataPoint]);

      // Simulate order book
      const price = simulationData.tokenomics.current_price;
      const spread = price * 0.001;
      
      setOrderBookData({
        bids: Array.from({length: 10}, (_, i) => ({
          price: price - spread - (i * spread * 0.1),
          size: Math.random() * 1000 + 100,
          total: 0
        })),
        asks: Array.from({length: 10}, (_, i) => ({
          price: price + spread + (i * spread * 0.1),
          size: Math.random() * 1000 + 100,
          total: 0
        }))
      });
    }
  }, [simulationData]);

  const getMetrics = () => {
    if (!simulationData?.tokenomics) {
      return {
        price: '0.001000',
        change24h: 0,
        volume24h: '0',
        marketCap: '0',
        high24h: '0.001000',
        low24h: '0.001000'
      };
    }

    const { tokenomics } = simulationData;
    return {
      price: tokenomics.current_price.toFixed(6),
      change24h: tokenomics.price_change_24h || 0,
      volume24h: ((simulationData.simulation_state?.total_disputes || 0) * 10000).toLocaleString(),
      marketCap: (tokenomics.market_cap || 0).toLocaleString(),
      high24h: (tokenomics.current_price * 1.1).toFixed(6),
      low24h: (tokenomics.current_price * 0.9).toFixed(6)
    };
  };

  const metrics = getMetrics();

  // Candlestick chart data
  const candlestickData = [{
    x: priceData.map(d => d.time),
    open: priceData.map(d => d.open),
    high: priceData.map(d => d.high),
    low: priceData.map(d => d.low),
    close: priceData.map(d => d.close),
    type: 'candlestick',
    increasing: { line: { color: '#00d4aa' } },
    decreasing: { line: { color: '#ff4757' } }
  }];

  const chartLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#ffffff', family: 'JetBrains Mono' },
    margin: { l: 60, r: 30, t: 30, b: 40 },
    xaxis: {
      gridcolor: '#363a4f',
      linecolor: '#363a4f',
      tickcolor: '#363a4f',
      showgrid: true,
      zeroline: false,
      rangeslider: { visible: false }
    },
    yaxis: {
      gridcolor: '#363a4f',
      linecolor: '#363a4f',
      tickcolor: '#363a4f',
      showgrid: true,
      zeroline: false,
      tickformat: '$.6f'
    },
    showlegend: false,
    height: 400
  };

  const TradingMetric = ({ icon: Icon, label, value, change, isPrice = false }) => (
    <motion.div
      whileHover={{ y: -2 }}
      className="trading-card"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-accent-blue" />
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-xs ${
            change > 0 ? 'text-accent-green' : 
            change < 0 ? 'text-accent-red' : 
            'text-gray-400'
          }`}>
            {change > 0 ? <TrendingUp className="w-3 h-3" /> : 
             change < 0 ? <TrendingDown className="w-3 h-3" /> : null}
            <span>{change > 0 ? '+' : ''}{change.toFixed(2)}%</span>
          </div>
        )}
      </div>
      <div className={`text-xl font-mono font-bold ${isPrice ? 'text-accent-green' : 'text-white'}`}>
        {value}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">FUEL Trading</h1>
          <p className="text-gray-400 mt-1">Professional Trading Interface</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
          <span className="text-gray-400">Live Market Data</span>
        </div>
      </div>

      {/* Trading Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <TradingMetric
          icon={DollarSign}
          label="Price"
          value={`$${metrics.price}`}
          change={metrics.change24h}
          isPrice={true}
        />
        <TradingMetric
          icon={BarChart3}
          label="24h Volume"
          value={`$${metrics.volume24h}`}
        />
        <TradingMetric
          icon={TrendingUp}
          label="24h High"
          value={`$${metrics.high24h}`}
        />
        <TradingMetric
          icon={TrendingDown}
          label="24h Low"
          value={`$${metrics.low24h}`}
        />
        <TradingMetric
          icon={PieChart}
          label="Market Cap"
          value={`$${metrics.marketCap}`}
        />
        <TradingMetric
          icon={Activity}
          label="Supply"
          value="1M FUEL"
        />
      </div>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Price Chart */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="chart-container"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">FUEL/USD</h3>
              <div className="flex items-center space-x-4 text-sm">
                <button className="px-3 py-1 bg-accent-blue text-white rounded">1m</button>
                <button className="px-3 py-1 text-gray-400 hover:text-white">5m</button>
                <button className="px-3 py-1 text-gray-400 hover:text-white">15m</button>
                <button className="px-3 py-1 text-gray-400 hover:text-white">1h</button>
              </div>
            </div>
            
            {priceData.length > 5 ? (
              <Plot
                data={candlestickData}
                layout={chartLayout}
                style={{ width: '100%', height: '400px' }}
                config={{ displayModeBar: false, responsive: true }}
              />
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                  <p>Building chart data...</p>
                  <p className="text-sm">Need {5 - priceData.length} more data points</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Order Book */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="trading-card h-full"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-accent-yellow" />
              <span>Order Book</span>
            </h3>
            
            <div className="space-y-4">
              {/* Asks */}
              <div>
                <div className="text-xs text-gray-400 mb-2 grid grid-cols-3 gap-2">
                  <span>Price</span>
                  <span>Size</span>
                  <span>Total</span>
                </div>
                
                <div className="space-y-1">
                  {orderBookData.asks.slice(0, 8).reverse().map((ask, i) => (
                    <div key={`ask-${i}`} className="grid grid-cols-3 gap-2 text-xs font-mono">
                      <span className="text-accent-red">{ask.price.toFixed(6)}</span>
                      <span className="text-white">{ask.size.toFixed(0)}</span>
                      <span className="text-gray-400">{(ask.price * ask.size).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spread */}
              <div className="py-2 border-y border-dark-600 text-center">
                <div className="text-xs text-gray-400">Spread</div>
                <div className="text-sm font-mono text-accent-yellow">
                  {simulationData?.tokenomics ? 
                    (simulationData.tokenomics.current_price * 0.002).toFixed(6) : 
                    '0.000002'
                  }
                </div>
              </div>

              {/* Bids */}
              <div>
                <div className="space-y-1">
                  {orderBookData.bids.slice(0, 8).map((bid, i) => (
                    <div key={`bid-${i}`} className="grid grid-cols-3 gap-2 text-xs font-mono">
                      <span className="text-accent-green">{bid.price.toFixed(6)}</span>
                      <span className="text-white">{bid.size.toFixed(0)}</span>
                      <span className="text-gray-400">{(bid.price * bid.size).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trading Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="trading-card"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
          
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 text-xs text-gray-400 border-b border-dark-600 pb-2">
              <span>Time</span>
              <span>Price</span>
              <span>Size</span>
              <span>Side</span>
            </div>
            
            {Array.from({length: 8}, (_, i) => {
              const time = new Date(Date.now() - i * 30000).toLocaleTimeString();
              const price = metrics.price;
              const size = Math.random() * 1000 + 50;
              const side = Math.random() > 0.5 ? 'buy' : 'sell';
              
              return (
                <div key={i} className="grid grid-cols-4 gap-2 text-xs font-mono">
                  <span className="text-gray-400">{time}</span>
                  <span className={side === 'buy' ? 'text-accent-green' : 'text-accent-red'}>
                    ${price}
                  </span>
                  <span className="text-white">{size.toFixed(0)}</span>
                  <span className={`capitalize ${side === 'buy' ? 'text-accent-green' : 'text-accent-red'}`}>
                    {side}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Market Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="trading-card"
        >
          <h3 className="text-lg font-semibold mb-4">Market Statistics</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">24h Volume</span>
              <span className="font-mono text-white">${metrics.volume24h}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Market Cap</span>
              <span className="font-mono text-white">${metrics.marketCap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Circulating Supply</span>
              <span className="font-mono text-white">1,000,000 FUEL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Supply</span>
              <span className="font-mono text-white">1,000,000 FUEL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">All Time High</span>
              <span className="font-mono text-accent-green">
                ${(parseFloat(metrics.price) * 1.5).toFixed(6)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">All Time Low</span>
              <span className="font-mono text-accent-red">$0.000100</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TradingView;
