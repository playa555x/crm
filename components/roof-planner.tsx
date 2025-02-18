'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Loader2, Plus, Trash2, Ruler } from 'lucide-react'
import { AddressSearch } from './address-search'
import { useToast } from "@/components/ui/use-toast"
import { MeasurementPoint } from './roof-planner/measurement-point'
import { MeasurementLine } from './roof-planner/measurement-line'
import { SolarPanel } from './roof-planner/solar-panel'

// Constants for solar panel dimensions in meters
const PANEL_HEIGHT_METERS = 1.762;
const PANEL_WIDTH_METERS = 1.134;

interface Point {
  id: string;
  x: number;
  y: number;
  realDistance?: number;
}

interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Area {
  id: string;
  name: string;
  points: Point[];
  area: number;
}

export function RoofPlanner() {
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [measurementPoints, setMeasurementPoints] = useState<Point[]>([])
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null)
  const [scale, setScale] = useState<number | null>(null) // pixels per meter
  const [panels, setPanels] = useState<Panel[]>([])
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [areas, setAreas] = useState<Area[]>([])
  const [currentArea, setCurrentArea] = useState<Point[]>([])
  const [measurementComplete, setMeasurementComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const { toast } = useToast()

  const handleAddressSelect = async (address: string, lat: number, lng: number) => {
    setIsLoading(true)
    try {
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        throw new Error('Google Maps API key is not configured')
      }
      
      // Construct URL for high-resolution satellite image
      const zoom = 20
      const size = '600x400'
      const scale = 2
      const maptype = 'satellite'
      
      const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&scale=${scale}&maptype=${maptype}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        imageRef.current = img
        setImage(imageUrl)
        setIsLoading(false)
        
        toast({
          title: "Dachbild geladen",
          description: `Adresse: ${address}`,
        })
      }
      
      img.onerror = () => {
        throw new Error('Failed to load image')
      }
      
      img.src = imageUrl
    } catch (error) {
      console.error('Error fetching roof image:', error)
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Dachbild konnte nicht geladen werden. Bitte überprüfen Sie den API-Schlüssel.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          const img = new Image()
          img.onload = () => {
            imageRef.current = img
            setImage(e.target.result as string)
          }
          img.src = e.target.result as string
        } else {
          toast({
            title: "Fehler",
            description: "Das Bild konnte nicht geladen werden. Bitte versuchen Sie es erneut.",
            variant: "destructive",
          })
        }
      }
      reader.onerror = () => {
        toast({
          title: "Fehler",
          description: "Das Bild konnte nicht gelesen werden. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const addPanel = () => {
    if (!scale) {
      toast({
        title: "Fehler",
        description: "Bitte führen Sie zuerst eine Messung durch, um den Maßstab festzulegen.",
        variant: "destructive",
      });
      return;
    }

    const panelWidthPixels = PANEL_WIDTH_METERS * scale;
    const panelHeightPixels = PANEL_HEIGHT_METERS * scale;

    // Find a valid area to place the panel
    const validArea = areas.find(area => {
      const centerX = (area.points[0].x + area.points[2].x) / 2;
      const centerY = (area.points[0].y + area.points[2].y) / 2;
      return isPointInArea(centerX, centerY, area);
    });

    if (!validArea) {
      toast({
        title: "Fehler",
        description: "Keine gültige Fläche für die Platzierung des Moduls gefunden.",
        variant: "destructive",
      });
      return;
    }

    const newPanel: Panel = {
      id: Date.now().toString(),
      x: (validArea.points[0].x + validArea.points[2].x - panelWidthPixels) / 2,
      y: (validArea.points[0].y + validArea.points[2].y - panelHeightPixels) / 2,
      width: panelWidthPixels,
      height: panelHeightPixels,
    };

    setPanels([...panels, newPanel]);
  };

  const removePanel = (id: string) => {
    setPanels(panels.filter(panel => panel.id !== id))
    setSelectedPanel(null)
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imageRef.current) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

    // Draw areas
    areas.forEach(area => {
      ctx.beginPath();
      ctx.moveTo(area.points[0].x, area.points[0].y);
      for (let i = 1; i < area.points.length; i++) {
        ctx.lineTo(area.points[i].x, area.points[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#FFFF00';
      ctx.stroke();

      // Draw area name and size
      const centerX = area.points.reduce((sum, point) => sum + point.x, 0) / area.points.length;
      const centerY = area.points.reduce((sum, point) => sum + point.y, 0) / area.points.length;
      ctx.fillStyle = 'black';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${area.name}: ${area.area.toFixed(2)} m²`, centerX, centerY);
    });

    // Draw current area being measured
    if (currentArea.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentArea[0].x, currentArea[0].y);
      for (let i = 1; i < currentArea.length; i++) {
        ctx.lineTo(currentArea[i].x, currentArea[i].y);
      }
      ctx.strokeStyle = '#00FF00';
      ctx.stroke();
    }

    // Draw panels
    panels.forEach(panel => {
      ctx.strokeStyle = panel.id === selectedPanel ? '#FF0000' : '#FFFF00';
      ctx.lineWidth = 2;
      ctx.strokeRect(panel.x, panel.y, panel.width, panel.height);
      
      // Fill with semi-transparent color
      ctx.fillStyle = panel.id === selectedPanel ? 
        'rgba(255, 0, 0, 0.2)' : 'rgba(255, 255, 0, 0.2)';
      ctx.fillRect(panel.x, panel.y, panel.width, panel.height);
    });
  };

  useEffect(() => {
    drawCanvas()
  }, [panels, selectedPanel, image, areas, currentArea])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMeasuring) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newPoint: Point = {
      id: Date.now().toString(),
      x,
      y,
    };

    if (currentArea.length > 0 && isPointClose(newPoint, currentArea[0])) {
      // Close the area
      const areaName = `Fläche ${String.fromCharCode(97 + areas.length)}`;
      const areaSize = calculateAreaSize(currentArea);
      setAreas([...areas, { id: Date.now().toString(), name: areaName, points: currentArea, area: areaSize }]);
      setCurrentArea([]);
      toast({
        title: "Fläche erstellt",
        description: `${areaName}: ${areaSize.toFixed(2)} m²`,
      });
    } else {
      setCurrentArea([...currentArea, newPoint]);
      if (currentArea.length > 0) {
        // Prompt for distance input
        const lastPoint = currentArea[currentArea.length - 1];
        setSelectedPoint(lastPoint.id);
      }
    }
  };

  const isPointClose = (point1: Point, point2: Point) => {
    const threshold = 10; // pixels
    return Math.abs(point1.x - point2.x) < threshold && Math.abs(point1.y - point2.y) < threshold;
  };

  const calculateAreaSize = (points: Point[]): number => {
    if (!scale) return 0;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    area = Math.abs(area) / 2;
    return area / (scale * scale);
  };

  const setDistanceForPoint = (pointId: string, distance: number) => {
    setMeasurementPoints(prev => {
      const pointIndex = prev.findIndex(p => p.id === pointId);
      const updatedPoints = prev.map(point => {
        if (point.id === pointId) {
          return { ...point, realDistance: distance };
        }
        return point;
      });

      // Calculate scale if it's the first measurement
      if (!scale && distance && pointIndex === 0) {
        const nextPoint = prev[1];
        if (nextPoint) {
          const pixelDistance = Math.sqrt(
            Math.pow(nextPoint.x - prev[0].x, 2) +
            Math.pow(nextPoint.y - prev[0].y, 2)
          );
          setScale(pixelDistance / distance);
        }
      }

      return updatedPoints;
    });
  };


  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if clicked on a panel
    const clickedPanel = panels.find(panel => 
      x >= panel.x && x <= panel.x + panel.width &&
      y >= panel.y && y <= panel.y + panel.height
    )

    setSelectedPanel(clickedPanel?.id || null)
    if (clickedPanel) {
      setIsDragging(true)
    }
  }

  const handlePanelDrag = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedPanel) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setPanels(panels.map(panel => 
      panel.id === selectedPanel
        ? { ...panel, x, y }
        : panel
    ));
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleMeasurementComplete = () => {
    setMeasurementComplete(true);
    setIsMeasuring(false);
    setSelectedPoint(null);
    setCurrentArea([]);
  };

  const handleResetMeasurement = () => {
    setMeasurementPoints([]);
    setScale(null);
    setMeasurementComplete(false);
    setAreas([]);
  };

  const isPointInArea = (x: number, y: number, area: Area): boolean => {
    let inside = false;
    for (let i = 0, j = area.points.length - 1; i < area.points.length; j = i++) {
      const xi = area.points[i].x, yi = area.points[i].y;
      const xj = area.points[j].x, yj = area.points[j].y;
      
      const intersect = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dachplaner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AddressSearch onAddressSelect={handleAddressSelect} />
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin h-8 w-8" />
            </div>
          ) : !image ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="roof-image-upload"
              />
              <Label htmlFor="roof-image-upload" className="cursor-pointer">
                <div className="text-sm text-gray-500">
                  Klicken Sie hier oder ziehen Sie ein Bild hierher, um es hochzuladen.
                </div>
              </Label>
            </div>
          ) : (
            <div>
              <div className="flex gap-2 mb-4">
                <Button
                  variant={isMeasuring ? "secondary" : "outline"}
                  onClick={() => setIsMeasuring(!isMeasuring)}
                >
                  <Ruler className="mr-2 h-4 w-4" />
                  {isMeasuring ? 'Messung beenden' : 'Dach vermessen'}
                </Button>
                <Button
                  onClick={addPanel}
                  disabled={!scale || areas.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Modul hinzufügen
                </Button>
                {selectedPanel && (
                  <Button variant="destructive" onClick={() => removePanel(selectedPanel)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Modul entfernen
                  </Button>
                )}
                {measurementComplete && (
                  <Button variant="destructive" onClick={handleResetMeasurement}>
                    Messung zurücksetzen
                  </Button>
                )}
              </div>

              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  onClick={handleCanvasClick}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handlePanelDrag}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  className="border border-gray-300 rounded-lg"
                />

                {/* Measurement lines */}
                {currentArea.map((point, index) => (
                  index > 0 && (
                    <MeasurementLine
                      key={`${point.id}-${currentArea[index - 1].id}`}
                      start={currentArea[index - 1]}
                      end={point}
                      realDistance={currentArea[index - 1].realDistance}
                    />
                  )
                ))}

                {/* Solar panels */}
                {panels.map(panel => (
                  <SolarPanel
                    key={panel.id}
                    x={panel.x}
                    y={panel.y}
                    width={panel.width}
                    height={panel.height}
                    selected={panel.id === selectedPanel}
                    onClick={() => {
                      setSelectedPanel(panel.id);
                      setIsDragging(true);
                    }}
                  />
                ))}
              </div>

              {/* Measurement input */}
              {selectedPoint && (
                <div className="mt-4">
                  <Label>Abstand zum vorherigen Punkt (in Metern)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      onChange={(e) => {
                        const distance = parseFloat(e.target.value);
                        if (!isNaN(distance)) {
                          setDistanceForPoint(selectedPoint, distance);
                        }
                      }}
                      value={
                        measurementPoints.find(p => p.id === selectedPoint)?.realDistance || ''
                      }
                    />
                    <Button variant="secondary" onClick={() => setSelectedPoint(null)}>
                      OK
                    </Button>
                  </div>
                </div>
              )}
              {currentArea.length > 2 && (
                <div className="mt-4">
                  <Button onClick={handleMeasurementComplete}>Messung abschließen</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

