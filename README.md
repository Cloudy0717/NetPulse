# ⚡ NetPulse

> Real-time Network Monitoring Dashboard — Built for learning Communication & Networking

![Version](https://img.shields.io/badge/Version-1.0-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)

---

## Overview

NetPulse is a full-stack real-time network monitoring dashboard that visualizes system metrics, network traffic, and ping latency through WebSocket-powered live data streams.

Designed as a personal learning project for **Communication & Networking** concepts — from ICMP ping to WebSocket protocols to bandwidth monitoring.

---

## Tech Stack

```
Frontend                          Backend
─────────────────────────────     ─────────────────────────────
React 18 + TypeScript             Python + FastAPI
Vite 5                            WebSocket (/ws/live)
Tailwind CSS 3                    psutil (system metrics)
Recharts (data visualization)     ping3 (ICMP ping)
Lucide Icons                      speedtest-cli (bandwidth)
React Router 6                    JSON file storage
```

---

## Features — v1.0

| Feature | Status | Description |
|---------|--------|-------------|
| Real-time Dashboard | ✅ | Live CPU, RAM, Disk monitoring |
| Network Traffic | ✅ | Upload/Download speed + packet stats |
| Ping Monitor | ✅ | Latency tracking with online/offline detection |
| WebSocket | ✅ | Single connection, auto-reconnect |
| Toast Alerts | ✅ | CPU >90%, RAM >85%, Ping timeout |
| Charts | ✅ | CPU, Traffic, Ping history (Recharts) |
| Settings | ✅ | Refresh rate, theme, ping target, notifications |
| Dark/Light Theme | ✅ | Tailwind dark mode with context |
| Speed Test | ✅ | Background job with progress polling |
| Traceroute | ✅ | Network path visualization |
| Responsive UI | ✅ | Mobile-friendly sidebar layout |

---

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/NetworkMonitoringDashboard.git
cd NetworkMonitoringDashboard

# Backend
cd backend
python -m venv venv
.\venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload  # http://localhost:8000

# Frontend (new terminal)
cd frontend
pnpm install
pnpm dev                       # http://localhost:5173
```

> Or just double-click `start.bat` — it launches both servers and opens the browser.

---

## Project Structure

```
NetworkMonitoringDashboard/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry
│   │   ├── config.py            # Environment config
│   │   ├── models/schemas.py    # Pydantic models
│   │   ├── services/            # System, Network, Ping, Notification
│   │   ├── routers/             # WebSocket, Speedtest, Traceroute, Settings
│   │   └── jobs/                # Background tasks
│   ├── tests/                   # pytest
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # Dashboard, Charts, Layout, Toast
│   │   ├── contexts/            # Settings & Theme providers
│   │   ├── hooks/               # useWebSocket, useChartData
│   │   ├── pages/               # Dashboard, Settings, Network, Speedtest, Traceroute
│   │   └── types/               # TypeScript interfaces
│   └── package.json
├── start.bat                    # One-click launcher
└── stop.bat                     # One-click stopper
```

---

## Roadmap

### v2.0 — Enhanced Monitoring
- [ ] SQLite database for historical data
- [ ] History page with time-range filtering
- [ ] Battery & Temperature monitoring
- [ ] Port Scanner
- [ ] Custom alert thresholds
- [ ] Data export (CSV/JSON)

### v3.0 — Multi-Device & Advanced
- [ ] Multi-device monitoring (agent-based)
- [ ] User authentication & roles
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] Custom dashboard widgets
- [ ] Mobile app (React Native)

---

## Screenshots

> Dashboard with real-time monitoring
>
> ![Dashboard](docs/screenshots/dashboard.png)

---

## License

MIT

---

<div align="center">

**Built with curiosity about how networks work.**

`ping google.com` → `142.250.80.46` → and the journey begins...

</div>
