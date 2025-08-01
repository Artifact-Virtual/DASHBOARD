import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';

const AnalyticsView = ({ data, connected }) => {
  const [analysisType, setAnalysisType] = useState('performance');
  const [timeRange, setTimeRange] = useState('all');

  // Chart configuration
  const chartConfig = {
    displayModeBar: false,
    responsive: true
  };

  const chartLayout = {
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#ffffff', family: 'Inter' },
    margin: { l: 50, r: 50, t: 50, b: 50 },
    xaxis: {
      gridcolor: '#2d3748',
      color: '#a0aec0'
    },
    yaxis: {
      gridcolor: '#2d3748',
      color: '#a0aec0'
    }
  };

  // Mock analytics data - in real implementation, this would come from historical data
  const analyticsData = useMemo(() => {
    if (!data) return null;

    // Performance Analytics
    const performanceMetrics = {
      avgBlockTime: Math.random() * 2 + 1, // 1-3 seconds
      throughput: Math.random() * 1000 + 500, // 500-1500 tps
      validationAccuracy: Math.random() * 0.1 + 0.9, // 90-100%
      networkLatency: Math.random() * 50 + 20 // 20-70ms
    };

    // Economic Analytics
    const economicMetrics = {
      totalValueLocked: Math.random() * 1000000 + 500000,
      fuelEfficiency: Math.random() * 0.2 + 0.8,
      transactionCosts: Math.random() * 0.01 + 0.005,
      liquidityDepth: Math.random() * 50000 + 25000
    };

    // Security Analytics
    const securityMetrics = {
      byzantineTolerance: Math.random() * 0.1 + 0.85,
      attackResistance: Math.random() * 0.15 + 0.85,
      validatorUptime: Math.random() * 0.05 + 0.95,
      consensusStrength: Math.random() * 0.1 + 0.9
    };

    return {
      performance: performanceMetrics,
      economic: economicMetrics,
      security: securityMetrics
    };
  }, [data]);

  const renderPerformanceAnalytics = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-lg)' }}>
      {/* Block Time Distribution */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">⏱️ Block Time Distribution</h3>
        </div>
        <Plot
          data={[{
            x: Array.from({length: 100}, (_, i) => i),
            y: Array.from({length: 100}, () => Math.random() * 3 + 1),
            type: 'histogram',
            marker: { color: '#4299e1', opacity: 0.7 },
            nbinsx: 20
          }]}
          layout={{
            ...chartLayout,
            title: '',
            xaxis: { ...chartLayout.xaxis, title: 'Block Time (seconds)' },
            yaxis: { ...chartLayout.yaxis, title: 'Frequency' }
          }}
          config={chartConfig}
          style={{ width: '100%', height: '350px' }}
        />
      </div>

      {/* Throughput Over Time */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">🚀 Network Throughput</h3>
        </div>
        <Plot
          data={[{
            x: Array.from({length: 50}, (_, i) => i),
            y: Array.from({length: 50}, () => Math.random() * 500 + 500),
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#48bb78', width: 3 },
            marker: { color: '#48bb78', size: 6 }
          }]}
          layout={{
            ...chartLayout,
            title: '',
            xaxis: { ...chartLayout.xaxis, title: 'Time' },
            yaxis: { ...chartLayout.yaxis, title: 'TPS' }
          }}
          config={chartConfig}
          style={{ width: '100%', height: '350px' }}
        />
      </div>

      {/* Validation Accuracy */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">✅ Validation Accuracy</h3>
        </div>
        <Plot
          data={[{
            values: [95, 3, 2],
            labels: ['Correct', 'False Positive', 'False Negative'],
            type: 'pie',
            marker: {
              colors: ['#48bb78', '#ed8936', '#f56565']
            }
          }]}
          layout={{
            ...chartLayout,
            title: '',
            showlegend: true
          }}
          config={chartConfig}
          style={{ width: '100%', height: '350px' }}
        />
      </div>

      {/* Network Latency Heatmap */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">🌐 Network Latency Map</h3>
        </div>
        <Plot
          data={[{
            z: Array.from({length: 10}, () => Array.from({length: 10}, () => Math.random() * 100)),
            type: 'heatmap',
            colorscale: [
              [0, '#48bb78'],
              [0.5, '#ed8936'],
              [1, '#f56565']
            ]
          }]}
          layout={{
            ...chartLayout,
            title: '',
            xaxis: { ...chartLayout.xaxis, title: 'Node ID' },
            yaxis: { ...chartLayout.yaxis, title: 'Node ID' }
          }}
          config={chartConfig}
          style={{ width: '100%', height: '350px' }}
        />
      </div>
    </div>
  );

  const renderEconomicAnalytics = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-lg)' }}>
      {/* Value Flow */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">💰 Value Flow Analysis</h3>
        </div>
        <Plot
          data={[{
            x: Array.from({length: 30}, (_, i) => i),
            y: Array.from({length: 30}, () => Math.random() * 100000 + 50000),
            type: 'scatter',
            mode: 'lines',
            fill: 'tonexty',
            line: { color: '#9f7aea', width: 2 },
            fillcolor: 'rgba(159, 122, 234, 0.2)'
          }]}
          layout={{
            ...chartLayout,
            title: '',
            xaxis: { ...chartLayout.xaxis, title: 'Time Period' },
            yaxis: { ...chartLayout.yaxis, title: 'Value (USD)' }
          }}
          config={chartConfig}
          style={{ width: '100%', height: '350px' }}
        />
      </div>

      {/* Fuel Efficiency */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">⛽ Fuel Efficiency Metrics</h3>
        </div>
        <Plot
          data={[
            {
              x: ['Network A', 'Network B', 'Network C', 'Our Network'],
              y: [0.65, 0.72, 0.68, 0.89],
              type: 'bar',
              marker: { 
                color: ['#718096', '#718096', '#718096', '#48bb78'],
                opacity: 0.8
              }
            }
          ]}
          layout={{
            ...chartLayout,
            title: '',
            xaxis: { ...chartLayout.xaxis, title: 'Network' },
            yaxis: { ...chartLayout.yaxis, title: 'Efficiency Score' }
          }}
          config={chartConfig}
          style={{ width: '100%', height: '350px' }}
        />
      </div>

      {/* Transaction Cost Distribution */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">💸 Transaction Cost Analysis</h3>
        </div>
        <Plot
          data={[{
            x: Array.from({length: 1000}, () => Math.random() * 0.02 + 0.001),
            type: 'histogram',
            marker: { color: '#ed8936', opacity: 0.7 },
            nbinsx: 30
          }]}
          layout={{
            ...chartLayout,
            title: '',
            xaxis: { ...chartLayout.xaxis, title: 'Cost (USD)' },
            yaxis: { ...chartLayout.yaxis, title: 'Frequency' }
          }}
          config={chartConfig}
          style={{ width: '100%', height: '350px' }}
        />
      </div>

      {/* Liquidity Depth */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">📊 Liquidity Depth Analysis</h3>
        </div>
        <Plot
          data={[
            {
              x: Array.from({length: 50}, (_, i) => -i * 0.1),
              y: Array.from({length: 50}, (_, i) => i * 1000),
              type: 'scatter',
              mode: 'lines',
              name: 'Bids',
              line: { color: '#48bb78', width: 3 }
            },
            {
              x: Array.from({length: 50}, (_, i) => i * 0.1),
              y: Array.from({length: 50}, (_, i) => i * 1000),
              type: 'scatter',
              mode: 'lines',
              name: 'Asks',
              line: { color: '#f56565', width: 3 }
            }
          ]}
          layout={{
            ...chartLayout,
            title: '',
            xaxis: { ...chartLayout.xaxis, title: 'Price Impact (%)' },
            yaxis: { ...chartLayout.yaxis, title: 'Volume' },
            showlegend: true
          }}
          config={chartConfig}
          style={{ width: '100%', height: '350px' }}
        />
      </div>
    </div>
  );

  const renderSecurityAnalytics = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-lg)' }}>
      {/* Security Score Radar */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">🛡️ Security Score Radar</h3>
        </div>
        <Plot
          data={[{
            type: 'scatterpolar',
            r: [0.95, 0.88, 0.92, 0.96, 0.89, 0.93],
            theta: ['Byzantine Tolerance', 'Attack Resistance', 'Consensus Strength', 'Validator Uptime', 'Network Integrity', 'Data Authenticity'],
            fill: 'tonext',
            marker: { color: '#9f7aea' },
            line: { color: '#9f7aea' }
          }]}
          layout={{
            ...chartLayout,
            title: '',
            polar: {
              radialaxis: {
                visible: true,
                range: [0, 1],
                color: '#a0aec0'
              },
              angularaxis: {
                color: '#a0aec0'
              }
            }
          }}
          config={chartConfig}
          style={{ width: '100%', height: '350px' }}
        />
      </div>

      {/* Attack Vectors */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">⚔️ Attack Vector Analysis</h3>
        </div>
        <Plot
          data={[{
            values: [15, 25, 10, 30, 20],
            labels: ['51% Attack', 'Eclipse Attack', 'Long Range Attack', 'Nothing at Stake', 'Grinding Attack'],
            type: 'pie',
            marker: {
              colors: ['#f56565', '#ed8936', '#ecc94b', '#48bb78', '#4299e1']
            }
          }]}
          layout={{
            ...chartLayout,
            title: '',
            showlegend: true
          }}
          config={chartConfig}
          style={{ width: '100%', height: '350px' }}
        />
      </div>

      {/* Validator Uptime */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">⏰ Validator Uptime</h3>
        </div>
        <Plot
          data={[{
            x: Array.from({length: 24}, (_, i) => i),
            y: Array.from({length: 24}, () => Math.random() * 0.1 + 0.9),
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#48bb78', width: 3 },
            marker: { color: '#48bb78', size: 6 }
          }]}
          layout={{
            ...chartLayout,
            title: '',
            xaxis: { ...chartLayout.xaxis, title: 'Hour of Day' },
            yaxis: { ...chartLayout.yaxis, title: 'Uptime %', range: [0.8, 1] }
          }}
          config={chartConfig}
          style={{ width: '100%', height: '350px' }}
        />
      </div>

      {/* Consensus Participation */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">🤝 Consensus Participation</h3>
        </div>
        <Plot
          data={[{
            x: Array.from({length: 20}, (_, i) => `V${i+1}`),
            y: Array.from({length: 20}, () => Math.random() * 0.2 + 0.8),
            type: 'bar',
            marker: { 
              color: Array.from({length: 20}, () => Math.random() > 0.5 ? '#48bb78' : '#ed8936'),
              opacity: 0.8
            }
          }]}
          layout={{
            ...chartLayout,
            title: '',
            xaxis: { ...chartLayout.xaxis, title: 'Validator' },
            yaxis: { ...chartLayout.yaxis, title: 'Participation Rate' }
          }}
          config={chartConfig}
          style={{ width: '100%', height: '350px' }}
        />
      </div>
    </div>
  );

  if (!connected) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '400px',
        flexDirection: 'column',
        gap: 'var(--spacing-md)'
      }}>
        <div style={{ fontSize: '3rem' }}>📊</div>
        <h2 style={{ color: 'var(--text-primary)' }}>Analytics Unavailable</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Connect to view detailed analytics</p>
      </div>
    );
  }

  return (
    <div className="analytics-view">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-xs)'
          }}>
            Advanced Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Deep dive into network performance and security metrics
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <select
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem'
            }}
          >
            <option value="performance">Performance Analytics</option>
            <option value="economic">Economic Analytics</option>
            <option value="security">Security Analytics</option>
          </select>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem'
            }}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Summary */}
      {analyticsData && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          {analysisType === 'performance' && (
            <>
              <div className="metric-card">
                <div className="metric-value" style={{ color: 'var(--accent-blue)' }}>
                  {analyticsData.performance.avgBlockTime.toFixed(2)}s
                </div>
                <div className="metric-label">Avg Block Time</div>
              </div>
              <div className="metric-card">
                <div className="metric-value" style={{ color: 'var(--accent-green)' }}>
                  {analyticsData.performance.throughput.toFixed(0)}
                </div>
                <div className="metric-label">Throughput (TPS)</div>
              </div>
              <div className="metric-card">
                <div className="metric-value" style={{ color: 'var(--accent-purple)' }}>
                  {(analyticsData.performance.validationAccuracy * 100).toFixed(1)}%
                </div>
                <div className="metric-label">Validation Accuracy</div>
              </div>
              <div className="metric-card">
                <div className="metric-value" style={{ color: 'var(--accent-yellow)' }}>
                  {analyticsData.performance.networkLatency.toFixed(0)}ms
                </div>
                <div className="metric-label">Network Latency</div>
              </div>
            </>
          )}
          
          {analysisType === 'economic' && (
            <>
              <div className="metric-card">
                <div className="metric-value" style={{ color: 'var(--accent-green)' }}>
                  ${analyticsData.economic.totalValueLocked.toLocaleString()}
                </div>
                <div className="metric-label">Total Value Locked</div>
              </div>
              <div className="metric-card">
                <div className="metric-value" style={{ color: 'var(--accent-cyan)' }}>
                  {(analyticsData.economic.fuelEfficiency * 100).toFixed(1)}%
                </div>
                <div className="metric-label">Fuel Efficiency</div>
              </div>
              <div className="metric-card">
                <div className="metric-value" style={{ color: 'var(--accent-yellow)' }}>
                  ${analyticsData.economic.transactionCosts.toFixed(4)}
                </div>
                <div className="metric-label">Avg Transaction Cost</div>
              </div>
              <div className="metric-card">
                <div className="metric-value" style={{ color: 'var(--accent-purple)' }}>
                  ${analyticsData.economic.liquidityDepth.toLocaleString()}
                </div>
                <div className="metric-label">Liquidity Depth</div>
              </div>
            </>
          )}
          
          {analysisType === 'security' && (
            <>
              <div className="metric-card">
                <div className="metric-value" style={{ color: 'var(--accent-green)' }}>
                  {(analyticsData.security.byzantineTolerance * 100).toFixed(1)}%
                </div>
                <div className="metric-label">Byzantine Tolerance</div>
              </div>
              <div className="metric-card">
                <div className="metric-value" style={{ color: 'var(--accent-blue)' }}>
                  {(analyticsData.security.attackResistance * 100).toFixed(1)}%
                </div>
                <div className="metric-label">Attack Resistance</div>
              </div>
              <div className="metric-card">
                <div className="metric-value" style={{ color: 'var(--accent-purple)' }}>
                  {(analyticsData.security.validatorUptime * 100).toFixed(1)}%
                </div>
                <div className="metric-label">Validator Uptime</div>
              </div>
              <div className="metric-card">
                <div className="metric-value" style={{ color: 'var(--accent-cyan)' }}>
                  {(analyticsData.security.consensusStrength * 100).toFixed(1)}%
                </div>
                <div className="metric-label">Consensus Strength</div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Charts */}
      {analysisType === 'performance' && renderPerformanceAnalytics()}
      {analysisType === 'economic' && renderEconomicAnalytics()}
      {analysisType === 'security' && renderSecurityAnalytics()}
    </div>
  );
};

export default AnalyticsView;
