export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchSystem() {
  const res = await fetch(`${API_URL}/api/system`);
  return res.json();
}

export async function fetchNetwork() {
  const res = await fetch(`${API_URL}/api/network`);
  return res.json();
}

export async function pingHost(host: string) {
  const res = await fetch(`${API_URL}/api/ping?host=${host}`);
  return res.json();
}

export async function startSpeedtest() {
  const res = await fetch(`${API_URL}/api/speedtest`, { method: "POST" });
  return res.json();
}

export async function getSpeedtestResult(jobId: string) {
  const res = await fetch(`${API_URL}/api/speedtest/${jobId}`);
  return res.json();
}

export async function traceroute(host: string) {
  const res = await fetch(`${API_URL}/api/traceroute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ host }),
  });
  return res.json();
}

export async function fetchSpeedHistory(limit = 50) {
  const res = await fetch(`${API_URL}/api/history/speed?limit=${limit}`)
  return res.json()
}

export async function fetchPingHistory(
  host?: string,
  start?: string,
  end?: string,
  limit = 100
) {
  const params = new URLSearchParams()
  if (host) params.set('host', host)
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  params.set('limit', String(limit))
  const res = await fetch(`${API_URL}/api/history/ping?${params}`)
  return res.json()
}
