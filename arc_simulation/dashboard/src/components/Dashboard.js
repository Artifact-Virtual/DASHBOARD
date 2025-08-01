import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardView from './views/DashboardView';
import NetworkView from './views/NetworkView';
import TradingView from './views/TradingView';
import AnalyticsView from './views/AnalyticsView';

const Dashboard = ({ view, simulationData, controls, connectionStatus }) => {
  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <DashboardView 
            simulationData={simulationData}
            controls={controls}
            connectionStatus={connectionStatus}
          />
        );
      case 'network':
        return (
          <NetworkView 
            simulationData={simulationData}
            controls={controls}
            connectionStatus={connectionStatus}
          />
        );
      case 'trading':
        return (
          <TradingView 
            simulationData={simulationData}
            controls={controls}
            connectionStatus={connectionStatus}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView 
            simulationData={simulationData}
            controls={controls}
            connectionStatus={connectionStatus}
          />
        );
      default:
        return (
          <DashboardView 
            simulationData={simulationData}
            controls={controls}
            connectionStatus={connectionStatus}
          />
        );
    }
  };

  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
