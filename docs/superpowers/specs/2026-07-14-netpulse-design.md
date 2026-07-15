# NetPulse – Network Monitoring Dashboard

**Design Spec v1.0**

**Date:** 2026-07-14

**Status:** Initial Design

---

## 1. Overview

NetPulse is a modern web-based network monitoring dashboard for learning Communication & Networking concepts. It displays real-time system and network statistics, performs network diagnostics, and provides AI-assisted troubleshooting.

### One-liner

A personal learning project to understand networking, APIs, client-server architecture, and real-time data visualization.

### Target Audience

- Self-learning (Communication & Networking course)
- GitHub Portfolio showcase

---

## 2. Technology Stack

### Frontend

| Category | Choice | Reason |
|----------|--------|--------|
| Framework | React | Industry standard, great for dashboards |
| Styling | Tailwind CSS + shadcn/ui | Modern, clean, dark-theme ready |
| Charts | Recharts | React-native, composable, live data |
| Icons | Lucide Icons | Consistent, lightweight |
| Build Tool | Vite | Fast dev server, modern bundler |

### Backend

| Category | Choice | Reason |
|----------|--------|--------|
| Language | Python | Rich networking libraries |
| Framework | FastAPI | Async, auto Swagger, modern |
| Database | SQLite (v1) → PostgreSQL (v3) | Start simple, scale later |

### Python Libraries

| Library | Purpose |
|---------|---------|
| psutil | CPU, RAM, Disk, Network I/O |
| ping3 | Ping latency |
| socket | IP, Hostname, DNS |
| speedtest-cli | Internet speed test |
| scapy | Packet capture (v2) |
| python-nmap | Port scanner (v2) |
| requests | Public IP lookup |

### Deployment

| Tool | Purpose |
|------|---------|
| Docker | Containerization |
| Docker Compose | Multi-service orchestration |

---

## 3. Folder Structure

```
NetPulse/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page-level components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service calls
│   │   ├── assets/           # Static assets
│   │   └── utils/            # Utility functions
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── routers/          # API route handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Data models (Pydantic)
│   │   └── utils/            # Helper functions
│   ├── main.py               # FastAPI app entry
│   └── requirements.txt
│
├── data/                     # SQLite DB files (.db)
├── docs/                     # Documentation & specs
├── screenshots/              # Project screenshots
├── README.md
├── docker-compose.yml
└── .gitignore
```

---

## 4. Features (8 Modules)

### Module 1: Dashboard (Home)

**Purpose:** Main overview page with all key metrics at a glance.

**Cards displayed:**
- CPU Usage (with progress bar)
- RAM Usage (with progress bar)
- Disk Usage (with progress bar)
- Upload Speed (real-time)
- Download Speed (real-time)
- Public IP
- Local IP
- Gateway
- Hostname
- OS
- Network Interface

**Live Charts:**
- CPU usage over time (line chart)
- RAM usage over time (line chart)
- Network traffic upload/download (dual line chart)
- Ping latency (line chart)

**Update frequency:** Every 1 second

---

### Module 2: System Information

**Purpose:** Detailed computer information.

**Data displayed:**

| Field | Example |
|-------|---------|
| Hostname | Windows-PC |
| Operating System | Windows 11 |
| CPU | Intel i5-13420H |
| RAM | 16GB |
| Disk | 512GB SSD |
| Python Version | 3.12.x |
| Battery | 85% (if laptop) |
| Temperature | 65°C (if supported) |

---

### Module 3: Network Information

**Purpose:** Detailed network configuration.

**Data displayed:**

| Field | Example |
|-------|---------|
| IPv4 | 192.168.1.23 |
| IPv6 | fe80::1 |
| MAC Address | AA:BB:CC:DD:EE:FF |
| Gateway | 192.168.1.1 |
| DNS | 8.8.8.8 |
| Public IP | 183.xxx.xxx.xxx |
| Network Interface | WiFi / Ethernet / VPN |
| Interface Status | Up / Down |

---

### Module 4: Real-time Traffic Monitor

**Purpose:** Live network traffic with charts.

**Data displayed:**
- Upload speed (MB/s)
- Download speed (MB/s)
- Live line chart (like Task Manager Network tab)

