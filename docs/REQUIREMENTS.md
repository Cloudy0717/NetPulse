# NetPulse - Project Requirements Log

**Date:** 2026-07-14

---

## Project Overview

Network Monitoring Dashboard for learning Communication & Networking.

**One-liner:** A modern web-based network monitoring dashboard that displays real-time system and network statistics, performs network diagnostics, and provides AI-assisted troubleshooting.

---

## Technology Decisions

| Category | Choice | Reason |
|----------|--------|--------|
| Frontend Framework | React | Industry standard, great for dashboards |
| Language | TypeScript | Modern React projects should use TS |
| Styling | Tailwind CSS + shadcn/ui | Modern, clean, dark-theme ready |
| Charts | Recharts | React-native, composable, live data |
| Icons | Lucide Icons | Consistent, lightweight |
| Build Tool | Vite | Fast dev server, modern bundler |
| Routing | react-router-dom | Modern React routing, URL-based |
| Package Manager | pnpm | Faster than npm |
| Backend Framework | FastAPI | Async, auto Swagger, modern |
| Real-time | WebSocket (single connection) | Enterprise standard, shows networking skills |
| Database (v1) | JSON file | Keep MVP simple |
| Database (v2) | SQLite | For history storage |
| Formatters | ruff + black (backend), eslint + prettier (frontend) | Code quality |
| Testing | Vitest + React Testing Library (frontend), pytest (backend) | Modern test stack |

---

## Architecture Decisions

### WebSocket Design
- **Single connection** at `/ws/live`
- Sends all data: system, traffic, ping, alerts
- Backend pushes every 1 second
- No polling, no multiple connections

### Notification System
- **Backend detects alerts** (CPU >90%, RAM >85%, Ping timeout)
- Backend pushes alerts via WebSocket
- Frontend only renders toast notifications
- Future: Email, Discord, Telegram, Webhook can reuse backend logic

### Speed Test
- **Background job pattern**
- `POST /api/speedtest` → returns `job_id`
- `GET /api/speedtest/{job_id}` → returns status + result
- Frontend polls until done (20-30 seconds typical)

### Settings Storage
- **JSON file** in v1 (`data/settings.json`)
- SQLite in v2 for history

### Configuration
- **`.env` files** for all config
- API_PORT, FRONTEND_URL, DEFAULT_PING_HOST, REFRESH_RATE, LOG_LEVEL

---

## Features (V1)

### 1. Dashboard (Home)
- CPU Usage card with progress bar
- RAM Usage card with progress bar
- Disk Usage card with progress bar
- Network Traffic card (Upload/Download)
- Ping card with latency + status
- Live charts (CPU, Traffic, Ping)

### 2. System Information
- Hostname
- Operating System
- CPU Model
- RAM Total/Used
- Disk Total/Used
- Python Version

### 3. Network Information
- IPv4
- IPv6
- MAC Address
- Gateway
- DNS
- Public IP
- Network Interface
- Interface Status

### 4. Real-time Traffic
- Upload speed (MB/s)
- Download speed (MB/s)
- Live line chart

### 5. Ping Monitor
- Default targets: Google, Cloudflare
- Custom host input
- Current latency
- Status: Online/Offline

### 6. Speed Test
- Manual trigger button
- Background job execution
- Results: Download, Upload, Latency, Server

### 7. Traceroute
- User input: hostname
- Visual hop-by-hop display

### 8. Settings Page
- Refresh Rate: 1s / 2s / 5s
- Theme: Dark / Light
- Default Ping Target: Google / Cloudflare
- Notification Alerts: Toggle on/off

### 9. Notification System
- Backend detects: CPU >90%, RAM >85%, Ping timeout
- Toast popup (bottom-right)
- Auto-dismiss after 5s

---

## Features (V2 - Future)

- Port Scanner
- Speed Test History (SQLite)
- Ping History (SQLite)
- History Page
- LibreSpeed (replace speedtest-cli)

---

## Features (V3 - Future)

- AI Network Assistant
- Packet Sniffer (scapy)
- Network Anomaly Alerts
- Multi-device Monitoring
- Docker Deployment
- Login System
- PostgreSQL Migration

---

## Code Style Requirements

### Backend
- Python 3.11+
- ruff + black for formatting
- `logging` module for all output
- No hardcoded values, use `.env`

### Frontend
- TypeScript only (no JavaScript)
- pnpm for package management
- eslint + prettier for formatting
- Vitest + React Testing Library for tests
- Component hierarchy: App → Routes → Pages → Components

---

## Folder Structure

```
NetPulse/
├── frontend/          # React + TypeScript
├── backend/           # FastAPI + Python
├── data/              # JSON files (v1)
├── docs/              # Specs and plans
├── README.md
└── .gitignore
```

---

## Learning Objectives

- Networking: IP, DNS, Ping, Ports, Traceroute, Speed Test
- APIs: REST design, WebSocket, async endpoints
- Frontend: React, TypeScript, real-time UI, charting
- Backend: FastAPI, psutil, system calls
- Database: JSON (v1), SQLite (v2)
- Visualization: Live charts, status indicators
- DevOps: Docker (v3)

---

*This file records all project requirements and decisions made during planning.*
