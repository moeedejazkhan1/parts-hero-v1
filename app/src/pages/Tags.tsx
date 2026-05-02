import { useState } from 'react';
import { Tag, Plus, Upload, X, Link2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { tags } from '@/data/mock';

export default function Tags() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { showToast } = useToast();

  const tagTypeLabels: Record<string, string> = {
    location: 'Location Tags',
    vendor: 'Vendor Tags',
    part: 'Part Tags',
    customer: 'Customer Tags',
    weather: 'Weather Tags',
  };

  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.type]) acc[tag.type] = [];
    acc[tag.type].push(tag);
    return acc;
  }, {} as Record<string, typeof tags>);

  const connectionData: Record<string, { news: number; academy: number; promotions: number }> = {
    'Brake': { news: 3, academy: 1, promotions: 2 },
    'Engine': { news: 2, academy: 2, promotions: 3 },
    'Transmission': { news: 1, academy: 1, promotions: 1 },
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-cyan-400" />
            Meta Data Tags
          </h1>
          <p className="text-gray-500 text-sm mt-1">The tagging intelligence layer that connects everything.</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Tag
        </button>
      </div>

      {/* Tag Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedTags).map(([type, typeTags]) => (
          <div key={type} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 capitalize">{tagTypeLabels[type] || type}</h3>
            <div className="flex flex-wrap gap-2">
              {typeTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:scale-105 ${tag.color}`}
                >
                  #{tag.name}
                  <sup className="ml-0.5 text-[10px] opacity-70">{tag.count}</sup>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Connection Web */}
      {selectedTag && connectionData[selectedTag] && (
        <div className="bg-white/5 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-cyan-400" />
              Connection Web: #{selectedTag}
            </h3>
            <button onClick={() => setSelectedTag(null)} className="text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{connectionData[selectedTag].news}</div>
              <div className="text-xs text-gray-500 mt-1">News Articles</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{connectionData[selectedTag].academy}</div>
              <div className="text-xs text-gray-500 mt-1">Academy Modules</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">{connectionData[selectedTag].promotions}</div>
              <div className="text-xs text-gray-500 mt-1">Promotions</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-cyan-400 rounded-full" /> News
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-purple-400 rounded-full" /> Academy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-amber-400 rounded-full" /> Promotions
            </span>
          </div>
        </div>
      )}

      {/* Bulk Tag Tool */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Bulk Tag Tool</h3>
        <div className="border-2 border-dashed border-white/20 rounded-xl p-12 flex flex-col items-center gap-3 hover:border-cyan-500/30 transition-all cursor-pointer">
          <Upload className="w-8 h-8 text-gray-500" />
          <span className="text-sm text-gray-400">Upload CSV or drag-select multiple items</span>
          <span className="text-xs text-gray-600">Coming in v2 — CSV upload with auto-tag mapping</span>
        </div>
      </div>

      {/* Create Tag Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateForm(false)}>
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">Create New Tag</h2>
            <div className="space-y-3">
              <input placeholder="Tag Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50" />
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none">
                <option>Location</option>
                <option>Vendor</option>
                <option>Part</option>
                <option>Customer</option>
                <option>Weather</option>
              </select>
              <div className="flex gap-2">
                {['bg-purple-500/20 text-purple-300', 'bg-orange-500/20 text-orange-300', 'bg-cyan-500/20 text-cyan-300', 'bg-emerald-500/20 text-emerald-300', 'bg-amber-500/20 text-amber-300'].map((color, i) => (
                  <button key={i} className={`w-8 h-8 rounded-full border border-white/20 ${color}`} />
                ))}
              </div>
              <input placeholder="Rules (e.g., Apply to all shops in Phoenix)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none" />
              <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 outline-none" />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowCreateForm(false); showToast('Tag created successfully!', 'success'); }}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2.5 rounded-xl hover:brightness-110 transition-all"
              >
                Create Tag
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 border border-white/20 text-white py-2.5 rounded-xl hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
