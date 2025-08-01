#!/bin/bash
# Comprehensive startup script for the Advanced Multi-ARC Constitutional Intelligence System

set -e  # Exit on any error

echo "🚀 Starting Advanced Multi-ARC Constitutional Intelligence System..."
echo "========================================================================="

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down system..."
    
    # Kill background processes
    pkill -f ".venv/bin/python headless_daemon.py" 2>/dev/null || true
    pkill -f "python headless_daemon.py" 2>/dev/null || true
    pkill -f "python demon.py" 2>/dev/null || true
    pkill -f "streamlit run" 2>/dev/null || true
    
    # Deactivate virtual environment
    if [ "$VENV_ACTIVE" -eq 1 ]; then
        deactivate 2>/dev/null || true
        echo "✅ Virtual environment deactivated"
    fi
    
    echo "✅ Advanced system shutdown complete"
    exit 0
}

# Set up cleanup trap
trap cleanup EXIT INT TERM

# Step 1: Activate virtual environment
echo "📦 Activating virtual environment..."
if [ -d ".venv" ]; then
    source .venv/bin/activate
    VENV_ACTIVE=1
    echo "✅ Virtual environment activated"
else
    echo "❌ No .venv directory found. Please run setup.sh first."
    exit 1
fi

# Step 2: Ensure simulation_data directory exists
echo "📁 Setting up data directory..."
mkdir -p simulation_data
echo "✅ Data directory ready"

# Step 3: Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f ".venv/bin/python headless_daemon.py" 2>/dev/null || true
pkill -f "python headless_daemon.py" 2>/dev/null || true
pkill -f "python demon.py" 2>/dev/null || true
pkill -f "streamlit run" 2>/dev/null || true
sleep 2
echo "✅ Cleanup complete"

# Step 4: Start the headless background data generator
echo "⚙️  Starting headless Multi-ARC data generator..."
.venv/bin/python headless_daemon.py &
HEADLESS_PID=$!
sleep 3

# Check if headless daemon started successfully
if ps -p $HEADLESS_PID > /dev/null; then
    echo "✅ Headless data generator started (PID: $HEADLESS_PID)"
else
    echo "❌ Failed to start headless daemon"
    exit 1
fi

# Step 5: Verify data generation
echo "📊 Verifying rich data generation..."
sleep 5
if [ -f "simulation_data/latest.json" ]; then
    STEP=$(cat simulation_data/latest.json | jq -r '.step' 2>/dev/null || echo "unknown")
    echo "✅ Rich data generation confirmed (Step: $STEP)"
else
    echo "❌ No simulation data found"
    exit 1
fi

# Step 6: Start Advanced Live Stream Dashboard
echo "🖥️  Starting Advanced Multi-ARC Live Stream Dashboard..."
echo "📍 Advanced Dashboard: http://localhost:8501"
echo "🎮 Features:"
echo "   • Real-time circular validation monitoring"
echo "   • Constitutional intelligence tracking"  
echo "   • Multi-ARC network visualization"
echo "   • Economic stress analysis"
echo "   • Crisis detection and management"
echo "🔄 Dashboard auto-refreshes with live simulation data"
echo ""
echo "Press Ctrl+C to stop the entire system"
echo "========================================================================="

# Start Advanced Live Stream (this will block until user interrupts)
.venv/bin/streamlit run live_stream.py --server.port 8501 --server.address 0.0.0.0
