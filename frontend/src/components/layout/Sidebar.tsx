import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Wifi, Gauge, Globe, History, Settings, Activity, Scan } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Wifi, label: 'Network', path: '/network' },
  { icon: Gauge, label: 'Speed Test', path: '/speedtest' },
  { icon: Activity, label: 'Ping History', path: '/ping-history' },
  { icon: Globe, label: 'Traceroute', path: '/traceroute' },
  { icon: History, label: 'Speed History', path: '/history' },
  { icon: Scan, label: 'Port Scanner', path: '/port-scanner' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-base-surface border-r border-base-border p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <Wifi className="w-5 h-5 text-black" />
        </div>
        <span className="font-display text-xl text-text-primary">NetPulse</span>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-body text-sm ${
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-slate-400 hover:bg-base-border hover:text-text-primary'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
