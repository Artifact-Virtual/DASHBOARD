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
    page_title="AV Multi-ARC Professional Stream",
    page_icon="🔴",
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
    }
    .live-indicator {
        animation: pulse 2s infinite;
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

# Initialize session state with enhanced LiveContextLoop tracking
if 'live_context_loop' not in st.session_state:
    # Create sophisticated multi-ARC network with circular validation
    fuel_sim = FuelSimulator(n_agents=8)
    st.session_state.live_context_loop = LiveContextLoop(
        ArcSimulator, AdamAgent, fuel_sim, initial_arc_count=3
    )
    st.session_state.step_count = 0
    st.session_state.running = False
    st.session_state.history = []
    st.session_state.subnet_bridge_threshold = 500  # FUEL tokens to bridge
    st.session_state.analytics_data = {
        'block_creation_rate': [],
        'agent_performance': [],
        'fuel_flows': [],
        'network_health': [],
        'validation_network': [],
        'circular_validation_events': []
    }

# Professional Header
st.markdown("""
<div class="main-header">
    <h1>🔴 ARTIFACT VIRTUAL MULTI-ARC PROFESSIONAL ANALYTICS STREAM</h1>
    <p>Real-time blockchain simulation with advanced analytics and FUEL token economics</p>
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
    
    # Analytics Settings
    st.subheader("📊 Analytics Settings")
    history_window = st.slider("History Window (steps)", 10, 100, 50, 5)
    show_predictions = st.checkbox("Show Forecaster Predictions", True)
    show_disputes = st.checkbox("Show Block Disputes", True)
    
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
        st.markdown("### 🔴 LIVE ANALYTICS DASHBOARD")
        
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
            st.subheader("🏗️ Advanced Multi-ARC Network with Circular Validation")
            
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
                    
                    # Create comprehensive FUEL distribution visualization
                    subnet_data = []
                    for subnet in fuel_subnets:
                        subnet_data.extend([
                            {"Subnet": f"ARC-{subnet['arc_id']}", "Type": "Liquidity", "Amount": subnet.get('liquidity', 0)},
                            {"Subnet": f"ARC-{subnet['arc_id']}", "Type": "Staked", "Amount": subnet.get('staked_fuel', 0)},
                            {"Subnet": f"ARC-{subnet['arc_id']}", "Type": "Rewards", "Amount": subnet.get('rewards_pool', 0)}
                        ])
                    
                    if subnet_data:
                        subnet_df = pd.DataFrame(subnet_data)
                        
                        # Stacked bar chart for comprehensive view
                        fig_subnet_dist = px.bar(
                            subnet_df, 
                            x='Subnet', 
                            y='Amount', 
                            color='Type',
                            title="⚡ Comprehensive Subnet FUEL Analysis",
                            color_discrete_map={
                                'Liquidity': '#1f77b4',
                                'Staked': '#ff7f0e', 
                                'Rewards': '#2ca02c'
                            }
                        )
                        fig_subnet_dist.update_layout(height=400)
                        st.plotly_chart(fig_subnet_dist, use_container_width=True)
                        
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
                        
                        # Bridge performance scatter plot
                        fig_bridge = px.scatter(
                            flow_df,
                            x='Transaction Volume',
                            y='Liquidity Ratio',
                            color='Bridge Status',
                            size='Transaction Volume',
                            title="🌉 Bridge Performance Matrix",
                            color_discrete_map={'active': 'green', 'pending': 'orange', 'inactive': 'red'}
                        )
                        fig_bridge.add_hline(y=1.0, line_dash="dash", line_color="red", 
                                           annotation_text="Bridge Threshold")
                        st.plotly_chart(fig_bridge, use_container_width=True)
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
                    
                    # Multi-metric economic dashboard
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
                            line=dict(color='red', width=3),
                            fill='tonexty'
                        ),
                        row=2, col=1
                    )
                    
                    # Average fuel
                    fig_econ.add_trace(
                        go.Scatter(
                            x=econ_df['Step'], 
                            y=econ_df['Avg Fuel'],
                            name="Avg Fuel",
                            line=dict(color='orange', width=3)
                        ),
                        row=2, col=2
                    )
                    
                    fig_econ.update_layout(
                        height=600, 
                        title_text="📊 Comprehensive Economic Analysis",
                        showlegend=False
                    )
                    st.plotly_chart(fig_econ, use_container_width=True)
                    
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
                    # REAL-TIME PERFORMANCE CHARTS
                    if validators:
                        st.subheader("🛡️ Validator Performance - Live Charts")
                        validator_df = pd.DataFrame(validators)
                        
                        # Live validator earnings chart
                        fig_val_earnings = px.bar(
                            validator_df, 
                            x='id', 
                            y='earnings', 
                            color='score',
                            title="💰 Validator Earnings (Live)",
                            color_continuous_scale="Viridis"
                        )
                        fig_val_earnings.update_layout(height=400)
                        st.plotly_chart(fig_val_earnings, use_container_width=True)
                        
                        # Validator performance vs fuel correlation
                        fig_val_corr = px.scatter(
                            validator_df,
                            x='fuel',
                            y='score',
                            size='earnings',
                            color='alive',
                            title="🔄 Validator Performance Correlation",
                            color_discrete_map={True: 'green', False: 'red'}
                        )
                        st.plotly_chart(fig_val_corr, use_container_width=True)
                    
                    if forecasters:
                        st.subheader("🔮 Forecaster Analytics - Live Data")
                        forecaster_df = pd.DataFrame(forecasters)
                        
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
                        
                        fig_forecast.update_layout(height=400, title_text="🔮 Live Forecaster Performance")
                        st.plotly_chart(fig_forecast, use_container_width=True)
                    
                    if operators:
                        st.subheader("⚙️ Operator Productivity - Real-time")
                        operator_df = pd.DataFrame(operators)
                        
                        # Live operator productivity chart
                        fig_ops = px.line_polar(
                            operator_df,
                            r='productivity',
                            theta='id',
                            line_close=True,
                            title="⚙️ Operator Productivity Radar (Live)"
                        )
                        fig_ops.update_traces(fill='toself')
                        st.plotly_chart(fig_ops, use_container_width=True)
                        
                        # Jobs completion bar chart
                        fig_jobs = px.bar(
                            operator_df,
                            x='id',
                            y='jobs_done',
                            color='productivity',
                            title="📋 Jobs Completed (Live Updates)",
                            color_continuous_scale="Plasma"
                        )
                        st.plotly_chart(fig_jobs, use_container_width=True)
                
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
            
            # Check if agent data is available
            if 'agents' in current_state and current_state['agents']:
                # Detailed agent breakdowns
                all_agents_df = pd.DataFrame(current_state['agents'])
                
                # Performance by type
                for agent_type in ['validator', 'forecaster', 'operator']:
                    type_agents = all_agents_df[all_agents_df['type'] == agent_type]
                    if not type_agents.empty:
                        st.write(f"**{agent_type.title()} Detailed Analysis:**")
                        st.dataframe(type_agents, use_container_width=True)
                        
                        # Performance statistics
                    if agent_type == 'validator':
                        st.metric("Total Earnings", f"${type_agents['earnings'].sum()}")
                        st.metric("Average Earnings", f"${type_agents['earnings'].mean():.2f}")
                    elif agent_type == 'forecaster':
                        st.metric("Total Predictions", type_agents['score'].sum())
                        st.metric("Average Accuracy", f"{type_agents['score'].mean():.2f}")
                    elif agent_type == 'operator':
                        st.metric("Total Jobs", type_agents['jobs_done'].sum())
                        st.metric("Average Productivity", f"{type_agents['jobs_done'].mean():.2f}")
            else:
                st.info("Agent performance data not available - LiveContextLoop uses different agent structure")
                st.write("**Available Data:**")
                st.write(f"- FUEL Agents Alive: {current_state.get('fuel_alive', 'N/A')}")
                st.write(f"- Economic Health: {current_state.get('economic_health', 'N/A')}")
                st.write(f"- System Complexity: {current_state.get('system_complexity', 'N/A')}")
        
        with research_tab3:
            st.subheader("🧪 Research Data Export")
            
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
    
    # Auto-refresh
    time.sleep(stream_speed)
    st.rerun()
