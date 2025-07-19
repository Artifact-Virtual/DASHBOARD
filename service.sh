#!/bin/bash

# ArtifactVirtual.com Service Management Script

case "$1" in
    start)
        echo "🚀 Starting ArtifactVirtual.com service..."
        sudo systemctl start artifactvirtual.service
        ;;
    stop)
        echo "🛑 Stopping ArtifactVirtual.com service..."
        sudo systemctl stop artifactvirtual.service
        ;;
    restart)
        echo "🔄 Restarting ArtifactVirtual.com service..."
        sudo systemctl restart artifactvirtual.service
        ;;
    status)
        sudo systemctl status artifactvirtual.service --no-pager
        ;;
    logs)
        echo "📝 Showing service logs (Ctrl+C to exit)..."
        sudo journalctl -u artifactvirtual.service -f
        ;;
    logs-vite)
        echo "📝 Showing Vite dev server logs (Ctrl+C to exit)..."
        tail -f /var/log/vite.log
        ;;
    logs-tunnel)
        echo "📝 Showing Cloudflare tunnel logs (Ctrl+C to exit)..."
        tail -f /var/log/cloudflared.log
        ;;
    enable)
        echo "✅ Enabling auto-start on boot..."
        sudo systemctl enable artifactvirtual.service
        ;;
    disable)
        echo "❌ Disabling auto-start on boot..."
        sudo systemctl disable artifactvirtual.service
        ;;
    test)
        echo "🧪 Testing site accessibility..."
        if curl -sf http://localhost:8080 >/dev/null; then
            echo "✅ Site is responding on http://localhost:8080"
            echo "🌍 Should also be live at: https://www.artifactvirtual.com"
        else
            echo "❌ Site is not responding"
        fi
        ;;
    *)
        echo "ArtifactVirtual.com Service Manager"
        echo "Usage: $0 {start|stop|restart|status|logs|logs-vite|logs-tunnel|enable|disable|test}"
        echo ""
        echo "Commands:"
        echo "  start       - Start the service"
        echo "  stop        - Stop the service"
        echo "  restart     - Restart the service"
        echo "  status      - Show service status"
        echo "  logs        - Show service logs (live)"
        echo "  logs-vite   - Show Vite dev server logs"
        echo "  logs-tunnel - Show Cloudflare tunnel logs"
        echo "  enable      - Enable auto-start on boot"
        echo "  disable     - Disable auto-start on boot"
        echo "  test        - Test if site is accessible"
        exit 1
        ;;
esac
