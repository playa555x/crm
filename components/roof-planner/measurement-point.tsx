interface MeasurementPoint {
  id: string;
  x: number;
  y: number;
  realDistance?: number; // Distance to next point in meters
}

interface MeasurementPointProps {
  point: MeasurementPoint;
  isSelected: boolean;
  onClick: () => void;
}

export function MeasurementPoint({ point, isSelected, onClick }: MeasurementPointProps) {
  return (
    <div
      className={`absolute w-4 h-4 rounded-full -translate-x-2 -translate-y-2 cursor-pointer
        ${isSelected ? 'bg-red-500 border-red-700' : 'bg-blue-500 border-blue-700'} border-2 border-white z-50`}
      style={{
        left: `${point.x}px`,
        top: `${point.y}px`,
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)' // Add shadow for visibility
      }}
      onClick={onClick}
    />
  );
}

