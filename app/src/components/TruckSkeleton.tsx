import { useState, useCallback } from 'react';
import { Wrench } from 'lucide-react';

export interface SkeletonZone {
  id: string;
  label: string;
  description: string;
  pathD: string;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  r?: number;
  rect?: { x: number; y: number; width: number; height: number; rx?: number };
}

interface TruckSkeletonProps {
  onZoneClick: (zoneId: string, zoneName: string) => void;
  activeZone?: string | null;
}

const zones: SkeletonZone[] = [
  {
    id: 'engine-hood',
    label: 'Engine / Hood',
    description: 'Engine blocks, gaskets, fuel injection',
    pathD: 'M 280 200 L 280 130 L 460 130 L 460 200 Z',
  },
  {
    id: 'cab',
    label: 'Cab',
    description: 'Seats, mirrors, HVAC, electrical',
    pathD: 'M 80 280 L 80 140 L 270 140 L 270 280 Z',
  },
  {
    id: 'exhaust-def',
    label: 'Exhaust / DEF',
    description: 'DPF, DOC, SCR, aftertreatment',
    pathD: 'M 360 210 L 360 240 L 500 240 L 500 210 Z',
  },
  {
    id: 'frame-chassis',
    label: 'Frame / Chassis',
    description: 'Frame rails, crossmembers, mounting',
    pathD: 'M 70 290 L 730 290 L 730 310 L 70 310 Z',
  },
  {
    id: 'front-axle',
    label: 'Front Axle / Steering',
    description: 'Steering gear, tie rods, king pins',
    pathD: 'M 140 320 L 140 280 L 220 280 L 220 320 Z',
  },
  {
    id: 'rear-axle',
    label: 'Rear Axle / Drivetrain',
    description: 'Differential, driveshaft, U-joints',
    pathD: 'M 520 320 L 520 280 L 650 280 L 650 320 Z',
  },
  {
    id: 'brakes',
    label: 'Brakes',
    description: 'Air disc, drum, slack adjusters, ABS',
    pathD: 'M 130 330 L 230 330 L 230 350 L 130 350 Z',
  },
  {
    id: 'suspension',
    label: 'Suspension',
    description: 'Air springs, shocks, leaf springs',
    pathD: 'M 240 300 L 500 300 L 500 320 L 240 320 Z',
  },
  {
    id: 'fifth-wheel',
    label: 'Fifth Wheel / Coupling',
    description: 'Fifth wheels, king pins, sliders',
    pathD: 'M 620 250 L 620 220 L 680 220 L 680 250 Z',
  },
  {
    id: 'fuel-tank',
    label: 'Fuel Tank',
    description: 'Fuel tanks, caps, straps, senders',
    pathD: 'M 480 260 L 480 230 L 560 230 L 560 260 Z',
  },
  {
    id: 'electrical',
    label: 'Electrical / Lights',
    description: 'Alternators, starters, LED lighting',
    pathD: 'M 90 180 L 90 150 L 140 150 L 140 180 Z',
  },
  {
    id: 'cooling',
    label: 'Cooling',
    description: 'Radiator, coolant, thermostat, fan clutch',
    pathD: 'M 280 125 L 280 90 L 380 90 L 380 125 Z',
  },
];

