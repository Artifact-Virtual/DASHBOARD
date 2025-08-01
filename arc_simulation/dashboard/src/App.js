import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import useWebSocket from './hooks/useWebSocket';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [simulationData, setSimulationData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  
  // WebSocket connection
  const { 
    connected, 
    sendMessage, 
    lastMessage, 
    connectionState 
  } = useWebSocket('ws://localhost:8000/ws');
  
  // Update connection status
  useEffect(() => {
    setConnectionStatus(connected ? 'connected' : 'disconnected');
  }, [connected]);
  
  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        
        if (data.type === 'heartbeat') {
          // Handle heartbeat - keep connection alive
          return;
        }
        
        // Update simulation data
        setSimulationData(data);
        
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage]);
  
  // Control functions
  const startSimulation = useCallback(() => {
    sendMessage(JSON.stringify({ type: 'start_simulation' }));
  }, [sendMessage]);
  
  const stopSimulation = useCallback(() => {
    sendMessage(JSON.stringify({ type: 'stop_simulation' }));
  }, [sendMessage]);
  
  const injectCrisis = useCallback((crisisType, severity, duration) => {
    sendMessage(JSON.stringify({
      type: 'inject_crisis',
      crisis_type: crisisType,
      severity: severity,
      duration: duration
    }));
  }, [sendMessage]);
  
  const addArc = useCallback(() => {
    sendMessage(JSON.stringify({ type: 'add_arc' }));
  }, [sendMessage]);
  
  const removeArc = useCallback(() => {
    sendMessage(JSON.stringify({ type: 'remove_arc' }));
  }, [sendMessage]);
  
  const updateTokenomics = useCallback((config) => {
    sendMessage(JSON.stringify({
      type: 'update_tokenomics',
      config: config
    }));
  }, [sendMessage]);
  
  const controls = {
    startSimulation,
    stopSimulation,
    injectCrisis,
    addArc,
    removeArc,
    updateTokenomics
  };
  
  return (
    <div className="min-h-screen bg-dark-900 text-white font-sans">
      {/* Professional Header */}
      <Header 
        connectionStatus={connectionStatus}
        currentData={simulationData}
        onViewChange={setCurrentView}
        currentView={currentView}
      />
      
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-80 bg-dark-800 border-r border-dark-600 overflow-y-auto"
            >
              <Sidebar 
                simulationData={simulationData}
                controls={controls}
                connectionStatus={connectionStatus}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Dashboard Area */}
        <div className="flex-1 overflow-hidden">
          {/* Sidebar Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-20 left-4 z-10 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-md p-2 transition-all duration-200"
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.div>
          </motion.button>
          
          {/* Dashboard Content */}
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full overflow-y-auto p-6"
            style={{ marginLeft: sidebarOpen ? '0' : '60px' }}
          >
            <Dashboard 
              view={currentView}
              simulationData={simulationData}
              controls={controls}
              connectionStatus={connectionStatus}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Connection Status Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg glass ${
          connectionStatus === 'connected' 
            ? 'text-accent-green' 
            : connectionStatus === 'connecting'
            ? 'text-accent-yellow'
            : 'text-accent-red'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' 
              ? 'bg-accent-green animate-pulse' 
              : connectionStatus === 'connecting'
              ? 'bg-accent-yellow animate-pulse'
              : 'bg-accent-red'
          }`} />
          <span className="text-xs font-medium">
            {connectionStatus === 'connected' ? 'Live' : 
             connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
          </span>
        </div>
      </motion.div>
      
      {/* Loading overlay when no data */}
      <AnimatePresence>
        {!simulationData && connectionStatus === 'connected' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-900 bg-opacity-90 flex items-center justify-center z-50"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Initializing Simulation</h3>
              <p className="text-gray-400">Connecting to ARC Multi-Network...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
