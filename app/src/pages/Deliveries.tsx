import { useState, useEffect } from 'react';
import { MapPin, Truck, Clock, Send, Phone, Star, DollarSign, ChevronRight, Plus, Minus } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface Delivery {
  id: string;
  invoice: string;
  item: string;
  from: string;
  to: string;
  status: 'En Route' | 'Picked Up' | 'At Pickup' | 'Delivered';
  progress: number;
  eta: string;
  driver: { name: string; rating: number; photo: string };
  cost: { base: number; markup: number; total: number };
  coords: { pickup: [number, number]; dropoff: [number, number]; driver: [number, number] };
}

const deliveries: Delivery[] = [
  {
    id: 'd1', invoice: '4421', item: 'Eaton Fuller Filter Kit (x3)', from: 'RWC Group — 4821 W Jefferson, Phoenix', to: "Tom's Diesel — 2150 E University, Phoenix",
    status: 'En Route', progress: 72, eta: '4 min', driver: { name: 'Mike R.', rating: 4.9, photo: 'M' },
    cost: { base: 10.00, markup: 3.50, total: 13.50 }, coords: { pickup: [33.45, -112.07], dropoff: [33.42, -112.01], driver: [33.43, -112.03] },
  },
  {
    id: 'd2', invoice: '4420', item: 'Cummins ISX Overhaul Gasket Set', from: 'Cummins SW — 3200 E Broadway, Phoenix', to: "Tom's Diesel — 2150 E University, Phoenix",
    status: 'Picked Up', progress: 40, eta: '18 min', driver: { name: 'Carlos L.', rating: 4.8, photo: 'C' },
    cost: { base: 14.50, markup: 4.50, total: 19.00 }, coords: { pickup: [33.41, -112.05], dropoff: [33.42, -112.01], driver: [33.415, -112.035] },
  },
  {
    id: 'd3', invoice: '4418', item: 'Bendix Air Dryer Cartridge (x2)', from: 'Bendix Direct — 1500 N 51st Ave, Phoenix', to: "Tom's Diesel — 2150 E University, Phoenix",
    status: 'Delivered', progress: 100, eta: 'Delivered', driver: { name: 'James T.', rating: 5.0, photo: 'J' },
    cost: { base: 8.50, markup: 2.50, total: 11.00 }, coords: { pickup: [33.48, -112.15], dropoff: [33.42, -112.01], driver: [33.42, -112.01] },
  },
];

const statusColors: Record<string, string> = {
  'En Route': 'bg-cyan-500/15 text-cyan-400',
  'Picked Up': 'bg-purple-500/15 text-purple-400',
  'At Pickup': 'bg-amber-500/15 text-amber-400',
  'Delivered': 'bg-emerald-500/15 text-emerald-400',
};

