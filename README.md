# surbanai

![SurrealDB](https://img.shields.io/badge/SurrealDB-2.x-ff00a0?style=for-the-badge&logo=surrealdb)
![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![NixOS Compatible](https://img.shields.io/badge/NixOS-Compatible-5277C3?style=for-the-badge&logo=nixos)


**surreal + kanban + ai — Zero-backend realtime Kanban board**

> **surbanai** = **sur**real + kan**ban** + **ai**

## 🚀 Features

- **Realtime updates**: Powered by SurrealDB `LIVE SELECT` for instantaneous synchronization.
- **Dark/Light Themes**: Switch between a terminal-style dark mode and a clean light mode.
- **Terminal/hacker dark theme**: Sleek high-contrast UI using JetBrains Mono.
- **Drag & Drop**: Fluid task movement between columns via native HTML5 API.
- **Detail Panel**: Click any card to open a side panel with inline editing.
- **Command Management**: Copy project START/STOP commands directly to your clipboard.
- **NixOS Compatible**: Optimized for declarative development environments.

## Screenshots

### Dark Theme (Terminal)
![surbanai dark theme](./docs/screenshot-dark.png)

### Light Theme (Clean)
![surbanai light theme](./docs/screenshot-light.png)

## ⚡ Quick Start

```bash
git clone https://github.com/diebugger-tech/surbanai
cd surbanai
cp .env.example .env
# Edit .env with your SurrealDB credentials
npm install && npm run dev
```

## Integrations (coming soon)
- **Obsidian** — sync vault notes and #todo tags to board cards
- **Hermes** — bidirectional AI agent task sync
- **Pflanternen** — NixOS automation diagnostics as cards

## 🛠 Management

### Makefile
Run `make help` to see all available automation tasks.

### Database
For visual database management, we recommend using [Surrealist](https://surrealist.app).

## 📖 Branching & Setup
- **main branch**: Generic, community-ready version for general use.
- **personal setup branch**: Tailored for specific NixOS configurations (see [AGENTS.md](./AGENTS.md)).

## 🤝 Contributing
Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.
