import React, { useState } from 'react';

const ArcManagement = ({ data, connected, addArc, removeArc }) => {
  const [newArcConfig, setNewArcConfig] = useState({
    id: '',
    stake: 1000,
    type: 'validator',
    region: 'us-east'
  });

  const handleAddArc = () => {
    if (!connected || !newArcConfig.id) return;
    
    addArc(newArcConfig);
    setNewArcConfig({
      id: '',
      stake: 1000,
      type: 'validator',
      region: 'us-east'
    });
  };

  const handleRemoveArc = (arcId) => {
    if (!connected) return;
    removeArc(arcId);
  };

  if (!connected) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '400px',
        flexDirection: 'column',
        gap: 'var(--spacing-md)'
      }}>
        <div style={{ fontSize: '3rem' }}>🔗</div>
        <h2 style={{ color: 'var(--text-primary)' }}>ARC Management Unavailable</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Connect to manage ARC nodes</p>
      </div>
    );
  }

  return (
    <div className="arc-management">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-xs)'
          }}>
            ARC Network Management
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage Constitutional Intelligence Network nodes
          </p>
        </div>
        
        <div className="status-indicator status-online">
          <div className="live-dot"></div>
          {data?.validators?.length || 0} Active ARCs
        </div>
      </div>

      {/* Add New ARC Form */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="card-header">
          <h3 className="card-title">➕ Add New ARC</h3>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <div>
            <label style={{
              display: 'block',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: 'var(--spacing-xs)'
            }}>
              ARC ID
            </label>
            <input
              type="text"
              value={newArcConfig.id}
              onChange={(e) => setNewArcConfig({...newArcConfig, id: e.target.value})}
              placeholder="arc-node-001"
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: 'var(--spacing-xs)'
            }}>
              Initial Stake
            </label>
            <input
              type="number"
              value={newArcConfig.stake}
              onChange={(e) => setNewArcConfig({...newArcConfig, stake: parseInt(e.target.value)})}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: 'var(--spacing-xs)'
            }}>
              Node Type
            </label>
            <select
              value={newArcConfig.type}
              onChange={(e) => setNewArcConfig({...newArcConfig, type: e.target.value})}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
            >
              <option value="validator">Validator</option>
              <option value="observer">Observer</option>
              <option value="archive">Archive</option>
              <option value="bridge">Bridge</option>
            </select>
          </div>
          
          <div>
            <label style={{
              display: 'block',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: 'var(--spacing-xs)'
            }}>
              Region
            </label>
            <select
              value={newArcConfig.region}
              onChange={(e) => setNewArcConfig({...newArcConfig, region: e.target.value})}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
            >
              <option value="us-east">US East</option>
              <option value="us-west">US West</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="oceania">Oceania</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleAddArc}
          className="btn btn-primary"
          disabled={!newArcConfig.id}
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          ➕ Deploy ARC Node
        </button>
      </div>

      {/* Active ARCs Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: 'var(--spacing-lg)'
      }}>
        {data?.validators?.map((validator, index) => (
          <div key={validator.id || index} className="card">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: 'var(--spacing-md)'
            }}>
              <div>
                <h3 style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  🔗 ARC-{validator.id || index}
                </h3>
                <div className="status-indicator status-online" style={{ fontSize: '0.75rem' }}>
                  <div className="live-dot"></div>
                  ACTIVE
                </div>
              </div>
              
              <button
                onClick={() => handleRemoveArc(validator.id || index)}
                className="btn btn-danger"
                style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  fontSize: '0.75rem'
                }}
              >
                ❌ Remove
              </button>
            </div>
            
            {/* ARC Metrics */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)'
            }}>
              <div>
                <div style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '0.75rem',
                  marginBottom: '2px'
                }}>
                  STAKE
                </div>
                <div style={{ 
                  color: 'var(--accent-green)', 
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  {((validator.stake || Math.random() * 10000 + 1000)).toLocaleString()} ARC
                </div>
              </div>
              
              <div>
                <div style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '0.75rem',
                  marginBottom: '2px'
                }}>
                  UPTIME
                </div>
                <div style={{ 
                  color: 'var(--accent-blue)', 
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  {(Math.random() * 5 + 95).toFixed(2)}%
                </div>
              </div>
              
              <div>
                <div style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '0.75rem',
                  marginBottom: '2px'
                }}>
                  BLOCKS VALIDATED
                </div>
                <div style={{ 
                  color: 'var(--accent-purple)', 
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  {Math.floor(Math.random() * 10000 + 1000).toLocaleString()}
                </div>
              </div>
              
              <div>
                <div style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '0.75rem',
                  marginBottom: '2px'
                }}>
                  REWARDS
                </div>
                <div style={{ 
                  color: 'var(--accent-yellow)', 
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  {(Math.random() * 1000 + 100).toFixed(2)} ARC
                </div>
              </div>
            </div>
            
            {/* Performance Indicators */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--spacing-xs)'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                  PERFORMANCE
                </span>
                <span style={{ color: 'var(--accent-green)', fontSize: '0.75rem', fontWeight: '600' }}>
                  {(Math.random() * 20 + 80).toFixed(1)}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: 'var(--bg-tertiary)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.random() * 20 + 80}%`,
                  height: '100%',
                  background: 'var(--gradient-success)',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
            
            {/* Connection Info */}
            <div style={{ 
              background: 'var(--bg-hover)',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Node ID:</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                  {validator.id || `arc-${index.toString().padStart(3, '0')}`}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Type:</span>
                <span style={{ color: 'var(--accent-blue)' }}>
                  {validator.type || 'Validator'}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Region:</span>
                <span style={{ color: 'var(--accent-cyan)' }}>
                  {validator.region || 'US-East'}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add placeholder cards if no validators */}
        {(!data?.validators || data.validators.length === 0) && (
          <div className="card" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
            minHeight: '200px',
            border: '2px dashed var(--border-color)'
          }}>
            <div style={{ fontSize: '2rem' }}>🔗</div>
            <h3 style={{ color: 'var(--text-secondary)' }}>No ARCs Deployed</h3>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
              Deploy your first ARC node to begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArcManagement;
