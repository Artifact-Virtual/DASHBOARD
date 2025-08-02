import React, { useState, useEffect } from 'react';
import './styles/main.css';

const App = () => {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws');
    
    ws.onopen = () => {
      console.log('Connected to simulation');
      setConnected(true);
      setLoading(false);
    };
    
    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        if (newData.type !== 'heartbeat') {
          setData(newData);
        }
      } catch (err) {
        console.error('Data parse error:', err);
      }
    };
    
    ws.onclose = () => {
      console.log('Disconnected from simulation');
      setConnected(false);
    };
    
    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('Connection failed');
      setLoading(false);
    };
    
    return () => ws.close();
  }, []);

  // Connection status
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Connecting to simulation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>Connection Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="waiting-screen">
        <div className="status-indicator">
          <div className={`connection-dot ${connected ? 'connected' : 'disconnected'}`}></div>
          <span>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <p>Waiting for simulation data...</p>
      </div>
    );
  }

  // Extract key metrics
  const networkState = data.network_state || {};
  const arcs = networkState.arcs || [];
  const totalBlocks = arcs.reduce((sum, arc) => sum + (arc.total_blocks || 0), 0);
  const fuelData = data.fuel_state || {};
  const aliveAgents = fuelData.alive_count || 0;
  const step = data.step || 0;
  const crisisMode = data.crisis_mode || false;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>ARC Simulation Dashboard</h1>
          <div className="header-status">
            <div className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></div>
            <span>Step {step.toLocaleString()}</span>
            {crisisMode && <span className="crisis-badge">CRISIS</span>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Key Metrics */}
        <section className="metrics-grid">
          <div className="metric-card">
            <h3>Network Blocks</h3>
            <div className="metric-value">{totalBlocks.toLocaleString()}</div>
          </div>
          <div className="metric-card">
            <h3>Active ARCs</h3>
            <div className="metric-value">{arcs.length}</div>
          </div>
          <div className="metric-card">
            <h3>Living Agents</h3>
            <div className="metric-value">{aliveAgents}</div>
          </div>
          <div className="metric-card">
            <h3>Era</h3>
            <div className="metric-value">{data.era || 0}</div>
          </div>
        </section>

        {/* ARC Network Status */}
        <section className="arc-section">
          <h2>ARC Network</h2>
          <div className="arc-grid">
            {arcs.map((arc, index) => (
              <div key={arc.arc_id || index} className="arc-card">
                <div className="arc-header">
                  <h4>ARC-{arc.arc_id}</h4>
                  <div className={`validation-status ${arc.last_block_valid ? 'valid' : 'invalid'}`}>
                    {arc.last_block_valid ? '✓' : '✗'}
                  </div>
                </div>
                <div className="arc-metrics">
                  <div className="arc-metric">
                    <span>Blocks</span>
                    <span>{(arc.total_blocks || 0).toLocaleString()}</span>
                  </div>
                  <div className="arc-metric">
                    <span>Rule</span>
                    <span>#{arc.current_rule || 0}</span>
                  </div>
                  <div className="arc-metric">
                    <span>Strictness</span>
                    <span>{((arc.rule_strictness || 1) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="arc-metric">
                    <span>Validators</span>
                    <span>{arc.validator_count || 0}</span>
                  </div>
                  <div className="arc-metric">
                    <span>Failures</span>
                    <span>{arc.recent_validation_failures || 0}</span>
                  </div>
                  <div className="arc-metric">
                    <span>ADAM Guilt</span>
                    <span>{((arc.adam_guilt || 0) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FUEL Economic System */}
        <section className="fuel-section">
          <h2>FUEL Economic System</h2>
          <div className="fuel-grid">
            <div className="fuel-card">
              <h4>Agent Status</h4>
              <div className="agent-stats">
                <div className="stat">
                  <span className="stat-label">Alive</span>
                  <span className="stat-value alive">{fuelData.alive_count || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Dead</span>
                  <span className="stat-value dead">{fuelData.dead_count || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Average FUEL</span>
                  <span className="stat-value">{(fuelData.avg_fuel || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {fuelData.agents && (
              <div className="fuel-card agents-grid">
                <h4>Individual Agents</h4>
                <div className="agents-list">
                  {fuelData.agents.slice(0, 8).map((agent, index) => (
                    <div key={index} className={`agent-item ${agent.alive ? 'alive' : 'dead'}`}>
                      <span>Agent {index}</span>
                      <span>{agent.fuel?.toFixed(1) || '0.0'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Crisis Indicators */}
        {crisisMode && data.crisis_indicators && (
          <section className="crisis-section">
            <h2>🚨 Crisis Status</h2>
            <div className="crisis-alerts">
              {data.crisis_indicators.map((indicator, index) => (
                <div key={index} className="crisis-alert">
                  {indicator}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* System Events */}
        {data.system_events && data.system_events.length > 0 && (
          <section className="events-section">
            <h2>Recent Events</h2>
            <div className="events-list">
              {data.system_events.slice(-10).reverse().map((event, index) => (
                <div key={index} className="event-item">
                  <span className="event-type">{event.type || 'Event'}</span>
                  <span className="event-desc">{event.description || 'System event'}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
