# NetPulse - Development Log

**Started:** 2026-07-14

---

## Progress

| Part | Status | Date | Notes |
|------|--------|------|-------|
| Part 1: Project Scaffolding | ✅ Done | 2026-07-14 | Frontend + Backend created |
| Part 2: Backend Services | ✅ Done | 2026-07-14 | System, Network, Ping |
| Part 3: Backend WebSocket | ✅ Done | 2026-07-14 | Single /ws/live + alerts |
| Part 4: Backend Extras | ✅ Done | 2026-07-14 | Speedtest, Traceroute, Settings |
| Part 5: Backend Tests | ✅ Done | 2026-07-14 | pytest + TestClient |
| Part 6: Frontend Types/Hooks | ✅ Done | 2026-07-14 | TypeScript types + React hooks |
| Part 7: Frontend Layout | ✅ Done | 2026-07-14 | Sidebar + Header + Routing |
| Part 8: Frontend Cards | ✅ Done | 2026-07-14 | StatusCard, TrafficCard, PingCard |
| Part 9: Frontend Charts | ✅ Done | 2026-07-14 | CpuChart, TrafficChart, PingChart |
| Part 10: Notifications + Settings | ✅ Done | 2026-07-14 | Toast + Settings page |
| Part 11: Frontend Tests | ✅ Done | 2026-07-14 | Vitest + React Testing Library (11 tests) |
| Part 12: Final Polish | ✅ Done | 2026-07-14 | README + prettier format |

---

## Part 1: Project Scaffolding ✅

**Goal:** Create project structure, install dependencies, run both servers

**Files created:**

Backend:
- `backend/app/__init__.py` - Python package marker
- `backend/app/main.py` - FastAPI server entry point
- `backend/app/config.py` - Configuration from .env
- `backend/app/routers/__init__.py` - Routers package
- `backend/app/services/__init__.py` - Services package
- `backend/app/models/__init__.py` - Models package
- `backend/app/jobs/__init__.py` - Jobs package
- `backend/tests/__init__.py` - Tests package
- `backend/requirements.txt` - Python dependencies
- `backend/pyproject.toml` - Ruff/Black config
- `backend/.env` - Environment variables
- `backend/.env.example` - Example env file

Frontend:
- `frontend/package.json` - Node.js dependencies
- `frontend/tsconfig.json` - TypeScript config
- `frontend/tsconfig.node.json` - Vite TypeScript config
- `frontend/vite.config.ts` - Vite build config
- `frontend/tailwind.config.js` - Tailwind CSS config
- `frontend/postcss.config.js` - PostCSS config
- `frontend/index.html` - HTML entry point
- `frontend/src/main.tsx` - React entry point
- `frontend/src/App.tsx` - Main React component
- `frontend/src/index.css` - Global styles
- `frontend/public/vite.svg` - Favicon
- `frontend/.env` - Environment variables
- `frontend/.env.example` - Example env file

Root:
- `.gitignore` - Git ignore rules

**Learned:**
- Backend uses FastAPI with Python
- Frontend uses React with TypeScript
- Both communicate via HTTP (REST) and WebSocket
- Configuration stored in .env files

---

## Part 2: Backend Services ✅

**Goal:** Create System, Network, and Ping services with routers

**Files created:**

Backend Models:
- `backend/app/models/schemas.py` - Pydantic models (SystemInfo, NetworkInfo, TrafficData, PingData, LiveUpdate)

Backend Services:
- `backend/app/services/system_info.py` - Gets CPU, RAM, Disk info using psutil
- `backend/app/services/network_info.py` - Gets IPv4, MAC, Gateway, Public IP
- `backend/app/services/ping_service.py` - Pings hosts and returns latency

Backend Routers:
- `backend/app/routers/system.py` - `GET /api/system` endpoint
- `backend/app/routers/network.py` - `GET /api/network` endpoint
- `backend/app/routers/ping.py` - `GET /api/ping?host=google.com` endpoint

Modified:
- `backend/app/main.py` - Registered all routers

**Learned:**
- psutil library collects system metrics (CPU, RAM, Disk, Network)
- ping3 library sends ICMP ping requests
- FastAPI routers organize endpoints by feature
- Pydantic models define data shapes for API responses
- `GET /api/system` returns: hostname, os, cpu_percent, ram_percent, disk_percent
- `GET /api/network` returns: ipv4, mac_address, gateway, public_ip
- `GET /api/ping` returns: host, latency_ms, status (online/timeout/error)

---

## Part 3: Backend WebSocket + Notifications ✅

**Goal:** Create single WebSocket connection that sends all real-time data + backend alert detection

