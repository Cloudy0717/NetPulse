import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
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
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/network" element={<NetworkPage />} />
        <Route path="/speedtest" element={<SpeedtestPage />} />
        <Route path="/traceroute" element={<TraceroutePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/ping-history" element={<PingHistoryPage />} />
        <Route path="/port-scanner" element={<PortScannerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App
