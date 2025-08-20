## ARTIFACT VIRTUAL — MONOREPO OVERVIEW

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Solidity-0.8.x-black" alt="Solidity" />
  <img src="https://img.shields.io/badge/Hardhat-2.x-yellow" alt="Hardhat" />
  <img src="https://img.shields.io/badge/Express-4.x-black" alt="Express" />
  <img src="https://img.shields.io/badge/Systemd-252-0078D6?logo=linux&logoColor=white" alt="Systemd" />
  <img src="https://img.shields.io/badge/Nginx-1.2x-009639?logo=nginx&logoColor=white" alt="Nginx" />
</p>

Welcome to the Artifact Virtual monorepo. This repository is the central hub for all core infrastructure, including:

- **Smart contracts** (Solidity, Hardhat)
- **Backend API** (Node.js, Express)
- **Frontend webapp** (`/www`, React 18, TypeScript, Vite, Tailwind)
- **Configuration** (Nginx, scripts)
- **Documentation** (Markdown, diagrams)
- **Data & research** (AI/ML, research DB)

---

## Monorepo Structure

```
contracts/   # Solidity smart contracts, deployment, tests
server/      # Node.js backend API, aggregator, integration
www/         # Main frontend webapp (React, TypeScript, Vite)
config/      # Nginx config, automation scripts
docs/        # API, DEX, auction, and technical docs
data/        # Deep technical/business docs, research DB
```

---

## Quick Start

```bash
# Install dependencies for all packages
cd contracts && npm install
cd ../server && npm install
cd ../www && npm install

# Start backend API
cd ../server && npm run start

# Start frontend (in another terminal)
cd ../www && npm run dev
```

---

## Service Management

Systemd service (`artifactvirtual.service`) and shell scripts (`service.sh`, `start-systemd.sh`, `stop-systemd.sh`) are provided for robust deployment and management. See `project_overview.md` for full details.

---

## Key Features

- **Smart Contracts**: ProfileRegistry, SimpleSwap, OpenZeppelin, multi-chain ready, tested with Hardhat.
- **Backend API**: Express, aggregator endpoints for DEX/quotes, rate limiting, CORS, health checks, in-memory caching, OKX/other integrations.
- **Frontend Webapp**: `/www` — see below for full details.
- **DevOps**: Automated scripts, systemd, multi-environment support, Nginx reverse proxy, Cloudflare tunnel.
- **Security**: Audited contracts, rate limiting, CORS, compliance frameworks, audit logging.
- **AI/ML & Research**: Research pipelines, semantic search, quantum research support.

---

## /www — Main Webpage (Frontend)

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Radix UI, Shadcn/ui, Lucide icons, React Query, React Router, ethers, wagmi, viem, three.js, recharts, and more.

**Component Architecture:** Highly modular, with feature-specific folders (`components/`, `pages/`, `hooks/`, `lib/`, `contracts/`).

**Routing:** SPA with lazy-loaded routes for performance. Main routes: `/`, `/articles`, `/research`, `/dashboard`, `/systemmap`, `/swap`, `/profile`, `/eth`, `/design`, and fallback for 404.

**UI/UX:** Modern, animated, mobile-first, with custom backgrounds, interactive hero, horizontal scroll panels, and advanced visualizations.

**State Management:** React Query for data fetching/caching, Context for global state, custom hooks for wallet and swap logic.

**Web3 Integration:** Wallet connection (wagmi, ethers, viem), on-chain profile publishing, contract interaction.

**Research & Blog:** Markdown-driven blog and research sections, dynamic routing, and content loading.

**System Architecture:** Visualized in `SystemArchitecture.tsx`—shows integration of FastAPI backend, React IDE, AROS (AI/automation), templates, real-time sync, and plugin ecosystem.

**Real-Time & Plugins:** Designed for live collaboration, plugin/extension management, and hot-reload development.

**Assets:** Logos, images, and public assets in `/public`.

**Notable Features:**
- HorizontalApp: Unique horizontal scroll experience for ecosystem navigation.
- GloriousParticleLoader, NoiseLinesBackground, MouseRepelCanvas: Advanced visual/interactive components.
- FloatingSidebar, TopRightConnect: Persistent navigation and wallet connection.
- System Map, Dashboard, Swap, Profile: Rich, interactive, and data-driven pages.
- AI/ML & Research: Integration with research pipelines, semantic search, and future quantum features.

---

## Documentation & Further Reading

- `project_overview.md`: Authoritative, exhaustive context and insights for the entire workspace.
- `ROADMAP.md`: Technical roadmap, tasks, and status.
- `data/information-sheet.md`: Deep technical/business documentation.
- `docs/`: API, DEX, and secure auction docs.

---

## License

MIT License. See `LICENSE` for details.

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
