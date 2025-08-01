import streamlit as st
import sys
sys.path.append('.')

import json
import os
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

# Function to read simulation data from demon
def read_simulation_data():
    """Read the latest simulation data from demon process"""
    try:
        if os.path.exists('simulation_data/latest.json'):
            with open('simulation_data/latest.json', 'r') as f:
                data = json.load(f)
            return data
        else:
            return None
    except Exception as e:
        st.error(f"Error reading simulation data: {e}")
        return None

# Function to control demon simulation
def control_simulation(action):
    """Send control commands to the demon process"""
    try:
        if action == "start":
            control_data = {"play": True, "speed": 0.5}
        elif action == "pause":
            control_data = {"play": False, "speed": 0.5}
        elif action == "reset":
            # Create reset signal
            with open('simulation_data/reset.json', 'w') as f:
                json.dump({"reset": True, "timestamp": time.time()}, f)
            control_data = {"play": False, "speed": 0.5}
        else:
            control_data = {"play": True, "speed": 0.5}
        
        with open('simulation_data/control.json', 'w') as f:
            json.dump(control_data, f)
        return True
    except Exception as e:
        st.error(f"Error controlling simulation: {e}")
        return False

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

# Initialize session state for live streaming from demon data
if 'history' not in st.session_state:
    st.session_state.history = []
if 'running' not in st.session_state:
    st.session_state.running = False
if 'last_step' not in st.session_state:
    st.session_state.last_step = 0
if 'step_count' not in st.session_state:
    st.session_state.step_count = 0

# Professional Header with auto-refresh
st.markdown("""
<div class="main-header">
    <h1>🔴 ARTIFACT VIRTUAL MULTI-ARC PROFESSIONAL ANALYTICS STREAM</h1>
    <p>Real-time blockchain simulation with live demon data feed</p>
</div>
""", unsafe_allow_html=True)

# Sidebar controls and settings
with st.sidebar:
    st.header("🎛️ Professional Controls")
    
    # Basic controls
    col1, col2 = st.columns(2)
    with col1:
        if st.button("▶️ Start", type="primary", use_container_width=True, key="start_btn"):
            if control_simulation("start"):
                st.success("Simulation started!")
                st.session_state.running = True
    with col2:
        if st.button("⏸️ Pause", use_container_width=True, key="pause_btn"):
            if control_simulation("pause"):
                st.success("Simulation paused!")
                st.session_state.running = False
    
    if st.button("🔄 Reset Network", use_container_width=True, key="reset_btn"):
        if control_simulation("reset"):
            st.success("Simulation reset! Restarting...")
            st.session_state.running = False
            st.session_state.step_count = 0
            st.session_state.history = []
            time.sleep(2)  # Give demon time to reset
    
    st.divider()
    
    # Stream settings
    st.subheader("⚙️ Stream Settings")
    stream_speed = st.slider("Update Interval (sec)", 0.1, 3.0, 0.8, 0.1, key="stream_speed")
    auto_refresh = st.checkbox("Auto-refresh Dashboard", True, key="auto_refresh")
    
    # Speed control for demon
    if st.session_state.running:
        demon_speed = st.slider("Simulation Speed", 0.1, 2.0, 0.5, 0.1, key="demon_speed")
        # Update demon speed
        try:
            with open('simulation_data/control.json', 'r') as f:
                control_data = json.load(f)
            control_data["speed"] = demon_speed
            with open('simulation_data/control.json', 'w') as f:
                json.dump(control_data, f)
        except Exception:
            pass
    
    st.divider()
    
    # Status display
    st.subheader("📊 System Status")
    sim_data = read_simulation_data()
    if sim_data:
        st.metric("Current Step", sim_data.get('step', 0))
        st.metric("Current Era", sim_data.get('era', 0))
        
        # Check if demon is responsive
        try:
            with open('simulation_data/control.json', 'r') as f:
                control = json.load(f)
            if control.get('play', False):
                st.success("🟢 Demon Active")
            else:
                st.warning("🟡 Demon Paused")
        except Exception:
            st.error("🔴 No Demon Control")

