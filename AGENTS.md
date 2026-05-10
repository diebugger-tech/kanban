# AI Agent Constraints & Architecture (surreal-board)

> Global context file for AI coding agents working on this repository.

## Stack & Constraints
- **Frontend**: React 18, Vite.
- **Backend/DB**: SurrealDB 2.3.10 (WebSocket).
- **Styling**: Terminal Aesthetic (Dark mode, `#00ffaa` accents, JetBrains Mono).
- **Rule**: Single-File Rule. One file per commit.
- **Rule**: NEVER change existing migration files.

## Key Files
- `src/App.jsx`: Main Kanban application logic and UI.
- `src/index.css`: Global styles.
- `Makefile`: Commands for dev, stop, logs.
- `db_init.sh`: SurrealDB initialization script.

## Coding Conventions
- **SurrealDB SDK v2.x**: Always use the `authentication` object for credentials (not `auth`), and `namespace`/`database` options in `db.connect()`.
- Use async/await for all DB calls.
- Stick to React hooks (`useState`, `useEffect`, `useRef`).
- Maintain the high-contrast terminal UI — avoid over-engineering the CSS.
