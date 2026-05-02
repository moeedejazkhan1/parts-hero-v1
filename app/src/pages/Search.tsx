import { useState } from 'react';
import {
  Search as SearchIcon, Camera, Copy, Check, Wrench, ShoppingCart,
  ChevronRight, Sparkles, ArrowLeft, Filter, Truck, GitBranch,
  Hash, Type, Layers, Bone, Zap, Star
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useCart } from '@/contexts/CartContext';
import { partsCatalog, searchParts, catalogStats } from '@/data/partsDatabase';
import type { CategoryNode, SubcategoryNode, ComponentNode, PartSpec } from '@/data/partsDatabase';
import { manufacturers, skeletonZoneMap } from '@/data/ymmData';
import type { Manufacturer, YearRange, TruckModel, SystemCategory } from '@/data/ymmData';
import TruckSkeleton from '@/components/TruckSkeleton';

// ============== TYPES ==============
type SearchMode = 'vin' | 'keyword' | 'learning' | 'skeleton';
type LearningStep = 'manufacturer' | 'year' | 'model' | 'system' | 'parts';
type ViewLevel = 'categories' | 'subcategories' | 'components' | 'parts' | 'part-detail';

const searchModes: { id: SearchMode; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'vin', label: 'VIN Search', icon: Hash, desc: 'Decode by VIN number' },
  { id: 'keyword', label: 'AI Search', icon: Type, desc: 'Natural language search' },
  { id: 'learning', label: 'Learning Tree', icon: Layers, desc: 'Year / Make / Model' },
  { id: 'skeleton', label: 'Truck Skeleton', icon: Bone, desc: 'Visual zone search' },
];