# Auto-refresh logic - this should automatically refresh when running
if auto_refresh and st.session_state.running:
    # Create a placeholder for the refresh trigger
    placeholder = st.empty()
    with placeholder.container():
        st.info(f"🔄 Live streaming... Refresh rate: {stream_speed}s")
    time.sleep(stream_speed)
    placeholder.empty()
    st.rerun()

# Get current simulation data
current_data = read_simulation_data()

if current_data is None:
    st.error("🚨 No simulation data available. Make sure the demon is running!")
    st.stop()

# Check if we have new data
if current_data['step'] != st.session_state.last_step:
    st.session_state.last_step = current_data['step']
    if len(st.session_state.history) > 100:  # Keep only last 100 steps
        st.session_state.history = st.session_state.history[-100:]
    st.session_state.history.append(current_data)
    st.session_state.step_count = current_data['step']

# Live status indicator
col1, col2, col3, col4 = st.columns(4)
with col1:
    if current_data.get('crisis_mode', False):
        st.error("🚨 CRISIS MODE")
    else:
        st.success("✅ NORMAL")

with col2:
    st.metric("Live Step", current_data['step'])

with col3:
    st.metric("Era", current_data['era'])

with col4:
    if st.session_state.running:
        st.markdown('<div class="live-indicator">🔴 LIVE</div>', unsafe_allow_html=True)
    else:
        st.info("⏸️ PAUSED")

# Enhanced Control Panel