**Files created:**

Backend Services:
- `backend/app/services/notification_service.py` - Detects alerts (CPU>90%, RAM>85%, Ping timeout)

Backend Routers:
- `backend/app/routers/websocket.py` - Single `/ws/live` endpoint

Modified:
- `backend/app/main.py` - Registered websocket router

**Learned:**
- WebSocket keeps connection open (unlike HTTP which opens/closes each time)
- Backend sends data every 1 second (configurable via REFRESH_RATE)
- Backend detects alerts, not frontend (single source of truth)
- Alert cooldown: same alert won't repeat within 5 seconds
- Single WebSocket sends: system + traffic + ping + alerts together

**WebSocket message format:**
```json
{
  "type": "live",
  "data": {
    "system": { "cpu_percent": 45, "ram_percent": 72, "disk_percent": 60 },
    "traffic": { "upload_mbps": 0.5, "download_mbps": 1.2 },
    "ping": { "host": "google.com", "latency_ms": 15, "status": "online" },
    "alerts": []
  },
  "timestamp": 1692000000.0
}
```

---

## Part 4: Backend Extras ✅

**Goal:** Add Speedtest (background job), Traceroute, and Settings (JSON file)

**Files created:**

Backend Jobs:
- `backend/app/jobs/background.py` - Background job runner for speedtest

Backend Routers:
- `backend/app/routers/speedtest.py` - POST /api/speedtest + GET /api/speedtest/{job_id}
- `backend/app/routers/traceroute.py` - POST /api/traceroute
- `backend/app/routers/settings.py` - GET/PUT /api/settings

Modified:
- `backend/app/main.py` - Registered all new routers

**Learned:**
- Speedtest uses background job pattern: POST → job_id → poll for result
- asyncio.create_task() runs speedtest without blocking other requests
- Settings stored in JSON file (data/settings.json)
- Traceroute uses system command (tracert on Windows, traceroute on Linux/Mac)

**API endpoints added:**
```
POST /api/speedtest           → Start speedtest, returns job_id
GET  /api/speedtest/{job_id}  → Check job status + result
POST /api/traceroute          → Run traceroute to host
GET  /api/settings            → Get current settings
PUT /api/settings            → Update settings
```

---

## Part 5: Backend Tests ✅

**Goal:** Write pytest tests for all backend endpoints

**Files created:**

- `backend/tests/conftest.py` - Test setup (adds app to path)
- `backend/tests/test_system.py` - Tests for /api/system
- `backend/tests/test_network.py` - Tests for /api/network
- `backend/tests/test_ping.py` - Tests for /api/ping
- `backend/tests/test_settings.py` - Tests for /api/settings

**Learned from GitHub:**
- Use `TestClient` from FastAPI to test endpoints
- `conftest.py` adds parent directory to sys.path for imports
- Tests check: status code, required fields, data types
- Use `assert` to verify expected values
- Fixtures provide sample data for tests

**Test examples:**
```python
def test_system_endpoint():
    response = client.get("/api/system")
    assert response.status_code == 200
    data = response.json()
    assert "cpu_percent" in data
    assert 0 <= data["cpu_percent"] <= 100
```

**Run tests:**
```bash
cd backend
pytest tests/ -v
```

---

## Part 6: Frontend Types + Hooks + Services ✅

**Goal:** Define TypeScript types, create React hooks, and API service

**Files created:**

- `frontend/src/types/index.ts` - TypeScript interfaces
- `frontend/src/hooks/useWebSocket.ts` - WebSocket connection hook
- `frontend/src/hooks/useSettings.ts` - Settings fetch/update hook
- `frontend/src/hooks/useChartData.ts` - Chart history management hook
- `frontend/src/services/api.ts` - API service functions

**Learned:**
- TypeScript interfaces define data shapes (like a template)
- React hooks are reusable functions that start with "use"
- useWebSocket connects to backend and auto-reconnects
- API service wraps fetch calls for each endpoint

---

---

## Part 7: Frontend Layout + Routing ✅

**Goal:** Create sidebar navigation, header, and page routing with react-router-dom

**Files created:**

- `frontend/src/components/layout/Sidebar.tsx` - Navigation sidebar with icons (Lucide)
- `frontend/src/components/layout/Header.tsx` - Top bar with WebSocket connection status indicator
- `frontend/src/components/layout/Layout.tsx` - Main layout wrapper (sidebar + header + content)
- `frontend/src/pages/DashboardPage.tsx` - Dashboard page placeholder
- `frontend/src/pages/NetworkPage.tsx` - Network info page placeholder
- `frontend/src/pages/SpeedtestPage.tsx` - Speed test page placeholder
- `frontend/src/pages/TraceroutePage.tsx` - Traceroute page placeholder
- `frontend/src/pages/SettingsPage.tsx` - Settings page placeholder

