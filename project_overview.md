# Project Overview

This platform is a multi-layered, enterprise-ready monorepo featuring a modern React frontend, robust smart contract infrastructure, and advanced simulation backend. The workspace is organized for clarity, scalability, and rapid development.

---

## 🏗️ Architecture Overview

- **Monorepo Structure:**  
    Organized into backend (`/server`), smart contracts (`/contracts`), frontend (`/www`), configuration (`/config`), documentation (`/docs`), and data (`/data`).
- **Documentation:**  
    Extensive technical and architectural documentation in `ROADMAP.md`, `project_overview.md`, and `information-sheet.md`, including Mermaid diagrams and technology stack tables.

---

## 🗂️ Directory Structure

```
/contracts      # Smart contracts (Solidity, Hardhat)
/server         # Node.js backend (API, integration)
/www            # React frontend (UI, dashboards)
/config         # Configuration files (Nginx, scripts)
/docs           # Documentation (Markdown, diagrams)
/data           # Supporting datasets, research DB
```

---

## Backend / Server (`/server`)

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-black)](https://expressjs.com/)

- **Tech Stack:** Node.js, Express, CORS, rate limiting, logging (Morgan).
- **API Endpoints:**
    - `/api/aggregator/quote` and `/api/aggregator/prepare-swap` for aggregator/DEX operations.
    - `/health` for health checks.
- **Handlers:** Core logic in `lib/aggregator.js`.
- **Environment:** Loads `.env.local`, supports OKX credentials for exchange integration.
- **Aggregator logic** and test client included.
- **Integrates** with frontend and simulation backend.

---

## Smart Contracts (`/contracts`)

[![Solidity](https://img.shields.io/badge/Solidity-0.8.x-black)](https://docs.soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.x-yellow)](https://hardhat.org/)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4.x-blue)](https://openzeppelin.com/)

- **Solidity Contracts:**  
    `ProfileRegistry.sol` and `SimpleSwap.sol` in `src/`.
- **Hardhat:** Compilation, deployment, and testing (`hardhat.config.js`).
- **Scripts:**  
    - `deploy.js`, `deploy-swap.js` for contract deployment.
    - `e2e-setprofile.js` for end-to-end profile setting.
- **Testing:**  
    Tests in `test/` and e2e scripts.
- **Roadmap:** Migration to OpenZeppelin, multi-chain support, advanced admin/role management.

---

## Frontend (`/www`)

[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-yellow)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-blue)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.1x-green)](https://threejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black)](https://socket.io/)

- **Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS.
- **State Management:** React Query, Context.
- **Routing:** React Router.
- **Structure:**
    - Main entry: `src/main.tsx`, `App.tsx`.
    - Modular components with feature-specific folders (e.g., `horizontal`, `ai`, `wallet`).
    - Pages: Lazy-loaded for performance.
- **UI:** Custom and third-party components (Lucide icons, Toaster, Sonner).
- **Features:**
    - Dashboard, research, articles, profile, swap, and system map pages.
    - Technical specs and system architecture visualizations.
    - Real-time features and plugin ecosystem (`SystemArchitecture.tsx`).
- **Assets:** Logos and images in `public/`.

---

## Configuration (`/config`)

[![Nginx](https://img.shields.io/badge/Nginx-1.2x-green)](https://nginx.org/)
[![Cloudflare Tunnel](https://img.shields.io/badge/Cloudflare%20Tunnel-active-orange)](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)

- **Nginx:** Reverse proxy and static file serving (`nginx.conf`, `mime.types`).
- **Cloudflare Tunnel:** Secure remote access.
- **Python & Node.js** package management.
- **Automated setup, backup, and maintenance scripts.**

---

## Documentation (`/docs`)

- **Comprehensive guides:** `README.md`, `ROADMAP.md`, `information-sheet.md`
- **API Docs:** Aggregator market/trade API, DEX implementation/integration, secure auction implementation.
- **Technical Roadmap:** Detailed in `ROADMAP.md` with tasks, features, and status.
- **Quick start instructions** and **architecture diagrams** (Mermaid).
- **Detailed feature and technology breakdowns.**

---

## Data (`/data`)

- **Information Sheet:** Deep technical and business documentation, including system architecture, integration endpoints, and technology stack.
- **Research Database:** Used for AI/ML and research features in the frontend.

---

## Notable Patterns & Features

- **AI/ML Integration:** Multi-provider AI, research pipeline, vector search, quantum research support.
- **Enterprise Features:** Distributed multi-agent orchestration, REST/WebSocket APIs, business intelligence, automation.
- **Security:** AES-256 encryption, compliance frameworks, audit logging.
- **Deployment:** Multiple environments (dev, alpha, quantum, enterprise) with Kubernetes, PostgreSQL, Redis, and monitoring.

---

> For a deeper dive, explore the documentation and architecture diagrams in the `/docs` directory.

