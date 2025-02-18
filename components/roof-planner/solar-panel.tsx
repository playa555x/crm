interface SolarPanelProps {
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
  onClick: () => void;
}

export function SolarPanel({ x, y, width, height, selected, onClick }: SolarPanelProps) {
  return (
    <div
      className={`absolute cursor-move ${selected ? 'z-20' : 'z-10'}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      onClick={onClick}
    >
      <div className={`w-full h-full relative ${selected ? 'border-2 border-red-500' : ''}`}>
        {/* Panel frame */}
        <div className="absolute inset-0 border border-gray-800 bg-black bg-opacity-90">
          {/* Subtle grid lines for glass texture */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-10 opacity-20">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="border border-gray-400" />
            ))}
          </div>
          {/* Subtle reflections */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white opacity-10" />
        </div>
      </div>
    </div>
  );
}

