import React, { useState, useCallback } from 'react';
import './styles/main.css';

// Component imports
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import SystemStatus from './components/SystemStatus';
import ArcManagement from './components/ArcManagement';

// Custom hooks
import useWebSocket from './hooks/useWebSocket';

const App = () => {
  // Application state
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationData, setSimulationData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [error, setError] = useState(null);

  // WebSocket connection with error handling
  const { 
    connected, 
    error: wsError, 
    sendMessage 
  } = useWebSocket('ws://localhost:8000/ws', {
    onOpen: () => {
      console.log('✅ WebSocket connected successfully');
      setConnectionStatus('connected');
      setError(null);
    },
    onClose: () => {
      console.log('🔌 WebSocket disconnected');
      setConnectionStatus('disconnected');
    },
    onError: (error) => {
      console.error('❌ WebSocket error:', error);
      setConnectionStatus('error');
      setError('Failed to connect to simulation server');
    },
    onMessage: (data) => {
      // Process incoming simulation data
      try {
        setSimulationData(data);
        setSimulationRunning(data?.running || false);
        
        // Clear any previous errors on successful data
        if (error) {
          setError(null);
        }
      } catch (err) {
        console.error('Error processing WebSocket data:', err);
        setError('Error processing simulation data');
      }
    }
  });

  // Simulation control functions
  const startSimulation = useCallback(() => {
    if (connected) {
      sendMessage({ action: 'start_simulation' });
      console.log('🚀 Starting simulation...');
    } else {
      setError('Cannot start simulation - not connected to server');
    }
  }, [connected, sendMessage]);

  const stopSimulation = useCallback(() => {
    if (connected) {
      sendMessage({ action: 'stop_simulation' });
      console.log('⏹️ Stopping simulation...');
    } else {
      setError('Cannot stop simulation - not connected to server');
    }
  }, [connected, sendMessage]);

  const resetSimulation = useCallback(() => {
    if (connected) {
      sendMessage({ action: 'reset_simulation' });
      console.log('🔄 Resetting simulation...');
    } else {
      setError('Cannot reset simulation - not connected to server');
    }
  }, [connected, sendMessage]);

  // Navigation handlers
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'arcs', label: 'ARC Management', icon: '🔧' },
    { id: 'system', label: 'System Status', icon: '⚙️' }
  ];

  const handleNavigation = useCallback((viewId) => {
    setActiveView(viewId);
    console.log(`📍 Navigating to: ${viewId}`);
  }, []);

  // Real-time status calculations
  const systemHealth = simulationData?.economic_health || 0;
  const totalFuel = simulationData?.fuel_agents?.reduce((sum, agent) => sum + (agent.fuel || 0), 0) || 0;
  const activeArcs = simulationData?.validators?.length || 0;
  const currentStep = simulationData?.step || 0;

  // Render appropriate view component
  const renderActiveView = () => {
    const commonProps = {
      data: simulationData,
      connected,
      error: wsError || error,
      startSimulation,
      stopSimulation,
      resetSimulation,
      simulationRunning
    };

    switch (activeView) {
      case 'dashboard':
        return <Dashboard {...commonProps} />;
      case 'analytics':
        return <Analytics {...commonProps} />;
      case 'arcs':
        return <ArcManagement {...commonProps} />;
      case 'system':
        return <SystemStatus {...commonProps} />;
      default:
        return <Dashboard {...commonProps} />;
    }
  };

  // Connection status indicator
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#00ff88';
      case 'connecting': return '#ffaa00';
      case 'disconnected': return '#ff6b6b';
      case 'error': return '#ff4757';
      default: return '#888';
    }
  };

  return (
    <div className="app">
      {/* Connection Status Bar */}
      <div className="connection-status" style={{
        background: connectionStatus === 'connected' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 75, 87, 0.1)',
        borderBottom: `1px solid ${getConnectionStatusColor()}`,
        padding: '4px 16px',
        fontSize: '12px',
        textAlign: 'center',
        color: getConnectionStatusColor()
      }}>
        {connectionStatus === 'connected' && '🟢 Connected to Multi-ARC System'}
        {connectionStatus === 'connecting' && '🟡 Connecting to server...'}
        {connectionStatus === 'disconnected' && '🔴 Disconnected from server'}
        {connectionStatus === 'error' && '❌ Connection error - Check server status'}
      </div>

      {/* Main App Header */}
      <Header
        connected={connected}
        error={error}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        data={simulationData}
        connectionStatus={connectionStatus}
        systemHealth={systemHealth}
        totalFuel={totalFuel}
        activeArcs={activeArcs}
        currentStep={currentStep}
      />

      {/* Main Application Layout */}
      <div className="app-layout">
        {/* Navigation Sidebar */}
        <Sidebar
          open={sidebarOpen}
          activeView={activeView}
          onNavigate={handleNavigation}
          navigationItems={navigationItems}
          simulationRunning={simulationRunning}
          startSimulation={startSimulation}
          stopSimulation={stopSimulation}
          resetSimulation={resetSimulation}
          connected={connected}
          systemHealth={systemHealth}
          totalFuel={totalFuel}
          activeArcs={activeArcs}
        />

        {/* Main Content Area */}
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          {/* Error Display */}
          {error && (
            <div className="error-banner">
              <div className="error-content">
                <span className="error-icon">⚠️</span>
                <span className="error-message">{error}</span>
                <button 
                  className="error-dismiss"
                  onClick={() => setError(null)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Real-time Dashboard Data */}
          {simulationData && (
            <div className="live-data-strip">
              <div className="live-metric">
                <span className="metric-label">STEP</span>
                <span className="metric-value">{currentStep.toLocaleString()}</span>
              </div>
              <div className="live-metric">
                <span className="metric-label">HEALTH</span>
                <span className="metric-value" style={{
                  color: systemHealth > 0.7 ? '#00ff88' : systemHealth > 0.4 ? '#ffaa00' : '#ff6b6b'
                }}>
                  {(systemHealth * 100).toFixed(1)}%
                </span>
              </div>
              <div className="live-metric">
                <span className="metric-label">FUEL</span>
                <span className="metric-value">{totalFuel.toFixed(2)}</span>
              </div>
              <div className="live-metric">
                <span className="metric-label">ARCS</span>
                <span className="metric-value">{activeArcs}</span>
              </div>
              <div className="live-metric">
                <span className="metric-label">STATUS</span>
                <span className="metric-value" style={{
                  color: simulationRunning ? '#00ff88' : '#888'
                }}>
                  {simulationRunning ? 'RUNNING' : 'STOPPED'}
                </span>
              </div>
            </div>
          )}

          {/* Dynamic View Content */}
          <div className="view-container">
            {renderActiveView()}
          </div>

          {/* Trading Status Footer */}
          <div className="trading-footer">
            <div className="footer-section">
              <span className="footer-label">Multi-ARC Constitutional Intelligence</span>
              <span className="footer-value">
                {connected ? '🟢 ONLINE' : '🔴 OFFLINE'}
              </span>
            </div>
            <div className="footer-section">
              <span className="footer-label">Last Update</span>
              <span className="footer-value">
                {simulationData ? new Date().toLocaleTimeString() : 'No data'}
              </span>
            </div>
            <div className="footer-section">
              <span className="footer-label">Performance</span>
              <span className="footer-value">
                {simulationData ? 'OPTIMAL' : 'MONITORING'}
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* Real-time Data Overlay for Development */}
      {process.env.NODE_ENV === 'development' && simulationData && (
        <div className="dev-overlay">
          <details>
            <summary>🔍 Live Data Debug</summary>
            <pre>{JSON.stringify(simulationData, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default App;