export default function Deliveries() {
  const [activeDelivery, setActiveDelivery] = useState<Delivery>(deliveries[0]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [driverPos, setDriverPos] = useState(0);
  const { showToast } = useToast();

  // Animate driver along route
  useEffect(() => {
    if (activeDelivery.status === 'Delivered') return;
    const interval = setInterval(() => {
      setDriverPos(prev => (prev + 0.5) % 100);
    }, 200);
    return () => clearInterval(interval);
  }, [activeDelivery]);

  const schedulePickup = () => {
    setShowSchedule(false);
    showToast('Hero dispatched! Your driver is on the way.', 'success');
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><MapPin className="w-6 h-6 text-cyan-400" />Delivery Hero</h1>
          <p className="text-gray-500 text-sm mt-1">White-label delivery. Real-time tracking. Parts Hero branded.</p>
        </div>
        <button onClick={() => setShowSchedule(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all flex items-center gap-2">
          <Send className="w-4 h-4" /> Schedule Pickup
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Map Area */}
        <div className="lg:w-[60%] space-y-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden relative">
            {/* Uber-style Map */}
            <div className="relative h-[450px] bg-[#0c1220] overflow-hidden">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.08]" style={{
                backgroundImage: `linear-gradient(rgba(0,217,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.3) 1px, transparent 1px)`,
                backgroundSize: `${40 * mapZoom}px ${40 * mapZoom}px`
              }} />

              {/* Major roads */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* I-10 */}
                <line x1="0" y1="65" x2="100" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="50" y="64" fill="rgba(255,255,255,0.15)" fontSize="2">I-10</text>
                {/* Loop 202 */}
                <line x1="60" y1="0" x2="55" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <text x="57" y="50" fill="rgba(255,255,255,0.12)" fontSize="2">L-202</text>
                {/* I-17 */}
                <line x1="35" y1="0" x2="40" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <text x="36" y="30" fill="rgba(255,255,255,0.12)" fontSize="2">I-17</text>
                {/* City streets */}
                <line x1="0" y1="40" x2="100" y2="38" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="0" y1="80" x2="100" y2="78" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="20" y1="0" x2="22" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="75" y1="0" x2="73" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </svg>

              {/* Route line */}
              {activeDelivery.status !== 'Delivered' && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 30 45 Q 40 50 55 48 Q 65 47 70 42" stroke="#00D9FF" strokeWidth="0.6" strokeDasharray="2 1" fill="none" opacity="0.7">
                    <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="2s" repeatCount="indefinite" />
                  </path>
                </svg>
              )}

              {/* Pickup pin */}
              <div className="absolute" style={{ left: '28%', top: '43%' }}>
                <div className="relative">
                  <div className="w-5 h-5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap font-bold">PICKUP</div>
                </div>
              </div>

              {/* Dropoff pin */}
              <div className="absolute" style={{ left: '68%', top: '40%' }}>
                <div className="relative">
                  <div className="w-5 h-5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50 flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap font-bold">DROP</div>
                </div>
              </div>

              {/* Driver truck */}
              {activeDelivery.status !== 'Delivered' && (
                <div className="absolute transition-all duration-1000 ease-linear" style={{
                  left: `${35 + (driverPos * 0.33)}%`,
                  top: `${47 - (driverPos * 0.05)}%`,
                }}>
                  <div className="relative">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/40">
                      <Truck className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0F172A] border border-cyan-500/30 rounded px-1.5 py-0.5 whitespace-nowrap">
                      <span className="text-[8px] text-cyan-400 font-mono">{activeDelivery.eta}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Map Controls */}
              <div className="absolute bottom-3 right-3 flex flex-col gap-1">
                <button onClick={() => setMapZoom(z => Math.min(z + 0.2, 2))} className="w-8 h-8 bg-[#1a2035] rounded-lg flex items-center justify-center text-gray-400 hover:text-white border border-white/10"><Plus className="w-4 h-4" /></button>
                <button onClick={() => setMapZoom(z => Math.max(z - 0.2, 0.5))} className="w-8 h-8 bg-[#1a2035] rounded-lg flex items-center justify-center text-gray-400 hover:text-white border border-white/10"><Minus className="w-4 h-4" /></button>
              </div>

              {/* Branding */}
              <div className="absolute bottom-3 left-3 bg-[#0F172A]/80 backdrop-blur border border-white/10 rounded-lg px-3 py-1.5">
                <span className="text-[10px] text-gray-500 font-mono">Powered by </span>
                <span className="text-[10px] text-cyan-400 font-bold">Parts Hero</span>
              </div>

              {/* ETA Card */}
              <div className="absolute top-3 left-3 right-3">
                <div className="bg-[#0F172A]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{activeDelivery.status === 'Delivered' ? 'Delivered' : `Arriving in ${activeDelivery.eta}`}</div>
                    <div className="text-xs text-gray-500">{activeDelivery.item}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[activeDelivery.status]}`}>{activeDelivery.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Panel */}
        <div className="lg:w-[40%] space-y-3">
          {/* Active Deliveries */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Active Deliveries</h3>
            <div className="space-y-2">
              {deliveries.map(d => (
                <button key={d.id} onClick={() => setActiveDelivery(d)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${activeDelivery.id === d.id ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white">Invoice #{d.invoice}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[d.status]}`}>{d.status}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">{d.item}</div>
                  <div className="w-full bg-white/5 rounded-full h-1 mt-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full transition-all" style={{ width: `${d.progress}%` }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Driver Info */}
          {activeDelivery.status !== 'Delivered' && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">{activeDelivery.driver.photo}</div>
                <div>
                  <div className="text-sm font-medium text-white">Your Hero Driver</div>
                  <div className="text-xs text-gray-500">{activeDelivery.driver.name}</div>
                  <div className="flex items-center gap-1 text-xs text-amber-400"><Star className="w-3 h-3 fill-current" /> {activeDelivery.driver.rating}</div>
                </div>
                <button className="ml-auto w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-all">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4 text-cyan-400" /> Cost Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs"><span className="text-gray-400">Base Delivery</span><span className="text-white font-mono">${activeDelivery.cost.base.toFixed(2)}</span></div>
              <div className="flex justify-between text-xs"><span className="text-gray-400">Hero Service Fee</span><span className="text-white font-mono">${activeDelivery.cost.markup.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm pt-2 border-t border-white/5"><span className="text-white font-medium">Total</span><span className="text-cyan-400 font-bold font-mono">${activeDelivery.cost.total.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Tracking Link */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-sm text-white font-medium">Share Tracking Link</div>
                <div className="text-xs text-gray-500">Customer sees: map + ETA + &quot;Your Parts Hero delivery is {activeDelivery.eta} away&quot;</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 ml-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSchedule(false)}>
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">Schedule a Hero Pickup</h2>
            <div className="space-y-3">
              <input placeholder="Invoice # (required)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50" />
              <input defaultValue="Tom's Diesel Repair — 2150 E University Dr, Phoenix, AZ" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
              <input placeholder="Pickup from (dealer address)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50" />
              <input placeholder="Item description" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50" />
              <div className="bg-white/5 rounded-xl p-3 space-y-2">
                <div className="flex justify-between text-xs text-gray-500"><span>Delivery Base</span><span className="font-mono">$10.00</span></div>
                <div className="flex justify-between text-xs text-gray-500"><span>Hero Service Fee</span><span className="font-mono">$3.50</span></div>
                <div className="flex justify-between text-sm text-cyan-400 font-medium pt-1 border-t border-white/5"><span>Estimated Total</span><span className="font-mono">$13.50</span></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={schedulePickup}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2.5 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Dispatch Hero
              </button>
              <button onClick={() => setShowSchedule(false)} className="flex-1 border border-white/20 text-white py-2.5 rounded-xl hover:bg-white/10 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
