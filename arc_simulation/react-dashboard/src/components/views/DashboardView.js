import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Shield, 
  Network,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';

const DashboardView = ({ simulationData, controls, connectionStatus }) => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [volumeHistory, setVolumeHistory] = useState([]);

  useEffect(() => {
    if (simulationData?.tokenomics) {
      const newPrice = {
        x: new Date().toISOString(),
        y: simulationData.tokenomics.current_price
      };
      
      const newVolume = {
        x: new Date().toISOString(),
        y: (simulationData.simulation_state?.total_disputes || 0) * 1000
      };

      setPriceHistory(prev => [...prev.slice(-50), newPrice]);
      setVolumeHistory(prev => [...prev.slice(-50), newVolume]);
    }
  }, [simulationData]);

  const getMetrics = () => {
    if (!simulationData) {
      return {
        price: '0.001000',
        priceChange: 0,
        volume: '0',
        marketCap: '0',
        arcs: 0,
        agents: 0,
        networkHealth: 100,
        blocks: 0
      };
    }

    const { tokenomics, simulation_state } = simulationData;
    const networkState = simulation_state?.network_state || {};
    const arcs = networkState.arcs || [];

    return {
      price: (tokenomics?.current_price || 0.001).toFixed(6),
      priceChange: tokenomics?.price_change_24h || 0,
      volume: ((simulation_state?.total_disputes || 0) * 1000).toLocaleString(),
      marketCap: (tokenomics?.market_cap || 0).toLocaleString(),
      arcs: arcs.length,
      agents: simulation_state?.fuel_alive || 0,
      networkHealth: (simulation_state?.economic_health || 1.0) * 100,
      blocks: arcs.reduce((sum, arc) => sum + (arc.total_blocks || 0), 0)
    };
  };

  const metrics = getMetrics();

  // Professional trading chart configuration
  const priceChartLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#ffffff', family: 'JetBrains Mono' },
    margin: { l: 50, r: 30, t: 30, b: 40 },
    xaxis: {
      gridcolor: '#363a4f',
      linecolor: '#363a4f',
      tickcolor: '#363a4f',
      showgrid: true,
      zeroline: false
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
    height: 300
  };

  const priceChartData = [{
    x: priceHistory.map(p => p.x),
    y: priceHistory.map(p => p.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: '#00d4aa',
      width: 2
    },
    fill: 'tonexty',
    fillcolor: 'rgba(0, 212, 170, 0.1)'
  }];

  const volumeChartData = [{
    x: volumeHistory.map(v => v.x),
    y: volumeHistory.map(v => v.y),
    type: 'bar',
    marker: {
      color: '#3742fa',
      opacity: 0.7
    }
  }];

  const MetricCard = ({ icon: Icon, title, value, change, changeType, suffix = '' }) => (
    <motion.div
      whileHover={{ y: -2 }}
      className="trading-card"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 ${
            changeType === 'positive' ? 'text-accent-green' :
            changeType === 'negative' ? 'text-accent-red' :
            'text-accent-blue'
          }`} />
          <span className="text-sm text-gray-400 font-medium">{title}</span>
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
      <div className="metric-value">{value}{suffix}</div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Trading Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time ARC Multi-Network Analytics</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Activity className="w-4 h-4" />
          <span>Live Data Stream</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign}
          title="FUEL Price"
          value={`$${metrics.price}`}
          change={metrics.priceChange}
          changeType={metrics.priceChange > 0 ? 'positive' : metrics.priceChange < 0 ? 'negative' : 'neutral'}
        />
        <MetricCard
          icon={BarChart3}
          title="Market Cap"
          value={`$${metrics.marketCap}`}
          changeType="neutral"
        />
        <MetricCard
          icon={Network}
          title="Active ARCs"
          value={metrics.arcs}
          changeType="neutral"
        />
        <MetricCard
          icon={Users}
          title="Live Agents"
          value={metrics.agents}
          changeType="positive"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="chart-container"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">FUEL Price Chart</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
              <span>Live</span>
            </div>
          </div>
          
          {priceHistory.length > 0 ? (
            <Plot
              data={priceChartData}
              layout={priceChartLayout}
              style={{ width: '100%', height: '300px' }}
              config={{ displayModeBar: false, responsive: true }}
            />
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Activity className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p>Waiting for price data...</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="chart-container"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Network Activity</h3>
            <span className="text-sm text-gray-400">Transactions</span>
          </div>
          
          {volumeHistory.length > 0 ? (
            <Plot
              data={volumeChartData}
              layout={{
                ...priceChartLayout,
                yaxis: {
                  ...priceChartLayout.yaxis,
                  tickformat: ','
                }
              }}
              style={{ width: '100%', height: '300px' }}
              config={{ displayModeBar: false, responsive: true }}
            />
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p>Waiting for activity data...</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Network Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Network Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="trading-card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Shield className={`w-6 h-6 ${
              metrics.networkHealth > 80 ? 'text-accent-green' :
              metrics.networkHealth > 60 ? 'text-accent-yellow' :
              'text-accent-red'
            }`} />
            <h3 className="text-lg font-semibold">Network Health</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Overall Score</span>
              <span className={`text-xl font-mono font-bold ${
                metrics.networkHealth > 80 ? 'text-accent-green' :
                metrics.networkHealth > 60 ? 'text-accent-yellow' :
                'text-accent-red'
              }`}>
                {metrics.networkHealth.toFixed(1)}%
              </span>
            </div>
            
            <div className="progress-bar">
              <motion.div
                className={`progress-fill ${
                  metrics.networkHealth > 80 ? 'bg-accent-green' :
                  metrics.networkHealth > 60 ? 'bg-accent-yellow' :
                  'bg-accent-red'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.networkHealth}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            
            <div className="text-sm text-gray-400">
              Status: {
                metrics.networkHealth > 80 ? 'Excellent' :
                metrics.networkHealth > 60 ? 'Good' :
                'Needs Attention'
              }
            </div>
          </div>
        </motion.div>

        {/* Block Production */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="trading-card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-6 h-6 text-accent-blue" />
            <h3 className="text-lg font-semibold">Block Production</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Blocks</span>
              <span className="text-xl font-mono font-bold text-accent-blue">
                {metrics.blocks.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active ARCs</span>
              <span className="text-lg font-mono text-white">{metrics.arcs}</span>
            </div>
            
            <div className="text-sm text-gray-400">
              Production Rate: {metrics.arcs > 0 ? (metrics.blocks / metrics.arcs).toFixed(1) : '0'} blocks/ARC
            </div>
          </div>
        </motion.div>

        {/* Agent Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="trading-card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-6 h-6 text-accent-purple" />
            <h3 className="text-lg font-semibold">Agent Network</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Agents</span>
              <span className="text-xl font-mono font-bold text-accent-green">
                {metrics.agents}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Survival Rate</span>
              <span className="text-lg font-mono text-white">
                {((metrics.agents / 8) * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="text-sm text-gray-400">
              Network Participation: High
            </div>
          </div>
        </motion.div>
      </div>

      {/* Loading State */}
      {connectionStatus !== 'connected' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-dark-900 bg-opacity-80 flex items-center justify-center z-40"
        >
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connecting to Network</h3>
            <p className="text-gray-400">Establishing real-time data connection...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardView;
