#!/bin/bash

# ArtifactVirtual.com Complete System Stop Script (Systemd Version)
# Stops all services, kills all ports, and exits virtual environments

PID_DIR="/tmp/artifactvirtual"

echo "🛑 Stopping ArtifactVirtual.com Complete System..."

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local service_name=$2
    PIDS=$(lsof -ti:$port 2>/dev/null || true)
    if [ -n "$PIDS" ]; then
        echo "🔌 Killing $service_name processes on port $port..."
        echo "$PIDS" | xargs kill -TERM 2>/dev/null || true
        sleep 2
        # Force kill if still running
        PIDS=$(lsof -ti:$port 2>/dev/null || true)
        if [ -n "$PIDS" ]; then
            echo "💀 Force killing stubborn processes on port $port..."
            echo "$PIDS" | xargs kill -KILL 2>/dev/null || true
        fi
    fi
}

# Function to comprehensively kill all related processes
kill_all_processes() {
    echo "🧹 Comprehensive process cleanup..."
    
    # Kill all common development ports
    kill_port 3000 "React/Next.js"
    kill_port 5173 "Vite"
    kill_port 8080 "Development Server"
    kill_port 8501 "Streamlit"
    kill_port 8502 "Streamlit Live Stream"
    kill_port 4173 "Vite Preview"
    kill_port 5000 "Flask/General"
    kill_port 8000 "Python HTTP Server"
    kill_port 9000 "General Development"
    
    # Kill specific service processes
    echo "🎯 Killing specific service processes..."
    
    # Vite/npm processes
    pkill -f "vite" 2>/dev/null || true
    pkill -f "npm.*run.*dev" 2>/dev/null || true
    pkill -f "npm.*run.*build" 2>/dev/null || true
    pkill -f "npm.*start" 2>/dev/null || true
    
    # Streamlit processes
    pkill -f "streamlit" 2>/dev/null || true
    pkill -f "streamlit.*run" 2>/dev/null || true
    
    # Python demon processes
    pkill -f "demon.py" 2>/dev/null || true
    pkill -f "arc_simulation" 2>/dev/null || true
    
    # Cloudflare tunnel processes
    pkill -f "cloudflared" 2>/dev/null || true
    
    # Node.js processes
    pkill -f "node.*vite" 2>/dev/null || true
    pkill -f "node.*webpack" 2>/dev/null || true
    
    # Any remaining Python HTTP servers
    pkill -f "python.*http.server" 2>/dev/null || true
    pkill -f "python.*-m.*http.server" 2>/dev/null || true
}

# Function to exit virtual environments
exit_virtual_environments() {
    echo "🐍 Exiting virtual environments..."
    
    # Check if we're in a conda environment
    if [ -n "$CONDA_DEFAULT_ENV" ]; then
        echo "🅒 Deactivating Conda environment: $CONDA_DEFAULT_ENV"
        conda deactivate 2>/dev/null || true
    fi
    
    # Check if we're in a Python venv
    if [ -n "$VIRTUAL_ENV" ]; then
        echo "🐍 Deactivating Python virtual environment: $(basename $VIRTUAL_ENV)"
        deactivate 2>/dev/null || true
    fi
    
    # Unset virtual environment variables
    unset VIRTUAL_ENV
    unset PYTHONPATH
    unset CONDA_DEFAULT_ENV
    unset CONDA_PREFIX
    
    # Reset PATH if needed (remove venv/conda paths)
    if [ -n "$_OLD_VIRTUAL_PATH" ]; then
        export PATH="$_OLD_VIRTUAL_PATH"
        unset _OLD_VIRTUAL_PATH
    fi
    
    echo "✅ Virtual environments cleaned up"
}

# Stop services using PID files
stop_pid_services() {
    echo "📋 Stopping services using PID files..."
    # Stop Vite dev server using PID file
    if [ -f "$PID_DIR/vite.pid" ]; then
        VITE_PID=$(cat "$PID_DIR/vite.pid")
        if kill -0 "$VITE_PID" 2>/dev/null; then
            echo "⚡ Stopping Vite dev server (PID: $VITE_PID)..."
            kill -TERM "$VITE_PID"
            echo "✅ Vite dev server stopped"
        fi
        rm -f "$PID_DIR/vite.pid"
    else
        echo "ℹ️  Vite dev server PID file not found"
    fi

    # Stop Cloudflare tunnel using PID file
    if [ -f "$PID_DIR/tunnel.pid" ]; then
        TUNNEL_PID=$(cat "$PID_DIR/tunnel.pid")
        if kill -0 "$TUNNEL_PID" 2>/dev/null; then
            echo "☁️  Stopping Cloudflare tunnel (PID: $TUNNEL_PID)..."
            kill -TERM "$TUNNEL_PID"
            echo "✅ Tunnel stopped"
        fi
        rm -f "$PID_DIR/tunnel.pid"
    else
        echo "ℹ️  Tunnel PID file not found"
    fi

    # Stop Arc Simulation demon using PID file
    if [ -f "$PID_DIR/demon.pid" ]; then
        DEMON_PID=$(cat "$PID_DIR/demon.pid")
        if kill -0 "$DEMON_PID" 2>/dev/null; then
            echo "🤖 Stopping Arc Simulation demon (PID: $DEMON_PID)..."
            kill -TERM "$DEMON_PID"
            echo "✅ Arc Simulation demon stopped"
        fi
        rm -f "$PID_DIR/demon.pid"
    else
        echo "ℹ️  Arc Simulation demon PID file not found"
    fi

    # Stop Live Stream using PID file
    if [ -f "$PID_DIR/live_stream.pid" ]; then
        STREAM_PID=$(cat "$PID_DIR/live_stream.pid")
        if kill -0 "$STREAM_PID" 2>/dev/null; then
            echo "📺 Stopping Live Stream (PID: $STREAM_PID)..."
            kill -TERM "$STREAM_PID"
            echo "✅ Live Stream stopped"
        fi
        rm -f "$PID_DIR/live_stream.pid"
    else
        echo "ℹ️  Live Stream PID file not found"
    fi
}

# Main execution
main() {
    stop_pid_services
    kill_all_processes
    exit_virtual_environments
    
    # Clean up PID directory
    rm -rf "$PID_DIR"
    
    # Final verification - check if any processes are still running
    echo "🔍 Final verification..."
    remaining_processes=0
    
    for port in 3000 5173 8080 8501 8502 4173 5000 8000 9000; do
        if lsof -ti:$port 2>/dev/null >/dev/null; then
            echo "⚠️  Warning: Port $port still has active processes"
            remaining_processes=1
        fi
    done
    
    if [ $remaining_processes -eq 0 ]; then
        echo "✅ All ports are clean!"
    else
        echo "⚠️  Some processes may still be running. You may need to restart your terminal or reboot."
    fi
    
    echo ""
    echo "🎉 Complete system shutdown finished!"
    echo "💡 All services stopped, ports cleaned, and virtual environments exited"
    echo "🔄 Ready for fresh restart"
}

# Run main function
main