export default function TruckSkeleton({ onZoneClick, activeZone }: TruckSkeletonProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div className="relative w-full">
      <div className="overflow-x-auto -mx-4 lg:-mx-6 px-4 lg:px-6 pb-2">
        <svg
          viewBox="0 0 800 420"
          className="w-full min-w-[320px] max-w-[900px] h-auto mx-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredZone(null)}
        >
          {/* Background */}
          <rect x="0" y="0" width="800" height="420" fill="transparent" />

          {/* Grid lines (subtle) */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="800" height="420" fill="url(#grid)" />

          {/* Main truck outline — clean line art */}
          <g stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none">
            {/* Cab */}
            <path d="M 80 280 L 80 140 Q 80 120 100 120 L 270 120 Q 290 120 290 140 L 290 280 Z" />
            {/* Windshield */}
            <path d="M 95 145 L 275 145 L 275 180 L 95 180 Z" fill="rgba(0,217,255,0.05)" />
            {/* Engine hood */}
            <path d="M 295 280 L 295 130 Q 295 115 315 115 L 460 115 Q 480 115 480 130 L 480 200 Q 480 210 470 210 L 470 280 Z" />
            {/* Hood line */}
            <line x1="295" y1="155" x2="475" y2="155" />
            {/* Sleeper / mid section */}
            <path d="M 485 280 L 485 140 L 600 140 L 600 280 Z" />
            {/* Rear body */}
            <path d="M 605 280 L 605 150 L 730 150 L 730 280 Z" />
            {/* Frame rails */}
            <line x1="70" y1="290" x2="740" y2="290" strokeWidth="2" />
            <line x1="70" y1="305" x2="740" y2="305" strokeWidth="2" />
            {/* Wheels */}
            <circle cx="160" cy="330" r="35" />
            <circle cx="160" cy="330" r="20" />
            <circle cx="480" cy="330" r="30" />
            <circle cx="480" cy="330" r="15" />
            <circle cx="585" cy="330" r="30" />
            <circle cx="585" cy="330" r="15" />
            <circle cx="690" cy="330" r="30" />
            <circle cx="690" cy="330" r="15" />
            {/* Axle lines */}
            <line x1="160" y1="290" x2="160" y2="330" strokeDasharray="3 3" />
            <line x1="480" y1="290" x2="480" y2="330" strokeDasharray="3 3" />
            <line x1="585" y1="290" x2="585" y2="330" strokeDasharray="3 3" />
            <line x1="690" y1="290" x2="690" y2="330" strokeDasharray="3 3" />
            {/* Bumper */}
            <path d="M 75 280 L 60 295 L 60 310 L 80 310 Z" fill="rgba(255,255,255,0.03)" />
          </g>

          {/* Zone hotspots */}
          {zones.map((zone) => {
            const isHovered = hoveredZone === zone.id;
            const isActive = activeZone === zone.id;

            return (
              <g
                key={zone.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => onZoneClick(zone.id, zone.label)}
              >
                {/* Hit area */}
                <path
                  d={zone.pathD}
                  fill={isActive ? 'rgba(0,217,255,0.15)' : isHovered ? 'rgba(0,217,255,0.08)' : 'rgba(0,217,255,0.02)'}
                  stroke={isActive ? '#00D9FF' : isHovered ? 'rgba(0,217,255,0.6)' : 'rgba(0,217,255,0.15)'}
                  strokeWidth={isActive ? 2 : isHovered ? 1.5 : 1}
                  strokeDasharray={isActive ? 'none' : '4 3'}
                  rx="8"
                  style={{ transition: 'all 0.2s ease' }}
                />

                {/* Zone label */}
                <text
                  x={getZoneCenter(zone).x}
                  y={getZoneCenter(zone).y - 6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isActive || isHovered ? '#00D9FF' : 'rgba(255,255,255,0.5)'}
                  fontSize="10"
                  fontWeight="600"
                  style={{ transition: 'all 0.2s ease', pointerEvents: 'none' }}
                >
                  {zone.label}
                </text>

                {/* Part count hint */}
                <text
                  x={getZoneCenter(zone).x}
                  y={getZoneCenter(zone).y + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isActive || isHovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)'}
                  fontSize="8"
                  style={{ transition: 'all 0.2s ease', pointerEvents: 'none' }}
                >
                  {zone.description}
                </text>

                {/* Glow effect on hover */}
                {isHovered && (
                  <circle
                    cx={getZoneCenter(zone).x}
                    cy={getZoneCenter(zone).y}
                    r={getZoneRadius(zone)}
                    fill="none"
                    stroke="rgba(0,217,255,0.3)"
                    strokeWidth="1"
                    opacity="0.5"
                  >
                    <animate attributeName="r" values={`${getZoneRadius(zone)};${getZoneRadius(zone) + 8};${getZoneRadius(zone)}`} dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating tooltip */}
      {hoveredZone && (
        <div
          className="absolute pointer-events-none z-50 bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-xl px-3 py-2 shadow-xl"
          style={{
            left: `${(tooltipPos.x / 800) * 100}%`,
            top: `${(tooltipPos.y / 420) * 100}%`,
            transform: 'translate(-50%, -120%)',
            minWidth: '160px',
          }}
        >
          <div className="text-xs font-semibold text-cyan-400">
            {zones.find(z => z.id === hoveredZone)?.label}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">
            {zones.find(z => z.id === hoveredZone)?.description}
          </div>
          <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
            <Wrench className="w-3 h-3" /> Click to explore parts
          </div>
        </div>
      )}

      {/* Mobile instruction */}
      <p className="text-center text-[10px] text-gray-600 mt-2 lg:hidden">
        Tap a zone on the truck to find parts
      </p>
    </div>
  );
}

// Helper to calculate center point of a path bounding box (simplified)
function getZoneCenter(zone: SkeletonZone): { x: number; y: number } {
  const coords = zone.pathD.match(/[\d.]+/g)?.map(Number) || [];
  if (coords.length >= 4) {
    const xs = coords.filter((_, i) => i % 2 === 0);
    const ys = coords.filter((_, i) => i % 2 === 1);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
  }
  return { x: 400, y: 210 };
}

function getZoneRadius(zone: SkeletonZone): number {
  const coords = zone.pathD.match(/[\d.]+/g)?.map(Number) || [];
  if (coords.length >= 4) {
    const xs = coords.filter((_, i) => i % 2 === 0);
    const ys = coords.filter((_, i) => i % 2 === 1);
    const w = Math.max(...xs) - Math.min(...xs);
    const h = Math.max(...ys) - Math.min(...ys);
    return Math.max(w, h) / 2 + 5;
  }
  return 40;
}
