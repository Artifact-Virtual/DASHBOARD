import React, { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';

const Dashboard = ({ data, connected, startSimulation, stopSimulation }) => {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [simulationRunning, setSimulationRunning] = useState(false);

  // Update time series data when new data arrives
  useEffect(() => {
    if (data && data.step) {
      setTimeSeriesData(prev => {
        const newData = [...prev, {
          step: data.step,
          economic_health: data.economic_health || 0,
          total_fuel: data.fuel_agents?.reduce((sum, agent) => sum + (agent.fuel || 0), 0) || 0,
          active_arcs: data.validators?.length || 0,
          timestamp: new Date()
        }];
        
        // Keep only last 100 data points for performance
        return newData.slice(-100);
      });
      
      setSimulationRunning(data.running || false);
    }
  }, [data]);

  // Memoized metrics calculations
  const metrics = useMemo(() => {
    if (!data) return null;

    const totalFuel = data.fuel_agents?.reduce((sum, agent) => sum + (agent.fuel || 0), 0) || 0;
    const avgFuelPerAgent = data.fuel_agents?.length ? totalFuel / data.fuel_agents.length : 0;
    const activeArcs = data.validators?.length || 0;
    const economicHealth = (data.economic_health || 0) * 100;
    
    // Calculate trends from time series
    const recentData = timeSeriesData.slice(-10);
    const healthTrend = recentData.length > 1 ? 
      ((recentData[recentData.length - 1]?.economic_health || 0) - (recentData[0]?.economic_health || 0)) * 100 : 0;
    
    return {
      totalFuel: totalFuel.toFixed(2),
      avgFuelPerAgent: avgFuelPerAgent.toFixed(2),
      activeArcs,
      economicHealth: economicHealth.toFixed(1),
      healthTrend: healthTrend.toFixed(2),
      step: data.step || 0
    };
  }, [data, timeSeriesData]);

  // Chart configurations for professional trading aesthetics
  const chartConfig = {
    displayModeBar: false,
    responsive: true
  };

  const chartLayout = {
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#ffffff', family: 'Inter' },
    margin: { l: 40, r: 40, t: 40, b: 40 },
    xaxis: {
      gridcolor: '#2d3748',
      color: '#a0aec0'
    },
    yaxis: {
      gridcolor: '#2d3748',
      color: '#a0aec0'
    },
    showlegend: false
  };

  const handleStartStop = () => {
    if (simulationRunning) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  if (!connected) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'var(--gradient-primary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem'
        }}>
          🔌
        </div>
        <h2 style={{ color: 'var(--text-primary)', textAlign: 'center' }}>
          Connecting to Multi-ARC System...
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
          Establishing WebSocket connection to real-time data feed
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{ height: '100%', overflow: 'auto' }}>
      {/* Main Control Header */}
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
            Multi-ARC Trading Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Real-time Constitutional Intelligence Network Monitoring
          </p>
        </div>
        
        <button
          onClick={handleStartStop}
          className={`btn ${simulationRunning ? 'btn-danger' : 'btn-success'}`}
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          {simulationRunning ? '⏹️ Stop Simulation' : '▶️ Start Simulation'}
        </button>
      </div>

      {/* Key Metrics Grid */}
      {metrics && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          <div className="metric-card">
            <div className="metric-value" style={{ color: 'var(--accent-blue)' }}>
              {metrics.step.toLocaleString()}
            </div>
            <div className="metric-label">Simulation Step</div>
            <div className="metric-change positive">
              Real-time Updates
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-value" style={{ 
              color: parseFloat(metrics.economicHealth) > 70 ? 'var(--accent-green)' : 
                     parseFloat(metrics.economicHealth) > 40 ? 'var(--accent-yellow)' : 'var(--accent-red)'
            }}>
              {metrics.economicHealth}%
            </div>
            <div className="metric-label">Economic Health</div>
            <div className={`metric-change ${parseFloat(metrics.healthTrend) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(metrics.healthTrend) >= 0 ? '+' : ''}{metrics.healthTrend}% trend
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-value" style={{ color: 'var(--accent-purple)' }}>
              {metrics.activeArcs}
            </div>
            <div className="metric-label">Active ARCs</div>
            <div className="metric-change positive">
              Constitutional Nodes
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-value" style={{ color: 'var(--accent-cyan)' }}>
              {parseFloat(metrics.totalFuel).toLocaleString()}
            </div>
            <div className="metric-label">Total Fuel</div>
            <div className="metric-change positive">
              Avg: {metrics.avgFuelPerAgent} per agent
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        {/* Economic Health Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">📈 Economic Health Trend</h3>
            <div className="live-indicator">
              <div className="live-dot"></div>
              LIVE
            </div>
          </div>
          <Plot
            data={[{
              x: timeSeriesData.map(d => d.step),
              y: timeSeriesData.map(d => d.economic_health * 100),
              type: 'scatter',
              mode: 'lines+markers',
              line: { 
                color: '#48bb78',
                width: 3
              },
              marker: { 
                color: '#48bb78',
                size: 6
              },
              fill: 'tonexty',
              fillcolor: 'rgba(72, 187, 120, 0.1)'
            }]}
            layout={{
              ...chartLayout,
              title: '',
              yaxis: { 
                ...chartLayout.yaxis, 
                title: 'Health (%)',
                range: [0, 100]
              },
              xaxis: { 
                ...chartLayout.xaxis, 
                title: 'Step'
              }
            }}
            config={chartConfig}
            style={{ width: '100%', height: '300px' }}
          />
        </div>

        {/* Fuel Distribution */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">⛽ Fuel Distribution</h3>
            <div className="live-indicator">
              <div className="live-dot"></div>
              LIVE
            </div>
          </div>
          <Plot
            data={[{
              x: timeSeriesData.map(d => d.step),
              y: timeSeriesData.map(d => d.total_fuel),
              type: 'bar',
              marker: { 
                color: '#4299e1',
                opacity: 0.8
              }
            }]}
            layout={{
              ...chartLayout,
              title: '',
              yaxis: { 
                ...chartLayout.yaxis, 
                title: 'Total Fuel'
              },
              xaxis: { 
                ...chartLayout.xaxis, 
                title: 'Step'
              }
            }}
            config={chartConfig}
            style={{ width: '100%', height: '300px' }}
          />
        </div>

        {/* ARC Network Activity */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">🔗 ARC Network Activity</h3>
            <div className="live-indicator">
              <div className="live-dot"></div>
              LIVE
            </div>
          </div>
          <Plot
            data={[{
              x: timeSeriesData.map(d => d.step),
              y: timeSeriesData.map(d => d.active_arcs),
              type: 'scatter',
              mode: 'lines+markers',
              line: { 
                color: '#9f7aea',
                width: 3
              },
              marker: { 
                color: '#9f7aea',
                size: 8
              }
            }]}
            layout={{
              ...chartLayout,
              title: '',
              yaxis: { 
                ...chartLayout.yaxis, 
                title: 'Active ARCs'
              },
              xaxis: { 
                ...chartLayout.xaxis, 
                title: 'Step'
              }
            }}
            config={chartConfig}
            style={{ width: '100%', height: '300px' }}
          />
        </div>

        {/* Multi-Metric Overview */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">📊 System Overview</h3>
            <div className="live-indicator">
              <div className="live-dot"></div>
              LIVE
            </div>
          </div>
          <Plot
            data={[
              {
                x: timeSeriesData.map(d => d.step),
                y: timeSeriesData.map(d => d.economic_health * 100),
                name: 'Health %',
                type: 'scatter',
                mode: 'lines',
                line: { color: '#48bb78', width: 2 }
              },
              {
                x: timeSeriesData.map(d => d.step),
                y: timeSeriesData.map(d => d.active_arcs * 10), // Scale for visibility
                name: 'ARCs (×10)',
                type: 'scatter',
                mode: 'lines',
                line: { color: '#9f7aea', width: 2 },
                yaxis: 'y2'
              }
            ]}
            layout={{
              ...chartLayout,
              title: '',
              yaxis: { 
                ...chartLayout.yaxis, 
                title: 'Health (%)',
                side: 'left'
              },
              yaxis2: {
                ...chartLayout.yaxis,
                title: 'ARCs (×10)',
                side: 'right',
                overlaying: 'y'
              },
              xaxis: { 
                ...chartLayout.xaxis, 
                title: 'Step'
              },
              showlegend: true,
              legend: {
                x: 0,
                y: 1,
                bgcolor: 'rgba(0,0,0,0.5)',
                font: { color: '#ffffff' }
              }
            }}
            config={chartConfig}
            style={{ width: '100%', height: '300px' }}
          />
        </div>
      </div>

      {/* Current System State */}
      {data && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🔍 Current System State</h3>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--spacing-lg)'
          }}>
            {/* Validators/ARCs */}
            <div>
              <h4 style={{ 
                color: 'var(--accent-purple)', 
                marginBottom: 'var(--spacing-md)',
                fontSize: '1rem'
              }}>
                🔗 Active ARCs ({data.validators?.length || 0})
              </h4>
              <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                {data.validators?.map((validator, index) => (
                  <div key={index} style={{
                    background: 'var(--bg-hover)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-xs)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.875rem' }}>
                      ARC-{validator.id || index}
                    </span>
                    <span style={{ 
                      color: 'var(--accent-green)',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fuel Agents */}
            <div>
              <h4 style={{ 
                color: 'var(--accent-cyan)', 
                marginBottom: 'var(--spacing-md)',
                fontSize: '1rem'
              }}>
                ⛽ Fuel Agents ({data.fuel_agents?.length || 0})
              </h4>
              <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                {data.fuel_agents?.slice(0, 5).map((agent, index) => (
                  <div key={index} style={{
                    background: 'var(--bg-hover)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-xs)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.875rem' }}>
                      Agent-{index + 1}
                    </span>
                    <span style={{ 
                      color: 'var(--accent-cyan)',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {(agent.fuel || 0).toFixed(2)} FUEL
                    </span>
                  </div>
                ))}
                {data.fuel_agents?.length > 5 && (
                  <div style={{ 
                    textAlign: 'center', 
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    marginTop: 'var(--spacing-sm)'
                  }}>
                    +{data.fuel_agents.length - 5} more agents
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
