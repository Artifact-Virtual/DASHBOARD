#!/bin/bash

# ArtifactVirtual.com Landing Page Stop Script (Systemd Version)
# Stops Vite dev server and cloudflare tunnel

PID_DIR="/tmp/artifactvirtual"

echo "🛑 Stopping ArtifactVirtual.com services..."

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

# Fallback: kill any remaining processes
if pgrep -f "npm.*run.*dev" >/dev/null; then
    echo "📦 Stopping remaining npm dev processes..."
    pkill -f "npm.*run.*dev"
fi

if pgrep cloudflared >/dev/null; then
    echo "☁️  Stopping remaining cloudflared processes..."
    pkill cloudflared
fi

# Clean up any remaining processes on port 8080
PIDS=$(lsof -ti:8080 2>/dev/null || true)
if [ -n "$PIDS" ]; then
    echo "🧹 Cleaning up remaining processes on port 8080..."
    echo "$PIDS" | xargs kill -TERM 2>/dev/null || true
fi

# Clean up PID directory
rm -rf "$PID_DIR"

echo "🎉 All services stopped!"
