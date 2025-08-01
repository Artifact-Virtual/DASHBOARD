import React from 'react';

const Header = ({ connected, error, sidebarOpen, setSidebarOpen, data }) => {
  const currentTime = new Date().toLocaleString();
  const simulationStep = data?.step || 0;
  const economicHealth = data?.economic_health || 0;

  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: 'var(--spacing-md) var(--spacing-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '64px'
    }}>
      {/* Left Side - Logo and Navigation Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '1.25rem',
            cursor: 'pointer',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--radius-md)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--bg-hover)';
            e.target.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--text-secondary)';
          }}
        >
          ☰
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--gradient-primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '0.875rem'
          }}>
            ARC
          </div>
          <div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Multi-ARC Trading Dashboard
            </h1>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              margin: 0
            }}>
              Constitutional Intelligence Network
            </div>
          </div>
        </div>
      </div>

      {/* Center - Live Status and Metrics */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--spacing-lg)',
        flex: 1,
        justifyContent: 'center'
      }}>
        {/* Connection Status */}
        <div className="status-indicator" style={{
          background: connected ? 'rgba(72, 187, 120, 0.2)' : 'rgba(245, 101, 101, 0.2)',
          color: connected ? 'var(--accent-green)' : 'var(--accent-red)'
        }}>
          <div className={connected ? 'live-dot' : ''} style={{
            width: '8px',
            height: '8px',
            background: connected ? 'var(--accent-green)' : 'var(--accent-red)',
            borderRadius: '50%'
          }}></div>
          {connected ? 'LIVE' : 'OFFLINE'}
        </div>

        {/* Simulation Step */}
        {connected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Step:</span>
            <span style={{ 
              color: 'var(--accent-blue)', 
              fontWeight: '600',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}>
              {simulationStep.toLocaleString()}
            </span>
          </div>
        )}

        {/* Economic Health */}
        {connected && economicHealth > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Health:</span>
            <span style={{ 
              color: economicHealth > 0.7 ? 'var(--accent-green)' : 
                     economicHealth > 0.4 ? 'var(--accent-yellow)' : 'var(--accent-red)',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              {(economicHealth * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Right Side - System Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        {/* Current Time */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '2px'
          }}>
            SYSTEM TIME
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            fontFamily: 'monospace'
          }}>
            {currentTime}
          </div>
        </div>

        {/* System Status Indicator */}
        <div style={{
          width: '40px',
          height: '40px',
          background: connected ? 'var(--gradient-success)' : 'var(--gradient-danger)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.25rem'
        }}>
          {connected ? '⚡' : '⚠️'}
        </div>
      </div>
    </header>
  );
};

export default Header;
