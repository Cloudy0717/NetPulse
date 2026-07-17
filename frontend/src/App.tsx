import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import DashboardPage from '@/pages/DashboardPage'
import NetworkPage from '@/pages/NetworkPage'
import SpeedtestPage from '@/pages/SpeedtestPage'
import TraceroutePage from '@/pages/TraceroutePage'
import HistoryPage from '@/pages/HistoryPage'
import PingHistoryPage from '@/pages/PingHistoryPage'
import PortScannerPage from '@/pages/PortScannerPage'
import SettingsPage from '@/pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-950 text-white">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/speedtest" element={<SpeedtestPage />} />
            <Route path="/traceroute" element={<TraceroutePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/ping-history" element={<PingHistoryPage />} />
            <Route path="/port-scanner" element={<PortScannerPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
