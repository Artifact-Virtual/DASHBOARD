#!/bin/bash
# Comprehensive startup script for the Arc Simulation System
# This is the ONLY entry point needed for all Arc Simulation# Step 7: Start Streamlit dashboard
echo "🖥️  Starting web dashboard..."
echo "📍 Main Dashboard: http://localhost:8501"
echo "📍 Live Stream: http://localhost:8502"
echo "🌐 Network access: http://0.0.0.0:8501 & http://0.0.0.0:8502"
echo "🎮 Use the Live Stream controls to Play/Pause the simulation"
echo "🔄 Main Dashboard shows current state, Live Stream shows real-time updates"
echo ""
echo "📊 Services Status:"
echo "   ✅ Arc Simulation Daemon: Running (PID: $DAEMON_PID)"
echo "   ✅ Live Stream Processor: Running (PID: ${STREAM_PID:-N/A})"
echo "   ✅ Web Dashboard: Starting..."
echo ""
echo "Press Ctrl+C to stop the entire system"
echo "================================================" -e  # Exit on any error

echo "🚀 Starting Arc Simulation System - Complete Suite..."
echo "================================================"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down all services..."
    
    # Kill background processes
    pkill -f "python demon.py" 2>/dev/null || true
    pkill -f "streamlit run.*streamlit_dashboard.py" 2>/dev/null || true
    pkill -f "streamlit run.*live_stream" 2>/dev/null || true
    pkill -f "python.*live_stream" 2>/dev/null || true
    
    # Stop systemd service if running
    systemctl --user stop demon.service 2>/dev/null || true
    
    # Deactivate virtual environment
    if [ "${VENV_ACTIVE:-0}" -eq 1 ]; then
        deactivate 2>/dev/null || true
        echo "✅ Virtual environment deactivated"
    fi
    
    echo "✅ Complete system shutdown"
    exit 0
}

# Set up cleanup trap
trap cleanup EXIT INT TERM

# Step 1: Setup virtual environment (create if needed)
echo "📦 Setting up virtual environment..."

# Get absolute path to avoid confusion
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_PATH="$SCRIPT_DIR/.venv"

echo "🔍 Script directory: $SCRIPT_DIR"
echo "🔍 Virtual environment path: $VENV_PATH"

# Deactivate any existing virtual environment
if [ -n "$VIRTUAL_ENV" ]; then
    echo "🔧 Deactivating existing virtual environment: $VIRTUAL_ENV"
    unset VIRTUAL_ENV
    unset PYTHONPATH
    # Reset PATH to remove old venv
    export PATH=$(echo $PATH | tr ':' '\n' | grep -v "/venv/" | grep -v "/.venv/" | tr '\n' ':' | sed 's/:$//')
fi

if [ ! -d "$VENV_PATH" ]; then
    echo "🔧 Creating virtual environment at: $VENV_PATH"
    python3 -m venv "$VENV_PATH"
    source "$VENV_PATH/bin/activate"
    pip install --upgrade pip
    pip install streamlit plotly matplotlib pandas networkx numpy
    echo "✅ Virtual environment created and configured"
else
    echo "🔧 Activating virtual environment from: $VENV_PATH"
    source "$VENV_PATH/bin/activate"
    
    # Verify we're in the right environment
    echo "🔍 VIRTUAL_ENV: $VIRTUAL_ENV"
    echo "🔍 Python path: $(which python3)"
    echo "🔍 Pip path: $(which pip)"
    
    # Check if plotly is installed, install if missing
    if ! python3 -c "import plotly" 2>/dev/null; then
        echo "🔧 Installing missing dependencies..."
        pip install plotly
    fi
    echo "✅ Virtual environment activated and verified"
fi
VENV_ACTIVE=1

# Step 2: Ensure simulation_data directory exists
echo "📁 Setting up data directory..."
mkdir -p simulation_data
echo "✅ Data directory ready"

# Step 3: Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "python demon.py" 2>/dev/null || true
pkill -f "streamlit run.*streamlit_dashboard.py" 2>/dev/null || true
pkill -f "streamlit run.*live_stream" 2>/dev/null || true
pkill -f "python.*live_stream" 2>/dev/null || true
systemctl --user stop demon.service 2>/dev/null || true
sleep 2
echo "✅ Cleanup complete"

# Step 4: Start the simulation daemon in background
echo "⚙️  Starting Arc Simulation daemon..."
python demon.py &
DAEMON_PID=$!
sleep 3

# Check if daemon started successfully
if ps -p $DAEMON_PID > /dev/null; then
    echo "✅ Arc Simulation daemon started (PID: $DAEMON_PID)"
else
    echo "❌ Failed to start daemon"
    exit 1
fi

# Step 5: Verify data generation
echo "📊 Verifying data generation..."
sleep 5
if [ -f "simulation_data/latest.json" ]; then
    STEP=$(python3 -c "import json; print(json.load(open('simulation_data/latest.json'))['step'])" 2>/dev/null || echo "unknown")
    echo "✅ Data generation confirmed (Step: $STEP)"
else
    echo "❌ No simulation data found"
    exit 1
fi

# Step 6: Start Live Stream processor in background
echo "📡 Starting live stream processor..."
python3 -m streamlit run live_stream_simple.py --server.port 8502 --server.address 0.0.0.0 &
STREAM_PID=$!
sleep 3

if ps -p $STREAM_PID > /dev/null; then
    echo "✅ Live stream processor started (PID: $STREAM_PID)"
    echo "📍 Live Stream available at: http://localhost:8502"
else
    echo "⚠️  Live stream processor failed to start (non-critical)"
fi

# Step 7: Start Streamlit dashboard
echo "🖥️  Starting web dashboard..."
echo "📍 Dashboard will be available at: http://localhost:8501"
echo "� Network access: http://0.0.0.0:8501"
echo "�🎮 Use the sidebar controls to Play/Pause the simulation"
echo "🔄 Enable 'Auto-refresh Dashboard' for live animations"
echo ""
echo "📊 Services Status:"
echo "   ✅ Arc Simulation Daemon: Running (PID: $DAEMON_PID)"
echo "   ✅ Live Stream Processor: Running (PID: ${STREAM_PID:-N/A})"
echo "   ✅ Web Dashboard: Starting..."
echo ""
echo "Press Ctrl+C to stop the entire system"
echo "================================================"

# Start Streamlit (this will block until user interrupts)
python3 -m streamlit run streamlit_dashboard.py --server.port 8501 --server.address 0.0.0.0
