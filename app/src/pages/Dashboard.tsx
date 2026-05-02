import { Link } from 'react-router';
import {
  Search, Package, Truck, GraduationCap, Newspaper, Bell,
  TrendingUp, TrendingDown, Activity, Zap, AlertTriangle,
  ChevronRight, MessageSquare, Tag, MapPin, Database,
  BarChart3, DollarSign, ShoppingCart, Wrench, Flame,
  ShieldAlert, Clock, ArrowUpRight, Sparkles,
  Cpu, Fuel, Settings
} from 'lucide-react';
import { getCustomerType } from '@/types';
import type { CustomerType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { recentActivity, deliveries, newsArticles } from '@/data/mock';
import { allPartsFlat, catalogStats } from '@/data/partsDatabase';

// ---- Analytics Data ----
const weeklyStats = [
  { day: 'Mon', searches: 12, orders: 3, savings: 420 },
  { day: 'Tue', searches: 18, orders: 5, savings: 680 },
  { day: 'Wed', searches: 8, orders: 2, savings: 210 },
  { day: 'Thu', searches: 24, orders: 7, savings: 950 },
  { day: 'Fri', searches: 15, orders: 4, savings: 540 },
  { day: 'Sat', searches: 6, orders: 1, savings: 120 },
  { day: 'Sun', searches: 4, orders: 0, savings: 0 },
];

const alerts = [
  { id: 1, type: 'urgent', icon: ShieldAlert, message: 'Arizona DOT Brake Inspection Blitz: May 14', time: '2h ago', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  { id: 2, type: 'warning', icon: AlertTriangle, message: 'Eaton Fuller Transmission Recall Q2 2025', time: '5h ago', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 3, type: 'info', icon: Zap, message: 'Cummins X15 Efficiency Package Now Available', time: '8h ago', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { id: 4, type: 'promo', icon: Tag, message: 'RWC Oil Promo: 15% Off Fleet Orders 50+ Gal', time: '1d ago', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
];

const categoryBreakdown = [
  { name: 'Engine', count: 89, percent: 28, color: 'bg-cyan-500', icon: Cpu },
  { name: 'Brake', count: 67, percent: 21, color: 'bg-red-500', icon: ShieldAlert },
  { name: 'Trans', count: 54, percent: 17, color: 'bg-amber-500', icon: Settings },
  { name: 'Electrical', count: 43, percent: 13, color: 'bg-purple-500', icon: Zap },
  { name: 'Fuel', count: 38, percent: 12, color: 'bg-emerald-500', icon: Fuel },
  { name: 'Other', count: 29, percent: 9, color: 'bg-gray-500', icon: Wrench },
];

// Get trending parts (highest savings)
const trendingParts = [...allPartsFlat]
  .sort((a, b) => (b.msrp - b.price) - (a.msrp - a.price))
  .slice(0, 5)
  .map((p, i) => ({
    ...p,
    trend: i < 2 ? 'up' : i < 4 ? 'stable' : 'down',
    saves: p.msrp - p.price,
  }));

const tickerItems = [
  'Arizona DOT Brake Inspection Blitz: May 14',
  'RWC Oil Promo: 15% Off Fleet Orders 50+ Gal',
  'Weather Alert: 108°F Phoenix - Hydration Protocol Active',
  'Eaton Fuller Transmission Recall Q2 2025',
  'Cummins X15 Efficiency Package Released',
  'Fleetguard LF14000NNNN Back in Stock',
  'Bendix Brake Chamber Recall: Check ADB22X Series',
  'Shell Rotella T6 Rebate Program Extended',
];

// ---- Components ----
function MiniBarChart() {
  const maxVal = Math.max(...weeklyStats.map(d => d.searches));
  return (
    <div className="flex items-end gap-1.5 h-10">
      {weeklyStats.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-cyan-500/30 rounded-t-sm transition-all hover:bg-cyan-400/50"
            style={{ height: `${(d.searches / maxVal) * 28}px` }}
          />
        </div>
      ))}
    </div>
  );
}

function SavingsRing({ percent, label, sub }: { percent: number; label: string; sub: string }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle cx="32" cy="32" r={radius} fill="none" stroke="#06b6d4" strokeWidth="6"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-cyan-400">{percent}%</span>
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{label}</div>
        <div className="text-xs text-gray-500">{sub}</div>
      </div>
    </div>
  );
}

// ---- Role-Based Command Center Pillars ----
const pillarsByType: Record<CustomerType, typeof pillars> = {
  manufacturer: [
    { path: '/vault', label: 'Vendor Vault', desc: 'Manage products', icon: Database, gradient: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30', iconColor: 'text-amber-400' },
    { path: '/promos', label: 'Promotions', desc: 'Campaigns & deals', icon: Tag, gradient: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30', iconColor: 'text-emerald-400' },
    { path: '/search', label: 'Part Search', desc: 'Find parts fast', icon: Search, gradient: 'from-cyan-500/20 to-blue-500/10', border: 'border-cyan-500/30', iconColor: 'text-cyan-400' },
    { path: '/chat', label: 'AI Chat', desc: 'Parts Hero AI', icon: MessageSquare, gradient: 'from-violet-500/20 to-purple-500/10', border: 'border-violet-500/30', iconColor: 'text-violet-400' },
    { path: '/news', label: 'Newsroom', desc: 'Industry intel', icon: Newspaper, gradient: 'from-sky-500/20 to-cyan-500/10', border: 'border-sky-500/30', iconColor: 'text-sky-400' },
    { path: '/academy', label: 'Academy', desc: 'Training hub', icon: GraduationCap, gradient: 'from-rose-500/20 to-pink-500/10', border: 'border-rose-500/30', iconColor: 'text-rose-400' },
  ],
  dealer: [
    { path: '/search', label: 'Part Search', desc: 'Find parts fast', icon: Search, gradient: 'from-cyan-500/20 to-blue-500/10', border: 'border-cyan-500/30', iconColor: 'text-cyan-400' },
    { path: '/garage', label: 'Fleet Garage', desc: 'Manage trucks', icon: Truck, gradient: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30', iconColor: 'text-emerald-400' },
    { path: '/vault', label: 'Vendor Vault', desc: '65+ vendors', icon: Database, gradient: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30', iconColor: 'text-amber-400' },
    { path: '/chat', label: 'AI Chat', desc: 'Parts Hero AI', icon: MessageSquare, gradient: 'from-violet-500/20 to-purple-500/10', border: 'border-violet-500/30', iconColor: 'text-violet-400' },
    { path: '/promos', label: 'Promos', desc: 'Active deals', icon: Tag, gradient: 'from-sky-500/20 to-cyan-500/10', border: 'border-sky-500/30', iconColor: 'text-sky-400' },
    { path: '/academy', label: 'Academy', desc: 'Training hub', icon: GraduationCap, gradient: 'from-rose-500/20 to-pink-500/10', border: 'border-rose-500/30', iconColor: 'text-rose-400' },
  ],
  installer: [
    { path: '/search', label: 'Part Search', desc: 'Find parts fast', icon: Search, gradient: 'from-cyan-500/20 to-blue-500/10', border: 'border-cyan-500/30', iconColor: 'text-cyan-400' },
    { path: '/garage', label: 'My Garage', desc: 'My trucks', icon: Truck, gradient: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30', iconColor: 'text-emerald-400' },
    { path: '/chat', label: 'AI Chat', desc: 'Parts Hero AI', icon: MessageSquare, gradient: 'from-violet-500/20 to-purple-500/10', border: 'border-violet-500/30', iconColor: 'text-violet-400' },
    { path: '/academy', label: 'Academy', desc: 'Training hub', icon: GraduationCap, gradient: 'from-rose-500/20 to-pink-500/10', border: 'border-rose-500/30', iconColor: 'text-rose-400' },
    { path: '/news', label: 'Newsroom', desc: 'Industry intel', icon: Newspaper, gradient: 'from-sky-500/20 to-cyan-500/10', border: 'border-sky-500/30', iconColor: 'text-sky-400' },
    { path: '/vault', label: 'Vendor Vault', desc: '65+ vendors', icon: Database, gradient: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30', iconColor: 'text-amber-400' },
  ],
};

export default function Dashboard() {
  const { user } = useAuth();
  const customerType = user ? getCustomerType(user.role) : 'installer';
const pillars = pillarsByType[customerType];
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const urgentNews = newsArticles.filter(n => n.urgent);
  const activeDeliveries = deliveries.filter(d => d.status === 'En Route');
  const totalSavings = trendingParts.reduce((acc, p) => acc + p.saves, 0);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto pb-8">

      {/* ===== HERO SECTION - WOW FACTOR ===== */}
      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 lg:p-8 overflow-hidden">
        {/* Animated Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400 uppercase tracking-widest">Command Center</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
  {greeting()}, {user?.name} {user?.shopName ? `from ${user.shopName}` : ''}
</h1>
            <p className="text-gray-400 text-sm lg:text-base max-w-lg">
              Your fleet overview, savings tracker, and parts intelligence — all in one place.
            </p>

            {/* Quick Action Pills */}
            <div className="flex flex-wrap gap-2 mt-5">
              <Link to="/search" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 hover:bg-cyan-500/20 transition-colors">
                <Search className="w-3 h-3" /> Search Parts
              </Link>
              <Link to="/chat" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 hover:bg-violet-500/20 transition-colors">
                <MessageSquare className="w-3 h-3" /> Ask AI
              </Link>
              <Link to="/garage" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                <Truck className="w-3 h-3" /> Fleet
              </Link>
              <Link to="/deliveries" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 hover:bg-amber-500/20 transition-colors">
                <MapPin className="w-3 h-3" /> Track Deliveries
              </Link>
            </div>
          </div>

          {/* CJ Avatar */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-xl scale-110" />
            <img src="/cj-waving.png" alt="CJ" className="relative w-24 h-24 lg:w-36 lg:h-36 object-contain drop-shadow-2xl" />
          </div>
        </div>

        {/* Live Ticker */}
        <div className="relative mt-6 -mx-6 lg:-mx-8 -mb-6 lg:-mb-8 px-6 lg:px-8 py-3 bg-cyan-500/5 border-t border-white/5">
          <div className="overflow-hidden">
            <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="text-sm text-cyan-400/80 font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
      </div>

      {/* ===== STATS ROW ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Parts', value: catalogStats.totalParts.toLocaleString(), sub: 'in catalog', icon: Package, trend: '+12%', up: true, chart: true },
          { label: 'Active Deliveries', value: activeDeliveries.length.toString(), sub: 'in transit', icon: Truck, trend: '+2', up: true, chart: false },
          { label: 'This Week Savings', value: `$${(totalSavings * 0.3).toLocaleString()}`, sub: 'vs MSRP', icon: DollarSign, trend: '+8.4%', up: true, chart: true },
          { label: 'Searches This Week', value: '87', sub: '47 unique', icon: BarChart3, trend: '-3%', up: false, chart: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
            {stat.chart && <div className="mt-2"><MiniBarChart /></div>}
            {!stat.chart && <div className="text-xs text-gray-500 mt-1">{stat.sub}</div>}
          </div>
        ))}
      </div>

      {/* ===== ANALYTICS & ALERTS ROW ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Weekly Activity
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Searches, orders & cost savings</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Searches</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Orders</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Savings</span>
            </div>
          </div>

          <div className="flex items-end gap-3 h-40">
            {weeklyStats.map((d, i) => {
              const maxSearch = Math.max(...weeklyStats.map(s => s.searches));
              const maxOrder = Math.max(...weeklyStats.map(s => s.orders));
              const maxSave = Math.max(...weeklyStats.map(s => s.savings));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full flex items-end gap-0.5 h-32 relative">
                    {/* Savings bar */}
                    <div className="flex-1 bg-amber-500/20 rounded-t-sm hover:bg-amber-500/40 transition-all"
                      style={{ height: `${(d.savings / maxSave) * 100}%` }} />
                    {/* Search bar */}
                    <div className="flex-1 bg-cyan-500/30 rounded-t-sm hover:bg-cyan-400/50 transition-all"
                      style={{ height: `${(d.searches / maxSearch) * 100}%` }} />
                    {/* Order bar */}
                    <div className="flex-1 bg-emerald-500/30 rounded-t-sm hover:bg-emerald-400/50 transition-all"
                      style={{ height: `${(d.orders / maxOrder) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cost Savings & Alerts */}
        <div className="space-y-4">
          {/* Savings Ring */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Cost Savings
            </h3>
            <div className="space-y-4">
              <SavingsRing percent={24} label="vs MSRP" sub="Average fleet savings" />
              <SavingsRing percent={67} label="Stock Availability" sub="Parts in stock now" />
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Total catalog value</span>
                <span className="text-white font-mono font-semibold">$2.4M</span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              Alerts <span className="text-xs text-gray-500 font-normal">({alerts.length})</span>
            </h3>
            <div className="space-y-2">
              {alerts.map(alert => (
                <div key={alert.id} className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${alert.color}`}>
                  <alert.icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium leading-snug">{alert.message}</p>
                    <span className="text-[10px] opacity-60">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== QUICK ACCESS PILLARS ===== */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          Quick Access
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {pillars.map(pillar => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.path}
                to={pillar.path}
                className={`group bg-gradient-to-br ${pillar.gradient} backdrop-blur-md border ${pillar.border} rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-200`}
              >
                <Icon className={`w-7 h-7 ${pillar.iconColor} mb-3 group-hover:scale-110 transition-transform`} />
                <div className="text-sm font-semibold text-white">{pillar.label}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{pillar.desc}</div>
                <ChevronRight className="w-4 h-4 text-gray-600 mt-3 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ===== TRENDING PARTS + CATEGORY BREAKDOWN ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Parts */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              Trending Parts
            </h3>
            <Link to="/search" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {trendingParts.map((part, i) => (
              <Link
                key={part.partNumber}
                to="/search"
                className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-xs font-bold text-cyan-400 font-mono">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate group-hover:text-cyan-400 transition-colors">
                    {part.name}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{part.brand}</span>
                    <span className="text-gray-700">|</span>
                    <span className="font-mono">{part.partNumber}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-emerald-400 font-mono">${part.price.toFixed(2)}</div>
                  <div className="text-[10px] text-gray-500 line-through">${part.msrp.toFixed(2)}</div>
                </div>
                <div className={`text-xs font-medium shrink-0 ${part.trend === 'up' ? 'text-emerald-400' : part.trend === 'stable' ? 'text-amber-400' : 'text-gray-500'}`}>
                  {part.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : part.trend === 'stable' ? <Activity className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Category Breakdown + Recent Activity */}
        <div className="space-y-6">
          {/* Category Distribution */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              Category Distribution
            </h3>
            <div className="space-y-3">
              {categoryBreakdown.map(cat => {
                const Icon = cat.icon;
                return (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white">{cat.name}</span>
                        <span className="text-xs text-gray-500 font-mono">{cat.count} parts</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${cat.color} rounded-full transition-all duration-1000`} style={{ width: `${cat.percent}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-mono w-8 text-right">{cat.percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.slice(0, 6).map((activity, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.action.includes('order') ? 'bg-emerald-400' :
                    activity.action.includes('search') ? 'bg-cyan-400' :
                    activity.action.includes('delivery') ? 'bg-amber-400' :
                    activity.action.includes('alert') ? 'bg-red-400' :
                    'bg-purple-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-300 truncate">{activity.action}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== DELIVERY STATUS ROW ===== */}
      {activeDeliveries.length > 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              Active Deliveries
            </h3>
            <Link to="/deliveries" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Track all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeDeliveries.map(d => (
              <div key={d.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{d.itemDescription}</div>
                  <div className="text-xs text-gray-500">{d.to}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-medium text-amber-400">{d.status}</div>
                  <div className="text-[10px] text-gray-500">ETA {d.eta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== NEWS STRIP ===== */}
      {urgentNews.length > 0 && (
        <div className="bg-gradient-to-r from-red-500/5 to-amber-500/5 backdrop-blur-md border border-red-500/10 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Urgent Industry News
          </h3>
          <div className="space-y-2">
            {urgentNews.slice(0, 2).map(news => (
              <Link key={news.id} to="/news" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white group-hover:text-cyan-400 transition-colors truncate">{news.headline}</div>
                  <div className="text-xs text-gray-500">{news.source} · {news.date}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ===== BOTTOM CTA ===== */}
      <div className="relative bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
              Need help finding parts?
            </h3>
            <p className="text-sm text-gray-400 mt-1">Our AI assistant can help you find the right parts for any truck in your fleet.</p>
          </div>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-all hover:shadow-lg hover:shadow-cyan-500/20 shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            Chat with Parts Hero AI
          </Link>
        </div>
      </div>
    </div>
  );

}