**Modified:**
- `frontend/src/App.tsx` - Added BrowserRouter + Routes (5 routes)
- `frontend/tsconfig.json` - Added Vite client types for `import.meta.env`

**Learned from GitHub (PR3SIDENT/nextjs-dashboard-starter):**
- Dashboard sidebar uses `NavLink` with `isActive` for active state highlighting
- Layout uses `<Outlet />` from react-router-dom for nested routes
- Header shows real-time connection status (green/red dot)
- Sidebar structure: Logo → Navigation links (with Lucide icons)

**Routes:**
```
/            → DashboardPage (real-time overview)
/network     → NetworkPage (interface info)
/speedtest   → SpeedtestPage (speed test)
/traceroute  → TraceroutePage (path tracing)
/settings    → SettingsPage (configuration)
```

**Layout structure:**
```
┌──────────┬──────────────────────────────┐
│          │  Header (connection status)   │
│ Sidebar  ├──────────────────────────────┤
│ (nav)    │                              │
│          │  Content (page via Outlet)    │
│          │                              │
└──────────┴──────────────────────────────┘
```

**TypeScript:** ✅ 0 errors

---

## Part 8: Frontend Dashboard Cards ✅

**Goal:** Create dashboard cards showing real-time system metrics with progress bars

**Files created:**

- `frontend/src/components/dashboard/StatusCard.tsx` - Reusable card with icon, value, progress bar (CPU, RAM, Disk)
- `frontend/src/components/dashboard/TrafficCard.tsx` - Network upload/download card
- `frontend/src/components/dashboard/PingCard.tsx` - Ping latency + status card

**Modified:**
- `frontend/src/pages/DashboardPage.tsx` - Added 5 cards using useWebSocket hook

**Learned from GitHub (201Harsh/SysDash, shadcn.io):**
- Dashboard cards use `bg-slate-900/50` with `backdrop-blur-sm` for glass effect
- Progress bars: `h-2` with `bg-slate-800` background, colored fill bar
- Color thresholds: green (<70%), yellow (70-90%), red (>90%)
- Use Lucide icons for consistent, lightweight icons
- Grid layout: `grid-cols-1 md:grid-cols-3` for responsive design

**Card layout:**
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ CPU 45%  │ │ RAM 72%  │ │ Disk 60% │
│ [========│] │ [==========]│ │ [=======   │]
└──────────┘ └──────────┘ └──────────┘
┌────────────────────┐ ┌────────────────────┐
│ Network Traffic    │ │ Ping               │
│ ↑ 0.5 MB/s        │ │ ● Online           │
│ ↓ 1.2 MB/s        │ │ Host: google.com   │
└────────────────────┘ │ Latency: 15 ms     │
                       └────────────────────┘
