# 🚀 Surreal Board

> A Realtime Kanban Board built with React, Vite, and SurrealDB 2.3.10 featuring a pure Terminal Aesthetic.

![Terminal Kanban Dashboard](https://via.placeholder.com/800x400.png?text=Terminal+Kanban+Dashboard)

## ⚡ Features
- **Realtime Sync**: Native WebSockets and Live Queries via SurrealDB 2.x SDK.
- **Terminal Aesthetic**: Dark mode, JetBrains Mono, high contrast design.
- **Native HTML5 Drag & Drop**: Smooth column management.
- **Slide-in Detail Panel**: Quick edit descriptions, tags, and status.
- **NixOS Compatible**: Fully reproducible environments.

## 🛠 Database Management
We recommend **Surrealist** for managing your SurrealDB data visually.
* **[Surrealist (Official GUI)](https://surrealist.app)** (or https://app.surrealdb.com)
  * Query Playground
  * Record Explorer
  * Schema Designer
  * *Connect to `ws://localhost:8000` with `root/root`*
* **surreal SQL CLI**: For fast queries directly in your terminal.

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/surreal-board.git
   cd surreal-board
   npm install
   ```

2. **Environment Setup**
   Copy the example environment file and adjust if necessary:
   ```bash
   cp .env.example .env
   ```

3. **Start the Database & App**
   ```bash
   make dev
   ```

## ⌨️ Makefile Commands (`make help`)
```text
Available commands:
make dev      Start development server and database
make stop     Stop all related containers
make build    Build for production
make logs     View application logs
make help     Show this help message
```

## 🤝 Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📝 License
MIT License © 2026 Andreas Bader. See [LICENSE](LICENSE) for details.
