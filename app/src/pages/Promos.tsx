import { useState } from 'react';
import { Tag, Clock, Sun, Check, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { promotions } from '@/data/mock';

export default function Promos() {
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { showToast } = useToast();
  const isManufacturer = user?.role === 'Manufacturer';

  const handleClaim = (id: string) => {
    setClaimedIds(prev => new Set([...prev, id]));
    showToast('Offer claimed! Added to your order.', 'success');
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-cyan-400" />
            Promotions
          </h1>
          <p className="text-gray-500 text-sm mt-1">Smart promotions matched to your garage, location, and weather.</p>
        </div>
        {isManufacturer && (
          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Promotion
          </button>
        )}
      </div>

      {/* Weather Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
        <Sun className="w-6 h-6 text-amber-400" />
        <div>
          <div className="text-sm font-semibold text-amber-400">AC Parts Promo Active — Your fleet needs cooling.</div>
          <div className="text-xs text-gray-500">15% off compressor kits. Phoenix temps at 108°F.</div>
        </div>
      </div>

      {/* Manufacturer Stats */}
      {isManufacturer && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <div className="text-2xl font-bold text-white font-mono">1,247</div>
            <div className="text-xs text-gray-500 uppercase">Views</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <div className="text-2xl font-bold text-cyan-400 font-mono">89</div>
            <div className="text-xs text-gray-500 uppercase">Claims</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <div className="text-2xl font-bold text-emerald-400 font-mono">7.1%</div>
            <div className="text-xs text-gray-500 uppercase">Conversion</div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
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

      {/* Promo Grid */}
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
  );
}
