interface Point {
  x: number;
  y: number;
}

interface MeasurementLineProps {
  start: Point;
  end: Point;
  realDistance?: number;
}

export function MeasurementLine({ start, end, realDistance }: MeasurementLineProps) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  return (
    <>
      <div
        className="absolute h-0.5 bg-yellow-400 origin-left"
        style={{
          left: `${start.x}px`,
          top: `${start.y}px`,
          width: `${length}px`,
          transform: `rotate(${angle}deg)`,
        }}
      />
      {realDistance && (
        <div
          className="absolute bg-black text-white px-2 py-1 rounded text-sm -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${midX}px`,
            top: `${midY}px`,
          }}
        >
          {realDistance.toFixed(2)}m
        </div>
      )}
    </>
  );
}

