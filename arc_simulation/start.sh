#!/bin/bash
# Professional React + WebSocket Dashboard for Multi-ARC Constitutional Intelligence System

set -e  # Exit on any error

echo "🚀 Multi-ARC Professional Dashboard"
echo "========================================================================="

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down dashboard system..."
    
    # Kill background processes
    pkill -f ".venv/bin/python websocket_server.py" 2>/dev/null || true
    pkill -f "python websocket_server.py" 2>/dev/null || true
    pkill -f ".venv/bin/python headless_daemon.py" 2>/dev/null || true
    pkill -f "python headless_daemon.py" 2>/dev/null || true
    pkill -f "serve -s build" 2>/dev/null || true
    
    # Kill any processes using ports
    fuser -k 8000/tcp 2>/dev/null || true
    fuser -k 3000/tcp 2>/dev/null || true
    
    # Deactivate virtual environment
    if [ "$VENV_ACTIVE" = "1" ]; then
        deactivate 2>/dev/null || true
        echo "✅ Virtual environment deactivated"
    fi
    
    echo "✅ Dashboard system shutdown complete"
    exit 0
}

# Set up cleanup trap
trap cleanup EXIT INT TERM

# Initialize variables
VENV_ACTIVE=0

# Step 1: Clean up existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f ".venv/bin/python websocket_server.py" 2>/dev/null || true
pkill -f "python websocket_server.py" 2>/dev/null || true
pkill -f ".venv/bin/python headless_daemon.py" 2>/dev/null || true
pkill -f "python headless_daemon.py" 2>/dev/null || true
pkill -f "serve -s build" 2>/dev/null || true

# Kill any processes using our ports
echo "🧹 Freeing up ports 8000 and 3000..."
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true

# Wait for ports to be fully released
echo "⏳ Waiting for ports to be released..."
sleep 3

# Force kill if still in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "❌ Port 8000 still in use. Force killing..."
    kill -9 $(lsof -Pi :8000 -sTCP:LISTEN -t) 2>/dev/null || true
    sleep 2
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "❌ Port 3000 still in use. Force killing..."
    kill -9 $(lsof -Pi :3000 -sTCP:LISTEN -t) 2>/dev/null || true
    sleep 2
fi

echo "✅ Port cleanup complete"

# Step 2: Activate virtual environment
echo "📦 Activating virtual environment..."
if [ -d ".venv" ]; then
    source .venv/bin/activate
    VENV_ACTIVE=1
    echo "✅ Virtual environment activated"
else
    echo "❌ No .venv directory found. Please run setup.sh first."
    exit 1
fi

# Step 3: Ensure simulation_data directory exists
echo "📁 Setting up data directory..."
mkdir -p simulation_data
echo "✅ Data directory ready"

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

# Step 6: Start WebSocket Backend
echo "🔌 Starting WebSocket Backend..."
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

# Step 7: Install and build React frontend
echo "⚛️  Setting up React Dashboard..."
if [ ! -d "react-dashboard/node_modules" ]; then
    echo "📦 Installing React dependencies..."
    cd react-dashboard
    npm install
    cd ..
    echo "✅ React dependencies installed"
fi

echo "� Building React app for production..."
cd react-dashboard
npm run build
echo "✅ React app built successfully"

echo "🚀 Starting Dashboard with serve..."
npx serve -s build -l 3000 &
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
echo "🖥️  Dashboard Successfully Launched!"
echo "📍 React Dashboard: http://localhost:3000"
echo "📍 WebSocket API: http://localhost:8000"
echo "🎮 Features:"
echo "   • Real-time WebSocket streaming (no page refreshes)"
echo "   • Dashboard aesthetics"
echo "   • Silky smooth real-time charts"
echo "   • Dynamic ARC management controls"
echo "   • Crisis injection and management"
echo "   • Multi-dimensional economic analysis"
echo "   • Constitutional intelligence monitoring"
echo "🔄 Dashboard updates at 60fps with live simulation data"
echo ""
echo "Press Ctrl+C to stop the entire system"
echo "========================================================================="

# Keep script running and wait for user interrupt
wait
