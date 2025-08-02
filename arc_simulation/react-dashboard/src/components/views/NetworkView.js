import React from 'react';
import { motion } from 'framer-motion';
import { Network, Zap, Shield, Activity } from 'lucide-react';

const NetworkView = ({ simulationData, controls, connectionStatus }) => {
  const getNetworkData = () => {
    if (!simulationData?.simulation_state?.network_state) {
      return { arcs: [], validationRelationships: {} };
    }
    
    const networkState = simulationData.simulation_state.network_state;
    return {
      arcs: networkState.arcs || [],
      validationRelationships: networkState.validation_relationships || {}
    };
  };

  const { arcs, validationRelationships } = getNetworkData();

  const ArcCard = ({ arc, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="arc-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Network className="w-5 h-5 text-accent-blue" />
          <span>ARC-{arc.arc_id}</span>
        </h3>
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          (arc.total_blocks - arc.disputed_blocks) / Math.max(1, arc.total_blocks) > 0.9 
            ? 'bg-accent-green text-dark-900' 
            : 'bg-accent-yellow text-dark-900'
        }`}>
          {(((arc.total_blocks - arc.disputed_blocks) / Math.max(1, arc.total_blocks)) * 100).toFixed(1)}% Valid
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-400">Total Blocks</div>
          <div className="text-xl font-mono font-bold text-white">{arc.total_blocks || 0}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Disputes</div>
          <div className="text-xl font-mono font-bold text-accent-red">{arc.disputed_blocks || 0}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">ADAM Guilt</span>
          <span className="font-mono text-accent-purple">{(arc.adam_guilt || 0).toFixed(3)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Policy</span>
          <span className="text-white capitalize">{arc.adam_policy || 'moderate'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Rule Index</span>
          <span className="font-mono text-accent-blue">{arc.current_rule || 0}</span>
        </div>
      </div>

      {/* Validation Progress */}
      <div className="mt-4">
        <div className="text-sm text-gray-400 mb-1">Validation Health</div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill bg-accent-green"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((arc.total_blocks - arc.disputed_blocks) / Math.max(1, arc.total_blocks)) * 100}%` 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Network Topology</h1>
          <p className="text-gray-400 mt-1">ARC Constitutional Network Analysis</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-accent-blue" />
            <span className="text-white font-medium">{arcs.length} Active ARCs</span>
          </div>
        </div>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="trading-card"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Network className="w-5 h-5 text-accent-blue" />
            <span className="text-sm text-gray-400">Network Nodes</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">{arcs.length}</div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="trading-card"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-5 h-5 text-accent-green" />
            <span className="text-sm text-gray-400">Total Validation</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {Object.keys(validationRelationships).length}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="trading-card"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="w-5 h-5 text-accent-purple" />
            <span className="text-sm text-gray-400">Network Health</span>
          </div>
          <div className="text-2xl font-mono font-bold text-accent-green">
            {simulationData?.simulation_state?.economic_health 
              ? `${(simulationData.simulation_state.economic_health * 100).toFixed(1)}%`
              : '100%'
            }
          </div>
        </motion.div>
      </div>

      {/* ARC Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-accent-purple" />
          <span>Constitutional ARCs</span>
        </h2>
        
        {arcs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {arcs.map((arc, index) => (
              <ArcCard key={arc.arc_id} arc={arc} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Network className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Network Data</h3>
            <p className="text-gray-500">Waiting for ARC network to initialize...</p>
          </div>
        )}
      </div>

      {/* Validation Relationships */}
      {Object.keys(validationRelationships).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-accent-green" />
            <span>Circular Validation Network</span>
          </h2>
          
          <div className="trading-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(validationRelationships).map(([arcId, validators]) => (
                <div key={arcId} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                  <span className="font-medium">ARC-{arcId}</span>
                  <span className="text-sm text-gray-400">
                    Validated by: ARC-{Array.isArray(validators) ? validators.join(', ARC-') : validators}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkView;
