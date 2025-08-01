## ARTIFACT VIRTUAL DASHBOARD

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.4.5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.2.10-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.1-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white" alt="Node.js" />
      <img src="https://img.shields.io/badge/Systemd-252-0078D6?logo=linux&logoColor=white" alt="Systemd" />
  <img src="https://img.shields.io/badge/Linux-Ubuntu-FF8800?logo=ubuntu&logoColor=white" alt="Linux" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?logo=githubactions&logoColor=white" alt="Build Status" />
  <img src="https://img.shields.io/badge/Network-Cloudflare-orange?logo=cloudflare&logoColor=white" alt="Network" />
  <img src="https://img.shields.io/badge/Nginx-1.24.0-009639?logo=nginx&logoColor=white" alt="Nginx" />
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?logo=vercel&logoColor=white" alt="Status" />
</p>

Welcome to the main dashboard for Artifact Virtual. This foundation is designed to evolve and expand as new systems and capabilities are introduced and interconnected. This project is more than a landing page: it is the central hub for Artifact Virtual’s growing ecosystem, built to support future integrations, research, and advanced features.

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

## Arc Simulation System

The `/arc_simulation` directory contains an **Advanced Multi-ARC Constitutional Intelligence System** - a sophisticated multi-layer governance simulation with real-time circular validation, economic stress modeling, and comprehensive live dashboard capabilities.

### Advanced Constitutional Intelligence Architecture

The system implements a sophisticated **dual-layer architecture** combining headless data generation with live interactive visualization:

#### System Architecture

**🔄 Headless Data Generation Layer:**
- `headless_daemon.py`: Background Multi-ARC Constitutional Intelligence Network
- Continuous rich data generation without UI overhead
- Advanced circular validation between ARCs
- Economic stress propagation and crisis management
- Constitutional era tracking and governance evolution

**🖥️ Live Visualization Layer:**
- `live_stream.py`: Advanced Multi-ARC Live Stream Dashboard
- Real-time constitutional intelligence monitoring
- Interactive circular validation visualization
- Economic stress analysis and crisis indicators
- Constitutional governance tracking with ADAM protocol

#### Core Components

- **LiveContextLoop (Enhanced)**: Advanced Multi-ARC Constitutional Intelligence Network with:
  - **Dynamic ARC addition/removal** with automatic validator assignment
  - **Circular validation network** ensuring system integrity across ARCs
  - **Cross-ARC validation** with sophisticated multi-criteria validation
  - **Economic stress propagation** across constitutional layers
  - **Constitutional era tracking** with network-wide consensus
  - **Multi-layer event correlation** and crisis detection
  - **Real-time network topology management**

- **ARC (Constitutional Layer)**: Blockchain-based constitutional law with evolving validation rules
- **ADAM Protocol (AI Governance)**: Intelligent rule evolution based on ethical observations and guilt tracking  
- **FUEL Network (Economic Substrate)**: Competitive agents in resource-constrained survival environment

#### Advanced LiveContextLoop Features

The `LiveContextLoop` class serves as the central nervous system, orchestrating complex interactions:

**Multi-ARC Network State:**
```python
# Dynamic network with circular validation
self.arcs = {}  # {arc_id: arc_instance}
self.adams = {}  # {arc_id: adam_instance}
self.arc_relationships = {}  # {arc_id: [validator_arc_ids]}
self.validation_history = {}  # Track cross-ARC validations
```

**Circular Validation Process:**
1. Each ARC validates 1-2 other ARCs in circular pattern
2. Multi-criteria validation: primary, structure, consensus
3. Network stress calculation based on validation failures
4. Dynamic network management: expansion/contraction based on stress
5. Cross-ARC event resolution and governance consensus

**Advanced Step Execution:**
1. **FUEL Economic Foundation**: Multi-factor crisis detection (mass deaths, resource shortage, scheduled stress)
2. **ARC Constitutional Layer**: Cross-validation with circular validation network
3. **ADAM Governance Layer**: Network-aware governance with stress response
4. **Dynamic Network Management**: Intelligent ARC addition/removal
5. **Cross-System Event Resolution**: Message bus and agent registry coordination

