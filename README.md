# SQL Lite GUI

A modern, fast, and intuitive SQLite GUI built with Electron, React, and Vite. Designed for developers who need a lightweight but powerful tool to manage their SQLite databases.

## Features

- **Blazing Fast**: Built with Vite and React for a smooth user experience.
- **SQL Editor**: Advanced SQL editor with syntax highlighting for SQLite.
- **Table Browser**: Easily explore and manage table structures and data.
- **Dark Mode**: Beautiful, modern UI with dark mode support.
- **Lightweight**: Optimized footprint for quick startup and low resource usage.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/sql-lite-gui.git
   cd sql-lite-gui
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application in development mode**:
   ```bash
   npm run dev:renderer
   npm run dev:electron
   npm start
   ```

## Build and Distribution

To build the application for production and package it for your operating system:

```bash
# Build and package the application
npm run dist
```

The packaged application will be located in the `dist-out/` directory.

## Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/)
- **Frontend**: [React](https://reactjs.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
