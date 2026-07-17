interface PulseRingProps {
  connected: boolean;
}

export default function PulseRing({ connected }: PulseRingProps) {
  return (
    <div className="relative flex items-center justify-center">
      {connected && (
        <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-accent opacity-75" />
      )}
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
          connected ? "bg-accent" : "bg-red-500"
        }`}
      />
    </div>
  );
}
