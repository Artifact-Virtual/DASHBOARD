import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus, 
  Zap, 
  AlertTriangle,
  Settings,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const Sidebar = ({ simulationData, controls, connectionStatus }) => {
  const [crisisType, setCrisisType] = useState('Economic Collapse');
  const [crisisSeverity, setCrisisSeverity] = useState(0.5);
  const [crisisDuration, setCrisisDuration] = useState(5);
  const [isRunning, setIsRunning] = useState(false);

  const crisisTypes = [
    'Economic Collapse',
    'Network Attack',
    'Data Corruption',
    'Byzantine Failure',
    'Liquidity Crisis',
    'Validator Outage',
    'Bridge Exploit',
    'Governance Attack',
    'Oracle Manipulation',
    'Flash Loan Attack'
  ];

  const handleStartStop = () => {
    if (isRunning) {
      controls.stopSimulation();
    } else {
      controls.startSimulation();
    }
    setIsRunning(!isRunning);
  };

  const getNetworkStats = () => {
    if (!simulationData?.simulation_state) {
      return { arcs: 0, agents: 0, blocks: 0 };
    }

    const state = simulationData.simulation_state;
    const networkState = state.network_state || {};
    const arcs = networkState.arcs || [];
    
    return {
      arcs: arcs.length,
      agents: state.fuel_alive || 0,
      blocks: arcs.reduce((sum, arc) => sum + (arc.total_blocks || 0), 0)
    };
  };

  const stats = getNetworkStats();

  return (
    <div className="h-full bg-dark-800 p-6 space-y-6">
      {/* Control Panel Header */}
      <div className="text-center pb-4 border-b border-dark-600">
        <h2 className="text-xl font-bold text-gradient">Control Panel</h2>
        <p className="text-sm text-gray-400 mt-1">Professional Controls</p>
      </div>

      {/* Main Controls */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Settings className="w-5 h-5 text-accent-blue" />
          <span>Simulation</span>
        </h3>

        {/* Start/Stop Controls */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartStop}
            disabled={connectionStatus !== 'connected'}
            className={`btn-primary flex items-center justify-center space-x-2 ${
              isRunning ? 'bg-accent-red' : 'bg-accent-green'
            } ${connectionStatus !== 'connected' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsRunning(false);
              // Add reset logic
            }}
            disabled={connectionStatus !== 'connected'}
            className={`btn-secondary flex items-center justify-center space-x-2 ${
              connectionStatus !== 'connected' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </motion.button>
        </div>

        {/* Network Statistics */}
        <div className="trading-card">
          <h4 className="font-medium mb-3 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-accent-green" />
            <span>Network Status</span>
          </h4>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-mono font-bold text-accent-blue">{stats.arcs}</div>
              <div className="text-xs text-gray-400">ARCs</div>
            </div>
            <div>
              <div className="text-xl font-mono font-bold text-accent-green">{stats.agents}</div>
              <div className="text-xs text-gray-400">Agents</div>
            </div>
            <div>
              <div className="text-xl font-mono font-bold text-accent-purple">{stats.blocks}</div>
              <div className="text-xs text-gray-400">Blocks</div>
            </div>
          </div>
        </div>
      </div>

      {/* ARC Management */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Zap className="w-5 h-5 text-accent-purple" />
          <span>ARC Management</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={controls.addArc}
            disabled={connectionStatus !== 'connected'}
            className={`btn-secondary flex items-center justify-center space-x-2 ${
              connectionStatus !== 'connected' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add ARC</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={controls.removeArc}
            disabled={connectionStatus !== 'connected' || stats.arcs <= 1}
            className={`btn-secondary flex items-center justify-center space-x-2 ${
              connectionStatus !== 'connected' || stats.arcs <= 1 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
          >
            <Minus className="w-4 h-4" />
            <span>Remove</span>
          </motion.button>
        </div>
      </div>

      {/* Crisis Injection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-accent-red" />
          <span>Crisis Injection</span>
        </h3>

        <div className="space-y-3">
          {/* Crisis Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Crisis Type</label>
            <select
              value={crisisType}
              onChange={(e) => setCrisisType(e.target.value)}
              className="select-trading w-full"
            >
              {crisisTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Severity: {(crisisSeverity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={crisisSeverity}
              onChange={(e) => setCrisisSeverity(parseFloat(e.target.value))}
              className="w-full accent-accent-red"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Duration: {crisisDuration} steps
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={crisisDuration}
              onChange={(e) => setCrisisDuration(parseInt(e.target.value))}
              className="w-full accent-accent-yellow"
            />
          </div>

          {/* Inject Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => controls.injectCrisis(crisisType, crisisSeverity, crisisDuration)}
            disabled={connectionStatus !== 'connected'}
            className={`btn-danger w-full flex items-center justify-center space-x-2 ${
              connectionStatus !== 'connected' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Inject Crisis</span>
          </motion.button>
        </div>
      </div>

      {/* FUEL Economics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-accent-green" />
          <span>FUEL Economics</span>
        </h3>

        {simulationData?.tokenomics && (
          <div className="trading-card">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Price</span>
                <span className="font-mono text-accent-green">
                  ${simulationData.tokenomics.current_price.toFixed(6)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Market Cap</span>
                <span className="font-mono text-white">
                  ${(simulationData.tokenomics.market_cap || 0).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">24h Change</span>
                <span className={`font-mono ${
                  (simulationData.tokenomics.price_change_24h || 0) > 0 
                    ? 'text-accent-green' 
                    : 'text-accent-red'
                }`}>
                  {(simulationData.tokenomics.price_change_24h || 0) > 0 ? '+' : ''}
                  {(simulationData.tokenomics.price_change_24h || 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connection Info */}
      <div className="trading-card">
        <h4 className="font-medium mb-2">Connection</h4>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' 
              ? 'bg-accent-green' 
              : connectionStatus === 'connecting'
              ? 'bg-accent-yellow animate-pulse'
              : 'bg-accent-red'
          }`} />
          <span className="text-sm">{connectionStatus}</span>
        </div>
        
        {simulationData && (
          <div className="mt-2 text-xs text-gray-400">
            Step: {simulationData.step || 0}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
