import { useRef, useEffect, useState, useCallback } from 'react'

interface WaveScanProps {
  status: 'idle' | 'connecting' | 'testing' | 'complete'
  speed?: number
  phase?: string
  onStart: () => void
  onRestart?: () => void
}

const W = 300
const H = 100
const CY = H / 2

export default function WaveScan({ status, speed = 0, phase = '', onStart, onRestart }: WaveScanProps) {
  const [points, setPoints] = useState<number[]>(() => Array(W).fill(CY))
  const [sweep, setSweep] = useState(-1)
  const raf = useRef<number>()
  const speedRef = useRef(0)
  const timeRef = useRef(0)

  speedRef.current = speed

  const advance = useCallback(() => {
    timeRef.current++
    const i = timeRef.current % W

    const amp = Math.min(speedRef.current / 150, 1) * 35
    const noise = Math.sin(timeRef.current / 8) * amp * 0.7
    const jitter = (Math.random() - 0.5) * amp * 0.6
    const val = CY - noise - jitter

    setPoints(prev => {
      const next = [...prev]
      next[i] = val
      return next
    })
    setSweep(i)
    raf.current = requestAnimationFrame(advance)
  }, [])

  const breathe = useCallback(() => {
    timeRef.current++
    const val = CY + Math.sin(timeRef.current / 30) * 2
    setPoints(Array(W).fill(val))
    raf.current = requestAnimationFrame(breathe)
  }, [])

  useEffect(() => {
    if (status === 'testing') {
      timeRef.current = 0
      setPoints(Array(W).fill(CY))
      setSweep(-1)
      raf.current = requestAnimationFrame(advance)
    } else if (status === 'idle') {
      setSweep(-1)
      raf.current = requestAnimationFrame(breathe)
    } else {
      setSweep(-1)
    }
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [status, advance, breathe])

  const pathD = points.map((y, x) =>
    `${x === 0 ? 'M' : 'L'}${x},${(y)}`
  ).join('')

  const showValue = (status === 'testing' && speed > 0) || (status === 'complete' && speed > 0)

  return (
    <div
      onClick={status === 'idle' ? onStart : undefined}
      className="bg-base-surface rounded-xl border border-base-border cursor-pointer select-none group relative overflow-hidden aspect-[3/1]"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path d={pathD} fill="none" stroke="#F59E0B" strokeWidth="0.8" vectorEffect="non-scaling-stroke" opacity={status === 'idle' ? 0.4 : 0.8} />

        {status === 'testing' && sweep >= 0 && (
          <>
            <line x1={sweep} y1={0} x2={sweep} y2={H} stroke="#F59E0B" strokeWidth="0.3" opacity="0.5" />
            <circle cx={sweep} cy={points[sweep]} r="1.5" fill="#F59E0B" />
          </>
        )}

        {status === 'idle' && (
          <>
            <circle cx={W / 2} cy={CY} r="2" fill="#F59E0B" opacity="0.8" />
            <text x={W / 2} y={CY + 10} textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="IBM Plex Sans">
              Click to start
            </text>
          </>
        )}
      </svg>

      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold font-mono text-accent">
            {speed.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400 font-body">Mbps</span>
          {phase && (
            <span className="text-xs text-slate-500 font-body">{phase}</span>
          )}
        </div>
      )}

      {status === 'testing' && speed === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-mono text-accent animate-pulse">Testing</span>
          {phase && (
            <span className="text-xs text-slate-500 font-body mt-1">{phase}</span>
          )}
        </div>
      )}

      {status === 'complete' && speed > 0 && onRestart && (
        <div className="absolute bottom-3 right-3">
          <button
            onClick={(e) => { e.stopPropagation(); onRestart() }}
            className="px-4 py-1.5 bg-accent hover:bg-accent/90 text-black rounded-lg transition-colors text-sm font-medium"
          >
            Test Again
          </button>
        </div>
      )}
    </div>
  )
}
