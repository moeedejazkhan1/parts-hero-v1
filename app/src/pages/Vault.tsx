import { useState } from 'react';
import { getCustomerType } from '@/types';
import {
  Database, Upload, AlertTriangle, TrendingUp, Cloud,
  Star, MapPin, Calendar, DollarSign, Package, Clock,
  Mail, X, ChevronRight, BarChart3, Users, Award,
  Zap, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { vendors, featuredVendors } from '@/data/mock';
import type { Vendor } from '@/types';

export default function Vault() {
  const [activeTab, setActiveTab] = useState<'vendors' | 'health' | 'verify' | 'portal'>('vendors');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user ? getCustomerType(user.role) === 'manufacturer' : false;

  const overallHealth = Math.round(vendors.reduce((a, v) => a + v.healthScore, 0) / vendors.length);

  const recentUploads = [
    { vendor: 'Cummins', skus: 240, date: 'Yesterday', status: 'Approved' },
    { vendor: 'Bendix', skus: 85, date: '2 days ago', status: 'Pending Review' },
    { vendor: 'Eaton', skus: 120, date: '3 days ago', status: 'Approved' },
    { vendor: 'Fleetguard', skus: 180, date: '4 days ago', status: 'Processing' },
  ];

  const verificationQueue = [
    { id: '1', partNumber: 'LF9009', issue: 'Missing weight data', vendor: 'Fleetguard' },
    { id: '2', partNumber: 'K-3338', issue: 'No dimensions specified', vendor: 'Bendix' },
    { id: '3', partNumber: 'GC4594', issue: 'Cross-reference incomplete', vendor: 'Meritor' },
    { id: '4', partNumber: '23536438', issue: 'Missing application data', vendor: 'Detroit Diesel' },
  ];

  const topPerformers = [...featuredVendors].sort((a, b) => (b.ordersThisMonth || 0) - (a.ordersThisMonth || 0)).slice(0, 5);
  const totalRevenue = featuredVendors.reduce((acc, v) => acc + parseInt((v.revenueYTD || '$0').replace(/[$K]/g, '')), 0);
  const totalOrders = featuredVendors.reduce((acc, v) => acc + (v.ordersThisMonth || 0), 0);
  const avgRating = (featuredVendors.reduce((acc, v) => acc + (v.rating || 0), 0) / featuredVendors.length).toFixed(1);

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-400" />
            The Vault
          </h1>
          <p className="text-gray-500 text-sm mt-1">{vendors.length}+ vendors. One source of truth.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('portal')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeTab === 'portal' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
            }`}
          >
            Manufacturer Portal
          </button>
        )}
      </div>

      {/* Partnership Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Partner Vendors</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{featuredVendors.length}</div>
          <div className="text-xs text-emerald-400 mt-1">+3 new this quarter</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Orders This Month</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{totalOrders}</div>
          <div className="text-xs text-emerald-400 mt-1">+12% vs last month</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">YTD Revenue</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">${totalRevenue}K</div>
          <div className="text-xs text-emerald-400 mt-1">+18% vs last year</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Star className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Avg Rating</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{avgRating}</div>
          <div className="text-xs text-gray-500 mt-1">out of 5.0</div>
        </div>
      </div>

      {/* Top Performers Row */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <div className="flex-shrink-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-4 min-w-[200px]">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            Top Performers
          </h3>
          <div className="space-y-2">
            {topPerformers.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setSelectedVendor(v)}
                className="flex items-center gap-2 w-full text-left hover:bg-white/5 rounded-lg p-1.5 transition-colors"
              >
                <span className="text-xs font-mono text-cyan-400 w-4">#{i + 1}</span>
                <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center overflow-hidden">
                  {v.logo ? (
                    <img src={v.logo} alt={v.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[8px] text-white font-bold">{v.initials}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white truncate">{v.name}</div>
                  <div className="text-[10px] text-gray-500">{v.ordersThisMonth} orders</div>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-600" />
              </button>
            ))}
          </div>
        </div>

        {recentUploads.map((upload, i) => (
          <div key={i} className="flex-shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                <Upload className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{upload.vendor}</div>
                <div className="text-xs text-gray-500">{upload.date}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{upload.skus} SKUs uploaded</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                upload.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-400' :
                upload.status === 'Pending Review' ? 'bg-amber-500/15 text-amber-400' :
                'bg-blue-500/15 text-blue-400'
              }`}>{upload.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['vendors', 'health', 'verify'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeTab === tab ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
            }`}
          >
            {tab === 'vendors' ? 'Vendor Partners' : tab === 'health' ? 'Health Check' : 'Verification Queue'}
          </button>
        ))}
      </div>

      {/* Vendor Partners */}
      {activeTab === 'vendors' && (
        <div className="space-y-6">
          {/* Featured Vendors with Logos */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Featured Partners ({featuredVendors.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {featuredVendors.map(vendor => (
                <button
                  key={vendor.id}
                  onClick={() => setSelectedVendor(vendor)}
                  className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden p-1.5 group-hover:scale-105 transition-transform">
                      {vendor.logo ? (
                        <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-white font-bold text-sm">{vendor.initials}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-white font-medium">{vendor.rating}</span>
                    </div>
                  </div>

                  <div className="text-sm font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {vendor.name}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{vendor.tagline}</p>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-white/[0.02] rounded-lg p-2">
                      <div className="text-gray-500">Orders</div>
                      <div className="text-white font-mono font-medium">{vendor.ordersThisMonth}/mo</div>
                    </div>
                    <div className="bg-white/[0.02] rounded-lg p-2">
                      <div className="text-gray-500">Revenue</div>
                      <div className="text-white font-mono font-medium">{vendor.revenueYTD}</div>
                    </div>
                    <div className="bg-white/[0.02] rounded-lg p-2">
                      <div className="text-gray-500">Health</div>
                      <div className={`font-mono font-medium ${vendor.healthScore > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {vendor.healthScore}%
                      </div>
                    </div>
                    <div className="bg-white/[0.02] rounded-lg p-2">
                      <div className="text-gray-500">Response</div>
                      <div className="text-white font-mono font-medium">{vendor.responseTime}</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Partner since {vendor.partnershipSince}</span>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* All Vendors */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-gray-400" />
              Full Vendor Directory ({vendors.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {vendors.map(vendor => (
                <button
                  key={vendor.id}
                  onClick={() => {
                    const featured = featuredVendors.find(v => v.name === vendor.name);
                    setSelectedVendor(featured || vendor);
                  }}
                  className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform overflow-hidden p-1"
                    style={{ background: vendor.logo ? 'rgba(255,255,255,0.1)' : undefined }}>
                    {vendor.logo ? (
                      <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-white font-bold text-sm bg-gradient-to-br w-full h-full flex items-center justify-center rounded-lg"
                        style={{ background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` }}>
                        {vendor.initials}
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-white truncate">{vendor.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">{vendor.partCount.toLocaleString()} parts</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Verification Queue */}
      {activeTab === 'verify' && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">SME Verification Queue</h3>
          <div className="space-y-2">
            {verificationQueue.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-all">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white font-medium">{item.partNumber}</div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400">
                    <AlertTriangle className="w-3 h-3" />
                    {item.issue}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{item.vendor}</div>
                </div>
                <button
                  onClick={() => showToast(`${item.partNumber} verified!`, 'success')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition-all"
                >
                  Verify
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Check Detail */}
      {activeTab === 'health' && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Detailed Health Analysis</h3>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${overallHealth > 80 ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
              <span className="text-sm text-gray-400">Overall: {overallHealth}%</span>
            </div>
          </div>

          {/* Health Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                  <circle
                    cx="64" cy="64" r="56"
                    stroke={overallHealth > 80 ? '#10B981' : overallHealth > 60 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${overallHealth * 3.52} 351.86`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{overallHealth}%</span>
                  <span className="text-[10px] text-gray-500 uppercase">Vault Health</span>
                </div>
              </div>
              <div className="mt-3 text-sm text-emerald-400 font-medium">Healthy</div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-sm font-semibold text-white mb-3">Gap Analysis Scorecard</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
                      <th className="text-left py-2 px-3">Vendor</th>
                      <th className="text-right py-2 px-3">SKUs</th>
                      <th className="text-right py-2 px-3">Missing Weight</th>
                      <th className="text-right py-2 px-3">Missing Dim</th>
                      <th className="text-right py-2 px-3">Cross-Ref</th>
                      <th className="text-right py-2 px-3">Health</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.slice(0, 10).map(v => (
                      <tr key={v.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            {v.logo && (
                              <img src={v.logo} alt={v.name} className="w-5 h-5 object-contain" />
                            )}
                            <span className="text-white font-medium text-xs">{v.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right text-gray-400 font-mono text-xs">{v.partCount.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">
                          <span className={`text-xs ${v.missingWeight > 100 ? 'text-red-400' : 'text-gray-400'}`}>{v.missingWeight}</span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className={`text-xs ${v.missingDimensions > 80 ? 'text-amber-400' : 'text-gray-400'}`}>{v.missingDimensions}</span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className={`text-xs ${v.missingCrossRef > 50 ? 'text-amber-400' : 'text-gray-400'}`}>{v.missingCrossRef}</span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className={`text-xs font-medium ${v.healthScore > 80 ? 'text-emerald-400' : v.healthScore > 60 ? 'text-amber-400' : 'text-red-400'}`}>
                            {v.healthScore}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase mb-2">Completeness Trend</div>
              <div className="h-32 flex items-end gap-1">
                {[65, 68, 72, 75, 78, 82, 85, 87].map((v, i) => (
                  <div key={i} className="flex-1 bg-cyan-500/30 rounded-t" style={{ height: `${v}%` }} />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase mb-2">Top Missing Fields</div>
              <div className="space-y-2">
                {[
                  { field: 'Weight', count: 1247, pct: 45 },
                  { field: 'Dimensions', count: 892, pct: 32 },
                  { field: 'Cross-Reference', count: 634, pct: 23 },
                ].map(item => (
                  <div key={item.field}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{item.field}</span>
                      <span className="text-gray-500">{item.count} items</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div className="bg-amber-500/60 h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase mb-2">Market Intel</div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <div className="text-sm text-white">Brake Chambers trending +23% in Phoenix</div>
                  <div className="text-xs text-gray-500 mt-1">Stock up ahead of May DOT blitz.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manufacturer Portal */}
      {activeTab === 'portal' && isAdmin && (
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Catalog</h3>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-12 flex flex-col items-center gap-3 hover:border-cyan-500/30 transition-all cursor-pointer">
              <Cloud className="w-8 h-8 text-gray-500" />
              <span className="text-sm text-gray-400">Drop CSV/Excel here or click to upload</span>
              <span className="text-xs text-gray-600">Max 50MB. Auto-mapped to Learning Tree.</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Data Health Over Time</h3>
            <div className="h-40 flex items-end gap-2">
              {[60, 65, 70, 72, 75, 78, 82, 85, 87, 88].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-cyan-500/40 rounded-t" style={{ height: `${v * 1.5}px` }} />
                  <span className="text-[10px] text-gray-500">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedVendor(null)}>
          <div
            className="bg-[#0F172A] border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-6 border-b border-white/5">
              <button
                onClick={() => setSelectedVendor(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden p-2">
                  {selectedVendor.logo ? (
                    <img src={selectedVendor.logo} alt={selectedVendor.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-white font-bold text-lg">{selectedVendor.initials}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white">{selectedVendor.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedVendor.tagline || 'Trusted Parts Hero vendor partner'}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-white font-medium">{selectedVendor.rating || '4.5'}</span>
                    </div>
                    {selectedVendor.partnershipSince && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        Partner since {selectedVendor.partnershipSince}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <Package className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white font-mono">{selectedVendor.partCount.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500">SKUs</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <BarChart3 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white font-mono">{selectedVendor.healthScore}%</div>
                  <div className="text-[10px] text-gray-500">Health</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <ArrowUpRight className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white font-mono">{selectedVendor.ordersThisMonth || 0}</div>
                  <div className="text-[10px] text-gray-500">Orders/mo</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                {selectedVendor.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="text-gray-400">{selectedVendor.location}</span>
                  </div>
                )}
                {selectedVendor.topCategory && (
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="text-gray-400">Top category: <span className="text-white">{selectedVendor.topCategory}</span></span>
                  </div>
                )}
                {selectedVendor.responseTime && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="text-gray-400">Avg response: <span className="text-emerald-400">{selectedVendor.responseTime}</span></span>
                  </div>
                )}
                {selectedVendor.revenueYTD && (
                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="text-gray-400">YTD Revenue: <span className="text-white font-medium">{selectedVendor.revenueYTD}</span></span>
                  </div>
                )}
                {selectedVendor.contact && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="text-gray-400">{selectedVendor.contact}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-3 border-t border-white/5">
                <button
                  onClick={() => { showToast(`Opening catalog for ${selectedVendor.name}`, 'info'); }}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-all"
                >
                  View Catalog
                </button>
                <button
                  onClick={() => { showToast(`Contact request sent to ${selectedVendor.name}`, 'success'); }}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
