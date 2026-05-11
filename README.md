# SurKAi

![SurrealDB](https://img.shields.io/badge/SurrealDB-2.x-ff00a0?style=for-the-badge&logo=surrealdb)
![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![NixOS Compatible](https://img.shields.io/badge/NixOS-Compatible-5277C3?style=for-the-badge&logo=nixos)

> **SurKAi v1.3** = **sur**real + **k**anban + **ai**
>
> Zero-backend realtime Kanban board powered by SurrealDB 2.x & AI Assistant.

---

## What's new in v1.3

- **KAi Assistant** — AI-powered task generator with **Wiki Context Sync**. KAi understands your project architecture before suggesting tasks.
- **Advanced Project Wiki** — Integrated documentation with **Mermaid.js** diagrams and **Prism** syntax highlighting.
- **Architecture Templates** — One-click templates for **ADR** (Architectural Decision Records), **Setup**, and **Architecture** docs.
- **System Dashboard** — Dynamic status monitor in the empty Backlog column (Global Pulse, DB Stats, KAi Health).
- **Magnetic UX** — Todo-Panel with magnetic snap-points, position persistence, and double-click collapse.
- **System Manifest** — Automatic project sidebar in Wiki showing Stack, Ports, and Entrypoints.
- **SurrealDB 2.x Support** — Full compatibility with SurrealDB v2.x (Auth & Export headers).

## Core Features

- **Realtime** — SurrealDB LIVE SELECT for instant sync across all clients.
- **Zero Backend** — Browser connects directly to SurrealDB via WebSocket. No middleware needed.
- **Terminal Aesthetics** — High-end hacker dark theme with premium glassmorphism and animations.
- **Drag & Drop** — Serialized RecordID handling for safe SurrealDB updates.
- **Detail Panel** — Inline editing with CLI command copy-to-clipboard integration.
- **NixOS Compatible** — Declarative development environments (nix-shell/flakes).

---

## Quick Start

Works on any Linux, macOS, or Windows WSL2.

1. Install SurrealDB:
   curl -sSf https://install.surrealdb.com | sh

2. Clone and run:
   git clone https://github.com/diebugger-tech/SurKAi
   cd SurKAi
   cp .env.example .env
   npm install
   surreal start --bind 127.0.0.1:8000 --user root --pass root surrealkv://./data &
   npm run dev

3. Open http://localhost:5174

Edit .env:
VITE_SURREAL_URL=ws://127.0.0.1:8000/rpc
VITE_SURREAL_USER=root
VITE_SURREAL_PASS=root
VITE_SURREAL_NS=kanban
VITE_SURREAL_DB=projects

NixOS: nix-shell -p surrealdb nodejs

---

## Makefile

make help       Show available commands
make dev        Start development server (port 5174)
make stop       Stop dev server
make db-start   Start SurrealDB locally
make db-init    Initialize demo data
make status     Show service status

---

## Architecture

Browser (React) -> WebSocket -> SurrealDB -> LIVE SELECT (realtime push)

No Express. No FastAPI. No proxy. SurrealDB IS the backend.

---

## Database Management

Surrealist (official GUI): https://surrealist.app

---

## Integrations (coming soon)

- Obsidian — sync #todo tags from vault notes to board cards
- Hermes — bidirectional AI agent task sync
- Pflanternen — NixOS automation diagnostics as cards

---

## Contributing

Contributions welcome! See CONTRIBUTING.md
Open an issue: https://github.com/diebugger-tech/SurKAi/issues

---

## License

MIT © Andreas Bader 2026
