import React, { useState } from 'react';

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen, 
  connected, 
  injectCrisis, 
  updateConfig,
  data 
}) => {
  const [crisisType, setCrisisType] = useState('economic_collapse');
  const [crisisSeverity, setCrisisSeverity] = useState(0.5);
  const [crisisDuration, setCrisisDuration] = useState(10);

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', description: 'Live System Overview' },
    { id: 'analytics', icon: '📈', label: 'Analytics', description: 'Performance Analysis' },
    { id: 'arcs', icon: '🔗', label: 'ARC Management', description: 'Network Nodes' },
    { id: 'system', icon: '⚙️', label: 'System Status', description: 'Health & Diagnostics' }
  ];

  const crisisTypes = [
    { value: 'economic_collapse', label: 'Economic Collapse', icon: '💥' },
    { value: 'network_attack', label: 'Network Attack', icon: '🔴' },
    { value: 'data_corruption', label: 'Data Corruption', icon: '🗃️' },
    { value: 'byzantine_failure', label: 'Byzantine Failure', icon: '⚡' },
    { value: 'liquidity_crisis', label: 'Liquidity Crisis', icon: '💧' },
    { value: 'validator_outage', label: 'Validator Outage', icon: '🔧' },
    { value: 'bridge_exploit', label: 'Bridge Exploit', icon: '🌉' },
    { value: 'governance_attack', label: 'Governance Attack', icon: '🏛️' },
    { value: 'oracle_manipulation', label: 'Oracle Manipulation', icon: '🔮' },
    { value: 'flash_loan_attack', label: 'Flash Loan Attack', icon: '⚡' }
  ];

  const handleCrisisInject = () => {
    if (!connected) return;
    
    const crisisConfig = {
      type: crisisType,
      severity: crisisSeverity,
      duration: crisisDuration,
      immediate: true
    };
    
    injectCrisis(crisisConfig);
  };

  const sidebarStyle = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: sidebarOpen ? '280px' : '60px',
    height: '100vh',
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    transition: 'width 0.3s ease',
    zIndex: 1000,
    overflow: 'hidden'
  };

  return (
    <aside style={sidebarStyle}>
      <div style={{ 
        padding: 'var(--spacing-lg)', 
        height: '100%', 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Navigation Menu */}
        <nav style={{ marginBottom: 'var(--spacing-xl)' }}>
          {sidebarOpen && (
            <h3 style={{
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 'var(--spacing-md)'
            }}>
              Navigation
            </h3>
          )}
          
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                marginBottom: 'var(--spacing-xs)',
                background: activeTab === item.id ? 'var(--gradient-primary)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: activeTab === item.id ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.background = 'var(--bg-hover)';
                  e.target.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              {sidebarOpen && (
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                    {item.label}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    opacity: 0.8,
                    marginTop: '2px'
                  }}>
                    {item.description}
                  </div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Crisis Management Controls */}
        {sidebarOpen && connected && (
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h3 style={{
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 'var(--spacing-md)'
            }}>
              Crisis Management
            </h3>
            
            <div className="card" style={{ padding: 'var(--spacing-md)' }}>
              {/* Crisis Type Selection */}
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Crisis Type
              </label>
              <select
                value={crisisType}
                onChange={(e) => setCrisisType(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  marginBottom: 'var(--spacing-md)'
                }}
              >
                {crisisTypes.map((crisis) => (
                  <option key={crisis.value} value={crisis.value}>
                    {crisis.icon} {crisis.label}
                  </option>
                ))}
              </select>

              {/* Severity Slider */}
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Severity: {(crisisSeverity * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={crisisSeverity}
                onChange={(e) => setCrisisSeverity(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  marginBottom: 'var(--spacing-md)'
                }}
              />

              {/* Duration Input */}
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Duration (steps)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={crisisDuration}
                onChange={(e) => setCrisisDuration(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  marginBottom: 'var(--spacing-md)'
                }}
              />

              {/* Inject Crisis Button */}
              <button
                onClick={handleCrisisInject}
                className="btn btn-danger"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontWeight: '600'
                }}
              >
                💥 Inject Crisis
              </button>
            </div>
          </div>
        )}

        {/* System Stats */}
        {sidebarOpen && data && (
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 'var(--spacing-md)'
            }}>
              Quick Stats
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: 'var(--spacing-xs) 0',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Active ARCs
                </span>
                <span style={{ 
                  color: 'var(--accent-blue)', 
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  {data.validators?.length || 0}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: 'var(--spacing-xs) 0',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Fuel Agents
                </span>
                <span style={{ 
                  color: 'var(--accent-green)', 
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  {data.fuel_agents?.length || 0}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: 'var(--spacing-xs) 0'
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Network Health
                </span>
                <span style={{ 
                  color: data.economic_health > 0.7 ? 'var(--accent-green)' : 
                         data.economic_health > 0.4 ? 'var(--accent-yellow)' : 'var(--accent-red)',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  {((data.economic_health || 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