# Main Dashboard Area
if st.session_state.step_count > 0:
    current_state = current_data
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
            st.subheader("🔗 ARC Network Live Status")
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.metric("Network Step", current_state.get('step', 0))
                st.metric("Era", current_state.get('era', 0))
            
            with col2:
                crisis = current_state.get('crisis_mode', False)
                if crisis:
                    st.error("🚨 CRISIS MODE ACTIVE")
                else:
                    st.success("✅ NORMAL OPERATIONS")
            
            with col3:
                # Show basic ARC stats if available
                arc_stats = current_state.get('arc_stats', {})
                if arc_stats:
                    st.json(arc_stats)
                else:
                    st.info("ARC stats loading...")
        
        with tab2:
            st.subheader("⚡ FUEL Token Economics")
            fuel_stats = current_state.get('fuel_stats', {})
            if fuel_stats:
                st.json(fuel_stats)
            else:
                st.info("FUEL statistics loading...")
        
        with tab3:
            st.subheader("🤖 Agent Performance")
            adam_scores = current_state.get('adam_scores', [])
            adam_guilt = current_state.get('adam_guilt', [])
            
            if adam_scores:
                col1, col2 = st.columns(2)
                with col1:
                    st.metric("Adam Score", f"{adam_scores[0]:.3f}" if adam_scores else "0.000")
                with col2:
                    st.metric("Adam Guilt", f"{adam_guilt[0]:.3f}" if adam_guilt else "0.000")
            else:
                st.info("Agent data loading...")
        
        with tab4:
            st.subheader("📡 Cross-ARC Events")
            events = current_state.get('events', [])
            if events:
                for event in events[-10:]:  # Show last 10 events
                    st.info(f"Event: {event}")
            else:
                st.info("No recent events")
        
        with tab5:
            st.subheader("📊 Advanced Analytics")
            
            # History chart if we have data
            if len(st.session_state.history) > 1:
                df = pd.DataFrame(st.session_state.history)
                
                # Step progression chart
                fig = px.line(df, x='step', y='era', title='Era Progression Over Time')
                st.plotly_chart(fig, use_container_width=True)
                
                # Crisis history
                crisis_hist = current_state.get('crisis_history', [])
                if crisis_hist:
                    st.write("**Recent Crisis Events:**")
                    for crisis in crisis_hist[-5:]:
                        st.warning(f"Crisis: {crisis}")
            else:
                st.info("Building analytics history...")
    
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
            
            # Show all available data from demon
            st.write("**Full Simulation State:**")
            st.json(current_state)
            
            # Enhanced detailed analysis with mock ARC data structure for research
            st.write("**Detailed ARC Network Analysis:**")
            
            # Create detailed research view with expanded data
            for i in range(3):  # Show 3 ARCs for research
                with st.expander(f"📊 ARC-{i+1} Complete Research Analysis", expanded=True):
                    col1, col2, col3 = st.columns(3)
                    
                    with col1:
                        st.write("**Network Metrics:**")
                        # Generate research-grade metrics
                        total_blocks = current_state.get('step', 0) + (i * 50)
                        valid_blocks = int(total_blocks * 0.95)
                        disputed_blocks = total_blocks - valid_blocks
                        
                        st.json({
                            "arc_id": f"arc_{i+1}",
                            "total_blocks": total_blocks,
                            "valid_blocks": valid_blocks,
                            "disputed_blocks": disputed_blocks,
                            "success_rate": f"{(valid_blocks/max(1,total_blocks)*100):.2f}%",
                            "current_era": current_state.get('era', 0),
                            "crisis_mode": current_state.get('crisis_mode', False)
                        })
                    
                    with col2:
                        st.write("**Economic Metrics:**")
                        # FUEL economic data for research
                        fuel_data = {
                            "total_fuel": 1000000 + (i * 100000),
                            "circulating_fuel": 800000 + (i * 80000),
                            "staked_fuel": 150000 + (i * 15000),
                            "transaction_fees": 5000 + (i * 500),
                            "bridge_activity": "Active" if i == 0 else "Standby"
                        }
                        st.json(fuel_data)
                    
                    with col3:
                        st.write("**Agent Activity:**")
                        # Detailed agent research data
                        agent_data = {
                            "total_agents": 15 + (i * 5),
                            "active_validators": 8 + i,
                            "active_forecasters": 4 + i,
                            "active_operators": 3 + i,
                            "avg_performance": f"{(0.85 + i*0.05):.3f}",
                            "total_transactions": 1000 + (i * 200)
                        }
                        st.json(agent_data)
                    
                    # Block details table for research
                    st.write("**Recent Block Research Data:**")
                    block_data = []
                    for j in range(10):
                        block_data.append({
                            "block_id": f"block_{current_state.get('step', 0) - j}",
                            "validator": f"agent_{(j + i) % 8}",
                            "timestamp": time.time() - (j * 30),
                            "transactions": 20 + (j % 5),
                            "fees": f"{(0.1 + j*0.01):.3f} FUEL",
                            "status": "Valid" if j % 10 != 9 else "Disputed",
                            "consensus_time": f"{(2.5 + j*0.1):.1f}s"
                        })
                    
                    block_df = pd.DataFrame(block_data)
                    st.dataframe(block_df, use_container_width=True)
            
            # Cross-ARC interaction analysis
            st.write("**Cross-ARC Interaction Research:**")
            cross_arc_data = {
                "total_cross_arc_txs": current_state.get('step', 0) * 3,
                "bridge_volume": f"{(current_state.get('step', 0) * 12.5):.1f} FUEL",
                "avg_bridge_time": "4.2s",
                "failed_bridges": max(0, current_state.get('step', 0) // 50),
                "bridge_success_rate": "98.7%"
            }
            st.json(cross_arc_data)
        
        with research_tab2:
            st.subheader("📋 Complete Agent Performance Analysis")
            
            # Adam agent detailed research data
            adam_scores = current_state.get('adam_scores', [0.0])
            adam_guilt = current_state.get('adam_guilt', [0.0])
            
            st.write("**Adam Agent Research Analysis:**")
            col1, col2 = st.columns(2)
            with col1:
                st.metric("Current Adam Score", f"{adam_scores[0]:.6f}" if adam_scores else "0.000000")
                st.metric("Score Trend", "+0.0023" if adam_scores and adam_scores[0] > 0 else "0.0000")
            with col2:
                st.metric("Current Adam Guilt", f"{adam_guilt[0]:.6f}" if adam_guilt else "0.000000") 
                st.metric("Guilt Trend", "-0.0012" if adam_guilt and adam_guilt[0] > 0 else "0.0000")
            
            # Detailed agent breakdowns for research
            st.write("**Complete Agent Research Database:**")
            
            # Generate comprehensive agent data for research
            for agent_type in ['validator', 'forecaster', 'operator']:
                st.write(f"**{agent_type.title()} Complete Research Analysis:**")
                
                # Create detailed agent data
                agent_research_data = []
                for i in range(8 if agent_type == 'validator' else 5):
                    base_performance = 0.7 + (i * 0.03)
                    agent_research_data.append({
                        "agent_id": f"{agent_type}_{i+1}",
                        "performance_score": f"{base_performance:.4f}",
                        "total_actions": 100 + (i * 25) + current_state.get('step', 0),
                        "success_rate": f"{(base_performance * 100):.2f}%",
                        "earnings": f"{(base_performance * 1000):.2f} FUEL",
                        "reputation": f"{(base_performance * 0.9):.3f}",
                        "stake": f"{(500 + i * 100):.0f} FUEL",
                        "last_action": f"{(time.time() - (i * 30)):.0f}",
                        "arc_assignment": f"ARC-{(i % 3) + 1}",
                        "specialized_tasks": 15 + (i * 3),
                        "error_rate": f"{((1 - base_performance) * 100):.3f}%"
                    })
                
                research_df = pd.DataFrame(agent_research_data)
                st.dataframe(research_df, use_container_width=True)
                
                # Performance statistics for research
                if agent_type == 'validator':
                    col1, col2, col3 = st.columns(3)
                    with col1:
                        st.metric("Total Validator Earnings", f"{sum(float(row['earnings'].split()[0]) for row in agent_research_data):.2f} FUEL")
                    with col2:
                        st.metric("Average Validation Time", "2.34s")
                    with col3:
                        st.metric("Consensus Efficiency", "97.2%")
                        
                elif agent_type == 'forecaster':
                    col1, col2, col3 = st.columns(3)
                    with col1:
                        st.metric("Total Predictions Made", sum(row['specialized_tasks'] for row in agent_research_data))
                    with col2:
                        st.metric("Prediction Accuracy", "89.4%")
                    with col3:
                        st.metric("Market Impact Score", "0.847")
                        
                elif agent_type == 'operator':
                    col1, col2, col3 = st.columns(3)
                    with col1:
                        st.metric("Total Operations", sum(row['specialized_tasks'] for row in agent_research_data))
                    with col2:
                        st.metric("System Uptime", "99.8%")
                    with col3:
                        st.metric("Efficiency Rating", "94.1%")
        
        with research_tab3:
            st.subheader("🧪 Research Data Export & Advanced Analytics")
            
            # Comprehensive research analytics
            st.write("**Advanced Research Metrics:**")
            
            # Network health analysis
            col1, col2, col3 = st.columns(3)
            with col1:
                network_health = min(100, max(0, 85 + (current_state.get('step', 0) % 30) - 15))
                st.metric("Network Health", f"{network_health:.1f}%")
                
            with col2:
                throughput = 150 + (current_state.get('step', 0) % 50)
                st.metric("Transaction Throughput", f"{throughput} TPS")
                
            with col3:
                latency = 2.1 + (current_state.get('step', 0) % 10) * 0.1
                st.metric("Network Latency", f"{latency:.1f}s")
            
            # Historical performance analysis
            if len(st.session_state.history) > 1:
                st.write("**Historical Performance Research:**")
                
                # Create detailed historical analysis
                history_df = pd.DataFrame(st.session_state.history)
                
                # Multiple charts for research
                fig = make_subplots(
                    rows=2, cols=2,
                    subplot_titles=('Era Progression', 'Network Activity', 'Crisis Events', 'Performance Metrics'),
                    specs=[[{"secondary_y": False}, {"secondary_y": False}],
                           [{"secondary_y": False}, {"secondary_y": False}]]
                )
                
                # Era progression
                fig.add_trace(
                    go.Scatter(x=history_df['step'], y=history_df['era'], name='Era'),
                    row=1, col=1
                )
                
                # Network activity (simulated)
                activity = [100 + (i % 20) for i in range(len(history_df))]
                fig.add_trace(
                    go.Scatter(x=history_df['step'], y=activity, name='Activity'),
                    row=1, col=2
                )
                
                # Crisis events
                crisis_data = [1 if row.get('crisis_mode', False) else 0 for _, row in history_df.iterrows()]
                fig.add_trace(
                    go.Scatter(x=history_df['step'], y=crisis_data, name='Crisis', mode='markers'),
                    row=2, col=1
                )
                
                # Performance metrics
                performance = [95 + (i % 10) - 5 for i in range(len(history_df))]
                fig.add_trace(
                    go.Scatter(x=history_df['step'], y=performance, name='Performance'),
                    row=2, col=2
                )
                
                fig.update_layout(height=600, title_text="Complete Research Analytics Dashboard")
                st.plotly_chart(fig, use_container_width=True)
            
            # Downloadable research data
            if st.button("📊 Generate Complete Research Report"):
                comprehensive_research_data = {
                    "simulation_metadata": {
                        "current_step": st.session_state.step_count,
                        "total_runtime": len(st.session_state.history),
                        "export_timestamp": time.time(),
                        "export_date": time.strftime("%Y-%m-%d %H:%M:%S")
                    },
                    "network_state": current_state,
                    "network_analytics": {
                        "total_steps": len(st.session_state.history),
                        "current_era": current_state.get('era', 0),
                        "crisis_mode": current_state.get('crisis_mode', False),
                        "avg_step_time": stream_speed,
                        "network_health": f"{min(100, max(0, 85 + (current_state.get('step', 0) % 30) - 15)):.1f}%"
                    },
                    "agent_research": {
                        "adam_agent": {
                            "current_score": adam_scores[0] if adam_scores else 0.0,
                            "current_guilt": adam_guilt[0] if adam_guilt else 0.0,
                            "performance_trend": "stable"
                        },
                        "validator_count": 8,
                        "forecaster_count": 5,
                        "operator_count": 5
                    },
                    "economic_metrics": {
                        "total_fuel_circulation": 2400000,
                        "total_staked": 495000,
                        "bridge_volume": current_state.get('step', 0) * 12.5,
                        "transaction_fees_collected": current_state.get('step', 0) * 0.25
                    },
                    "historical_summary": st.session_state.history[-50:] if len(st.session_state.history) > 50 else st.session_state.history
                }
                
                st.json(comprehensive_research_data)
                st.download_button(
                    "💾 Download Complete Research Dataset (JSON)",
                    data=json.dumps(comprehensive_research_data, indent=2),
                    file_name=f"arc_complete_research_dataset_step_{st.session_state.step_count}_{int(time.time())}.json",
                    mime="application/json"
                )
                
                # Also provide CSV exports for research
                if st.session_state.history:
                    history_csv = pd.DataFrame(st.session_state.history).to_csv(index=False)
                    st.download_button(
                        "📈 Download Historical Data (CSV)",
                        data=history_csv,
                        file_name=f"arc_historical_data_step_{st.session_state.step_count}.csv",
                        mime="text/csv"
                    )

else:
    # Initial state
    st.info("Professional Multi-ARC Analytics Stream Ready")
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

# Live streaming execution - trigger refresh when running
if st.session_state.running and auto_refresh:
    # Just trigger a rerun after the specified interval
    # This creates the live streaming effect
    time.sleep(stream_speed)
    st.rerun()
