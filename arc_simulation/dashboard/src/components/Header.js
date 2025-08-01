import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Zap,
  BarChart3,
  Network
} from 'lucide-react';

const Header = ({ connectionStatus, currentData, onViewChange, currentView }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: Activity }
  ];

  // Extract key metrics from current data
  const getHeaderMetrics = () => {
    if (!currentData?.simulation_state) {
      return {
        price: '0.001',
        change: '0.00',
        volume: '0',
        networkHealth: '100'
      };
    }

    const { tokenomics, simulation_state } = currentData;
    const price = tokenomics?.current_price || 0.001;
    const change = tokenomics?.price_change_24h || 0;
    const volume = simulation_state?.total_disputes || 0;
    const health = simulation_state?.economic_health || 1.0;

    return {
      price: price.toFixed(6),
      change: change.toFixed(2),
      volume: (volume * 1000).toLocaleString(),
      networkHealth: (health * 100).toFixed(1)
    };
  };

  const metrics = getHeaderMetrics();

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-800 border-b border-dark-600 glass"
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo and Brand */}
        <motion.div 
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">ARC MULTINET</h1>
            <p className="text-xs text-gray-400">Professional Trading Dashboard</p>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-accent-blue text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Real-time Metrics */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* FUEL Price */}
          <motion.div 
            className="text-right"
            animate={{ 
              scale: currentData?.timestamp ? [1, 1.02, 1] : 1 
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-accent-green" />
              <span className="text-lg font-mono font-bold text-accent-green">
                ${metrics.price}
              </span>
            </div>
            <div className={`text-xs ${
              parseFloat(metrics.change) > 0 
                ? 'text-accent-green' 
                : parseFloat(metrics.change) < 0 
                ? 'text-accent-red' 
                : 'text-gray-400'
            }`}>
              {parseFloat(metrics.change) > 0 ? '+' : ''}{metrics.change}%
            </div>
          </motion.div>

          {/* Volume */}
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-accent-blue" />
              <span className="text-sm font-medium text-white">
                {metrics.volume}
              </span>
            </div>
            <div className="text-xs text-gray-400">24h Volume</div>
          </div>

          {/* Network Health */}
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <Shield className={`w-4 h-4 ${
                parseFloat(metrics.networkHealth) > 80 
                  ? 'text-accent-green' 
                  : parseFloat(metrics.networkHealth) > 60 
                  ? 'text-accent-yellow' 
                  : 'text-accent-red'
              }`} />
              <span className={`text-sm font-medium ${
                parseFloat(metrics.networkHealth) > 80 
                  ? 'text-accent-green' 
                  : parseFloat(metrics.networkHealth) > 60 
                  ? 'text-accent-yellow' 
                  : 'text-accent-red'
              }`}>
                {metrics.networkHealth}%
              </span>
            </div>
            <div className="text-xs text-gray-400">Health</div>
          </div>
        </div>

        {/* Connection Status */}
        <motion.div
          className="flex items-center space-x-2"
          animate={{ scale: connectionStatus === 'connected' ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 2, repeat: connectionStatus === 'connected' ? Infinity : 0 }}
        >
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' 
              ? 'bg-accent-green shadow-lg shadow-accent-green/50' 
              : connectionStatus === 'connecting'
              ? 'bg-accent-yellow animate-pulse'
              : 'bg-accent-red'
          }`} />
          <span className="text-sm font-medium">
            {connectionStatus === 'connected' 
              ? 'LIVE' 
              : connectionStatus === 'connecting'
              ? 'CONNECTING'
              : 'OFFLINE'}
          </span>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-dark-600">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${
                currentView === item.id
                  ? 'text-accent-blue'
                  : 'text-gray-400'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
