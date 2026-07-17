const DOT_COUNT = 8

export default function Spinner({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{ transform: `rotate(${i * (360 / DOT_COUNT)}deg)` }}
        >
          <div
            className="mx-auto w-1.5 h-1.5 rounded-full bg-accent"
            style={{
              animation: `spinner-fade 1.4s ease-in-out infinite`,
              animationDelay: `${i * (1.4 / DOT_COUNT)}s`,
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes spinner-fade {
          0%, 100% { opacity: 0.25; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
