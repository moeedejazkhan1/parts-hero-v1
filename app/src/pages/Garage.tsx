import { useState } from 'react';
import { Plus, Search, Wrench, ChevronRight, ChevronLeft, ShoppingCart, AlertTriangle, CheckCircle, Cog, CircleDot, Zap, Droplets, Thermometer, Fuel, Wind, Package, ArrowRight, Copy, Check } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useCart } from '@/contexts/CartContext';
import { fleet } from '@/data/mock';
import { realParts, getRelatedParts } from '@/data/realParts';
import type { Truck } from '@/types';
import type { RealPart } from '@/data/realParts';

const statusColors = {
  'Active': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'In Service': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Needs Parts': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
};

// Truck system tree - each truck has these systems
const truckSystems = [
  { id: 'engine', name: 'Engine', icon: Cog, color: 'text-red-400', bg: 'bg-red-500/10', parts: realParts.filter(p => p.category === 'Engine') },
  { id: 'transmission', name: 'Transmission', icon: Cog, color: 'text-blue-400', bg: 'bg-blue-500/10', parts: realParts.filter(p => p.category === 'Transmission') },
  { id: 'brakes', name: 'Brake System', icon: CircleDot, color: 'text-orange-400', bg: 'bg-orange-500/10', parts: realParts.filter(p => p.category === 'Brake') },
  { id: 'drivetrain', name: 'Drivetrain / Differential', icon: Cog, color: 'text-purple-400', bg: 'bg-purple-500/10', parts: realParts.filter(p => p.category === 'Drivetrain') },
  { id: 'electrical', name: 'Electrical / Charging', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10', parts: realParts.filter(p => p.category === 'Electrical') },
  { id: 'fuel', name: 'Fuel System', icon: Fuel, color: 'text-pink-400', bg: 'bg-pink-500/10', parts: realParts.filter(p => p.category === 'Fuel System') },
  { id: 'hvac', name: 'HVAC / AC', icon: Thermometer, color: 'text-cyan-400', bg: 'bg-cyan-500/10', parts: realParts.filter(p => p.category === 'HVAC') },
  { id: 'cooling', name: 'Cooling System', icon: Droplets, color: 'text-sky-400', bg: 'bg-sky-500/10', parts: realParts.filter(p => p.category === 'Cooling') },
  { id: 'exhaust', name: 'Exhaust / Aftertreatment', icon: Wind, color: 'text-gray-400', bg: 'bg-gray-500/10', parts: realParts.filter(p => p.category === 'Exhaust') },
  { id: 'tires', name: 'Tires & Wheels', icon: CircleDot, color: 'text-emerald-400', bg: 'bg-emerald-500/10', parts: realParts.filter(p => p.category === 'Tires') },
  { id: 'air', name: 'Air Intake', icon: Wind, color: 'text-teal-400', bg: 'bg-teal-500/10', parts: realParts.filter(p => p.category === 'Air Intake') },
  { id: 'cab', name: 'Cab / Body', icon: Package, color: 'text-rose-400', bg: 'bg-rose-500/10', parts: realParts.filter(p => p.category === 'Cab') },
];

type ViewLevel = 'fleet' | 'truck' | 'system' | 'parts';

export default function Garage() {
  const [view, setView] = useState<ViewLevel>('fleet');
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<typeof truckSystems[0] | null>(null);
  const [selectedPart, setSelectedPart] = useState<RealPart | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const activeCount = fleet.filter(t => t.status === 'Active').length;
  const needsPartsCount = fleet.filter(t => t.status === 'Needs Parts').length;
  const inServiceCount = fleet.filter(t => t.status === 'In Service').length;

  // Filter parts by search across all parts for a truck
  const getFilteredParts = (parts: RealPart[]) => {
    if (!searchQuery) return parts;
    const q = searchQuery.toLowerCase();
    return parts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.partNumber.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.component.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q)
    );
  };

  const handleCopyPart = (part: RealPart) => {
    const text = `${part.partNumber}\t${part.name}\t${part.brand}\t$${part.price.toFixed(2)}\t${part.applications[0] || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(part.id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Copied for Karmak/Procede/CDK/DSI', 'success');
  };

  // Group parts by subcategory for system view
  const groupBySubcategory = (parts: RealPart[]) => {
    const grouped: Record<string, RealPart[]> = {};
    parts.forEach(p => {
      if (!grouped[p.subcategory]) grouped[p.subcategory] = [];
      grouped[p.subcategory].push(p);
    });
    return grouped;
  };

  // Breadcrumb navigation
  const breadcrumbs = [
    { label: 'Fleet', view: 'fleet' as ViewLevel },
    ...(selectedTruck ? [{ label: `${selectedTruck.year} ${selectedTruck.make} ${selectedTruck.model}`, view: 'truck' as ViewLevel }] : []),
    ...(selectedSystem ? [{ label: selectedSystem.name, view: 'system' as ViewLevel }] : []),
    ...(selectedPart ? [{ label: selectedPart.name, view: 'parts' as ViewLevel }] : []),
  ];

  const navigateTo = (view: ViewLevel) => {
    setView(view);
    if (view === 'fleet') { setSelectedTruck(null); setSelectedSystem(null); setSelectedPart(null); }
    if (view === 'truck') { setSelectedSystem(null); setSelectedPart(null); }
    if (view === 'system') { setSelectedPart(null); }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Customer Header */}
      <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
          <Wrench className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Tom's Diesel Repair — Phoenix, AZ</div>
          <div className="text-xs text-amber-400">Hero Service Shop</div>
        </div>
      </div>

      {/* Fleet Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="text-2xl font-bold text-white font-mono">{fleet.length}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Fleet Total</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="text-2xl font-bold text-emerald-400 font-mono">{activeCount}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Active</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="text-2xl font-bold text-amber-400 font-mono">{needsPartsCount}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Need Parts</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="text-2xl font-bold text-blue-400 font-mono">{inServiceCount}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">In Service</div>
        </div>
      </div>

      {/* Breadcrumb */}
      {view !== 'fleet' && (
        <div className="flex items-center gap-2 text-sm flex-wrap">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-3 h-3 text-gray-600" />}
              <button
                onClick={() => navigateTo(crumb.view)}
                className={`transition-colors ${i === breadcrumbs.length - 1 ? 'text-cyan-400 font-medium' : 'text-gray-400 hover:text-white'}`}
              >
                {crumb.label}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* ===== FLEET VIEW ===== */}
      {view === 'fleet' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fleet.map(truck => (
            <button
              key={truck.id}
              onClick={() => { setSelectedTruck(truck); setView('truck'); }}
              className="text-left bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-0.5 transition-all group"
            >
              <div className="h-40 overflow-hidden relative">
                <img src={truck.photo} alt={truck.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-medium border ${statusColors[truck.status]}`}>
                  {truck.status}
                </span>
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold text-white">{truck.year} {truck.make} {truck.model}</div>
                <div className="text-xs text-gray-500">{truck.color} — VIN: ****{truck.vin.slice(-6)}</div>
                <div className="text-xs text-gray-500 mt-1">{truck.engine} / {truck.transmission}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {truck.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-[10px]">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  <span className="text-[10px] text-gray-500">Last service: {truck.lastService}</span>
                  <span className="text-gray-700">|</span>
                  <span className="text-[10px] text-cyan-400">{truckSystems.filter(s => s.parts.length > 0).length} systems with parts</span>
                </div>
              </div>
            </button>
          ))}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex flex-col items-center justify-center gap-3 bg-white/5 backdrop-blur-md border border-dashed border-white/20 rounded-2xl p-8 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all min-h-[280px]"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-500/15 flex items-center justify-center">
              <Plus className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-sm font-medium text-gray-400">Add Vehicle</span>
          </button>
        </div>
      )}

      {/* ===== TRUCK DETAIL VIEW ===== */}
      {view === 'truck' && selectedTruck && (
        <div className="space-y-4">
          {/* Truck Header */}
          <div className="relative h-56 rounded-2xl overflow-hidden">
            <img src={selectedTruck.photo} alt={selectedTruck.model} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white">{selectedTruck.year} {selectedTruck.make} {selectedTruck.model}</h2>
              <p className="text-sm text-gray-400">{selectedTruck.color} — {selectedTruck.engine} — {selectedTruck.transmission}</p>
            </div>
            <button onClick={() => navigateTo('fleet')} className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/50 text-white text-xs hover:bg-black/70 transition-all">
              <ChevronLeft className="w-3 h-3" /> Back to Fleet
            </button>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Engine', value: selectedTruck.engine },
              { label: 'Transmission', value: selectedTruck.transmission },
              { label: 'VIN', value: `****${selectedTruck.vin.slice(-6)}` },
              { label: 'Status', value: selectedTruck.status, color: selectedTruck.status === 'Active' ? 'text-emerald-400' : selectedTruck.status === 'Needs Parts' ? 'text-amber-400' : 'text-blue-400' },
            ].map(spec => (
              <div key={spec.label} className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase">{spec.label}</div>
                <div className={`text-xs font-medium mt-0.5 ${(spec as any).color || 'text-white'}`}>{spec.value}</div>
              </div>
            ))}
          </div>

          {/* Systems Grid */}
          <h3 className="text-lg font-semibold text-white pt-2">Select a System to Explore Parts</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {truckSystems.map(sys => {
              const Icon = sys.icon;
              const partCount = sys.parts.length;
              return (
                <button
                  key={sys.id}
                  onClick={() => { setSelectedSystem(sys); setView('system'); }}
                  disabled={partCount === 0}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    partCount > 0
                      ? `${sys.bg} border-white/10 hover:border-white/20 hover:scale-[1.02]`
                      : 'bg-white/5 border-white/5 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${sys.color}`} />
                  <span className="text-xs font-medium text-white text-center">{sys.name}</span>
                  <span className="text-[10px] text-gray-500">{partCount} parts</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== SYSTEM VIEW ===== */}
      {view === 'system' && selectedTruck && selectedSystem && (
        <div className="space-y-4">
          {/* Search within system */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${selectedSystem.name} parts by name, number, or brand...`}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* Subcategory groups */}
          {Object.entries(groupBySubcategory(getFilteredParts(selectedSystem.parts))).map(([subcat, parts]) => (
            <div key={subcat} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                {subcat}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {parts.map(part => (
                  <button
                    key={part.id}
                    onClick={() => { setSelectedPart(part); setView('parts'); }}
                    className="text-left bg-white/5 border border-white/5 rounded-xl p-3 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{part.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{part.partNumber}</div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-sm font-bold text-cyan-400">${part.price.toFixed(2)}</div>
                        <div className="text-[10px] text-gray-600 line-through">${part.msrp.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-gray-500">{part.brand}</span>
                      {part.inStock ? (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> In Stock ({part.stockQuantity})
                        </span>
                      ) : (
                        <span className="text-[10px] text-red-400">Out of Stock</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {getFilteredParts(selectedSystem.parts).length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No parts found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* ===== PART DETAIL VIEW ===== */}
      {view === 'parts' && selectedPart && selectedTruck && (
        <div className="space-y-4">
          {/* Part Header */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image placeholder */}
              <div className="w-full lg:w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl flex items-center justify-center border border-cyan-500/10 flex-shrink-0">
                <Wrench className="w-16 h-16 text-cyan-400/40" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedPart.name}</h2>
                    <div className="text-sm font-mono text-cyan-400 mt-1">{selectedPart.partNumber}</div>
                    <div className="text-sm text-gray-500 mt-1">by {selectedPart.brand}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-cyan-400">${selectedPart.price.toFixed(2)}</div>
                    <div className="text-sm text-gray-600 line-through">${selectedPart.msrp.toFixed(2)}</div>
                    <div className="text-xs text-emerald-400 mt-1">You save ${(selectedPart.msrp - selectedPart.price).toFixed(2)}</div>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mt-3 leading-relaxed">{selectedPart.description}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedPart.verified && (
                    <span className="px-2 py-1 rounded-lg bg-cyan-500/15 text-cyan-400 text-xs font-medium border border-cyan-500/20">
                      HERO Verified
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    In Stock: {selectedPart.stockQuantity}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-white/5 text-gray-400 text-xs border border-white/10">
                    {selectedPart.weight}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-white/5 text-gray-400 text-xs border border-white/10">
                    {selectedPart.warranty}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => addToCart(selectedPart, 1, selectedTruck.id)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:brightness-110 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Build Sheet
                  </button>
                  <button
                    onClick={() => handleCopyPart(selectedPart)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all text-sm"
                  >
                    {copiedId === selectedPart.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copiedId === selectedPart.id ? 'Copied!' : 'Copy for DMS'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(selectedPart.specs).map(([key, value]) => (
                <div key={key} className="bg-white/5 rounded-lg p-3">
                  <div className="text-[10px] text-gray-500 uppercase">{key}</div>
                  <div className="text-xs text-white font-medium mt-0.5">{value}</div>
                </div>
              ))}
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-[10px] text-gray-500 uppercase">Dimensions</div>
                <div className="text-xs text-white font-medium mt-0.5">{selectedPart.dimensions}</div>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">Applications</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPart.applications.map(app => (
                <span key={app} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-xs border border-white/10">
                  {app}
                </span>
              ))}
            </div>
          </div>

          {/* Don't Forget Kit */}
          {selectedPart.relatedParts.length > 0 && (
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Don't Forget Kit — Related Parts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {getRelatedParts(selectedPart).map(related => (
                  <button
                    key={related.id}
                    onClick={() => { setSelectedPart(related); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-left bg-white/5 rounded-xl p-3 border border-white/5 hover:border-amber-500/30 transition-all"
                  >
                    <div className="text-xs font-medium text-white">{related.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{related.partNumber}</div>
                    <div className="text-xs text-cyan-400 mt-1">${related.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">Add Vehicle to Fleet</h2>
            <div className="space-y-3">
              <div className="bg-white/5 border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-cyan-500/30 transition-all">
                <Wrench className="w-6 h-6 text-gray-500" />
                <span className="text-sm text-gray-500">Tap to upload truck photo</span>
              </div>
              <div className="flex gap-2">
                <input placeholder="Enter VIN" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none" />
                <button className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 px-4 py-3 rounded-xl text-sm">Decode</button>
              </div>
              <input placeholder="Year" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none" />
              <input placeholder="Make" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none" />
              <input placeholder="Model" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none" />
              <input placeholder="Engine" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none" />
              <input placeholder="Color" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none" />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowAddModal(false); showToast('Vehicle added to fleet!', 'success'); }}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2.5 rounded-xl hover:brightness-110 transition-all"
              >
                Add to Fleet
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 border border-white/20 text-white py-2.5 rounded-xl hover:bg-white/10 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
