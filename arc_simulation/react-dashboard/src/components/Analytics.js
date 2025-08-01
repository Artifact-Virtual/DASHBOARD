import React from 'react';

const Analytics = ({ data, connected }) => {
  if (!connected || !data) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h3 className="loading-text">Loading Analytics...</h3>
        <p className="loading-subtext">Analyzing network performance data</p>
      </div>
    );
  }

  return (
    <div className="analytics">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            📈 Performance Analytics
          </h2>
          <p className="card-subtitle">Deep analysis of network metrics and trends</p>
        </div>
        
        <div className="chart-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h3 className="loading-text">Advanced Analytics Coming Soon</h3>
            <p className="loading-subtext">Professional trading analytics with historical data visualization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
