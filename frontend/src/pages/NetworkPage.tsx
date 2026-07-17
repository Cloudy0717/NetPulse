import { useState, useEffect } from 'react'
import { Wifi, Globe, Fingerprint, Router, MapPin, Network, Monitor, Power } from 'lucide-react'

interface NetworkData {
  ipv4: string
  ipv6: string
  mac_address: string
  gateway: string
  dns: string
  public_ip: string
  interface_name: string
  interface_status: string
}

export default function NetworkPage() {
  const [data, setData] = useState<NetworkData | null>(null)
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/network`)
        const json = await res.json()
        setData(json)
      } catch {
        // ignore
      }
      setLoading(false)
    }
    fetchData()
  }, [API_URL])

  if (loading) return <div className="p-4 text-slate-400">Loading...</div>

  const fields = [
    { icon: Wifi, label: 'IPv4', value: data?.ipv4 },
    { icon: Globe, label: 'IPv6', value: data?.ipv6 },
    { icon: Fingerprint, label: 'MAC Address', value: data?.mac_address },
    { icon: Router, label: 'Gateway', value: data?.gateway },
    { icon: Network, label: 'DNS', value: data?.dns },
    { icon: MapPin, label: 'Public IP', value: data?.public_ip },
    { icon: Monitor, label: 'Interface', value: data?.interface_name },
    { icon: Power, label: 'Status', value: data?.interface_status === 'Up' ? 'Connected' : 'Disconnected' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Network Information</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">{label}</div>
              <div className="font-medium">{value || 'Unknown'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