**Update frequency:** Every 1 second

**Chart style:**
- X-axis: Time (last 60 seconds)
- Y-axis: Speed (MB/s)
- Two lines: Upload (green) / Download (blue)

---

### Module 5: Ping Monitor

**Purpose:** Continuous ping to multiple hosts.

**Default targets:**
- Google (8.8.8.8)
- Cloudflare (1.1.1.1)
- Custom host (user input)

**Data per host:**
- Current latency (ms)
- Average latency
- Min latency
- Max latency
- Packet loss (%)
- Status: 🟢 Online / 🔴 Offline

**Update frequency:** Every 1 second (per host)

---

### Module 6: Speed Test

**Purpose:** Manual internet speed test.

**User action:** Click "Run Speed Test" button

**Results displayed:**
- Download speed (Mbps)
- Upload speed (Mbps)
- Latency (ms)
- Jitter (ms)
- Server used

**History:** Stored in SQLite for comparison

---

### Module 7: Port Scanner

**Purpose:** Scan open ports on a target IP.

**User input:** Target IP address

**Common ports scanned:**

| Port | Service |
|------|---------|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 3306 | MySQL |
| 8080 | HTTP Alt |

**Results displayed:**
- Port number
- Service name
- Status: Open / Closed / Filtered

---

### Module 8: Traceroute

**Purpose:** Visual route trace to a destination.

**User input:** Hostname (e.g., google.com)

**Results displayed:**
- Hop number
- IP address
- Hostname
- Latency (ms)

**Visual representation:**
```
PC → Router → ISP → Backbone → Destination
```

---

## 5. API Design

### Base URL

```
http://localhost:8000/api/v1
```

### Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/system` | System info (CPU, RAM, Disk) | - |
| GET | `/network` | Network info (IP, MAC, Gateway) | - |
| GET | `/traffic` | Real-time upload/download speed | - |
| GET | `/ping` | Ping a host | `?host=google.com` |
| GET | `/ping/monitor` | Continuous ping (SSE/stream) | `?host=google.com` |
| POST | `/speedtest` | Run speed test | - |
| POST | `/portscan` | Scan ports | `{"target": "192.168.1.1"}` |
| POST | `/traceroute` | Trace route | `{"host": "google.com"}` |
| GET | `/history/speed` | Speed test history | `?limit=10` |
| GET | `/history/ping` | Ping history | `?host=google.com&limit=100` |
| GET | `/health` | Health check | - |

### Response Format

All responses follow:

```json
{
  "status": "success",
  "data": { ... },
  "timestamp": "2026-07-14T12:00:00Z"
}
```

### Error Format

```json
{
  "status": "error",
  "message": "Invalid host",
  "code": 400
}
```

---

## 6. UI/UX Design

### Theme: Dark Mode (Default)