// ============== MAIN COMPONENT ==============
export default function PartsSearch() {
  const [searchMode, setSearchMode] = useState<SearchMode>('keyword');

  // ----- Shared state -----
  const [view, setView] = useState<ViewLevel>('categories');
  const [selectedCategory, setSelectedCategory] = useState<CategoryNode | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryNode | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentNode | null>(null);
  const [selectedPart, setSelectedPart] = useState<PartSpec | null>(null);
  const [searchResults, setSearchResults] = useState<PartSpec[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ----- VIN state -----
  const [vin, setVin] = useState('');
  const [vinDecoded, setVinDecoded] = useState(false);

  // ----- Keyword state -----
  const [searchQuery, setSearchQuery] = useState('');

  // ----- Learning Tree state -----
  const [learningStep, setLearningStep] = useState<LearningStep>('manufacturer');
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const [selectedYearRange, setSelectedYearRange] = useState<YearRange | null>(null);
  const [selectedModel, setSelectedModel] = useState<TruckModel | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<SystemCategory | null>(null);

  // ----- Skeleton state -----
  const [activeSkeletonZone, setActiveSkeletonZone] = useState<string | null>(null);

  const { showToast } = useToast();
  const { addToCart } = useCart();

  // ============== HANDLERS ==============

  const handleVinDecode = () => {
    if (!vin) { showToast('Please enter a VIN', 'error'); return; }
    setVinDecoded(true);
    showToast('VIN decoded: 2019 Freightliner Cascadia — Cummins ISX15', 'success');
  };

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

  const handleCopyPart = (part: PartSpec) => {
    const text = `${part.partNumber}\t${part.name}\t${part.brand}\t$${part.price.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopiedId(part.partNumber);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Copied for Karmak/Procede/CDK/DSI', 'success');
  };

  // Category navigation
  const goToCategory = (cat: CategoryNode) => { setSelectedCategory(cat); setView('subcategories'); };
  const goToSubcategory = (sub: SubcategoryNode) => { setSelectedSubcategory(sub); setView('components'); };
  const goToComponent = (comp: ComponentNode) => { setSelectedComponent(comp); setView('parts'); setSearchResults([]); };
  const goToPartDetail = (part: PartSpec) => { setSelectedPart(part); setView('part-detail'); };

  const goBack = () => {
    if (view === 'part-detail') { setView('parts'); setSelectedPart(null); }
    else if (view === 'parts' && selectedComponent) { setView('components'); setSelectedComponent(null); }
    else if (view === 'parts' && searchResults.length > 0) { setSearchResults([]); setView(selectedSubcategory ? 'components' : selectedCategory ? 'subcategories' : 'categories'); }
    else if (view === 'components') { setView('subcategories'); setSelectedSubcategory(null); }
    else if (view === 'subcategories') { setView('categories'); setSelectedCategory(null); }
  };

  // Learning tree navigation
  const resetLearningTree = () => {
    setLearningStep('manufacturer');
    setSelectedManufacturer(null);
    setSelectedYearRange(null);
    setSelectedModel(null);
    setSelectedSystem(null);
  };

  const handleManufacturerSelect = (mfg: Manufacturer) => {
    setSelectedManufacturer(mfg);
    setLearningStep('year');
  };

  const handleYearSelect = (year: YearRange) => {
    setSelectedYearRange(year);
    setLearningStep('model');
  };

  const handleModelSelect = (model: TruckModel) => {
    setSelectedModel(model);
    setLearningStep('system');
  };

  const handleSystemSelect = (system: SystemCategory) => {
    setSelectedSystem(system);
    setLearningStep('parts');
    // Map system to catalog category if possible
    const cat = partsCatalog.find(c => c.id === system.id);
    if (cat) {
      setSelectedCategory(cat);
      setView('subcategories');
    } else {
      // Fallback: search parts by system name
      const results = searchParts(system.name);
      setSearchResults(results);
      setView('parts');
    }
  };

  // Skeleton zone click
  const handleSkeletonZoneClick = (zoneId: string, zoneName: string) => {
    setActiveSkeletonZone(zoneId);
    showToast(`${zoneName} — Loading parts...`, 'info');
    const zoneData = skeletonZoneMap[zoneId];
    if (zoneData) {
      // Find first matching category
      const cat = partsCatalog.find(c => zoneData.categories.includes(c.id));
      if (cat) {
        setSelectedCategory(cat);
        setView('subcategories');
        setSearchMode('keyword');
      } else {
        const results = searchParts(zoneData.name);
        setSearchResults(results);
        setView('parts');
        setSearchMode('keyword');
      }
    }
  };

  // ============== RENDER ==============

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SearchIcon className="w-6 h-6 text-cyan-400" />
          Parts Search
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {catalogStats.totalParts} parts • {catalogStats.totalCategories} categories • {catalogStats.brands} brands
        </p>
      </div>

      {/* ====== SEARCH MODE TABS ====== */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {searchModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = searchMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setSearchMode(mode.id);
                  // Reset views when switching
                  setView('categories');
                  setSearchResults([]);
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                  setSelectedComponent(null);
                  setSelectedPart(null);
                  if (mode.id !== 'learning') resetLearningTree();
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/30'
                    : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'bg-cyan-500/20' : 'bg-white/5'
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-gray-500'}`} />
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isActive ? 'text-cyan-400' : 'text-white'}`}>
                    {mode.label}
                  </div>
                  <div className="text-[10px] text-gray-500 hidden lg:block">{mode.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ====== MODE 1: VIN SEARCH ====== */}
      {searchMode === 'vin' && (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-cyan-400" />
              VIN Decoder
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  value={vin}
                  onChange={e => setVin(e.target.value)}
                  placeholder="Enter 17-character VIN..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50 font-mono tracking-wider"
                  maxLength={17}
                  onKeyDown={e => e.key === 'Enter' && handleVinDecode()}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleVinDecode}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3.5 rounded-xl font-medium hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Decode VIN
                </button>
                <button className="bg-white/5 border border-white/10 text-gray-400 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Example: 3ALACWDC2DDSC0624 (2013 Freightliner Cascadia)
            </p>
          </div>

          {vinDecoded && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">2019 Freightliner Cascadia</h3>
                  <p className="text-sm text-gray-400">Cummins ISX15 450HP • Detroit DT12 Transmission</p>
                </div>
                <span className="ml-auto px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs border border-emerald-500/20">
                  HERO Verified
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Year', value: '2019' },
                  { label: 'Make', value: 'Freightliner' },
                  { label: 'Model', value: 'Cascadia' },
                  { label: 'Engine', value: 'ISX15' },
                  { label: 'Transmission', value: 'DT12' },
                  { label: 'Axle', value: 'DT12-14' },
                  { label: 'GVWR', value: '80,000 lbs' },
                  { label: 'Cab', value: '72\" Raised' },
                ].map((spec) => (
                  <div key={spec.label} className="bg-white/5 rounded-xl p-3">
                    <div className="text-[10px] text-gray-500 uppercase">{spec.label}</div>
                    <div className="text-sm text-white font-medium mt-0.5">{spec.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('Freightliner Cascadia ISX15');
                    setSearchMode('keyword');
                    handleSearch();
                  }}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2.5 rounded-xl font-medium hover:brightness-110 transition-all"
                >
                  Find Parts for This Truck
                </button>
                <button className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all text-sm">
                  Save to Garage
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====== MODE 2: AI KEYWORD SEARCH ====== */}
      {searchMode === 'keyword' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by name, part number, brand, or keyword..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3.5 rounded-xl font-medium hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> AI Search
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Try: "brake pads for Cascadia", "radiator hose ISX15", "alternator 24V"
            </p>
          </div>

          {/* Results or Categories */}
          {renderContent()}
        </div>
      )}

      {/* ====== MODE 3: LEARNING TREE / YEAR MAKE MODEL ====== */}
      {searchMode === 'learning' && (
        <div className="space-y-6">
          {/* Breadcrumb for Learning Tree */}
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <button
              onClick={resetLearningTree}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <GitBranch className="w-4 h-4" /> Learning Tree
            </button>
            {selectedManufacturer && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-600" />
                <button
                  onClick={() => { setLearningStep('manufacturer'); setSelectedYearRange(null); setSelectedModel(null); setSelectedSystem(null); }}
                  className={`transition-colors ${learningStep === 'manufacturer' ? 'text-cyan-400 font-medium' : 'text-gray-400 hover:text-white'}`}
                >
                  {selectedManufacturer.name}
                </button>
              </>
            )}
            {selectedYearRange && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-600" />
                <button
                  onClick={() => { setLearningStep('year'); setSelectedModel(null); setSelectedSystem(null); }}
                  className={`transition-colors ${learningStep === 'year' ? 'text-cyan-400 font-medium' : 'text-gray-400 hover:text-white'}`}
                >
                  {selectedYearRange.label}
                </button>
              </>
            )}
            {selectedModel && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-600" />
                <button
                  onClick={() => { setLearningStep('model'); setSelectedSystem(null); }}
                  className={`transition-colors ${learningStep === 'model' ? 'text-cyan-400 font-medium' : 'text-gray-400 hover:text-white'}`}
                >
                  {selectedModel.name}
                </button>
              </>
            )}
            {selectedSystem && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-600" />
                <span className="text-cyan-400 font-medium">{selectedSystem.name}</span>
              </>
            )}
          </div>

          {/* STEP 1: Manufacturer Selector */}
          {learningStep === 'manufacturer' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Step 1 — Select Manufacturer</h2>
              <p className="text-sm text-gray-500">Choose your truck brand to begin the parts search</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {manufacturers.map((mfg) => (
                  <button
                    key={mfg.name}
                    onClick={() => handleManufacturerSelect(mfg)}
                    className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all text-left"
                  >
                    {/* Logo image */}
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={mfg.logo}
                        alt={mfg.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                    {/* Label */}
                    <div className="p-3">
                      <div className="text-sm font-semibold text-white">{mfg.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {mfg.yearRanges.reduce((acc, yr) => acc + yr.models.length, 0)} models
                      </div>
                    </div>
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
                      style={{ boxShadow: `inset 0 0 30px ${mfg.color}20, 0 8px 32px ${mfg.color}15` }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Year Range */}
          {learningStep === 'year' && selectedManufacturer && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                Step 2 — Select Year Range for {selectedManufacturer.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedManufacturer.yearRanges.map((yr) => (
                  <button
                    key={yr.label}
                    onClick={() => handleYearSelect(yr)}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 hover:-translate-y-0.5 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {yr.label}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <p className="text-xs text-gray-500">{yr.models.length} models available</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {yr.models.slice(0, 3).map(m => (
                        <span key={m.name} className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[10px]">
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Model Selector */}
          {learningStep === 'model' && selectedYearRange && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                Step 3 — Select Model ({selectedYearRange.label})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedYearRange.models.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => handleModelSelect(model)}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 hover:-translate-y-0.5 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {model.name}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Available engines:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {model.engines.map((eng) => (
                        <span key={eng} className="px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-[10px] border border-cyan-500/20">
                          {eng}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: System Category Tree */}
          {learningStep === 'system' && selectedModel && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                Step 4 — Select System for {selectedManufacturer?.name} {selectedModel.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {selectedModel.systems.map((system) => (
                  <button
                    key={system.id}
                    onClick={() => handleSystemSelect(system)}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:border-cyan-500/30 hover:-translate-y-0.5 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-3">
                      <Wrench className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {system.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1">{system.subcategories.length} subcategories</p>
                    <p className="text-[10px] text-gray-600">{system.partCount.toLocaleString()} parts</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Parts Results */}
          {learningStep === 'parts' && renderContent()}
        </div>
      )}

      {/* ====== MODE 4: TRUCK SKELETON ====== */}
      {searchMode === 'skeleton' && (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bone className="w-5 h-5 text-cyan-400" />
                Interactive Truck Skeleton
              </h2>
              <span className="text-xs text-gray-500 hidden lg:block">
                Hover zones to preview — Click to drill into parts
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Click any zone on the truck diagram to explore parts for that area. 
              Perfect for new hires who don't know part names yet.
            </p>

            <TruckSkeleton
              onZoneClick={handleSkeletonZoneClick}
              activeZone={activeSkeletonZone}
            />
          </div>

          {/* Zone legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(skeletonZoneMap).map(([id, zone]) => (
              <button
                key={id}
                onClick={() => handleSkeletonZoneClick(id, zone.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
                  activeSkeletonZone === id
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                }`}
              >
                <Zap className="w-3 h-3" />
                {zone.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ============== SHARED RENDERERS ==============

  function renderContent() {
    if (view === 'part-detail' && selectedPart) {
      return renderPartDetail();
    }

    if (view === 'parts' && (selectedComponent || searchResults.length > 0)) {
      return renderPartsList();
    }

    if (view === 'components' && selectedCategory && selectedSubcategory) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={goBack} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <span className="text-cyan-400 font-medium">{selectedSubcategory.name}</span>
          </div>
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
      );
    }

    if (view === 'subcategories' && selectedCategory) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={goBack} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <span className="text-cyan-400 font-medium">{selectedCategory.name}</span>
          </div>
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
      );
    }

    // Default: categories grid
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Browse All Categories</h2>
        </div>
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
    );
  }

  function renderPartsList() {
    const parts = searchResults.length > 0 ? searchResults : selectedComponent?.parts || [];
    const title = searchResults.length > 0
      ? `${searchResults.length} Results for "${searchQuery}"`
      : `${selectedComponent?.name} — ${selectedComponent?.parts.length} Parts`;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {view !== 'categories' && (
              <button onClick={goBack} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => {
              const sorted = [...parts].sort((a, b) => a.price - b.price);
              if (searchResults.length > 0) setSearchResults(sorted);
            }} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Price: Low to High
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {parts.map(part => (
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
                <div className="flex flex-wrap gap-1 mt-2">
                  {part.verified && (
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 text-[9px] border border-cyan-500/20 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5" /> HERO Verified
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px]">
                    94% Match
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2 pt-2 border-t border-white/5">
                  <button onClick={() => addToCart({...part, id: part.partNumber, stockQuantity: part.stockQty})}
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
    );
  }

  function renderPartDetail() {
    if (!selectedPart) return null;
    return (
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
                <span className="px-2 py-1 rounded-lg bg-violet-500/15 text-violet-400 text-xs border border-violet-500/20">98% Confidence Match</span>
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
    );
  }
}
