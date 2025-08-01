import streamlit as st
import sys
import time
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np

sys.path.append('.')

from shared.context import LiveContextLoop
from fuel_simulation.fuel_sim import FuelSimulator
from arc_simulation.arc_sim import ArcSimulator
from adam_simulation.adam_sim import AdamAgent

# Page config
st.set_page_config(
    page_title="ARC MULTINET SIMULATION",
    page_icon="",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better visuals
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #1f1f2e, #2d3748);
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        color: white;
        text-align: center;
    }
    .metric-card {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #007bff;
        margin: 0.5rem 0;
    }
    .arc-status {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin: 0.2rem;
        min-height: 300px;
    }
    .chart-container {
        height: 400px;
        margin-bottom: 1rem;
    }
    .stable-container {
        min-height: 500px;
        margin-bottom: 1rem;
    }
    .live-indicator {
        animation: pulse 2s infinite;
        background: #ff4444;
        color: white;
        padding: 0.5rem;
        border-radius: 5px;
        text-align: center;
        font-weight: bold;
    }
    }
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
    .paused-mode {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state for stable performance and cached charts
if 'live_context_loop' not in st.session_state:
    fuel_sim = FuelSimulator(n_agents=8)
    st.session_state.live_context_loop = LiveContextLoop(
        ArcSimulator, AdamAgent, fuel_sim, initial_arc_count=3
    )
if 'running' not in st.session_state:
    st.session_state.running = False
if 'step_count' not in st.session_state:
    st.session_state.step_count = 0
if 'history' not in st.session_state:
    st.session_state.history = []
if 'analytics_data' not in st.session_state:
    st.session_state.analytics_data = {
        'block_creation_rate': [],
        'agent_performance': [],
        'fuel_flows': [],
        'network_health': [],
        'validation_network': [],
        'circular_validation_events': []
    }
if 'subnet_bridge_threshold' not in st.session_state:
    st.session_state.subnet_bridge_threshold = 500

# Chart cache for stable rendering
if 'chart_cache' not in st.session_state:
    st.session_state.chart_cache = {}
if 'last_update_step' not in st.session_state:
    st.session_state.last_update_step = 0

# Utility functions for stable rendering
@st.cache_data(ttl=1)
def create_cached_chart(chart_type, data, chart_config):
    """Create cached charts to reduce rendering overhead"""
    if chart_type == "bar":
        return px.bar(data, **chart_config)
    elif chart_type == "line":
        return px.line(data, **chart_config)
    elif chart_type == "scatter":
        return px.scatter(data, **chart_config)
    elif chart_type == "pie":
        return px.pie(data, **chart_config)
    elif chart_type == "histogram":
        return px.histogram(data, **chart_config)
    elif chart_type == "line_polar":
        return px.line_polar(data, **chart_config)
    return None

def should_update_chart(chart_id, current_step):
    """Determine if chart should be updated to prevent unnecessary renders"""
    last_update = st.session_state.chart_cache.get(f"{chart_id}_last_update", 0)
    return current_step > last_update

def update_chart_cache(chart_id, current_step):
    """Mark chart as updated"""
    st.session_state.chart_cache[f"{chart_id}_last_update"] = current_step

# Report Generation Functions
def generate_comprehensive_report(history, current_state, report_type):
    """Generate extremely detailed professional reports with extensive visualizations"""
    
    st.markdown(f"""
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; padding: 2rem; border-radius: 15px; margin-bottom: 2rem;">
        <h1 style="margin: 0; text-align: center;">📊 COMPREHENSIVE SYSTEM ANALYSIS REPORT</h1>
        <h2 style="margin: 0.5rem 0 0 0; text-align: center; opacity: 0.9;">Advanced Multi-ARC Constitutional Intelligence Network</h2>
        <p style="margin: 0.5rem 0 0 0; text-align: center; opacity: 0.8;">
            Generated: {pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")} | Steps: {len(history)} | Type: {report_type}
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Executive Summary
    st.header("📋 Executive Summary")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Simulation Steps", len(history))
    
    with col2:
        avg_health = np.mean([h.get('economic_health', 1.0) for h in history[-20:]])
        st.metric("Avg Economic Health", f"{avg_health:.1%}")
    
    with col3:
        total_arcs = len(current_state.get('validators', []))
        st.metric("Active ARCs", total_arcs)
    
    with col4:
        total_events = len(current_state.get('system_events', []))
        st.metric("System Events", total_events)
    
    # Detailed Analysis Tabs
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "🏗️ System Architecture",
        "📈 Performance Analytics", 
        "💰 Economic Analysis",
        "🔒 Security & Governance",
        "📊 Comparative Overlay Analysis"
    ])
    
    with tab1:
        generate_architecture_analysis(history, current_state)
    
    with tab2:
        generate_performance_analysis(history, current_state)
    
    with tab3:
        generate_economic_analysis(history, current_state)
    
    with tab4:
        generate_security_analysis(history, current_state)
    
    with tab5:
        generate_comparative_overlay_analysis(history, current_state)

def generate_architecture_analysis(history, current_state):
    """Generate detailed system architecture analysis"""
    st.subheader("🏗️ System Architecture Analysis")
    
    # Network evolution data
    network_data = []
    for i, h in enumerate(history):
        validators = h.get('validators', [])
        forecasters = h.get('forecasters', [])
        operators = h.get('operators', [])
        
        network_data.append({
            'Step': i,
            'Validators': len(validators),
            'Forecasters': len(forecasters),
            'Operators': len(operators),
            'Total_Agents': len(validators) + len(forecasters) + len(operators),
            'Economic_Health': h.get('economic_health', 1.0) * 100
        })
    
    if network_data:
        network_df = pd.DataFrame(network_data)
        
        # Network evolution chart
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=('Agent Population Trends', 'Network Complexity', 
                          'Health vs Population', 'Current Distribution'),
            specs=[[{"secondary_y": True}, {"type": "scatter"}],
                   [{"type": "scatter"}, {"type": "pie"}]]
        )
        
        # Population trends
        fig.add_trace(
            go.Scatter(x=network_df['Step'], y=network_df['Validators'], 
                      name="Validators", line=dict(color='blue')),
            row=1, col=1
        )
        fig.add_trace(
            go.Scatter(x=network_df['Step'], y=network_df['Forecasters'], 
                      name="Forecasters", line=dict(color='green')),
            row=1, col=1
        )
        fig.add_trace(
            go.Scatter(x=network_df['Step'], y=network_df['Operators'], 
                      name="Operators", line=dict(color='red')),
            row=1, col=1
        )
        
        fig.update_layout(height=600, title_text="🏗️ Network Architecture Evolution")
        st.plotly_chart(fig, use_container_width=True)

def generate_performance_analysis(history, current_state):
    """Generate detailed performance analysis"""
    st.subheader("📈 Performance Analytics Deep Dive")
    
    # Performance data extraction
    perf_data = []
    for i, h in enumerate(history):
        validators = h.get('validators', [])
        forecasters = h.get('forecasters', [])
        operators = h.get('operators', [])
        
        avg_val_score = np.mean([v.get('score', 0) for v in validators]) if validators else 0
        avg_fore_accuracy = np.mean([f.get('accuracy', 0) for f in forecasters]) if forecasters else 0
        avg_op_efficiency = np.mean([o.get('efficiency', 0) for o in operators]) if operators else 0
        
        perf_data.append({
            'Step': i,
            'Validator_Score': avg_val_score,
            'Forecaster_Accuracy': avg_fore_accuracy,
            'Operator_Efficiency': avg_op_efficiency,
            'Overall_Performance': (avg_val_score + avg_fore_accuracy + avg_op_efficiency) / 3
        })
    
    if perf_data:
        perf_df = pd.DataFrame(perf_data)
        
        # Performance trends
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=perf_df['Step'], y=perf_df['Validator_Score'],
                               name="Validator Score", line=dict(color='blue', width=3)))
        fig.add_trace(go.Scatter(x=perf_df['Step'], y=perf_df['Forecaster_Accuracy'],
                               name="Forecaster Accuracy", line=dict(color='green', width=3)))
        fig.add_trace(go.Scatter(x=perf_df['Step'], y=perf_df['Operator_Efficiency'],
                               name="Operator Efficiency", line=dict(color='red', width=3)))
        
        fig.update_layout(title="📈 Agent Performance Evolution", height=400)
        st.plotly_chart(fig, use_container_width=True)

def generate_economic_analysis(history, current_state):
    """Generate detailed economic analysis"""
    st.subheader("💰 Economic Analysis Deep Dive")
    
    # Economic data
    econ_data = []
    for i, h in enumerate(history):
        fuel_stats = h.get('fuel_mainnet', {})
        fuel_subnets = h.get('fuel_subnets', [])
        
        total_liquidity = sum([s.get('liquidity', 0) for s in fuel_subnets])
        
        econ_data.append({
            'Step': i,
            'Total_Supply': fuel_stats.get('total_supply', 0),
            'Circulating': fuel_stats.get('circulating_supply', 0),
            'Subnet_Liquidity': total_liquidity,
            'Economic_Health': h.get('economic_health', 1.0) * 100,
            'Economic_Stress': h.get('economic_stress', 0) * 100
        })
    
    if econ_data:
        econ_df = pd.DataFrame(econ_data)
        
        # Economic trends
        fig = make_subplots(rows=2, cols=1, 
                           subplot_titles=('FUEL Supply Evolution', 'Economic Health Trends'))
        
        fig.add_trace(
            go.Scatter(x=econ_df['Step'], y=econ_df['Total_Supply'],
                      name="Total Supply", line=dict(color='blue')),
            row=1, col=1
        )
        fig.add_trace(
            go.Scatter(x=econ_df['Step'], y=econ_df['Economic_Health'],
                      name="Economic Health", line=dict(color='green')),
            row=2, col=1
        )
        
        fig.update_layout(height=500, title_text="💰 Economic Analysis")
        st.plotly_chart(fig, use_container_width=True)

def generate_security_analysis(history, current_state):
    """Generate security and governance analysis"""
    st.subheader("🔒 Security & Governance Analysis")
    
    # Security metrics
    security_data = []
    for i, h in enumerate(history):
        violations = h.get('total_violations', 0)
        governance_events = len(h.get('governance_events', []))
        
        security_data.append({
            'Step': i,
            'Violations': violations,
            'Governance_Events': governance_events,
            'Security_Score': max(0, 100 - violations * 10)
        })
    
    if security_data:
        sec_df = pd.DataFrame(security_data)
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=sec_df['Step'], y=sec_df['Security_Score'],
                               name="Security Score", line=dict(color='green', width=3)))
        fig.add_trace(go.Scatter(x=sec_df['Step'], y=sec_df['Violations'],
                               name="Violations", line=dict(color='red', width=3)))
        
        fig.update_layout(title="🔒 Security Analysis", height=400)
        st.plotly_chart(fig, use_container_width=True)

def generate_comparative_overlay_analysis(history, current_state):
    """Generate comprehensive comparative overlay analysis"""
    st.subheader("📊 Comparative Overlay Analysis")
    
    st.markdown("""
    ### 🎯 Multi-Dimensional Data Overlay
    This section overlays all collected data for comprehensive comparative analysis.
    """)
    
    if len(history) > 5:
        # Extract all metrics
        overlay_data = []
        for i, h in enumerate(history):
            overlay_data.append({
                'Step': i,
                'Economic_Health': h.get('economic_health', 1.0) * 100,
                'Network_Size': len(h.get('validators', [])) + len(h.get('forecasters', [])) + len(h.get('operators', [])),
                'FUEL_Supply': h.get('fuel_mainnet', {}).get('total_supply', 0),
                'Violations': h.get('total_violations', 0),
                'Stress_Level': h.get('economic_stress', 0) * 100
            })
        
        overlay_df = pd.DataFrame(overlay_data)
        
        # Normalize for overlay
        normalized_data = overlay_df.copy()
        for col in ['Economic_Health', 'Network_Size', 'FUEL_Supply', 'Violations', 'Stress_Level']:
            if normalized_data[col].max() > 0:
                normalized_data[f'{col}_norm'] = (normalized_data[col] / normalized_data[col].max()) * 100
        
        # All metrics overlay
        fig = go.Figure()
        colors = ['blue', 'green', 'red', 'orange', 'purple']
        metrics = ['Economic_Health', 'Network_Size', 'FUEL_Supply', 'Violations', 'Stress_Level']
        
        for i, metric in enumerate(metrics):
            fig.add_trace(
                go.Scatter(
                    x=normalized_data['Step'], 
                    y=normalized_data[f'{metric}_norm'],
                    name=metric.replace('_', ' '),
                    line=dict(color=colors[i], width=2),
                    opacity=0.8
                )
            )
        
        fig.update_layout(
            title="📊 Ultimate Comparative Overlay Analysis",
            height=600,
            yaxis_title="Normalized Values (0-100)"
        )
        st.plotly_chart(fig, use_container_width=True)
        
        # Correlation matrix
        st.subheader("🔗 Correlation Analysis")
        corr_matrix = overlay_df[['Economic_Health', 'Network_Size', 'FUEL_Supply', 'Violations', 'Stress_Level']].corr()
        
        fig_corr = px.imshow(
            corr_matrix.values,
            labels=dict(x="Metrics", y="Metrics", color="Correlation"),
            x=[col.replace('_', ' ') for col in corr_matrix.columns],
            y=[col.replace('_', ' ') for col in corr_matrix.index],
            color_continuous_scale='RdBu',
            title="📈 Cross-Metric Correlation Matrix"
        )
        st.plotly_chart(fig_corr, use_container_width=True)
        
        # Statistical summary
        st.subheader("📈 Statistical Summary")
        st.dataframe(overlay_df.describe(), use_container_width=True)

# Professional Header
st.markdown("""
<div class="main-header">
    <h2> ARC MULTINET SIMULATION </h2>
    <p>Real-time blockchain simulation with advanced analytics and tokenomics</p>
</div>
""", unsafe_allow_html=True)

# Enhanced Control Panel
with st.sidebar:
    st.header("🎛️ Professional Controls")
    
    # Main controls
    col1, col2 = st.columns(2)
    with col1:
        if st.button("▶️ Start", type="primary", use_container_width=True):
            st.session_state.running = True
    with col2:
        if st.button("⏸️ Pause", use_container_width=True):
            st.session_state.running = False
    
    if st.button("🔄 Reset Network", use_container_width=True):
        fuel_sim = FuelSimulator(n_agents=8)
        st.session_state.live_context_loop = LiveContextLoop(
            ArcSimulator, AdamAgent, fuel_sim, initial_arc_count=3
        )
        st.session_state.step_count = 0
        st.session_state.running = False
        st.session_state.history = []
        st.session_state.analytics_data = {
            'block_creation_rate': [],
            'agent_performance': [],
            'fuel_flows': [],
            'network_health': [],
            'validation_network': [],
            'circular_validation_events': []
        }
    
    # Stream settings
    st.subheader("⚙️ Stream Settings")
    stream_speed = st.slider("Update Interval (sec)", 0.1, 3.0, 0.8, 0.1)
    
    # FUEL Economics Settings
    st.subheader("⚡ FUEL Economics")
    bridge_threshold = st.slider(
        "Subnet Bridge Threshold (FUEL)", 100, 1000, 500, 50
    )
    st.session_state.subnet_bridge_threshold = bridge_threshold
    
    # Advanced Tokenomics Configuration
    st.subheader("💰 Treasury & Tokenomics")
    
    # Initialize tokenomics session state
    if 'tokenomics_config' not in st.session_state:
        st.session_state.tokenomics_config = {
            'initial_treasury': 1000000,
            'fuel_cost': 0.01,
            'target_price': 1.0,
            'burn_rate': 0.02,
            'staking_apy': 0.12,
            'bridge_fee_rate': 0.005,
            'validator_reward_rate': 0.1,
            'inflation_rate': 0.03
        }
    
    with st.expander("🏦 Treasury Configuration"):
        initial_treasury = st.number_input(
            "Initial Treasury (FUEL)", 
            min_value=10000, 
            max_value=10000000, 
            value=st.session_state.tokenomics_config['initial_treasury'],
            step=10000
        )
        
        target_price = st.number_input(
            "Target Price ($)", 
            min_value=0.001, 
            max_value=100.0, 
            value=st.session_state.tokenomics_config['target_price'],
            step=0.01,
            format="%.3f"
        )
        
        fuel_cost = st.number_input(
            "Transaction Cost (FUEL)", 
            min_value=0.001, 
            max_value=10.0, 
            value=st.session_state.tokenomics_config['fuel_cost'],
            step=0.001,
            format="%.3f"
        )
        
        # Update tokenomics config
        st.session_state.tokenomics_config.update({
            'initial_treasury': initial_treasury,
            'target_price': target_price,
            'fuel_cost': fuel_cost
        })
    
    with st.expander("⚙️ Economic Parameters"):
        burn_rate = st.slider("Burn Rate", 0.0, 0.1, st.session_state.tokenomics_config['burn_rate'], 0.001)
        staking_apy = st.slider("Staking APY", 0.0, 0.5, st.session_state.tokenomics_config['staking_apy'], 0.01)
        bridge_fee_rate = st.slider("Bridge Fee Rate", 0.001, 0.02, st.session_state.tokenomics_config['bridge_fee_rate'], 0.001)
        validator_reward_rate = st.slider("Validator Reward Rate", 0.01, 0.3, st.session_state.tokenomics_config['validator_reward_rate'], 0.01)
        inflation_rate = st.slider("Inflation Rate", 0.0, 0.1, st.session_state.tokenomics_config['inflation_rate'], 0.001)
        
        # Update rates
        st.session_state.tokenomics_config.update({
            'burn_rate': burn_rate,
            'staking_apy': staking_apy,
            'bridge_fee_rate': bridge_fee_rate,
            'validator_reward_rate': validator_reward_rate,
            'inflation_rate': inflation_rate
        })
    
    # Price Target Strategy
    price_strategy = st.selectbox("Price Growth Strategy", [
        "Conservative Growth",
        "Aggressive Growth", 
        "BTC Parity Target",
        "ETH Parity Target",
        "Stable Dollar Peg",
        "Custom Target"
    ])
    
    if price_strategy == "Custom Target":
        custom_target = st.number_input("Custom Target Price ($)", 0.001, 100000.0, 1.0)
        st.session_state.tokenomics_config['custom_target'] = custom_target
    
    st.session_state.tokenomics_config['price_strategy'] = price_strategy
    
    # Analytics Settings
    st.subheader("📊 Analytics Settings")
    history_window = st.slider("History Window (steps)", 10, 100, 50, 5)
    show_predictions = st.checkbox("Show Forecaster Predictions", True)
    show_disputes = st.checkbox("Show Block Disputes", True)
    
    # Dynamic ARC Management
    st.subheader("🔧 Dynamic ARC Management")
    current_arcs = len(st.session_state.live_context_loop.arcs) if hasattr(st.session_state, 'live_context_loop') else 3
    st.info(f"Current ARCs: {current_arcs}")
    
    col1, col2 = st.columns(2)
    with col1:
        if st.button("➕ Add ARC", use_container_width=True):
            if hasattr(st.session_state, 'live_context_loop'):
                # Add new ARC with auto-generated ID
                new_arc_id = st.session_state.live_context_loop.add_arc()
                st.success(f"Added ARC-{new_arc_id}")
                st.rerun()
    
    with col2:
        if st.button("➖ Remove ARC", use_container_width=True):
            if hasattr(st.session_state, 'live_context_loop') and current_arcs > 1:
                removed_arc = st.session_state.live_context_loop.remove_arc()
                if removed_arc:
                    st.success(f"Removed ARC-{removed_arc}")
                    st.rerun()
                else:
                    st.warning("Cannot remove ARC")
            else:
                st.warning("Cannot remove - minimum 1 ARC required")
    
    # Crisis Injection System
    st.subheader("⚠️ Crisis Injection")
    crisis_type = st.selectbox("Crisis Type", [
        "None",
        "Economic Collapse",
        "Network Attack",
        "Data Corruption",
        "Byzantine Failure",
        "Liquidity Crisis",
        "Validator Outage",
        "Bridge Exploit",
        "Governance Attack",
        "Oracle Manipulation",
        "Flash Loan Attack"
    ])
    
    crisis_severity = st.slider("Crisis Severity", 0.1, 1.0, 0.5, 0.1)
    crisis_duration = st.slider("Crisis Duration (steps)", 1, 20, 5, 1)
    
    if st.button("💥 Inject Crisis", use_container_width=True) and crisis_type != "None":
        if hasattr(st.session_state, 'live_context_loop'):
            st.session_state.live_context_loop.inject_crisis(crisis_type, crisis_severity, crisis_duration)
            st.error(f"💥 {crisis_type} injected! Severity: {crisis_severity:.1f}, Duration: {crisis_duration} steps")
            st.rerun()
    
    # Report Generation
    st.subheader("📄 Report Generation")
    if not st.session_state.running and len(st.session_state.history) > 10:
        report_type = st.selectbox("Report Type", [
            "Comprehensive Analysis",
            "Performance Summary", 
            "Economic Analysis",
            "Security Assessment",
            "Network Health Report"
        ])
        
        if st.button("📊 Generate Detailed Report", use_container_width=True):
            st.session_state.generate_report = True
            st.session_state.report_type = report_type
            st.success("Report generation initiated!")
            st.rerun()
    else:
        if st.session_state.running:
            st.info("⏸️ Pause simulation to generate reports")
        else:
            st.info("📊 Need more data (10+ steps) for reports")
    
    # Live Status
    st.subheader("📡 System Status")
    if st.session_state.running:
        st.markdown(
            '<div class="live-indicator">🔴 STREAMING LIVE</div>', 
            unsafe_allow_html=True
        )
        st.metric("Active Step", st.session_state.step_count)
    else:
        st.info("⏸️ PAUSED")
        st.metric("Current Step", st.session_state.step_count)
    
    # Performance metrics
    if len(st.session_state.history) > 1:
        avg_duration = np.mean([
            h.get('duration', 0) for h in st.session_state.history[-10:]
        ])
        st.metric("Avg Step Time", f"{avg_duration:.3f}s")
    
    # Network health indicator
    if st.session_state.step_count > 0:
        current_state = st.session_state.live_context_loop.get_current_state()
        network_state_check = (
            'network_state' in current_state and 
            'arcs' in current_state['network_state']
        )
        if network_state_check:
            arcs = current_state['network_state']['arcs']
            total_blocks = sum(arc.get('total_blocks', 0) for arc in arcs)
            # Estimate validity from validation failures
            total_failures = sum(arc.get('recent_validation_failures', 0) for arc in arcs)
            health = ((total_blocks - total_failures) / total_blocks * 100) if total_blocks > 0 else 100
            
            if health >= 90:
                st.success(f"🟢 Network: {health:.1f}%")
            elif health >= 80:
                st.warning(f"🟡 Network: {health:.1f}%")
        else:
            st.error(f"🔴 Network: {health:.1f}%")

# Main Dashboard Area
if st.session_state.step_count > 0:
    current_state = st.session_state.live_context_loop.get_current_state()
    
    # Enhanced metrics row with LiveContextLoop data
    col1, col2, col3, col4, col5 = st.columns(5)
    
    # Extract data from sophisticated LiveContextLoop state
    network_state = current_state.get('network_state', {})
    arcs_data = network_state.get('arcs', [])
    
    total_blocks = sum(arc['total_blocks'] for arc in arcs_data)
    fuel_alive = current_state.get('fuel_alive', 0)
    fuel_dead = current_state.get('fuel_dead', 0)
    total_events = current_state.get('total_disputes', 0)
    avg_fuel = current_state.get('fuel_avg', 0)
    
    with col1:
        st.metric("🔗 Network Blocks", total_blocks)
    with col2:
        st.metric("🤖 Agents Alive", fuel_alive)
    with col3:
        st.metric("� Agent Deaths", fuel_dead)
    with col4:
        st.metric("� Total Events", total_events)
    with col5:
        st.metric("⚡ Avg Fuel", f"{avg_fuel:.1f}")
    
    # Main content based on mode
    if st.session_state.running:
        # LIVE MODE - Full real-time dashboard
        st.markdown("### LIVE ANALYTICS DASHBOARD")
        
        # Tab structure for organized data
        tab1, tab2, tab3, tab4, tab5 = st.tabs([
            "🔗 ARC Network Status",
            "⚡ FUEL Token Economics", 
            "🤖 Agent Performance",
            "📡 Cross-ARC Events",
            "📊 Advanced Analytics"
        ])
        
        with tab1:
            # Enhanced ARC display with circular validation
            st.subheader("Multi-ARC Network with Circular Validation")
            
            # Show circular validation relationships
            validation_relationships = current_state.get('network_state', {}).get('validation_relationships', {})
            if validation_relationships:
                st.info(f"🔄 Circular Validation Active: {validation_relationships}")
            
            arc_cols = st.columns(len(arcs_data))
            
            for i, arc_data in enumerate(arcs_data):
                with arc_cols[i]:
                    validators = arc_data.get('validators', [])
                    validator_str = ", ".join(map(str, validators)) if validators else "Self"
                    
                    # Calculate real-time validation metrics
                    total_blocks = arc_data.get('total_blocks', 0)
                    disputed_blocks = arc_data.get('disputed_blocks', 0)
                    recent_failures = arc_data.get('recent_validation_failures', 0)
                    
                    # Validation success rate as percentage
                    validation_success = ((total_blocks - disputed_blocks) / max(1, total_blocks)) * 100
                    
                    # ADAM guilt and anxiety metrics
                    adam_guilt = arc_data.get('adam_guilt', 0)
                    adam_policy = arc_data.get('adam_policy', 'moderate')
                    
                    # Calculate anxiety based on policy and validation failures
                    if adam_policy == 'emergency_policy':
                        anxiety_level = min(1.0, 0.8 + recent_failures * 0.05)
                        anxiety_desc = "🔴 High Crisis"
                    elif adam_policy == 'conservative':
                        anxiety_level = min(1.0, 0.6 + recent_failures * 0.03)
                        anxiety_desc = "🟡 Cautious"
                    elif adam_policy == 'liberal':
                        anxiety_level = max(0.1, 0.3 - recent_failures * 0.02)
                        anxiety_desc = "🟢 Relaxed"
                    else:  # moderate
                        anxiety_level = 0.4 + recent_failures * 0.02
                        anxiety_desc = "🔵 Balanced"
                    
                    # Performance status based on validation success
                    if validation_success >= 95:
                        performance_status = "🟢 Excellent"
                    elif validation_success >= 80:
                        performance_status = "🟡 Good"
                    elif validation_success >= 60:
                        performance_status = "🟠 Moderate"
                    else:
                        performance_status = "🔴 Poor"
                    
                    st.markdown(f"""
                    <div class="arc-status">
                        <h4>🏛️ ARC-{arc_data['arc_id']} {performance_status}</h4>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    # Validation progress bar
                    st.markdown(f"""
                    <div style="background: linear-gradient(90deg, #4CAF50 {validation_success}%, #f44336 {100-validation_success}%); 
                                height: 8px; border-radius: 4px; margin: 8px 0;"></div>
                    """, unsafe_allow_html=True)
                    
                    # Basic metrics
                    col1, col2 = st.columns(2)
                    with col1:
                        st.write(f"**✅ Validation:** {validation_success:.1f}%")
                        st.write(f"**📦 Blocks:** {total_blocks}")
                        st.write(f"**⚖️ Rule Index:** {arc_data.get('current_rule', 0)}")
                    
                    with col2:
                        st.write(f"**🔗 Validates:** ARC-{validator_str}")
                        st.write(f"**⚠️ Recent Failures:** {recent_failures}")
                    
                    # ADAM Guilt section
                    st.write(f"**🧠 ADAM Guilt:** {adam_guilt:.3f}")
                    guilt_progress = st.progress(adam_guilt)
                    
                    # Anxiety section  
                    st.write(f"**😰 Anxiety:** {anxiety_level:.2f} ({anxiety_desc})")
                    anxiety_progress = st.progress(anxiety_level)
                    
                    # Policy and additional info
                    st.write(f"**🎯 Policy:** {adam_policy}")
                    
                    st.markdown("""
                    <div style="font-size: 0.9em; color: #666; margin-top: 8px;">
                        <p>• Validation decides ARC health</p>
                        <p>• Guilt affects ADAM decisions</p>
                        <p>• Anxiety from policy stress</p>
                    </div>
                    """, unsafe_allow_html=True)
            
            # Show validation metrics
            validation_metrics = current_state.get('network_state', {}).get('validation_metrics', {})
            if validation_metrics:
                st.subheader("🔍 Cross-ARC Validation Network")
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    st.metric("Validation Pairs", validation_metrics.get('total_validation_pairs', 0))
                with col2:
                    st.metric("Recent Failures", validation_metrics.get('recent_failures', 0))
                with col3:
                    network_stress = validation_metrics.get('network_stress', 0)
                    st.metric("Network Stress", f"{network_stress:.2%}")
            
            # Crisis indicators
            crisis_indicators = current_state.get('crisis_indicators', [])
            if crisis_indicators:
                st.warning("🚨 Active Crisis Indicators:")
                for indicator in crisis_indicators:
                    st.write(f"- {indicator}")
            
            # Constitutional era and governance
            col1, col2 = st.columns(2)
            with col1:
                st.metric("Constitutional Era", current_state.get('era', 1))
            with col2:
                st.metric("Total Violations", current_state.get('total_violations', 0))
        
        with tab2:
            # Enhanced FUEL economics with COMPREHENSIVE REAL-TIME ANALYTICS
            st.subheader("⚡ FUEL Token Economics Dashboard - LIVE DATA")
            
            # Get comprehensive FUEL data from enhanced LiveContextLoop
            fuel_mainnet = current_state.get('fuel_mainnet', {})
            fuel_subnets = current_state.get('fuel_subnets', [])
            
            # COMPREHENSIVE FUEL ANALYTICS DASHBOARD
            fuel_tab1, fuel_tab2, fuel_tab3 = st.tabs([
                "💰 Mainnet & Liquidity", 
                "🌉 Bridge Analytics",
                "📊 Economic Health"
            ])
            
            with fuel_tab1:
                # MAINNET LIQUIDITY DASHBOARD
                st.subheader("💰 Mainnet FUEL Economics")
                
                # Key mainnet metrics
                mainnet_liquidity = fuel_mainnet.get('liquidity', 10000)
                mainnet_volume = fuel_mainnet.get('volume_24h', 75000)
                bridge_fees = fuel_mainnet.get('bridge_fees', 250)
                
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("💰 Mainnet Liquidity", f"${mainnet_liquidity:,}")
                with col2:
                    st.metric("📈 24h Volume", f"${mainnet_volume:,}")
                with col3:
                    st.metric("🌉 Bridge Fees", f"${bridge_fees}")
                
                # SUBNET DISTRIBUTION ANALYSIS
                if fuel_subnets:
                    st.subheader("⚡ Subnet FUEL Distribution")
                    
                    # Create comprehensive FUEL distribution visualization with stable container
                    subnet_data = []
                    for subnet in fuel_subnets:
                        subnet_data.extend([
                            {"Subnet": f"ARC-{subnet['arc_id']}", "Type": "Liquidity", "Amount": subnet.get('liquidity', 0)},
                            {"Subnet": f"ARC-{subnet['arc_id']}", "Type": "Staked", "Amount": subnet.get('staked_fuel', 0)},
                            {"Subnet": f"ARC-{subnet['arc_id']}", "Type": "Rewards", "Amount": subnet.get('rewards_pool', 0)}
                        ])
                    
                    if subnet_data and should_update_chart("fuel_distribution", st.session_state.step_count):
                        subnet_df = pd.DataFrame(subnet_data)
                        
                        # Stable chart container
                        with st.container():
                            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                            
                            # Cached stacked bar chart for comprehensive view
                            fig_subnet_dist = create_cached_chart(
                                "bar",
                                subnet_df,
                                {
                                    'x': 'Subnet', 
                                    'y': 'Amount', 
                                    'color': 'Type',
                                    'title': "⚡ Comprehensive Subnet FUEL Analysis",
                                    'color_discrete_map': {
                                        'Liquidity': '#1f77b4',
                                        'Staked': '#ff7f0e', 
                                        'Rewards': '#2ca02c'
                                    },
                                    'height': 350
                                }
                            )
                            st.plotly_chart(fig_subnet_dist, use_container_width=True, key="fuel_dist")
                            
                            st.markdown('</div>', unsafe_allow_html=True)
                        
                        update_chart_cache("fuel_distribution", st.session_state.step_count)
                        
                        # Subnet performance table
                        subnet_summary = []
                        for subnet in fuel_subnets:
                            subnet_summary.append({
                                'ARC ID': subnet['arc_id'],
                                'Liquidity': f"{subnet.get('liquidity', 0):,} FUEL",
                                'Staked': f"{subnet.get('staked_fuel', 0):,} FUEL",
                                'Rewards Pool': f"{subnet.get('rewards_pool', 0):,} FUEL",
                                'TX Volume': f"{subnet.get('transaction_volume', 0):,}",
                                'Bridge Status': subnet.get('bridge_status', 'unknown').title()
                            })
                        
                        subnet_df_summary = pd.DataFrame(subnet_summary)
                        st.dataframe(subnet_df_summary, use_container_width=True)
                else:
                    st.info("No subnet data available - initializing FUEL subnet network...")
            
            with fuel_tab2:
                # BRIDGE ANALYTICS AND MONITORING
                st.subheader("🌉 Cross-Chain Bridge Analytics")
                
                if fuel_subnets:
                    # Bridge threshold progress monitoring
                    st.write("**Bridge Readiness Status:**")
                    
                    bridge_cols = st.columns(len(fuel_subnets))
                    for i, subnet in enumerate(fuel_subnets):
                        with bridge_cols[i]:
                            liquidity = subnet.get('liquidity', 0)
                            progress = min(1.0, liquidity / st.session_state.subnet_bridge_threshold)
                            status = subnet.get('bridge_status', 'pending')
                            
                            # Bridge status indicator
                            if status == 'active':
                                st.success(f"🟢 ARC-{subnet['arc_id']}")
                            elif progress >= 1.0:
                                st.info(f"🔵 ARC-{subnet['arc_id']}")
                            else:
                                st.warning(f"🟡 ARC-{subnet['arc_id']}")
                            
                            st.metric(f"ARC-{subnet['arc_id']} Liquidity", f"{liquidity:,} FUEL")
                            st.progress(progress)
                            
                            if liquidity >= st.session_state.subnet_bridge_threshold:
                                st.success("🌉 Bridge Ready!")
                            else:
                                remaining = st.session_state.subnet_bridge_threshold - liquidity
                                st.info(f"Need {remaining:,} more FUEL")
                    
                    # Bridge flow visualization
                    st.subheader("🔄 Bridge Flow Analysis")
                    
                    # Create bridge flow data
                    flow_data = []
                    for subnet in fuel_subnets:
                        tx_volume = subnet.get('transaction_volume', 0)
                        flow_data.append({
                            'Subnet': f"ARC-{subnet['arc_id']}",
                            'Transaction Volume': tx_volume,
                            'Bridge Status': subnet.get('bridge_status', 'pending'),
                            'Liquidity Ratio': subnet.get('liquidity', 0) / st.session_state.subnet_bridge_threshold
                        })
                    
                    if flow_data:
                        flow_df = pd.DataFrame(flow_data)
                        
                        if should_update_chart("bridge_flow", st.session_state.step_count):
                            # Stable chart container
                            with st.container():
                                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                                
                                # Cached bridge performance scatter plot
                                fig_bridge = create_cached_chart(
                                    "scatter",
                                    flow_df,
                                    {
                                        'x': 'Transaction Volume',
                                        'y': 'Liquidity Ratio',
                                        'color': 'Bridge Status',
                                        'size': 'Transaction Volume',
                                        'title': "🌉 Bridge Performance Matrix",
                                        'color_discrete_map': {'active': 'green', 'pending': 'orange', 'inactive': 'red'},
                                        'height': 350
                                    }
                                )
                                # Add bridge threshold line
                                fig_bridge.add_hline(y=1.0, line_dash="dash", line_color="red", 
                                                   annotation_text="Bridge Threshold")
                                st.plotly_chart(fig_bridge, use_container_width=True, key="bridge_flow")
                                
                                st.markdown('</div>', unsafe_allow_html=True)
                            
                            update_chart_cache("bridge_flow", st.session_state.step_count)
                else:
                    st.info("Bridge analytics will appear when subnet data is available")
            
            with fuel_tab3:
                # ECONOMIC HEALTH ANALYSIS
                st.subheader("📊 Network Economic Health")
                
                # Economic stress indicators
                economic_stress = current_state.get('economic_stress', 0)
                economic_health = current_state.get('economic_health', 1.0)
                fuel_alive = current_state.get('fuel_alive', 0)
                fuel_dead = current_state.get('fuel_dead', 0)
                
                # Health metrics
                col1, col2, col3 = st.columns(3)
                with col1:
                    if economic_health > 0.8:
                        st.success(f"🟢 Economic Health: {economic_health:.1%}")
                    elif economic_health > 0.6:
                        st.warning(f"🟡 Economic Health: {economic_health:.1%}")
                    else:
                        st.error(f"🔴 Economic Health: {economic_health:.1%}")
                
                with col2:
                    st.metric("⚡ Agents Alive", fuel_alive, delta=f"-{fuel_dead} died")
                
                with col3:
                    if economic_stress < 0.3:
                        st.success(f"🟢 Stress Level: {economic_stress:.1%}")
                    elif economic_stress < 0.6:
                        st.warning(f"🟡 Stress Level: {economic_stress:.1%}")
                    else:
                        st.error(f"🔴 Stress Level: {economic_stress:.1%}")
                
                # Economic trend analysis
                if len(st.session_state.history) > 10:
                    st.subheader("📈 Economic Trend Analysis")
                    
                    if should_update_chart("economic_trends", st.session_state.step_count):
                        # Extract economic data from history
                        econ_data = []
                        for h in st.session_state.history[-20:]:
                            econ_data.append({
                                'Step': h.get('step', 0),
                                'Economic Health': h.get('economic_health', 1.0) * 100,
                                'Economic Stress': h.get('economic_stress', 0) * 100,
                                'Agents Alive': h.get('fuel_alive', 0),
                                'Avg Fuel': h.get('fuel_avg', 0)
                            })
                        
                        econ_df = pd.DataFrame(econ_data)
                        
                        # Stable chart container
                        with st.container():
                            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                            
                            # Cached multi-metric economic dashboard
                            @st.cache_data(show_spinner=False)
                            def create_economic_dashboard(data_hash):
                                fig_econ = make_subplots(
                                    rows=2, cols=2,
                                    subplot_titles=('Economic Health %', 'Agent Population', 'Economic Stress %', 'Average Fuel'),
                                    specs=[[{"secondary_y": False}, {"secondary_y": False}],
                                           [{"secondary_y": False}, {"secondary_y": False}]]
                                )
                                
                                # Economic health trend
                                fig_econ.add_trace(
                                    go.Scatter(
                                        x=econ_df['Step'], 
                                        y=econ_df['Economic Health'],
                                        name="Health %",
                                        line=dict(color='green', width=3)
                                    ),
                                    row=1, col=1
                                )
                                
                                # Agent population
                                fig_econ.add_trace(
                                    go.Scatter(
                                        x=econ_df['Step'], 
                                        y=econ_df['Agents Alive'],
                                        name="Alive",
                                        line=dict(color='blue', width=3)
                                    ),
                                    row=1, col=2
                                )
                                
                                # Economic stress
                                fig_econ.add_trace(
                                    go.Scatter(
                                        x=econ_df['Step'], 
                                        y=econ_df['Economic Stress'],
                                        name="Stress %",
                                        line=dict(color='red', width=3)
                                    ),
                                    row=2, col=1
                                )
                                
                                # Average fuel
                                fig_econ.add_trace(
                                    go.Scatter(
                                        x=econ_df['Step'], 
                                        y=econ_df['Avg Fuel'],
                                        name="Fuel",
                                        line=dict(color='orange', width=3)
                                    ),
                                    row=2, col=2
                                )
                                
                                fig_econ.update_layout(
                                    height=500,
                                    title_text="📊 Economic Health Dashboard",
                                    showlegend=False
                                )
                                return fig_econ
                            
                            # Create cached economic dashboard
                            data_hash = hash(str(econ_df.values.tobytes()))
                            fig_econ = create_economic_dashboard(data_hash)
                            st.plotly_chart(fig_econ, use_container_width=True, key="economic_trends")
                            
                            st.markdown('</div>', unsafe_allow_html=True)
                        
                        update_chart_cache("economic_trends", st.session_state.step_count)
                        
                        # Economic insights
                        latest_health = econ_df['Economic Health'].iloc[-1]
                        health_trend = econ_df['Economic Health'].iloc[-1] - econ_df['Economic Health'].iloc[-5] if len(econ_df) >= 5 else 0
                        
                        if latest_health > 80:
                            st.success(f"🟢 Economy is thriving! Health: {latest_health:.1f}%")
                        elif latest_health > 60:
                            st.info(f"🟡 Economy is stable. Health: {latest_health:.1f}%")
                        else:
                            st.error(f"🔴 Economy needs attention! Health: {latest_health:.1f}%")
                        
                        if health_trend > 5:
                            st.info("📈 Economic health is improving!")
                        elif health_trend < -5:
                            st.warning("📉 Economic health is declining!")
                        else:
                            st.info("➡️ Economic health is stable")
                else:
                    st.info("📊 Collecting economic data... Need more simulation steps for trend analysis")
        
        with tab3:
            # Enhanced agent analytics with REAL-TIME PERFORMANCE GRAPHS
            st.subheader("🤖 Agent Performance Analytics - LIVE DATA")
            
            # Use comprehensive agent data from enhanced LiveContextLoop state
            agents_data = current_state.get('agents', [])
            
            if agents_data:
                # Real-time agent performance breakdown
                validators = [a for a in agents_data if a.get('type') == 'validator']
                forecasters = [a for a in agents_data if a.get('type') == 'forecaster']
                operators = [a for a in agents_data if a.get('type') == 'operator']
                
                # COMPREHENSIVE PERFORMANCE DASHBOARD
                performance_tab1, performance_tab2, performance_tab3 = st.tabs([
                    "📊 Live Performance Charts", 
                    "🔍 Detailed Agent Analysis",
                    "📈 Real-time Trends"
                ])
                
                with performance_tab1:
                    # REAL-TIME PERFORMANCE CHARTS with stable containers
                    if validators and should_update_chart("validators", st.session_state.step_count):
                        st.subheader("🛡️ Validator Performance - Live Charts")
                        validator_df = pd.DataFrame(validators)
                        
                        # Create stable chart container
                        with st.container():
                            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                            
                            # Cached validator earnings chart
                            fig_val_earnings = create_cached_chart(
                                "bar",
                                validator_df,
                                {
                                    'x': 'id', 
                                    'y': 'earnings', 
                                    'color': 'score',
                                    'title': "💰 Validator Earnings (Live)",
                                    'color_continuous_scale': "Viridis",
                                    'height': 350
                                }
                            )
                            st.plotly_chart(fig_val_earnings, use_container_width=True, key="val_earnings")
                            
                            st.markdown('</div>', unsafe_allow_html=True)
                        
                        # Stable correlation chart container
                        with st.container():
                            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                            
                            fig_val_corr = create_cached_chart(
                                "scatter",
                                validator_df,
                                {
                                    'x': 'fuel',
                                    'y': 'score',
                                    'size': 'earnings',
                                    'color': 'alive',
                                    'title': "🔄 Validator Performance Correlation",
                                    'color_discrete_map': {True: 'green', False: 'red'},
                                    'height': 350
                                }
                            )
                            st.plotly_chart(fig_val_corr, use_container_width=True, key="val_corr")
                            
                            st.markdown('</div>', unsafe_allow_html=True)
                        
                        update_chart_cache("validators", st.session_state.step_count)
                    
                    if forecasters and should_update_chart("forecasters", st.session_state.step_count):
                        st.subheader("🔮 Forecaster Analytics - Live Data")
                        forecaster_df = pd.DataFrame(forecasters)
                        
                        # Stable forecaster chart container
                        with st.container():
                            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                            
                            # Live forecaster accuracy vs predictions
                            fig_forecast = make_subplots(
                                rows=1, cols=2,
                                subplot_titles=('Prediction Volume', 'Accuracy Distribution'),
                                specs=[[{"type": "bar"}, {"type": "histogram"}]]
                            )
                            
                            fig_forecast.add_trace(
                                go.Bar(
                                    x=forecaster_df['id'], 
                                    y=forecaster_df['predictions'],
                                    name="Predictions",
                                    marker_color='lightblue'
                                ),
                                row=1, col=1
                            )
                            
                            fig_forecast.add_trace(
                                go.Histogram(
                                    x=forecaster_df['accuracy'],
                                    name="Accuracy",
                                    marker_color='orange'
                                ),
                                row=1, col=2
                            )
                            
                            fig_forecast.update_layout(
                                height=350, 
                                title_text="🔮 Live Forecaster Performance"
                            )
                            st.plotly_chart(fig_forecast, use_container_width=True, key="forecaster_perf")
                            
                            st.markdown('</div>', unsafe_allow_html=True)
                        
                        update_chart_cache("forecasters", st.session_state.step_count)
                    
                    if operators and should_update_chart("operators", st.session_state.step_count):
                        st.subheader("⚙️ Operator Productivity - Real-time")
                        operator_df = pd.DataFrame(operators)
                        
                        # Stable operator chart containers
                        with st.container():
                            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                            
                            # Cached operator productivity radar
                            fig_ops = create_cached_chart(
                                "line_polar",
                                operator_df,
                                {
                                    'r': 'productivity',
                                    'theta': 'id',
                                    'line_close': True,
                                    'title': "⚙️ Operator Productivity Radar (Live)",
                                    'height': 350
                                }
                            )
                            if fig_ops:
                                fig_ops.update_traces(fill='toself')
                                st.plotly_chart(fig_ops, use_container_width=True, key="ops_radar")
                            
                            st.markdown('</div>', unsafe_allow_html=True)
                        
                        with st.container():
                            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                            
                            # Jobs completion bar chart
                            fig_jobs = create_cached_chart(
                                "bar",
                                operator_df,
                                {
                                    'x': 'id',
                                    'y': 'jobs_done',
                                    'color': 'productivity',
                                    'title': "📋 Jobs Completed (Live Updates)",
                                    'color_continuous_scale': "Plasma",
                                    'height': 350
                                }
                            )
                            st.plotly_chart(fig_jobs, use_container_width=True, key="jobs_done")
                            
                            st.markdown('</div>', unsafe_allow_html=True)
                        
                        update_chart_cache("operators", st.session_state.step_count)
                
                with performance_tab2:
                    # DETAILED AGENT ANALYSIS WITH LIVE METRICS
                    st.subheader("🔍 Individual Agent Deep Dive")
                    
                    # Agent type performance summary
                    for agent_type in ['validator', 'forecaster', 'operator']:
                        type_agents = [a for a in agents_data if a.get('type') == agent_type]
                        if type_agents:
                            with st.expander(f"📊 {agent_type.title()} Detailed Analysis ({len(type_agents)} active)", expanded=False):
                                type_df = pd.DataFrame(type_agents)
                                
                                # Performance summary metrics
                                col1, col2, col3 = st.columns(3)
                                with col1:
                                    avg_score = type_df['score'].mean()
                                    st.metric(f"Avg {agent_type.title()} Score", f"{avg_score:.1f}")
                                with col2:
                                    alive_count = type_df['alive'].sum()
                                    st.metric("Active Agents", f"{alive_count}/{len(type_agents)}")
                                with col3:
                                    avg_fuel = type_df['fuel'].mean()
                                    st.metric("Avg Fuel", f"{avg_fuel:.1f}")
                                
                                # Detailed performance table
                                st.write("**Live Performance Data:**")
                                display_df = type_df.copy()
                                display_df['alive'] = display_df['alive'].map({True: '🟢 Active', False: '🔴 Inactive'})
                                st.dataframe(display_df, use_container_width=True)
                                
                                # Agent-specific performance metrics
                                if agent_type == 'validator':
                                    total_earnings = type_df['earnings'].sum()
                                    st.info(f"💰 Total Network Earnings: ${total_earnings:,}")
                                elif agent_type == 'forecaster':
                                    total_predictions = type_df['predictions'].sum()
                                    avg_accuracy = type_df['accuracy'].mean()
                                    st.info(f"🔮 Network Predictions: {total_predictions} (Avg Accuracy: {avg_accuracy:.1%})")
                                elif agent_type == 'operator':
                                    total_jobs = type_df['jobs_done'].sum()
                                    avg_productivity = type_df['productivity'].mean()
                                    st.info(f"⚙️ Network Productivity: {total_jobs} jobs ({avg_productivity:.1%} efficiency)")
                
                with performance_tab3:
                    # REAL-TIME TREND ANALYSIS
                    st.subheader("📈 Real-time Performance Trends")
                    
                    if len(st.session_state.history) > 5:
                        # Extract historical agent performance data
                        trend_data = []
                        for i, h in enumerate(st.session_state.history[-20:]):
                            step_agents = h.get('agents', [])
                            if step_agents:
                                for agent_type in ['validator', 'forecaster', 'operator']:
                                    type_agents = [a for a in step_agents if a.get('type') == agent_type]
                                    if type_agents:
                                        avg_score = np.mean([a['score'] for a in type_agents])
                                        avg_fuel = np.mean([a['fuel'] for a in type_agents])
                                        active_count = sum(a['alive'] for a in type_agents)
                                        
                                        trend_data.append({
                                            'Step': h.get('step', st.session_state.step_count - 20 + i),
                                            'Agent_Type': agent_type,
                                            'Avg_Score': avg_score,
                                            'Avg_Fuel': avg_fuel,
                                            'Active_Count': active_count
                                        })
                        
                        if trend_data:
                            trend_df = pd.DataFrame(trend_data)
                            
                            # Multi-line performance trend chart
                            fig_trends = make_subplots(
                                rows=2, cols=2,
                                subplot_titles=('Performance Scores', 'Fuel Levels', 'Active Agents', 'Score vs Fuel'),
                                specs=[[{"secondary_y": False}, {"secondary_y": False}],
                                       [{"secondary_y": False}, {"secondary_y": False}]]
                            )
                            
                            colors = {'validator': '#1f77b4', 'forecaster': '#ff7f0e', 'operator': '#2ca02c'}
                            
                            for agent_type in ['validator', 'forecaster', 'operator']:
                                type_data = trend_df[trend_df['Agent_Type'] == agent_type]
                                if not type_data.empty:
                                    # Performance scores
                                    fig_trends.add_trace(
                                        go.Scatter(
                                            x=type_data['Step'], 
                                            y=type_data['Avg_Score'],
                                            name=f"{agent_type.title()} Score",
                                            line=dict(color=colors[agent_type])
                                        ),
                                        row=1, col=1
                                    )
                                    
                                    # Fuel levels
                                    fig_trends.add_trace(
                                        go.Scatter(
                                            x=type_data['Step'], 
                                            y=type_data['Avg_Fuel'],
                                            name=f"{agent_type.title()} Fuel",
                                            line=dict(color=colors[agent_type], dash='dash')
                                        ),
                                        row=1, col=2
                                    )
                                    
                                    # Active count
                                    fig_trends.add_trace(
                                        go.Scatter(
                                            x=type_data['Step'], 
                                            y=type_data['Active_Count'],
                                            name=f"{agent_type.title()} Active",
                                            line=dict(color=colors[agent_type], dash='dot')
                                        ),
                                        row=2, col=1
                                    )
                                    
                                    # Score vs Fuel correlation
                                    fig_trends.add_trace(
                                        go.Scatter(
                                            x=type_data['Avg_Fuel'], 
                                            y=type_data['Avg_Score'],
                                            mode='markers',
                                            name=f"{agent_type.title()} Correlation",
                                            marker=dict(color=colors[agent_type], size=8)
                                        ),
                                        row=2, col=2
                                    )
                            
                            fig_trends.update_layout(
                                height=800, 
                                title_text="📈 Real-time Agent Performance Trends",
                                showlegend=True
                            )
                            st.plotly_chart(fig_trends, use_container_width=True)
                            
                            # Performance insights
                            latest_data = trend_df[trend_df['Step'] == trend_df['Step'].max()]
                            if not latest_data.empty:
                                st.subheader("🧠 Performance Insights")
                                for agent_type in ['validator', 'forecaster', 'operator']:
                                    type_latest = latest_data[latest_data['Agent_Type'] == agent_type]
                                    if not type_latest.empty:
                                        score = type_latest['Avg_Score'].iloc[0]
                                        fuel = type_latest['Avg_Fuel'].iloc[0]
                                        active = type_latest['Active_Count'].iloc[0]
                                        
                                        if score > 80:
                                            st.success(f"🟢 {agent_type.title()}s performing excellently (Score: {score:.1f})")
                                        elif score > 60:
                                            st.info(f"🟡 {agent_type.title()}s performing adequately (Score: {score:.1f})")
                                        else:
                                            st.warning(f"🔴 {agent_type.title()}s need attention (Score: {score:.1f})")
                    else:
                        st.info("📊 Collecting trend data... Need more simulation steps for trend analysis")
            else:
                st.warning("🚨 No detailed agent data available! The LiveContextLoop may need to be restarted.")
                st.info("💡 Try clicking 'Reset Network' to restore comprehensive agent tracking.")
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.markdown("#### ⚖️ Validators")
                if agents_data and validators:
                    val_df = pd.DataFrame(validators)
                    # Add arc assignment based on agent ID
                    val_df['arc'] = val_df['id'] % len(current_state.get('network_state', {}).get('arcs', [1]))
                    
                    fig = px.bar(val_df, x='id', y='earnings', 
                               color='score', title="Validator Earnings")
                    st.plotly_chart(fig, use_container_width=True)
                elif agents_data:
                    st.info("No validator data available")
                else:
                    # Show basic agent info from FUEL simulation
                    st.info("📊 Using FUEL Agent Data")
                    st.metric("🤖 Agents Alive", current_state.get('fuel_alive', 0))
                    
            with col2:
                st.markdown("#### 🔮 Forecasters")
                if agents_data and forecasters:
                    fore_df = pd.DataFrame(forecasters)
                    # Add arc assignment based on agent ID
                    fore_df['arc'] = fore_df['id'] % len(current_state.get('network_state', {}).get('arcs', [1]))
                    
                    fig = px.scatter(fore_df, x='id', y='score', size='accuracy',
                                   color='arc', title="Forecaster Accuracy (Real-time)")
                    st.plotly_chart(fig, use_container_width=True)
                    
                    # Most accurate
                    top_forecaster = max(forecasters, key=lambda x: x['score'])
                    st.success(f"🎯 Best: Agent-{top_forecaster['id']} ({top_forecaster['score']:.1f}% accuracy)")
                elif agents_data:
                    st.info("No forecaster data available")
                else:
                    st.metric("💀 Agent Deaths", current_state.get('fuel_dead', 0))
            
            with col3:
                st.markdown("#### ⚙️ Operators")
                if agents_data and operators:
                    op_df = pd.DataFrame(operators)
                    # Add arc assignment based on agent ID
                    op_df['arc'] = op_df['id'] % len(current_state.get('network_state', {}).get('arcs', [1]))
                    
                    fig = px.bar(op_df, x='id', y='jobs_done',
                               color='productivity', title="Operator Productivity")
                    st.plotly_chart(fig, use_container_width=True)
                    
                    # Most productive
                    top_operator = max(operators, key=lambda x: x['jobs_done'])
                    st.success(f"🔧 Best: Agent-{top_operator['id']} ({top_operator['jobs_done']} jobs)")
                elif agents_data:
                    st.info("No operator data available")
                else:
                    st.info("📊 Economic Health")
                    st.metric("Economic Stress", f"{current_state.get('economic_stress', 0):.1%}")
        
        with tab4:
            # Enhanced event monitoring
            st.subheader("📡 Cross-ARC Event Monitor")
            
            # Safe access to events data
            events = current_state.get('messages', {}).get('events', [])
            if not events:
                events = current_state.get('governance_events', [])
            
            if events:
                # Event timeline
                event_data = []
                for i, event in enumerate(events[-10:]):  # Last 10 events
                    event_data.append({
                        'Event_ID': i,
                        'Type': event.get('type', 'Unknown'),
                        'Details': str(event)[:50] + "...",
                        'Timestamp': time.time() - (len(events) - i)
                    })
                
                event_df = pd.DataFrame(event_data)
                
                # Event type distribution
                event_counts = event_df['Type'].value_counts()
                fig = px.pie(values=event_counts.values, names=event_counts.index,
                           title="Event Type Distribution")
                st.plotly_chart(fig, use_container_width=True)
                
                # Recent events list
                st.markdown("#### 🚨 Recent Events")
                for event in events[-5:]:
                    event_type = event.get('type', 'Unknown')
                    if event_type == 'block_challenge':
                        st.warning(f"⚔️ Challenge: ARC-{event.get('from_arc')} → ARC-{event.get('target_arc')}")
                    elif event_type == 'fuel_bridge_complete':
                        st.success(f"🌉 Bridge: ARC-{event.get('arc')} +{event.get('amount'):,} FUEL")
                    else:
                        st.info(f"📨 {event_type}: {str(event)[:80]}...")
            else:
                st.info("🔲 No active cross-ARC events")
        
        with tab5:
            # Advanced analytics and insights
            st.subheader("📊 Advanced Network Analytics")
            
            if len(st.session_state.history) > 10:
                # Network health trends
                health_data = []
                for h in st.session_state.history[-history_window:]:
                    # Get ARCs from network_state, with safe fallback
                    arcs = h.get('network_state', {}).get('arcs', [])
                    total_b = sum(arc.get('total_blocks', 0) for arc in arcs)
                    # Calculate health based on disputed vs total blocks
                    disputed_b = sum(arc.get('disputed_blocks', 0) for arc in arcs)
                    valid_b = max(0, total_b - disputed_b)
                    
                    # Safe access to events
                    events_count = 0
                    if 'messages' in h and 'events' in h['messages']:
                        events_count = len(h['messages']['events'])
                    elif 'system_events' in h:
                        events_count = len(h['system_events'])
                    
                    health_data.append({
                        'Step': h['step'],
                        'Health': (valid_b / total_b * 100) if total_b > 0 else 100,
                        'Blocks': total_b,
                        'Events': events_count
                    })
                
                health_df = pd.DataFrame(health_data)
                
                # Multi-metric dashboard
                fig = make_subplots(
                    rows=2, cols=2,
                    subplot_titles=('Network Health %', 'Block Growth', 'Event Activity', 'Health vs Events'),
                    specs=[[{"secondary_y": False}, {"secondary_y": False}],
                           [{"secondary_y": False}, {"secondary_y": False}]]
                )
                
                # Health trend
                fig.add_trace(
                    go.Scatter(x=health_df['Step'], y=health_df['Health'], name="Health %"),
                    row=1, col=1
                )
                
                # Block growth
                fig.add_trace(
                    go.Scatter(x=health_df['Step'], y=health_df['Blocks'], name="Total Blocks"),
                    row=1, col=2
                )
                
                # Event activity
                fig.add_trace(
                    go.Scatter(x=health_df['Step'], y=health_df['Events'], name="Events"),
                    row=2, col=1
                )
                
                # Health vs Events correlation
                fig.add_trace(
                    go.Scatter(x=health_df['Events'], y=health_df['Health'], 
                             mode='markers', name="Health vs Events"),
                    row=2, col=2
                )
                
                fig.update_layout(height=600, title_text="Advanced Network Analytics")
                st.plotly_chart(fig, use_container_width=True)
                
                # Key insights
                st.markdown("#### 🧠 AI Insights")
                avg_health = health_df['Health'].mean()
                health_trend = health_df['Health'].diff().mean()
                
                if avg_health >= 95:
                    st.success(f"🟢 Excellent network health: {avg_health:.1f}% average")
                elif avg_health >= 85:
                    st.warning(f"🟡 Good network health: {avg_health:.1f}% average")
                else:
                    st.error(f"🔴 Network under stress: {avg_health:.1f}% average")
                
                if health_trend > 0:
                    st.info("📈 Network health is improving")
                elif health_trend < -0.5:
                    st.warning("📉 Network health is declining")
                else:
                    st.info("➡️ Network health is stable")
    
    else:
        # PAUSED MODE - Full detailed analysis for research
        st.markdown("""
        <div class="paused-mode">
            <h3>⏸️ RESEARCH MODE - DETAILED ANALYSIS</h3>
            <p>Stream paused for detailed analysis. All data remains accessible for research.</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Full detailed view when paused (for research)
        research_tab1, research_tab2, research_tab3 = st.tabs([
            "🔬 Detailed Network State",
            "📋 Complete Agent Analysis", 
            "🧪 Research Data Export"
        ])
        
        with research_tab1:
            st.subheader("🔬 Complete Network State Analysis")
            
            # Detailed ARC analysis
            if 'network_state' in current_state and 'arcs' in current_state['network_state']:
                arcs_data = current_state['network_state']['arcs']
                for arc_state in arcs_data:
                    arc_id = arc_state.get('arc_id', 'Unknown')
                    with st.expander(f"📊 ARC-{arc_id} Complete Analysis", expanded=True):
                        col1, col2 = st.columns(2)
                        
                        with col1:
                            st.write("**Network Metrics:**")
                            st.json({
                                "arc_id": arc_id,
                                "total_blocks": arc_state.get('total_blocks', 0),
                                "validators": arc_state.get('validators', []),
                                "validator_count": arc_state.get('validator_count', 0),
                                "recent_validation_failures": arc_state.get('recent_validation_failures', 0),
                                "adam_guilt": arc_state.get('adam_guilt', 0),
                                "adam_policy": arc_state.get('adam_policy', 'unknown')
                            })
                        
                        with col2:
                            st.write("**Validation Status:**")
                            validation_success_rate = 1.0
                            if arc_state.get('total_blocks', 0) > 0:
                                failures = arc_state.get('recent_validation_failures', 0)
                                total = arc_state.get('total_blocks', 1)
                                validation_success_rate = max(0, (total - failures) / total)
                            
                            st.metric("Validation Success Rate", f"{validation_success_rate:.1%}")
                            st.metric("ADAM Guilt Level", f"{arc_state.get('adam_guilt', 0):.2f}")
                            st.metric("Governance Policy", arc_state.get('adam_policy', 'unknown'))
            else:
                st.info("Detailed ARC analysis not available - using basic LiveContextLoop data")
        
        with research_tab2:
            st.subheader("📋 Complete Agent Performance Analysis")
            
            # Enhanced agent performance visualization
            if 'agents' in current_state and current_state['agents']:
                all_agents_df = pd.DataFrame(current_state['agents'])
                
                # Agent performance overview charts
                st.markdown("### 📊 Agent Performance Visualizations")
                
                col1, col2 = st.columns(2)
                
                with col1:
                    # Agent type distribution
                    type_counts = all_agents_df['type'].value_counts()
                    fig_types = px.pie(
                        values=type_counts.values,
                        names=type_counts.index,
                        title="🎯 Agent Type Distribution",
                        color_discrete_sequence=px.colors.qualitative.Set3
                    )
                    st.plotly_chart(fig_types, use_container_width=True)
                
                with col2:
                    # Agent performance correlation
                    if 'score' in all_agents_df.columns and 'earnings' in all_agents_df.columns:
                        fig_corr = px.scatter(
                            all_agents_df,
                            x='score',
                            y='earnings',
                            color='type',
                            size='fuel' if 'fuel' in all_agents_df.columns else None,
                            title="💰 Performance vs Earnings Correlation",
                            hover_data=['id', 'alive', 'arc'] if 'arc' in all_agents_df.columns else ['id', 'alive']
                        )
                        st.plotly_chart(fig_corr, use_container_width=True)
                
                # Detailed agent analysis by type
                for agent_type in ['validator', 'forecaster', 'operator']:
                    type_agents = all_agents_df[all_agents_df['type'] == agent_type]
                    if not type_agents.empty:
                        st.markdown(f"### 🔍 {agent_type.title()} Deep Analysis")
                        
                        # Performance metrics
                        col1, col2, col3, col4 = st.columns(4)
                        
                        with col1:
                            if agent_type == 'validator':
                                st.metric("Total Earnings", f"${type_agents['earnings'].sum():.2f}")
                            elif agent_type == 'forecaster':
                                st.metric("Total Predictions", int(type_agents['score'].sum()))
                            elif agent_type == 'operator':
                                st.metric("Total Jobs", int(type_agents['jobs_done'].sum()))
                        
                        with col2:
                            if agent_type == 'validator':
                                st.metric("Avg Earnings", f"${type_agents['earnings'].mean():.2f}")
                            elif agent_type == 'forecaster':
                                st.metric("Avg Accuracy", f"{type_agents['score'].mean():.2f}")
                            elif agent_type == 'operator':
                                st.metric("Avg Productivity", f"{type_agents['jobs_done'].mean():.2f}")
                        
                        with col3:
                            alive_count = type_agents['alive'].sum() if 'alive' in type_agents.columns else len(type_agents)
                            st.metric("Active Agents", alive_count)
                        
                        with col4:
                            if 'fuel' in type_agents.columns:
                                st.metric("Avg FUEL", f"{type_agents['fuel'].mean():.1f}")
                        
                        # Performance distribution chart
                        if agent_type == 'validator' and 'earnings' in type_agents.columns:
                            fig_dist = px.histogram(
                                type_agents,
                                x='earnings',
                                title=f"💰 {agent_type.title()} Earnings Distribution",
                                nbins=20
                            )
                            st.plotly_chart(fig_dist, use_container_width=True)
                        
                        elif agent_type == 'forecaster' and 'score' in type_agents.columns:
                            fig_dist = px.histogram(
                                type_agents,
                                x='score',
                                title=f"🎯 {agent_type.title()} Accuracy Distribution",
                                nbins=20
                            )
                            st.plotly_chart(fig_dist, use_container_width=True)
                        
                        elif agent_type == 'operator' and 'jobs_done' in type_agents.columns:
                            fig_dist = px.histogram(
                                type_agents,
                                x='jobs_done',
                                title=f"⚙️ {agent_type.title()} Productivity Distribution",
                                nbins=20
                            )
                            st.plotly_chart(fig_dist, use_container_width=True)
                        
                        # Detailed data table
                        with st.expander(f"📄 {agent_type.title()} Detailed Data"):
                            st.dataframe(type_agents, use_container_width=True)
                            
            else:
                st.info("Agent performance data not available - LiveContextLoop uses different agent structure")
                
                # Alternative visualization for LiveContextLoop data
                st.markdown("### 📊 Available System Metrics")
                
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    fuel_alive = current_state.get('fuel_alive', 0)
                    st.metric("FUEL Agents Alive", fuel_alive)
                
                with col2:
                    economic_health = current_state.get('economic_health', 0)
                    st.metric("Economic Health", f"{economic_health:.1%}")
                
                with col3:
                    system_complexity = current_state.get('system_complexity', 0)
                    st.metric("System Complexity", system_complexity)
                
                # Historical trend for available data
                if len(st.session_state.history) > 5:
                    hist_data = []
                    for i, h in enumerate(st.session_state.history[-20:]):
                        hist_data.append({
                            'Step': i,
                            'FUEL_Alive': h.get('fuel_alive', 0),
                            'Economic_Health': h.get('economic_health', 0) * 100,
                            'System_Complexity': h.get('system_complexity', 0)
                        })
                    
                    hist_df = pd.DataFrame(hist_data)
                    
                    fig_trends = make_subplots(
                        rows=1, cols=3,
                        subplot_titles=('FUEL Agents Alive', 'Economic Health %', 'System Complexity')
                    )
                    
                    fig_trends.add_trace(
                        go.Scatter(x=hist_df['Step'], y=hist_df['FUEL_Alive'],
                                  name="FUEL Alive", line=dict(color='blue')),
                        row=1, col=1
                    )
                    
                    fig_trends.add_trace(
                        go.Scatter(x=hist_df['Step'], y=hist_df['Economic_Health'],
                                  name="Economic Health", line=dict(color='green')),
                        row=1, col=2
                    )
                    
                    fig_trends.add_trace(
                        go.Scatter(x=hist_df['Step'], y=hist_df['System_Complexity'],
                                  name="System Complexity", line=dict(color='red')),
                        row=1, col=3
                    )
                    
                    fig_trends.update_layout(height=400, title_text="📈 System Metrics Trends")
                    st.plotly_chart(fig_trends, use_container_width=True)
        
        with research_tab3:
            st.subheader("🧪 Research Data Export & Analysis")
            
            # Enhanced research data analysis
            st.markdown("### 📊 Research Data Visualizations")
            
            if len(st.session_state.history) > 10:
                # Research data extraction and visualization
                research_data = []
                for i, h in enumerate(st.session_state.history):
                    research_data.append({
                        'Step': i,
                        'Economic_Health': h.get('economic_health', 1.0) * 100,
                        'Constitutional_Stability': h.get('constitutional_stability', 0.9) * 100,
                        'Integration_Health': h.get('integration_health', 1.0) * 100,
                        'FUEL_Alive': h.get('fuel_alive', 0),
                        'Total_Violations': h.get('total_violations', 0),
                        'System_Complexity': h.get('system_complexity', 0)
                    })
                
                research_df = pd.DataFrame(research_data)
                
                # Comprehensive research analysis charts
                fig_research = make_subplots(
                    rows=2, cols=2,
                    subplot_titles=('System Health Metrics', 'Stability Trends',
                                  'Complexity vs Health', 'Violations Over Time'),
                    specs=[[{"secondary_y": False}, {"secondary_y": False}],
                           [{"type": "scatter"}, {"type": "bar"}]]
                )
                
                # Health metrics
                fig_research.add_trace(
                    go.Scatter(x=research_df['Step'], y=research_df['Economic_Health'],
                              name="Economic Health", line=dict(color='green', width=2)),
                    row=1, col=1
                )
                fig_research.add_trace(
                    go.Scatter(x=research_df['Step'], y=research_df['Constitutional_Stability'],
                              name="Constitutional Stability", line=dict(color='blue', width=2)),
                    row=1, col=1
                )
                fig_research.add_trace(
                    go.Scatter(x=research_df['Step'], y=research_df['Integration_Health'],
                              name="Integration Health", line=dict(color='purple', width=2)),
                    row=1, col=1
                )
                
                # Stability trends
                fig_research.add_trace(
                    go.Scatter(x=research_df['Step'], y=research_df['FUEL_Alive'],
                              name="FUEL Agents", line=dict(color='orange', width=2)),
                    row=1, col=2
                )
                
                # Complexity vs Health scatter
                fig_research.add_trace(
                    go.Scatter(x=research_df['System_Complexity'], y=research_df['Economic_Health'],
                              mode='markers', name="Complexity-Health",
                              marker=dict(size=8, color=research_df['Step'], colorscale='Viridis')),
                    row=2, col=1
                )
                
                # Violations bar chart
                fig_research.add_trace(
                    go.Bar(x=research_df['Step'], y=research_df['Total_Violations'],
                          name="Violations", marker_color='red'),
                    row=2, col=2
                )
                
                fig_research.update_layout(height=700, title_text="🧪 Comprehensive Research Analysis")
                st.plotly_chart(fig_research, use_container_width=True)
                
                # Statistical analysis
                st.markdown("### 📈 Statistical Research Summary")
                
                col1, col2 = st.columns(2)
                
                with col1:
                    st.dataframe(research_df.describe(), use_container_width=True)
                
                with col2:
                    # Correlation matrix
                    corr_matrix = research_df[['Economic_Health', 'Constitutional_Stability', 
                                             'Integration_Health', 'System_Complexity']].corr()
                    
                    fig_corr = px.imshow(
                        corr_matrix.values,
                        labels=dict(x="Metrics", y="Metrics", color="Correlation"),
                        x=corr_matrix.columns,
                        y=corr_matrix.index,
                        color_continuous_scale='RdBu',
                        title="🔗 Research Metrics Correlation"
                    )
                    st.plotly_chart(fig_corr, use_container_width=True)
            
            # Downloadable research data
            if st.button("📊 Generate Research Report"):
                research_data = {
                    "simulation_step": st.session_state.step_count,
                    "network_state": current_state,
                    "history_summary": {
                        "total_steps": len(st.session_state.history),
                        "avg_health": np.mean([
                            h.get('constitutional_stability', 0.9) * 100
                            for h in st.session_state.history[-20:] if isinstance(h, dict)
                        ]) if st.session_state.history else 0
                    }
                }
                
                st.json(research_data)
                st.download_button(
                    "💾 Download Research Data (JSON)",
                    data=pd.Series(research_data).to_json(),
                    file_name=f"arc_simulation_research_step_{st.session_state.step_count}.json",
                    mime="application/json"
                )

else:
    # Initial state
    st.info("🚀 Professional Multi-ARC Analytics Stream Ready")
    st.markdown("### 🎯 Features:")
    st.markdown("""
    - **🔴 Live Streaming**: Real-time network monitoring with professional analytics
    - **⏸️ Research Mode**: Detailed analysis when paused - perfect for studying network behavior
    - **⚡ FUEL Token Economics**: Proper subnet token tracking with bridge thresholds
    - **📊 Advanced Analytics**: Multi-dimensional performance tracking and AI insights
    - **🎛️ Professional Controls**: Fine-tuned parameters for research and analysis
    - **💾 Data Export**: Download research data for external analysis
    """)
    
    st.markdown("Click **▶️ Start** in the sidebar to begin the professional simulation stream.")

# Live streaming execution with LiveContextLoop
if st.session_state.running:
    start_time = time.time()
    
    # Run sophisticated LiveContextLoop simulation step
    st.session_state.live_context_loop.step()
    st.session_state.step_count += 1
    
    # Record performance
    step_duration = time.time() - start_time
    
    # Get comprehensive state from LiveContextLoop
    state = st.session_state.live_context_loop.get_current_state()
    st.session_state.history.append({
        'step': st.session_state.step_count,
        'timestamp': time.time(),
        'duration': step_duration,
        **state
    })
    
    # Limit history size for performance
    if len(st.session_state.history) > 200:
        st.session_state.history = st.session_state.history[-100:]

# Handle Report Generation
if hasattr(st.session_state, 'generate_report') and st.session_state.generate_report:
    st.session_state.generate_report = False
    report_type = getattr(st.session_state, 'report_type', 'Comprehensive Analysis')
    
    with st.expander("📊 Generated Report", expanded=True):
        generate_comprehensive_report(st.session_state.history, current_state, report_type)
    
    st.stop()  # Stop execution to show report

if st.session_state.running:
    # Auto-refresh
    time.sleep(stream_speed)
    st.rerun()
else:
    st.info("⏸️ Simulation paused. Use controls in sidebar to continue or generate reports.")
