import { useState } from 'react';
import {
  Clock, Sun, Check, Plus, Star, ArrowRight,
  ShoppingCart, Zap, Truck, ExternalLink, BadgePercent
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { promotions } from '@/data/mock';

// DMS integration partners
const dmsPartners = [
  { name: 'CDK Global', abbr: 'CDK', color: '#00A4E4', status: 'Connected' },
  { name: 'Karmak Fusion', abbr: 'KA', color: '#F26522', status: 'Connected' },
  { name: 'Procede Excede', abbr: 'PE', color: '#0055A4', status: 'Connected' },
  { name: 'Reynolds & Reynolds', abbr: 'RE', color: '#C8102E', status: 'Connected' },
];

// Featured deals
const featuredDeals = [
  {
    id: 'fd1',
    title: 'KLONDIKE SAE 50 CF-2',
    subtitle: 'Heavy Duty Engine Oil',
    description: 'Special Pricing for RWC Customers',
    image: '/promo-klondike-oil.png',
    badge: 'RWC Exclusive',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    cta: 'View Pricing',
    accent: '#D4AF37',
  },
  {
    id: 'fd2',
    title: 'SUMMER COOLANT SALE',
    subtitle: '15% OFF',
    description: 'Heavy Duty Antifreeze & Coolant — All Sizes',
    image: '/promo-coolant.png',
    badge: 'Limited Time',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    cta: 'Claim 15% Off',
    accent: '#E53935',
  },
];

// Rebate deals
const rebateDeals = [
  {
    id: 'rd1',
    title: '$10k Manufacturer Rebate',
    description: 'Engine Components Rebate Program Q2 2025',
    icon: Truck,
    color: 'from-cyan-500/20 to-blue-500/10',
    border: 'border-cyan-500/20',
    textColor: 'text-cyan-400',
  },
  {
    id: 'rd2',
    title: '$10k Manufacturer Rebate',
    description: 'Powertrain Overhaul Rebate — Cummins & Detroit',
    icon: Zap,
    color: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/20',
    textColor: 'text-amber-400',
  },
  {
    id: 'rd3',
    title: '$10k Engine Components Rebate',
    description: 'Fleet-wide engine parts rebate for RWC customers',
    icon: BadgePercent,
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
    textColor: 'text-emerald-400',
  },
];

export default function Promos() {
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const [claimedDeals, setClaimedDeals] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { showToast } = useToast();
  const isManufacturer = user ? ['Part Manufacturer - Sales', 'Part Manufacturer - Data Management', 'Parts Manufacturer - Marketing and Promotions Manager'].includes(user.role) : false;

  const handleClaim = (id: string) => {
    setClaimedIds(prev => new Set([...prev, id]));
    showToast('Offer claimed! Added to your order.', 'success');
  };

  const handleClaimDeal = (id: string) => {
    setClaimedDeals(prev => new Set([...prev, id]));
    showToast('Deal claimed! Check your email for redemption details.', 'success');
  };

  const handlePushDMS = () => {
    showToast('Pushing promotions to all connected DMS systems...', 'info');
    setTimeout(() => {
      showToast('Successfully synced to CDK, Karmak, Procede & Reynolds!', 'success');
    }, 1500);
  };

  const tagColors: Record<string, string> = {
    '#Cummins': 'bg-red-500/15 text-red-400 border-red-500/30',
    '#Engine': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    '#Oil': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    '#Phoenix': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    '#HotWeather': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    '#Eaton': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    '#Transmission': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    '#Powertrain': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    '#Bendix': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    '#Brakes': 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    '#Chassis': 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    '#PACCAR': 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    '#AC': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    '#Meritor': 'bg-lime-500/15 text-lime-400 border-lime-500/30',
    '#Differential': 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* ====== HEADER ====== */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <Star className="w-7 h-7 text-amber-400" />
            Featured Promotions
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Vendor offers, rebates & exclusive deals matched to your fleet.
          </p>
        </div>
        {isManufacturer && (
          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Promotion
          </button>
        )}
      </div>

      {/* ====== WEATHER BANNER ====== */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
        <Sun className="w-6 h-6 text-amber-400 flex-shrink-0" />
        <div>
          <div className="text-sm font-semibold text-amber-400">
            AC Parts Promo Active — Your fleet needs cooling.
          </div>
          <div className="text-xs text-gray-500">
            15% off compressor kits. Phoenix temps at 108°F. Limited inventory.
          </div>
        </div>
        <span className="ml-auto px-2 py-1 rounded-full bg-red-500/15 text-red-400 text-[10px] font-bold border border-red-500/20 flex-shrink-0 animate-pulse">
          URGENT
        </span>
      </div>

      {/* ====== FEATURED PROMOTIONS (2 large cards) ====== */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Featured Vendor Offers
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {featuredDeals.map((deal) => (
            <div
              key={deal.id}
              className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group"
            >
              {/* Background accent glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ background: `radial-gradient(circle at 80% 50%, ${deal.accent}15, transparent 60%)` }}
              />

              <div className="flex flex-col sm:flex-row">
                {/* Image side */}
                <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content side */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${deal.badgeColor} mb-2`}>
                        {deal.badge}
                      </span>
                      <h3 className="text-lg font-bold text-white leading-tight">{deal.title}</h3>
                      <p className="text-sm font-semibold" style={{ color: deal.accent }}>{deal.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{deal.description}</p>

                  <div className="flex items-center gap-3">
                    {claimedDeals.has(deal.id) ? (
                      <span className="px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-medium flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaimDeal(deal.id)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {deal.cta}
                      </button>
                    )}
                    <button className="px-3 py-2 rounded-xl bg-white/5 text-gray-400 text-xs hover:bg-white/10 transition-all flex items-center gap-1">
                      Details <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ====== DEAL GRID (Rebates) ====== */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Deal Grid — Manufacturer Rebates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {rebateDeals.map((deal) => {
            const Icon = deal.icon;
            return (
              <div
                key={deal.id}
                className={`relative bg-gradient-to-br ${deal.color} backdrop-blur-md border ${deal.border} rounded-2xl p-5 hover:border-white/20 transition-all group overflow-hidden`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${deal.textColor}`} />
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">Q2 2025</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{deal.title}</h3>
                  <p className="text-xs text-gray-500 mb-4">{deal.description}</p>
                  {claimedDeals.has(deal.id) ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-medium">
                      <Check className="w-3.5 h-3.5" /> Claimed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaimDeal(deal.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-all flex items-center gap-1"
                    >
                      Claim Rebate <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ====== LEGACY BRIDGE — DMS Integration Wall ====== */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-cyan-400" />
              Legacy Bridge
            </h2>
            <p className="text-xs text-gray-500">DMS Integration Wall — Push promotions directly to your dealer management system</p>
          </div>
          <button
            onClick={handlePushDMS}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            Push to DMS & ROI
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {dmsPartners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:border-white/20 transition-all"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: partner.color }}
              >
                {partner.abbr}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{partner.name}</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {partner.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ====== MANUFACTURER STATS ====== */}
      {isManufacturer && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <div className="text-2xl font-bold text-white font-mono">1,247</div>
            <div className="text-xs text-gray-500 uppercase">Promotion Views</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <div className="text-2xl font-bold text-cyan-400 font-mono">89</div>
            <div className="text-xs text-gray-500 uppercase">Claims This Week</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <div className="text-2xl font-bold text-emerald-400 font-mono">7.1%</div>
            <div className="text-xs text-gray-500 uppercase">Conversion Rate</div>
          </div>
        </div>
      )}

      {/* ====== FILTER BAR ====== */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Location', 'Business Type', 'Category', 'Weather'].map((filter, i) => (
          <button
            key={filter}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              i === 0 ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ====== ALL PROMOTIONS GRID ====== */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          All Active Promotions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map(promo => (
            <div key={promo.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group">
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {/* Vendor badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg bg-gradient-to-br ${promo.vendorGradient} shadow-lg`}>
                  <span className="text-white text-[10px] font-bold">{promo.vendorInitials}</span>
                </div>
                {/* Relevance score */}
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur text-emerald-400 text-[10px] font-medium">
                  {promo.relevanceScore}% match
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-white mb-1">{promo.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{promo.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {promo.tags.map(tag => (
                    <span key={tag} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${tagColors[tag] || 'bg-white/5 text-gray-400 border-white/10'}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    Ends in {promo.expiryDays} days
                  </div>
                  {claimedIds.has(promo.id) || promo.claimed ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Claimed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaim(promo.id)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-all"
                    >
                      Claim Offer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ====== KLONDIKE BRAND FOOTER ====== */}
      <div className="flex items-center justify-center gap-2 py-4 border-t border-white/5">
        <span className="text-xs text-gray-600">Powered by</span>
        <span className="text-xs font-bold text-amber-400">KLONDIKE</span>
        <span className="text-[10px] text-gray-600 uppercase tracking-wider">— Run Right</span>
      </div>
    </div>
  );
}
