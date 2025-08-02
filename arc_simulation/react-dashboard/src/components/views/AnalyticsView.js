import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity, 
  Brain,
  Shield,
  Zap,
  AlertTriangle
} from 'lucide-react';

const AnalyticsView = ({ simulationData, controls, connectionStatus }) => {
  const [analyticsHistory, setAnalyticsHistory] = useState([]);

  useEffect(() => {
    if (simulationData) {
      const dataPoint = {
        timestamp: new Date().toISOString(),
        step: simulationData.step || 0,
        economicHealth: (simulationData.simulation_state?.economic_health || 1.0) * 100,
        networkSize: simulationData.simulation_state?.network_state?.arcs?.length || 0,
        agentsAlive: simulationData.simulation_state?.fuel_alive || 0,
        totalBlocks: simulationData.simulation_state?.network_state?.arcs?.reduce(
          (sum, arc) => sum + (arc.total_blocks || 0), 0
        ) || 0,
        totalDisputes: simulationData.simulation_state?.total_disputes || 0,
        fuelPrice: simulationData.tokenomics?.current_price || 0.001
      };

      setAnalyticsHistory(prev => [...prev.slice(-100), dataPoint]);
    }
  }, [simulationData]);

  const getAnalyticsMetrics = () => {
    if (analyticsHistory.length === 0) {
      return {
        avgHealth: 100,
        avgNetworkSize: 3,
        totalVolume: 0,
        healthTrend: 0,
        performanceScore: 100
      };
    }

    const recent = analyticsHistory.slice(-20);
    const avgHealth = recent.reduce((sum, d) => sum + d.economicHealth, 0) / recent.length;
    const avgNetworkSize = recent.reduce((sum, d) => sum + d.networkSize, 0) / recent.length;
    const totalVolume = recent.reduce((sum, d) => sum + d.totalDisputes, 0);
    
    const healthTrend = recent.length > 1 
      ? recent[recent.length - 1].economicHealth - recent[0].economicHealth
      : 0;

    const performanceScore = Math.min(100, 
      (avgHealth * 0.4) + 
      (avgNetworkSize * 10) + 
      (Math.min(totalVolume, 10) * 5)
    );

    return {
      avgHealth: avgHealth.toFixed(1),
      avgNetworkSize: avgNetworkSize.toFixed(1),
      totalVolume,
      healthTrend: healthTrend.toFixed(1),
      performanceScore: performanceScore.toFixed(1)
    };
  };

  const metrics = getAnalyticsMetrics();

  // Chart configurations
  const chartLayout = {
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
      zeroline: false
    },
    showlegend: false,
    height: 300
  };

  // Economic Health Chart
  const healthChartData = [{
    x: analyticsHistory.map(d => d.timestamp),
    y: analyticsHistory.map(d => d.economicHealth),
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#00d4aa', width: 3 },
    marker: { color: '#00d4aa', size: 4 }
  }];

  // Network Activity Chart
  const activityChartData = [
    {
      x: analyticsHistory.map(d => d.timestamp),
      y: analyticsHistory.map(d => d.totalBlocks),
      name: 'Blocks',
      type: 'scatter',
      mode: 'lines',
      line: { color: '#3742fa', width: 2 }
    },
    {
      x: analyticsHistory.map(d => d.timestamp),
      y: analyticsHistory.map(d => d.totalDisputes),
      name: 'Disputes',
      type: 'scatter',
      mode: 'lines',
      line: { color: '#ff4757', width: 2 },
      yaxis: 'y2'
    }
  ];

  const activityLayout = {
    ...chartLayout,
    showlegend: true,
    legend: { x: 0, y: 1 },
    yaxis2: {
      ...chartLayout.yaxis,
      overlaying: 'y',
      side: 'right'
    }
  };

  // Agent Performance Distribution
  const getAgentDistribution = () => {
    if (!simulationData?.simulation_state) return [];
    
    const { fuel_alive = 0, fuel_dead = 0 } = simulationData.simulation_state;
    return [
      { label: 'Active Agents', value: fuel_alive, color: '#00d4aa' },
      { label: 'Inactive Agents', value: fuel_dead, color: '#ff4757' }
    ];
  };

  const agentDistData = getAgentDistribution();
  const pieChartData = [{
    labels: agentDistData.map(d => d.label),
    values: agentDistData.map(d => d.value),
    type: 'pie',
    marker: {
      colors: agentDistData.map(d => d.color)
    },
    textinfo: 'label+percent',
    textposition: 'outside'
  }];

  const AnalyticsCard = ({ icon: Icon, title, value, trend, description }) => (
    <motion.div
      whileHover={{ y: -2 }}
      className="trading-card"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Icon className="w-6 h-6 text-accent-blue" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        {trend !== undefined && (
          <div className={`text-sm ${
            trend > 0 ? 'text-accent-green' : 
            trend < 0 ? 'text-accent-red' : 'text-gray-400'
          }`}>
            {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="text-2xl font-mono font-bold text-white mb-2">{value}</div>
      {description && <div className="text-sm text-gray-400">{description}</div>}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Advanced Analytics</h1>
          <p className="text-gray-400 mt-1">Deep Insights & Performance Metrics</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Brain className="w-5 h-5 text-accent-purple" />
          <span className="text-gray-400">AI-Powered Analysis</span>
        </div>
      </div>

      {/* Key Analytics Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AnalyticsCard
          icon={Activity}
          title="Performance Score"
          value={`${metrics.performanceScore}%`}
          trend={parseFloat(metrics.healthTrend)}
          description="Overall system performance"
        />
        <AnalyticsCard
          icon={Shield}
          title="Network Health"
          value={`${metrics.avgHealth}%`}
          trend={parseFloat(metrics.healthTrend)}
          description="Average economic health"
        />
        <AnalyticsCard
          icon={Zap}
          title="Network Size"
          value={metrics.avgNetworkSize}
          description="Average active ARCs"
        />
        <AnalyticsCard
          icon={BarChart3}
          title="Total Activity"
          value={metrics.totalVolume}
          description="Recent transaction volume"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Economic Health Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-accent-green" />
            <span>Economic Health Trend</span>
          </h3>
          
          {analyticsHistory.length > 5 ? (
            <Plot
              data={healthChartData}
              layout={{
                ...chartLayout,
                yaxis: { ...chartLayout.yaxis, title: 'Health %', range: [0, 100] }
              }}
              style={{ width: '100%', height: '300px' }}
              config={{ displayModeBar: false, responsive: true }}
            />
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p>Collecting health data...</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Network Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-accent-blue" />
            <span>Network Activity</span>
          </h3>
          
          {analyticsHistory.length > 5 ? (
            <Plot
              data={activityChartData}
              layout={activityLayout}
              style={{ width: '100%', height: '300px' }}
              config={{ displayModeBar: false, responsive: true }}
            />
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Activity className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p>Collecting activity data...</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-accent-purple" />
            <span>Agent Distribution</span>
          </h3>
          
          {agentDistData.some(d => d.value > 0) ? (
            <Plot
              data={pieChartData}
              layout={{
                ...chartLayout,
                height: 250,
                margin: { l: 0, r: 0, t: 0, b: 0 }
              }}
              style={{ width: '100%', height: '250px' }}
              config={{ displayModeBar: false, responsive: true }}
            />
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <PieChart className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p>No agent data</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="trading-card lg:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-accent-purple" />
            <span>AI Performance Insights</span>
          </h3>
          
          <div className="space-y-4">
            {/* Performance Analysis */}
            <div className="bg-dark-700 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-accent-green" />
                <span>System Performance</span>
              </h4>
              <p className="text-sm text-gray-300">
                {parseFloat(metrics.performanceScore) > 80 
                  ? "🟢 Excellent: System is operating at peak performance with strong economic health."
                  : parseFloat(metrics.performanceScore) > 60
                  ? "🟡 Good: System performance is stable but could benefit from optimization."
                  : "🔴 Attention: System performance needs improvement. Consider crisis intervention."
                }
              </p>
            </div>

            {/* Network Analysis */}
            <div className="bg-dark-700 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-accent-blue" />
                <span>Network Analysis</span>
              </h4>
              <p className="text-sm text-gray-300">
                {parseFloat(metrics.avgNetworkSize) >= 3
                  ? "✅ Optimal network size maintaining good decentralization and validation coverage."
                  : "⚠️ Network size below optimal. Consider adding more ARCs for better resilience."
                }
              </p>
            </div>

            {/* Economic Trends */}
            <div className="bg-dark-700 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-accent-green" />
                <span>Economic Trends</span>
              </h4>
              <p className="text-sm text-gray-300">
                {parseFloat(metrics.healthTrend) > 5
                  ? "📈 Strong upward trend in economic health. Market conditions are improving."
                  : parseFloat(metrics.healthTrend) < -5
                  ? "📉 Declining economic health detected. Monitor for potential interventions."
                  : "➡️ Economic health is stable. System maintaining equilibrium."
                }
              </p>
            </div>

            {/* Recommendations */}
            <div className="bg-dark-700 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-accent-yellow" />
                <span>Recommendations</span>
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                {parseFloat(metrics.avgHealth) < 70 && (
                  <li>• Consider reducing crisis severity or duration</li>
                )}
                {parseFloat(metrics.avgNetworkSize) < 3 && (
                  <li>• Add more ARCs to improve network resilience</li>
                )}
                {metrics.totalVolume < 5 && (
                  <li>• Increase simulation activity for better data collection</li>
                )}
                <li>• Monitor trends for early crisis detection</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Real-time Statistics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="trading-card"
      >
        <h3 className="text-lg font-semibold mb-4">Real-time Statistics</h3>
        
        <div className="overflow-x-auto">
          <table className="trading-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Current</th>
                <th>Average</th>
                <th>Trend</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Economic Health</td>
                <td className="font-mono">
                  {simulationData?.simulation_state 
                    ? `${(simulationData.simulation_state.economic_health * 100).toFixed(1)}%`
                    : '100.0%'
                  }
                </td>
                <td className="font-mono">{metrics.avgHealth}%</td>
                <td className={`font-mono ${
                  parseFloat(metrics.healthTrend) > 0 ? 'text-accent-green' : 
                  parseFloat(metrics.healthTrend) < 0 ? 'text-accent-red' : 'text-gray-400'
                }`}>
                  {parseFloat(metrics.healthTrend) > 0 ? '+' : ''}{metrics.healthTrend}%
                </td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${
                    parseFloat(metrics.avgHealth) > 80 ? 'bg-accent-green text-dark-900' :
                    parseFloat(metrics.avgHealth) > 60 ? 'bg-accent-yellow text-dark-900' :
                    'bg-accent-red text-white'
                  }`}>
                    {parseFloat(metrics.avgHealth) > 80 ? 'Excellent' :
                     parseFloat(metrics.avgHealth) > 60 ? 'Good' : 'Poor'}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Network Size</td>
                <td className="font-mono">
                  {simulationData?.simulation_state?.network_state?.arcs?.length || 0} ARCs
                </td>
                <td className="font-mono">{metrics.avgNetworkSize} ARCs</td>
                <td className="font-mono text-gray-400">Stable</td>
                <td>
                  <span className="px-2 py-1 rounded text-xs bg-accent-blue text-white">
                    Active
                  </span>
                </td>
              </tr>
              <tr>
                <td>Agent Population</td>
                <td className="font-mono">
                  {simulationData?.simulation_state?.fuel_alive || 0} / 8
                </td>
                <td className="font-mono">
                  {analyticsHistory.length > 0 
                    ? (analyticsHistory.slice(-10).reduce((sum, d) => sum + d.agentsAlive, 0) / Math.min(10, analyticsHistory.length)).toFixed(1)
                    : '0'
                  }
                </td>
                <td className="font-mono text-gray-400">Variable</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${
                    (simulationData?.simulation_state?.fuel_alive || 0) > 6 ? 'bg-accent-green text-dark-900' :
                    (simulationData?.simulation_state?.fuel_alive || 0) > 4 ? 'bg-accent-yellow text-dark-900' :
                    'bg-accent-red text-white'
                  }`}>
                    {(simulationData?.simulation_state?.fuel_alive || 0) > 6 ? 'Healthy' :
                     (simulationData?.simulation_state?.fuel_alive || 0) > 4 ? 'Moderate' : 'Low'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsView;
