
# Artifact Virtual Dashboard

Welcome to the main dashboard for Artifact Virtual—a foundation designed to evolve and expand as new systems and capabilities are introduced and interconnected. This project is more than a landing page: it is the central hub for Artifact Virtual’s growing ecosystem, built to support future integrations, research, and advanced features.

Currently, the dashboard is accessible worldwide via a secure Cloudflare tunnel. The long-term vision is to transition to a  production-grade deployment using SSL certificates and direct hosting on port 80, ensuring robust, secure, and seamless access. ISP limitations are being aggressively addressed to enable this transition.

Whether you’re contributing, deploying, or exploring, this repository is the starting point for Artifact Virtual’s journey toward a unified, extensible platform.

## Service Management & Resilience

This project uses a systemd service (`artifactvirtual.service`) for robust management. Services started via systemd will continue running even if you log out, disconnect your terminal, or close your SSH session. 

**Note:** If your computer goes to sleep or hibernates (e.g., lid closed), all processes—including systemd services—will pause until the system wakes up. On wake, systemd will resume services automatically if configured with restart policies.



### Managing the Service

Use the provided `service.sh` script for easy management:

```bash
./service.sh start      # Start the service
./service.sh stop       # Stop the service
./service.sh restart    # Restart the service
./service.sh status     # Show service status
./service.sh logs       # Show live service logs
./service.sh enable     # Enable auto-start on boot
./service.sh disable    # Disable auto-start on boot
./service.sh test       # Test if site is accessible
```

For direct systemd commands:

```bash
sudo systemctl start artifactvirtual.service
sudo systemctl stop artifactvirtual.service
sudo systemctl status artifactvirtual.service
```

## Quick Start

```bash
# Start everything (nginx + cloudflare tunnel)
./start.sh

# Stop everything
./stop.sh
```

## Structure

```
cert-nginx/
├── start.sh              # Main startup script
├── stop.sh               # Stop script  
├── config/
│   ├── nginx.conf         # Minimal nginx config
│   └── mime.types         # File type mappings
├── ssl/
│   └── certs/            # SSL certificates (kept for future use)
│       ├── server.crt
│       └── server.key
└── www/
    ├── README.md         # React app documentation
    └── dist/             # Built React application
        ├── index.html    # Main HTML file
        ├── assets/       # JS/CSS bundles
        └── *.png         # Logo assets
```

## What the start script does

1. 🔍 Kills any processes using port 8080
2. 🌐 Starts nginx on port 8080 serving the React landing page
3. ☁️ Starts Cloudflare tunnel connecting to localhost:8080
4. ✅ Verifies everything is working

## Access

- **Global**: <https://www.artifactvirtual.com>
- **Local**: <http://localhost:8080>

## Features

- **Modern React App**: Built with TypeScript, Vite, and Tailwind CSS
- **Blog System**: Integrated markdown blog functionality
- **Responsive Design**: Mobile-first approach with beautiful animations
- **SEO Optimized**: Proper meta tags and social media cards
- **Performance**: Optimized bundles with code splitting

## Logs

- Nginx errors: `/tmp/nginx_error.log`
- Tunnel logs: `/tmp/cloudflared.log`
