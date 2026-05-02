import { useState } from 'react';
import { Search as SearchIcon, Camera, Copy, Check, Wrench, ShoppingCart, ChevronRight, Sparkles, ArrowLeft, Filter } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useCart } from '@/contexts/CartContext';
import { partsCatalog, allPartsFlat, searchParts, catalogStats } from '@/data/partsDatabase';
import type { CategoryNode, SubcategoryNode, ComponentNode, PartSpec } from '@/data/partsDatabase';

type ViewLevel = 'categories' | 'subcategories' | 'components' | 'parts' | 'part-detail';

export default function PartsSearch() {
  const [view, setView] = useState<ViewLevel>('categories');
  const [selectedCategory, setSelectedCategory] = useState<CategoryNode | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryNode | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentNode | null>(null);
  const [selectedPart, setSelectedPart] = useState<PartSpec | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vin, setVin] = useState('');
  const [searchResults, setSearchResults] = useState<PartSpec[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMake, setActiveMake] = useState<string | null>(null);
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const makes = ['Freightliner', 'International', 'Peterbilt', 'Kenworth', 'Volvo'];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const results = searchParts(searchQuery);
    setSearchResults(results);
    setView('parts');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedComponent(null);
    showToast(`Found ${results.length} parts for "${searchQuery}"`, 'success');
  };

  const handleVinDecode = () => {
    if (!vin) { showToast('Please enter a VIN', 'error'); return; }
    showToast('VIN decoded: 2019 Freightliner Cascadia — Cummins ISX15', 'success');
    setActiveMake('Freightliner');
  };

  const handleCopyPart = (part: PartSpec) => {
    const text = `${part.partNumber}\t${part.name}\t${part.brand}\t$${part.price.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopiedId(part.partNumber);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Copied for Karmak/Procede/CDK/DSI', 'success');
  };

  // Navigate to category
  const goToCategory = (cat: CategoryNode) => {
    setSelectedCategory(cat);
    setView('subcategories');
  };

  // Navigate to subcategory
  const goToSubcategory = (sub: SubcategoryNode) => {
    setSelectedSubcategory(sub);
    setView('components');
  };

  // Navigate to component
  const goToComponent = (comp: ComponentNode) => {
    setSelectedComponent(comp);
    setView('parts');
    setSearchResults([]);
  };

  // Navigate to part detail
  const goToPartDetail = (part: PartSpec) => {
    setSelectedPart(part);
    setView('part-detail');
  };

  // Go back
  const goBack = () => {
    if (view === 'part-detail') { setView('parts'); setSelectedPart(null); }
    else if (view === 'parts' && selectedComponent) { setView('components'); setSelectedComponent(null); }
    else if (view === 'parts' && searchResults.length > 0) { setSearchResults([]); setView(selectedSubcategory ? 'components' : selectedCategory ? 'subcategories' : 'categories'); }
    else if (view === 'components') { setView('subcategories'); setSelectedSubcategory(null); }
    else if (view === 'subcategories') { setView('categories'); setSelectedCategory(null); }
  };

  // Skeleton zones mapped to categories
  const skeletonZones = [
    { id: 'engine', label: 'Engine', x: 320, y: 150, w: 140, h: 80, cat: 'engine', count: allPartsFlat.filter(p => p.applications.some(a => a.includes('ISX') || a.includes('DD') || a.includes('Engine'))).length },
    { id: 'transmission', label: 'Transmission', x: 200, y: 220, w: 100, h: 60, cat: 'transmission', count: allPartsFlat.filter(p => p.name.toLowerCase().includes('trans') || p.name.toLowerCase().includes('clutch') || p.name.toLowerCase().includes('sync')).length },
    { id: 'brakes', label: 'Brakes', x: 180, y: 320, w: 80, h: 50, cat: 'brakes', count: allPartsFlat.filter(p => p.name.toLowerCase().includes('brake') || p.name.toLowerCase().includes('slack') || p.name.toLowerCase().includes('abs')).length },
    { id: 'electrical', label: 'Electrical', x: 120, y: 120, w: 80, h: 60, cat: 'electrical', count: allPartsFlat.filter(p => p.name.toLowerCase().includes('alternator') || p.name.toLowerCase().includes('starter') || p.name.toLowerCase().includes('battery') || p.name.toLowerCase().includes('led')).length },
    { id: 'differential', label: 'Drivetrain', x: 520, y: 250, w: 120, h: 50, cat: 'tires', count: allPartsFlat.filter(p => p.name.toLowerCase().includes('bearing') || p.name.toLowerCase().includes('seal') || p.name.toLowerCase().includes('differential')).length },
    { id: 'hvac', label: 'HVAC', x: 250, y: 160, w: 60, h: 40, cat: 'hvac', count: allPartsFlat.filter(p => p.name.toLowerCase().includes('compressor') || p.name.toLowerCase().includes('condenser') || p.name.toLowerCase().includes('drier')).length },
    { id: 'fuel', label: 'Fuel', x: 380, y: 200, w: 60, h: 40, cat: 'fuel', count: allPartsFlat.filter(p => p.name.toLowerCase().includes('fuel') || p.name.toLowerCase().includes('injector')).length },
  ];

  const handleZoneClick = (zone: typeof skeletonZones[0]) => {
    const cat = partsCatalog.find(c => c.id === zone.cat);
    if (cat) goToCategory(cat);
  };

  const breadcrumb = [
    { label: 'All Categories', action: () => { setView('categories'); setSelectedCategory(null); setSelectedSubcategory(null); setSelectedComponent(null); } },
    ...(selectedCategory ? [{ label: selectedCategory.name, action: () => { setView('subcategories'); setSelectedSubcategory(null); setSelectedComponent(null); } }] : []),
    ...(selectedSubcategory ? [{ label: selectedSubcategory.name, action: () => { setView('components'); setSelectedComponent(null); } }] : []),
    ...(selectedComponent ? [{ label: selectedComponent.name, action: () => setView('parts') }] : []),
  ];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <SearchIcon className="w-6 h-6 text-cyan-400" />
            Parts Search
          </h1>
          <p className="text-gray-500 text-sm mt-1">{catalogStats.totalParts} parts • {catalogStats.totalCategories} categories • {catalogStats.brands} brands</p>
        </div>
      </div>

      {/* Search Bar + VIN */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name, part number, brand, or keyword..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50"
            />
          </div>
          <button onClick={handleSearch} className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 px-5 py-3 rounded-xl hover:bg-cyan-500/30 transition-all font-medium text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> AI Search
          </button>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <input value={vin} onChange={e => setVin(e.target.value)} placeholder="Enter VIN..."
              className="w-48 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none text-sm"
              onKeyDown={e => e.key === 'Enter' && handleVinDecode()} />
          </div>
          <button onClick={handleVinDecode} className="bg-white/5 border border-white/10 text-gray-400 px-3 py-3 rounded-xl hover:bg-white/10 text-sm">Decode</button>
          <button className="bg-white/5 border border-white/10 text-gray-400 px-3 py-3 rounded-xl hover:bg-white/10"><Camera className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Make filter */}
      <div className="flex gap-2 flex-wrap">
        {makes.map(make => (
          <button key={make} onClick={() => setActiveMake(activeMake === make ? null : make)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${activeMake === make ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
            {make}
          </button>
        ))}
      </div>

      {/* Breadcrumb */}
      {view !== 'categories' && (
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <button onClick={goBack} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back
          </button>
          <span className="text-gray-700">|</span>
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-3 h-3 text-gray-600" />}
              <button onClick={crumb.action} className={`transition-colors ${i === breadcrumb.length - 1 ? 'text-cyan-400 font-medium' : 'text-gray-400 hover:text-white'}`}>
                {crumb.label}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* ===== CATEGORIES VIEW ===== */}
      {view === 'categories' && (
        <div className="space-y-6">
          {/* Interactive Skeleton — scrollable on mobile */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2"><Wrench className="w-4 h-4" /> Interactive Big Rig — Click a Zone</h3>
              <span className="text-[10px] text-gray-600">Click zones or cards below</span>
            </div>
            <div className="overflow-x-auto -mx-4 lg:-mx-6 px-4 lg:px-6 pb-2 flex justify-center">
              <svg viewBox="40 20 740 320" className="w-full min-w-[600px] max-w-[750px] h-auto max-h-[280px] mx-auto">
                <g stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none">
                  {/* Truck cab - front section */}
                  <path d="M 80 280 L 80 180 L 160 160 L 200 160 L 230 180 L 230 280 Z" />
                  {/* Engine bay */}
                  <path d="M 230 280 L 230 200 L 380 190 L 420 190 L 440 210 L 440 280 Z" />
                  {/* Mid chassis */}
                  <path d="M 440 280 L 440 220 L 500 220 L 500 280 Z" />
                  {/* Sleeper / rear cab */}
                  <path d="M 500 280 L 500 200 L 650 200 L 650 280 Z" />
                  {/* Trailer connection */}
                  <path d="M 650 280 L 650 220 L 720 220 L 720 280 Z" />
                  {/* Frame rails */}
                  <line x1="80" y1="280" x2="720" y2="280" />
                  <line x1="80" y1="300" x2="720" y2="300" />
                  {/* Wheels */}
                  <circle cx="155" cy="310" r="30" />
                  <circle cx="470" cy="310" r="25" />
                  <circle cx="530" cy="310" r="25" />
                  <circle cx="590" cy="310" r="25" />
                  <circle cx="685" cy="310" r="25" />
                  {/* Axle lines */}
                  <line x1="155" y1="280" x2="155" y2="310" strokeDasharray="2 2" />
                  <line x1="470" y1="280" x2="470" y2="310" strokeDasharray="2 2" />
                  <line x1="530" y1="280" x2="530" y2="310" strokeDasharray="2 2" />
                  <line x1="590" y1="280" x2="590" y2="310" strokeDasharray="2 2" />
                  <line x1="685" y1="280" x2="685" y2="310" strokeDasharray="2 2" />
                </g>
              {skeletonZones.map(zone => (
                <g key={zone.id} className="cursor-pointer" onClick={() => handleZoneClick(zone)}>
                  <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="8"
                    fill="rgba(0,217,255,0.08)" stroke="#00D9FF" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={zone.x + zone.w / 2} y={zone.y + zone.h / 2 - 6} textAnchor="middle" dominantBaseline="middle" fill="#00D9FF" fontSize="10" fontWeight="600">{zone.label}</text>
                  <text x={zone.x + zone.w / 2} y={zone.y + zone.h / 2 + 8} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.4)" fontSize="8">{zone.count} parts</text>
                </g>
              ))}
              </svg>
            </div>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {partsCatalog.map(cat => {
              const partCount = cat.subcategories.reduce((a, s) => a + s.components.reduce((b, c) => b + c.parts.length, 0), 0);
              return (
                <button key={cat.id} onClick={() => goToCategory(cat)}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:border-cyan-500/30 hover:-translate-y-0.5 transition-all group text-left">
                  <div className={`w-10 h-10 rounded-xl ${cat.color.replace('text-', 'bg-').replace('400', '500/15')} flex items-center justify-center mb-2`}>
                    <Wrench className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <div className="text-sm font-semibold text-white">{cat.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{cat.subcategories.length} subcats • {partCount} parts</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== SUBCATEGORIES VIEW ===== */}
      {view === 'subcategories' && selectedCategory && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">{selectedCategory.name} — Select Subcategory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedCategory.subcategories.map(sub => {
              const partCount = sub.components.reduce((a, c) => a + c.parts.length, 0);
              return (
                <button key={sub.id} onClick={() => goToSubcategory(sub)}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 hover:-translate-y-0.5 transition-all group text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">{sub.name}</h3>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-xs text-gray-500">{sub.components.length} components • {partCount} parts</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== COMPONENTS VIEW ===== */}
      {view === 'components' && selectedCategory && selectedSubcategory && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">{selectedSubcategory.name} — Select Component</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedSubcategory.components.map(comp => (
              <button key={comp.id} onClick={() => goToComponent(comp)}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 hover:-translate-y-0.5 transition-all group text-left">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">{comp.name}</h3>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                </div>
                <p className="text-xs text-gray-500">{comp.parts.length} parts available</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== PARTS LIST VIEW ===== */}
      {(view === 'parts' && (selectedComponent || searchResults.length > 0)) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {searchResults.length > 0 ? `${searchResults.length} Results for "${searchQuery}"` : `${selectedComponent?.name} — ${selectedComponent?.parts.length} Parts`}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => { const sorted = [...(searchResults.length > 0 ? searchResults : selectedComponent?.parts || [])].sort((a, b) => a.price - b.price); if (searchResults.length > 0) setSearchResults(sorted); }}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Price: Low to High
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {(searchResults.length > 0 ? searchResults : selectedComponent?.parts || []).map(part => (
              <div key={part.partNumber} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group">
                <div className="h-28 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 flex items-center justify-center border-b border-white/5">
                  <Wrench className="w-8 h-8 text-gray-700 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div className="p-3">
                  <div className="text-xs font-semibold text-white truncate">{part.name}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">{part.partNumber} • {part.brand}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="text-sm font-bold text-cyan-400">${part.price.toFixed(2)}</span>
                      <span className="text-[10px] text-gray-600 line-through ml-1">${part.msrp.toFixed(2)}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400">{part.stockQty} in stock</span>
                  </div>
                  <div className="flex gap-1.5 mt-2 pt-2 border-t border-white/5">
                    <button onClick={() => { addToCart({...part, id: part.partNumber, stockQuantity: part.stockQty}); }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-[10px] font-medium hover:bg-cyan-500/30 transition-all">
                      <ShoppingCart className="w-3 h-3" /> Add
                    </button>
                    <button onClick={() => handleCopyPart(part)}
                      className="px-2 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-all">
                      {copiedId === part.partNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button onClick={() => goToPartDetail(part)}
                      className="px-2 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-all text-[10px]">View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== PART DETAIL VIEW ===== */}
      {view === 'part-detail' && selectedPart && (
        <div className="space-y-4">
          <button onClick={goBack} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to parts list
          </button>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl flex items-center justify-center border border-cyan-500/10 flex-shrink-0">
                <Wrench className="w-16 h-16 text-cyan-400/40" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedPart.name}</h2>
                    <p className="text-sm font-mono text-cyan-400">{selectedPart.partNumber}</p>
                    <p className="text-sm text-gray-500">by {selectedPart.brand}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-cyan-400">${selectedPart.price.toFixed(2)}</div>
                    <div className="text-sm text-gray-600 line-through">${selectedPart.msrp.toFixed(2)}</div>
                    <div className="text-xs text-emerald-400">Save ${(selectedPart.msrp - selectedPart.price).toFixed(2)}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-3 leading-relaxed">{selectedPart.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedPart.verified && <span className="px-2 py-1 rounded-lg bg-cyan-500/15 text-cyan-400 text-xs border border-cyan-500/20">HERO Verified</span>}
                  <span className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs border border-emerald-500/20">In Stock: {selectedPart.stockQty}</span>
                  <span className="px-2 py-1 rounded-lg bg-white/5 text-gray-400 text-xs border border-white/10">{selectedPart.weight}</span>
                  <span className="px-2 py-1 rounded-lg bg-white/5 text-gray-400 text-xs border border-white/10">{selectedPart.warranty}</span>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => addToCart({...selectedPart, id: selectedPart.partNumber, stockQuantity: selectedPart.stockQty})}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:brightness-110 transition-all">
                    <ShoppingCart className="w-4 h-4" /> Add to Build Sheet
                  </button>
                  <button onClick={() => handleCopyPart(selectedPart)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all text-sm">
                    {copiedId === selectedPart.partNumber ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    Copy for DMS
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
            </div>
          </div>

          {/* Applications */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">Applications</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPart.applications.map(app => (
                <span key={app} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-xs border border-white/10">{app}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