| Element | Color |
|---------|-------|
| Background | Slate (#0f172a) |
| Card | Dark Gray (#1e293b) |
| Accent | Blue (#3b82f6) |
| Success | Green (#22c55e) |
| Error | Red (#ef4444) |
| Text Primary | White (#ffffff) |
| Text Secondary | Gray (#94a3b8) |

### Layout

```
┌─────────────────────────────────────────────────────┐
│  HEADER: NetPulse Logo + Title                      │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ SIDEBAR  │         MAIN CONTENT AREA                │
│          │                                          │
│ Dashboard│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ Network  │  │  CPU    │ │  RAM    │ │ Disk    │   │
│ Ping     │  └─────────┘ └─────────┘ └─────────┘   │
│ Speed    │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ Ports    │  │ Upload  │ │Download │ │  Ping   │   │
│ Trace    │  └─────────┘ └─────────┘ └─────────┘   │
│ History  │  ┌───────────────────────────────────┐   │
│ Settings │  │         LIVE CHARTS               │   │
│          │  └───────────────────────────────────┘   │
│          │  ┌───────────────────────────────────┐   │
│          │  │      RECENT EVENTS                │   │
│          │  └───────────────────────────────────┘   │
└──────────┴──────────────────────────────────────────┘
```

### Sidebar Navigation

- Dashboard (Home)
- Network Info
- Ping Monitor
- Speed Test
- Port Scanner
- Traceroute
- History
- Settings

### Design References

- Grafana (dark theme, clean)
- Uptime Kuma (status cards)
- Glassmorphism (subtle, not overdone)

---

## 7. Data Flow

```
┌──────────────┐     HTTP/SSE      ┌──────────────┐     System Calls
│              │ ◄──────────────► │              │ ◄──────────────►
│   Frontend   │                  │   Backend    │                  │
│   (React)    │                  │   (FastAPI)  │                  │
│              │                  │              │                  │
└──────────────┘                  └──────────────┘                  │
                                                                    │
                                                            ┌───────┴───────┐
                                                            │   psutil      │
                                                            │   ping3       │
                                                            │   speedtest   │
                                                            │   socket      │
                                                            └───────────────┘
```

### Update Strategy

All real-time data uses **REST polling** (simple, reliable).

| Data | Method | Frequency |
|------|--------|-----------|
| CPU/RAM/Disk | GET `/system` | 1 second |
| Network traffic | GET `/traffic` | 1 second |
| Ping | GET `/ping?host=...` | 1 second |
| Speed test | POST `/speedtest` | On-demand |
| Port scan | POST `/portscan` | On-demand |
| Traceroute | POST `/traceroute` | On-demand |

> **Note:** SSE/WebSocket considered for v2 if polling proves insufficient. Start simple.

---

## 8. Database Schema (SQLite)

### speed_tests

```sql
CREATE TABLE speed_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    download_mbps REAL,
    upload_mbps REAL,
    latency_ms REAL,
    jitter_ms REAL,
    server TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ping_history

```sql
CREATE TABLE ping_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    host TEXT,
    latency_ms REAL,
    packet_loss REAL,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### events

```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT,
    message TEXT,
    severity TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 9. Version Roadmap

### Version 1 (Week 1) — MVP

**Focus:** Core dashboard with real-time metrics

- [x] Project setup (React + FastAPI)
- [ ] System information endpoint
- [ ] Network information endpoint
- [ ] CPU/RAM/Disk monitoring
- [ ] Real-time traffic monitor
- [ ] Basic ping
- [ ] Dashboard UI with cards
- [ ] Live charts (Recharts)
- [ ] Dark theme

**Deliverable:** Working dashboard showing live system/network stats

---

### Version 2 (Week 2) — Diagnostics

**Focus:** Network diagnostic tools

- [ ] Port Scanner
- [ ] Traceroute
- [ ] Speed Test integration
- [ ] History storage (SQLite)
- [ ] History page
- [ ] Ping monitor (multi-host)

**Deliverable:** Full diagnostic toolkit with history

---

### Version 3 (Future) — Advanced

**Focus:** Intelligence and deployment

- [ ] AI Network Assistant (chat-based troubleshooting)
- [ ] Packet sniffer (scapy)
- [ ] Network anomaly alerts
- [ ] Multi-device monitoring
- [ ] Docker deployment
- [ ] Login system
- [ ] PostgreSQL migration

**Deliverable:** Production-ready, intelligent monitoring system

---

## 10. Learning Objectives

This project teaches:

| Area | Skills |
|------|--------|
| Networking | IP, DNS, Ping, Ports, Traceroute, Speed Test |
| APIs | REST design, async endpoints, SSE |
| Frontend | React, real-time UI, charting |
| Backend | FastAPI, psutil, system calls |
| Database | SQLite, data persistence |
| Visualization | Live charts, status indicators |
| DevOps | Docker, containerization |

---

## 11. Non-Goals (Explicitly Excluded)

- ❌ Enterprise-grade monitoring (Prometheus, Grafana integration)
- ❌ Real-time alerting (email/SMS) — save for v3
- ❌ Multi-user authentication — save for v3
- ❌ Mobile app — web only
- ❌ Cloud deployment — local/docker only

---

## 12. Open Questions

1. **Deployment:** Local-only for v1, or also Docker from day 1?
2. **OS Support:** Windows primary, or also Linux/macOS?
3. **Custom ping targets:** Allow user to add custom hosts in v1?

---

*Spec version 1.0 — Ready for user review.*
