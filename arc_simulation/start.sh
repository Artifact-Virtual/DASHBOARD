#!/bin/bash
# Professional React + WebSocket Dashboard for Advanced Multi-ARC Constitutional Intelligence System

set -e  # Exit on any error

echo "Multi-ARC Dashboard..."
echo "========================================================================="

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down professional dashboard system..."
    
    # Kill background processes
    pkill -f ".venv/bin/python websocket_server.py" 2>/dev/null || true
    pkill -f "python websocket_server.py" 2>/dev/null || true
    pkill -f ".venv/bin/python headless_daemon.py" 2>/dev/null || true
    pkill -f "python headless_daemon.py" 2>/dev/null || true
    pkill -f "python demon.py" 2>/dev/null || true
    pkill -f "npm start" 2>/dev/null || true
    pkill -f "streamlit run" 2>/dev/null || true
    
    # Deactivate virtual environment
    if [ "$VENV_ACTIVE" = "1" ]; then
        deactivate 2>/dev/null || true
        echo "✅ Virtual environment deactivated"
    fi
    
    echo "✅ Professional dashboard system shutdown complete"
    exit 0
}

# Set up cleanup trap
trap cleanup EXIT INT TERM

# Initialize variables
VENV_ACTIVE=0

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

# Step 6: Start Professional WebSocket Backend
echo "🔌 Starting Professional WebSocket Backend..."
.venv/bin/python websocket_server.py &
WEBSOCKET_PID=$!
sleep 3

# Check if WebSocket server started successfully
if ps -p $WEBSOCKET_PID > /dev/null; then
    echo "✅ WebSocket Backend started (PID: $WEBSOCKET_PID)"
else
    echo "❌ Failed to start WebSocket backend"
    exit 1
fi

# Step 7: Install and start React frontend (if not already done)
echo "⚛️  Setting up Professional React Dashboard..."
if [ ! -d "react-dashboard/node_modules" ]; then
    echo "📦 Installing React dependencies..."
    cd react-dashboard
    npm install
    cd ..
    echo "✅ React dependencies installed"
fi

echo "🚀 Starting Professional Trading Dashboard..."
cd react-dashboard
npm start &
REACT_PID=$!
cd ..
sleep 5

# Check if React app started successfully
if ps -p $REACT_PID > /dev/null; then
    echo "✅ React Dashboard started (PID: $REACT_PID)"
else
    echo "❌ Failed to start React dashboard"
    exit 1
fi

# Step 6: Start Advanced Live Stream Dashboard
echo "🖥️  Professional Trading Dashboard Successfully Launched!"
echo "📍 React Dashboard: http://localhost:3000"
echo "📍 WebSocket API: http://localhost:8000"
echo "🎮 Professional Features:"
echo "   • Real-time WebSocket streaming (no page refreshes)"
echo "   • Professional trading dashboard aesthetics"
echo "   • Silky smooth real-time charts"
echo "   • Dynamic ARC management controls"
echo "   • Crisis injection and management"
echo "   • Multi-dimensional economic analysis"
echo "   • Constitutional intelligence monitoring"
echo "🔄 Dashboard updates at 60fps with live simulation data"
echo ""
echo "Press Ctrl+C to stop the entire professional system"
echo "========================================================================="

# Keep script running and wait for user interrupt
wait
