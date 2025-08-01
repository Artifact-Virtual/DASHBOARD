import React from 'react';

const SystemStatus = ({ data, connected, error }) => {
  return (
    <div className="system-status">
      {/* Connection Status */}
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="card-title">
            🔌 Connection Status
          </h2>
        </div>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">WebSocket</div>
            <div className={`metric-value ${connected ? 'text-success' : 'text-error'}`}>
              {connected ? 'CONNECTED' : 'DISCONNECTED'}
            </div>
            <div className={`metric-change ${connected ? 'positive' : 'negative'}`}>
              {connected ? '✅ Live' : '❌ Offline'}
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-label">Backend</div>
            <div className="metric-value">
              {data ? 'ACTIVE' : 'INACTIVE'}
            </div>
            <div className={`metric-change ${data ? 'positive' : 'negative'}`}>
              {data ? '✅ Streaming' : '❌ No Data'}
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-label">Last Update</div>
            <div className="metric-value text-sm">
              {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'N/A'}
            </div>
            <div className="metric-change neutral">
              📡 Data Feed
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg">
            <h4 className="text-red-800 font-medium">Connection Error</h4>
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* System Health */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            ⚙️ System Health
          </h2>
          <p className="card-subtitle">Network diagnostics and performance metrics</p>
        </div>
        
        {data ? (
          <div>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-label">Network Health</div>
                <div className="metric-value">
                  {data.network_health ? (data.network_health * 100).toFixed(1) + '%' : 'N/A'}
                </div>
                <div className="metric-change positive">
                  🌐 Overall
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-label">Economic Health</div>
                <div className="metric-value">
                  {data.simulation_state?.economic_health ? (data.simulation_state.economic_health * 100).toFixed(1) + '%' : 'N/A'}
                </div>
                <div className="metric-change positive">
                  💰 Economy
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-label">Simulation Step</div>
                <div className="metric-value">
                  {data.step_count || 0}
                </div>
                <div className="metric-change neutral">
                  🔄 Cycles
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-4">Raw System Data</h3>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-xs text-gray-300">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="loading-container">
            <p className="loading-text">No system data available</p>
            <p className="loading-subtext">Connect to backend to view system health</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemStatus;