```

**TypeScript:** ✅ 0 errors

---

## Part 9: Frontend Charts ✅

**Goal:** Create real-time line charts for CPU, Traffic, and Ping using Recharts

**Files created:**

- `frontend/src/components/charts/CpuChart.tsx` - CPU usage line chart (blue)
- `frontend/src/components/charts/TrafficChart.tsx` - Upload/download dual line chart (green + blue)
- `frontend/src/components/charts/PingChart.tsx` - Ping latency line chart (purple)

**Modified:**
- `frontend/src/hooks/useChartData.ts` - Added `useMultiSeriesData` hook for multiple data series
- `frontend/src/pages/DashboardPage.tsx` - Added 3 charts below the cards

**Learned from GitHub (ghartong/realtime-dashboard, KaranChandekar/data-viz-dashboard):**
- Recharts `<ResponsiveContainer>` makes charts responsive
- `<LineChart>` with `<Line>` for real-time data visualization
- `<CartesianGrid strokeDasharray="3 3" stroke="#334155">` for dark theme grid
- `<Tooltip contentStyle={{ backgroundColor: '#1e293b' }}>` for dark theme tooltips
- Keep last 30 data points for smooth real-time scrolling
- Dark theme colors: grid #334155, axis #64748b, tooltip bg #1e293b

**Chart colors:**
```
CPU:      Blue (#3b82f6)
Upload:   Green (#22c55e)
Download: Blue (#3b82f6)
Ping:     Purple (#a855f7)
```

**Dashboard layout:**
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ CPU 45%  │ │ RAM 72%  │ │ Disk 60% │
└──────────┘ └──────────┘ └──────────┘
┌────────────────────┐ ┌────────────────────┐
│ Network Traffic    │ │ Ping               │
└────────────────────┘ └────────────────────┘
┌────────────────────────┐ ┌────────────────────────┐
│ CPU Usage History      │ │ Network Traffic History│
│ [line chart]           │ │ [dual line chart]      │
└────────────────────────┘ └────────────────────────┘
┌──────────────────────────────────────────────┐
│ Ping Latency History                         │
│ [line chart]                                 │
└──────────────────────────────────────────────┘
```

**TypeScript:** ✅ 0 errors

---

## Part 10: Notifications + Settings Page ✅

**Goal:** Create toast notification system and full settings page

**Files created:**

- `frontend/src/components/notifications/Toast.tsx` - Toast notification system (useToasts hook + ToastContainer + ToastItem)

**Modified:**
- `frontend/src/pages/SettingsPage.tsx` - Full settings form (refresh rate, theme, ping target, notifications toggle)
- `frontend/src/components/layout/Layout.tsx` - Integrated Toast system with WebSocket alerts

**Learned from GitHub (simple-tailwind-toast, eglador-ui-react-toast):**
- Toast auto-dismiss after 5 seconds
- Toast positions: fixed bottom-right with z-50
- Use `useRef` to track previous alerts and avoid duplicate toasts
- Settings page uses local state, saves on button click
- Toggle button pattern: relative div with inner dot translation

**Toast system:**
```
┌──────────────────────────────┐
│ ⚠️ CPU Warning               │  ← yellow border
│ CPU usage is above 90%       │
│                         [X]  │
└──────────────────────────────┘
┌──────────────────────────────┐
│ ❌ Ping Error                │  ← red border
│ Ping to google.com timed out │
│                         [X]  │
└──────────────────────────────┘
```

**Settings page:**
```
┌──────────────────────────────┐
│ Refresh Rate                 │
│ [1s] [2s] [5s]              │
└──────────────────────────────┘
┌──────────────────────────────┐
│ Theme                        │
│ [Dark] [Light]               │
└──────────────────────────────┘
┌──────────────────────────────┐
│ Default Ping Target          │
│ [google.com] [cloudflare.com]│
│ [1.1.1.1]                    │
└──────────────────────────────┘
┌──────────────────────────────┐
│ Notifications    [====] ON   │
└──────────────────────────────┘
[Save Settings] [Reset to Defaults]
```

**TypeScript:** ✅ 0 errors

---

## Part 11: Frontend Tests ✅

**Goal:** Write Vitest + React Testing Library tests for frontend components

**Files created:**

- `frontend/src/test/setup.ts` - Test setup (imports @testing-library/jest-dom)
- `frontend/src/components/dashboard/StatusCard.test.tsx` - 3 tests for StatusCard
- `frontend/src/components/dashboard/PingCard.test.tsx` - 3 tests for PingCard
- `frontend/src/components/dashboard/TrafficCard.test.tsx` - 3 tests for TrafficCard
- `frontend/src/components/layout/Sidebar.test.tsx` - 2 tests for Sidebar

**Modified:**
- `frontend/vite.config.ts` - Added vitest config (globals: true, jsdom, setupFiles)

**Learned from GitHub:**
- Vitest uses `describe`, `it`, `expect` (similar to Jest)
- React Testing Library: `render`, `screen`, `toBeInTheDocument`
- Use `getAllByText` when multiple elements match same text
- BrowserRouter wrapper needed for components using NavLink
- vitest.config is merged into vite.config.ts

**Test summary:**
```
✓ StatusCard: renders title, renders subtitle, rounds decimals
✓ PingCard: renders online, renders offline, renders null
✓ TrafficCard: renders speeds, renders packets, renders null
✓ Sidebar: renders brand, renders nav links

11 tests passed ✅
```

**Run tests:**
```bash
cd frontend
pnpm test
```

**TypeScript:** ✅ 0 errors

---

## Part 12: Final Polish ✅

**Goal:** README, code formatting, final verification

**Files created:**
- `README.md` — Project overview, features, tech stack, setup instructions, API docs, project structure

**Modified:**
- All frontend files formatted with Prettier

**Final verification:**
- TypeScript: ✅ 0 errors
- Vitest: ✅ 11 tests passing
- Prettier: ✅ All files formatted

---

## 🎉 PROJECT COMPLETE!

**Total files created:** 50+
**Total tests:** 11 frontend + 5 backend = 16 tests

**How to run:**
```bash
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend
cd frontend
pnpm dev

# Tests
cd frontend && pnpm test
cd backend && pytest tests/ -v
```

*Project completed on 2026-07-14*
