#!/bin/bash

# ArtifactVirtual.com Complete System Startup Script (Systemd Version)
# Starts both Landing Page and Arc Simulation for systemd service

set -e

echo "🚀 Starting ArtifactVirtual.com Complete System (Systemd Mode)..."

# Get the script directory (works even if script is symlinked)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WWW_DIR="$SCRIPT_DIR/www"

PID_DIR="/tmp/artifactvirtual"

echo "📁 Working from: $SCRIPT_DIR"

# Create PID directory
mkdir -p "$PID_DIR"

# Function to kill processes and clean up PIDs
kill_all_services() {
    echo "🔍 Checking for existing processes..."
    
    # Kill any previous landing page instances
    if [ -f "$PID_DIR/vite.pid" ]; then
        OLD_PID=$(cat "$PID_DIR/vite.pid")
        if kill -0 "$OLD_PID" 2>/dev/null; then
            echo "💀 Killing previous Vite process (PID: $OLD_PID)"
            kill -TERM "$OLD_PID" 2>/dev/null || true
            sleep 2
            kill -KILL "$OLD_PID" 2>/dev/null || true
        fi
        rm -f "$PID_DIR/vite.pid"
    fi
    
    # Kill any npm/node processes that might be running our app
    pkill -f "npm run dev" 2>/dev/null || true
    pkill -f "vite.*8080" 2>/dev/null || true
    sleep 1
    
    # Find PIDs using ports 8080 and 8501
    PIDS_8080=$(lsof -ti:8080 2>/dev/null || true)
    PIDS_8501=$(lsof -ti:8501 2>/dev/null || true)
    
    if [ -n "$PIDS_8080" ]; then
        echo "💀 Killing processes on port 8080: $PIDS_8080"
        echo "$PIDS_8080" | xargs kill -TERM 2>/dev/null || true
        sleep 2
        
        # Force kill if still running
        PIDS_8080=$(lsof -ti:8080 2>/dev/null || true)
        if [ -n "$PIDS_8080" ]; then
            echo "💀 Force killing stubborn processes on 8080: $PIDS_8080"
            echo "$PIDS_8080" | xargs kill -KILL 2>/dev/null || true
            sleep 1
        fi
    else
        echo "✅ Port 8080 is free"
    fi
    
    if [ -n "$PIDS_8501" ]; then
        echo "💀 Killing processes on port 8501: $PIDS_8501"
        echo "$PIDS_8501" | xargs kill -TERM 2>/dev/null || true
        sleep 2
        
        # Force kill if still running
        PIDS_8501=$(lsof -ti:8501 2>/dev/null || true)
        if [ -n "$PIDS_8501" ]; then
            echo "💀 Force killing stubborn processes on 8501: $PIDS_8501"
            echo "$PIDS_8501" | xargs kill -KILL 2>/dev/null || true
            sleep 1
        fi
    else
        echo "✅ Port 8501 is free"
    fi
}

# Function to start Vite dev server
start_vite() {
    echo "⚡ Starting Vite dev server..."
    
    # Check if we're in the right directory
    if [ ! -f "$WWW_DIR/package.json" ]; then
        echo "❌ package.json not found in $WWW_DIR"
        exit 1
    fi
    
    # Change to www directory
    cd "$WWW_DIR"
    echo "📁 Changed to: $(pwd)"
    
    # Start Vite dev server in background and save PID
    (cd "$WWW_DIR" && npm run dev > /var/log/vite.log 2>&1) &
    VITE_PID=$!
    echo "$VITE_PID" > "$PID_DIR/vite.pid"
    echo "✅ Vite dev server started (PID: $VITE_PID)"
    
    # Wait for server to start
    echo "⏳ Waiting for dev server to start..."
    sleep 5
    
    # Check if it's running and responding
    if kill -0 "$VITE_PID" 2>/dev/null && curl -sf http://localhost:8080 >/dev/null; then
        echo "✅ Dev server is running and responding on port 8080"
        echo "📝 Dev server logs: /var/log/vite.log"
    else
        echo "❌ Dev server failed to start! Check logs:"
        cat /var/log/vite.log
        exit 1
    fi
    
    # Return to original directory
    cd "$SCRIPT_DIR"
}

# Function to start cloudflare tunnel
start_tunnel() {
    echo "☁️  Starting Cloudflare tunnel..."
    
    # Check if cloudflared is installed
    if ! command -v cloudflared >/dev/null 2>&1; then
        echo "❌ cloudflared not found! Please install it first."
        exit 1
    fi
    
    # Check if config exists
    if [ ! -f "$HOME/.cloudflared/config.yml" ]; then
        echo "❌ Cloudflare tunnel config not found at ~/.cloudflared/config.yml"
        exit 1
    fi
    
    # Start tunnel in background and save PID
    cloudflared tunnel run > /var/log/cloudflared.log 2>&1 &
    TUNNEL_PID=$!
    echo "$TUNNEL_PID" > "$PID_DIR/tunnel.pid"
    echo "✅ Cloudflare tunnel started (PID: $TUNNEL_PID)"
    
    # Wait a moment and check if tunnel connected
    sleep 3
    if kill -0 "$TUNNEL_PID" 2>/dev/null; then
        echo "✅ Tunnel is running and connected"
        echo "📝 Tunnel logs: /var/log/cloudflared.log"
    else
        echo "❌ Tunnel failed to start! Check logs:"
        cat /var/log/cloudflared.log
        exit 1
    fi
}


# Function to show status of all services
show_status() {
    echo ""
    echo "📊 Service Status:"
    echo "=================="
    
    # Check PID files
    if [ -f "$PID_DIR/vite.pid" ] && kill -0 "$(cat "$PID_DIR/vite.pid")" 2>/dev/null; then
        echo "✅ Vite Dev Server: Running (PID: $(cat "$PID_DIR/vite.pid"))"
    else
        echo "❌ Vite Dev Server: Not running"
    fi
    
    if [ -f "$PID_DIR/tunnel.pid" ] && kill -0 "$(cat "$PID_DIR/tunnel.pid")" 2>/dev/null; then
        echo "✅ Cloudflare Tunnel: Running (PID: $(cat "$PID_DIR/tunnel.pid"))"
    else
        echo "❌ Cloudflare Tunnel: Not running"
    fi
    
    # Port check
    if netstat -tlnp 2>/dev/null | grep -q ":8080.*LISTEN"; then
        echo "✅ Port 8080 (Landing Page): Listening"
    else
        echo "❌ Port 8080 (Landing Page): Not listening"
    fi
    
    echo ""
    echo "🌍 Your site should be live at: https://www.artifactvirtual.com"
    echo "🏠 Local access: http://localhost:8080"
    echo ""
    echo "📝 Logs:"
    echo "   Vite dev server: /var/log/vite.log"
    echo "   Tunnel logs: /var/log/cloudflared.log"
    echo "   Arc Simulation: /tmp/arc_simulation.log"
}

# Main execution

# Main execution
main() {
    kill_all_services
    start_vite
    start_tunnel
    show_status
    echo "🎉 All services started successfully!"
    echo "💡 Service is running in systemd mode"
    # Prevent multiple instances: check if already running
    if pgrep -f "start-systemd.sh" | grep -v "$$" >/dev/null; then
        echo "\u274c Another instance of start-systemd.sh is already running. Exiting."
        exit 1
    fi
    # Keep the script running (systemd will manage it)
    wait
}

# Run main function
main