**Crisis Management:**
- **Multi-factor crisis detection**: Deaths, resources, scheduled stress
- **Network stress monitoring**: Validation failure rates
- **Constitutional era advancement**: Network majority consensus
- **Dynamic network adaptation**: Expansion in stable periods, contraction under stress

### Rich Data Structure

The system generates comprehensive state data:

#### Network State Structure
```json
{
  "step": 150,
  "era": 3,
  "crisis_mode": false,
  "crisis_indicators": [],
  
  "network_state": {
    "arcs": [
      {
        "arc_id": 0,
        "total_blocks": 45,
        "validators": [1, 2],
        "validator_count": 2,
        "recent_validation_failures": 1,
        "adam_guilt": 0.3,
        "adam_policy": "moderate"
      }
    ],
    "validation_relationships": {0: [1, 2], 1: [2, 0], 2: [0, 1]},
    "validation_metrics": {
      "total_validation_pairs": 6,
      "recent_failures": 2,
      "network_stress": 0.15,
      "circular_validation_active": true
    },
    "total_arc_count": 3,
    "network_topology": "circular",
    "dynamic_management_active": true
  },
  
  "fuel_alive": 6,
  "economic_stress": 0.25,
  "economic_health": 0.75,
  
  "total_violations": 12,
  "constitutional_stability": 0.92,
  "governance_events": [...],
  "system_complexity": 18,
  "integration_health": 0.85
}
```

### State Management

The simulation uses a comprehensive file-based state management system:

#### Control Files
- `simulation_data/control.json`: Controls simulation playback
  ```json
  {"play": true, "speed": 0.5}
  ```
- `simulation_data/reset.json`: Triggers simulation reset (auto-deleted after read)
- `simulation_data/latest.json`: Current simulation state data

#### State Data Structure
```json
{
  "step": 42,
  "fuel_alive": 6,
  "fuel_dead": 2,
  "fuel_avg": 75.3,
  "fuel_deaths_this_step": 1,
  "adam_scores": [12, 8, 15],
  "adam_guilt": [0.2, 0.8, 0.1],
  "adam_policies": ["liberal", "conservative", "moderate"],
  "arc_data": [
    {"arc_id": 0, "total_blocks": 150, "disputed_blocks": 3, "last_block_valid": true}
  ],
  "crisis_mode": false,
  "total_disputes": 2
}
```

### Usage

**Dual-System Launch (Recommended):**

```bash
cd arc_simulation
chmod +x start.sh
./start.sh
```

The system will:

1. Activate virtual environment
2. Start headless background daemon with Multi-ARC Constitutional Intelligence
3. Launch advanced live stream dashboard at <http://localhost:8501>
4. Provide real-time circular validation visualization and crisis monitoring

**Advanced Dashboard Features:**

- Real-time Multi-ARC Constitutional Intelligence monitoring
- Interactive circular validation network visualization  
- Economic stress analysis with crisis indicators
- Constitutional governance tracking with ADAM protocol
- Dynamic network topology management
- Cross-ARC validation metrics and failure analysis
- Constitutional era progression and governance evolution

**Background Daemon Management:**

The headless daemon (`headless_daemon.py`) runs continuously and:

- Generates rich Multi-ARC Constitutional Intelligence data
- Manages circular validation between ARCs
- Handles economic stress propagation and crisis detection
- Tracks constitutional era advancement through network consensus
- Provides dynamic network expansion/contraction based on stress
- Maintains comprehensive state persistence across multiple JSON files

The system showcases sophisticated emergent governance patterns through the interaction of economic stress, constitutional evolution, and intelligent governance adaptation across multiple constitutional layers with advanced circular validation.

## Logs

- **Nginx errors**: `/tmp/nginx_error.log`
- **Tunnel logs**: `/tmp/cloudflared.log`  
- **Advanced Multi-ARC Simulation logs**: Console output from `headless_daemon.py` and `live_stream.py`
