import streamlit as st
import sys
sys.path.append('.')

from shared.context import LiveContextLoop
from fuel_simulation.fuel_sim import FuelSimulator
from arc_simulation.arc_sim import ArcSimulator
from adam_simulation.adam_sim import AdamAgent
import time
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np

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
    st.session_state.live_context_loop = LiveContextLoop(ArcSimulator, AdamAgent, fuel_sim, initial_arc_count=3)
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
        st.session_state.live_context_loop = LiveContextLoop(ArcSimulator, AdamAgent, fuel_sim, initial_arc_count=3)
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
    bridge_threshold = st.slider("Subnet Bridge Threshold (FUEL)", 100, 1000, 500, 50)
    st.session_state.subnet_bridge_threshold = bridge_threshold
    
    # Analytics Settings
    st.subheader("📊 Analytics Settings")
    history_window = st.slider("History Window (steps)", 10, 100, 50, 5)
    show_predictions = st.checkbox("Show Forecaster Predictions", True)
    show_disputes = st.checkbox("Show Block Disputes", True)
    
    # Live Status
    st.subheader("📡 System Status")
    if st.session_state.running:
        st.markdown('<div class="live-indicator">🔴 STREAMING LIVE</div>', unsafe_allow_html=True)
        st.metric("Active Step", st.session_state.step_count)
    else:
        st.info("⏸️ PAUSED")
        st.metric("Current Step", st.session_state.step_count)
    
    # Performance metrics
    if len(st.session_state.history) > 1:
        avg_duration = np.mean([h.get('duration', 0) for h in st.session_state.history[-10:]])
        st.metric("Avg Step Time", f"{avg_duration:.3f}s")
    
    # Network health indicator
    if st.session_state.step_count > 0:
        current_state = st.session_state.live_context_loop.get_current_state()
        if 'network_state' in current_state and 'arcs' in current_state['network_state']:
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
                    
                    st.markdown(f"""
                    <div class="arc-status">
                        <h4>ARC-{arc_data['arc_id']}</h4>
                        <p><strong>Blocks:</strong> {arc_data['total_blocks']}</p>
                        <p><strong>Rule:</strong> {arc_data.get('current_rule', 'N/A')}</p>
                        <p><strong>Validates:</strong> {validator_str}</p>
                        <p><strong>ADAM Guilt:</strong> {arc_data.get('adam_guilt', 0):.2f}</p>
                        <p><strong>Policy:</strong> {arc_data.get('adam_policy', 'N/A')}</p>
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
            # Enhanced FUEL economics
            st.subheader("⚡ FUEL Token Economics Dashboard")
            
            # FUEL distribution chart - using available data from LiveContextLoop
            fuel_data = []
            
            # Check if fuel mainnet data exists, otherwise use basic metrics
            fuel_mainnet_liquidity = current_state.get('fuel_mainnet', {}).get('liquidity', 10000)  # Default fallback
            fuel_data.append({"Location": "Mainnet", "Amount": fuel_mainnet_liquidity, "Type": "USD"})
            
            # Check if fuel subnets exist, otherwise skip or create mock data
            fuel_subnets = current_state.get('fuel_subnets', [])
            if not fuel_subnets:
                # Create basic subnet data from available ARC info
                for arc_data in arcs_data:
                    fuel_data.append({
                        "Location": f"ARC-{arc_data['arc_id']} Subnet",
                        "Amount": arc_data.get('total_blocks', 0) * 100,  # Estimate based on blocks
                        "Type": "FUEL Tokens"
                    })
            else:
                for subnet in fuel_subnets:
                    fuel_data.append({
                        "Location": f"ARC-{subnet['arc_id']} Subnet",
                        "Amount": subnet['liquidity'],
                        "Type": "FUEL Tokens"
                    })
            
            fuel_df = pd.DataFrame(fuel_data)
            
            # Separate charts for USD and FUEL tokens
            col1, col2 = st.columns(2)
            
            with col1:
                mainnet_df = fuel_df[fuel_df['Type'] == 'USD']
                if not mainnet_df.empty:
                    fig_mainnet = px.pie(mainnet_df, values='Amount', names='Location',
                                       title="💰 Mainnet USD Liquidity")
                    st.plotly_chart(fig_mainnet, use_container_width=True)
            
            with col2:
                subnet_df = fuel_df[fuel_df['Type'] == 'FUEL Tokens']
                if not subnet_df.empty:
                    fig_subnet = px.bar(subnet_df, x='Location', y='Amount',
                                      title="⚡ Subnet FUEL Token Balances")
                    st.plotly_chart(fig_subnet, use_container_width=True)
            
            # Bridge threshold monitoring
            st.subheader("🌉 Bridge Monitoring")
            
            # Use the safely extracted fuel_subnets
            if fuel_subnets:
                bridge_cols = st.columns(len(fuel_subnets))
                
                for i, subnet in enumerate(fuel_subnets):
                    with bridge_cols[i]:
                        progress = subnet['liquidity'] / st.session_state.subnet_bridge_threshold
                        st.metric(f"ARC-{subnet['arc_id']}", f"{subnet['liquidity']} FUEL")
                        st.progress(min(progress, 1.0))
                        
                        if subnet['liquidity'] >= st.session_state.subnet_bridge_threshold:
                            st.success("🌉 Ready to Bridge!")
                        else:
                            remaining = st.session_state.subnet_bridge_threshold - subnet['liquidity']
                            st.info(f"Need {remaining} more FUEL")
            else:
                st.info("No subnet data available for bridge monitoring")
        
        with tab3:
            # Enhanced agent analytics
            st.subheader("🤖 Agent Performance Analytics")
            
            # Use available data from LiveContextLoop state
            agents_data = current_state.get('agents', [])
            
            if agents_data:
                # Agent type breakdown with performance metrics
                validators = [a for a in agents_data if a.get('type') == 'validator']
                forecasters = [a for a in agents_data if a.get('type') == 'forecaster']
                operators = [a for a in agents_data if a.get('type') == 'operator']
                
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    st.markdown("#### ⚖️ Validators")
                    if validators:
                        val_df = pd.DataFrame(validators)
                        if 'earnings' in val_df.columns and 'arc' in val_df.columns:
                            fig = px.bar(val_df, x='arc', y='earnings', 
                                       title="Validator Earnings by ARC")
                            st.plotly_chart(fig, use_container_width=True)
                        else:
                            st.metric("Active Validators", len(validators))
                    else:
                        st.info("No validator data available")
            else:
                # Show basic agent info from FUEL simulation
                st.info("📊 Using FUEL Agent Data")
                col1, col2 = st.columns(2)
                with col1:
                    st.metric("🤖 Agents Alive", current_state.get('fuel_alive', 0))
                with col2:
                    st.metric("💀 Agent Deaths", current_state.get('fuel_dead', 0))
                    
                    # Top performer - handle case where validators are just IDs
                    if validators and len(validators) > 0:
                        if isinstance(validators[0], dict) and 'earnings' in validators[0]:
                            top_validator = max(validators, key=lambda x: x['earnings'])
                            st.success(f"🏆 Top: ARC-{top_validator['arc']} (${top_validator['earnings']})")
                        else:
                            st.info(f"🏆 Active Validators: {len(validators)}")
                    else:
                        st.info("🏆 No validators active")
            
            with col2:
                st.markdown("#### 🔮 Forecasters")
                if forecasters:
                    fore_df = pd.DataFrame(forecasters)
                    fig = px.scatter(fore_df, x='arc', y='score', size='score',
                                   title="Forecaster Accuracy by ARC")
                    st.plotly_chart(fig, use_container_width=True)
                    
                    # Most accurate
                    top_forecaster = max(forecasters, key=lambda x: x['score'])
                    st.success(f"🎯 Best: ARC-{top_forecaster['arc']} ({top_forecaster['score']} correct)")
            
            with col3:
                st.markdown("#### ⚙️ Operators")
                if operators:
                    op_df = pd.DataFrame(operators)
                    fig = px.bar(op_df, x='arc', y='jobs_done',
                               title="Operator Jobs by ARC")
                    st.plotly_chart(fig, use_container_width=True)
                    
                    # Most productive
                    top_operator = max(operators, key=lambda x: x['jobs_done'])
                    st.success(f"🔧 Busiest: ARC-{top_operator['arc']} ({top_operator['jobs_done']} jobs)")
        
        with tab4:
            # Enhanced event monitoring
            st.subheader("📡 Cross-ARC Event Monitor")
            
            events = current_state['messages']['events']
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
                    total_b = sum(len(arc['blocks']) for arc in h['arcs'])
                    valid_b = sum(sum(1 for block in arc['blocks'] if block['valid']) for arc in h['arcs'])
                    health_data.append({
                        'Step': h['step'],
                        'Health': (valid_b / total_b * 100) if total_b > 0 else 100,
                        'Blocks': total_b,
                        'Events': len(h['messages']['events'])
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
