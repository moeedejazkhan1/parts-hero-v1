import { useState, useEffect, useRef } from 'react';
import {
  Search, MessageSquare, Truck, Phone, Printer, Mail, Share2,
  Sun, Moon, Bell, AlertTriangle, CheckCircle, Clock,
  Package, MapPin, Users, ChevronRight,
  Send, Bot, FileText, X, ClipboardList,
  Sparkles, PhoneCall, Radio, BarChart3, Activity,
  Database, Newspaper, Tag, GraduationCap, BrainCircuit,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { Link } from 'react-router';

// ─── Types ───
interface FulfillmentOrder {
  id: string;
  orderNum: string;
  status: 'pending' | 'picking' | 'staging' | 'transit' | 'delivered';
  customer: string;
  timeRemaining?: string;
  eta?: string;
}

interface RequestItem {
  id: string;
  type: 'urgent' | 'intrashop' | 'outside' | 'fleet';
  customer: string;
  title: string;
  time: string;
  assigned: string;
  status: 'open' | 'inprogress' | 'resolved';
}

interface ChatMessage {
  id: string;
  sender: 'customer' | 'inside' | 'outside' | 'system';
  name: string;
  avatar: string;
  text: string;
  time: string;
}

interface ActionItem {
  id: string;
  text: string;
  aiGenerated: boolean;
}

// ─── Mock Data ───
const fulfillmentOrders: FulfillmentOrder[] = [
  { id: '1', orderNum: '#442', status: 'transit', customer: "Bob's Repair", timeRemaining: '5m to delivery', eta: '12:45 PM' },
  { id: '2', orderNum: '#445', status: 'staging', customer: "Mike's Diesel", eta: 'Will-Call Ready' },
  { id: '3', orderNum: '#448', status: 'picking', customer: 'Desert Freight', eta: 'Picked by Courier' },
  { id: '4', orderNum: '#451', status: 'transit', customer: 'Valley Transport', timeRemaining: '12m to delivery', eta: '1:02 PM' },
  { id: '5', orderNum: '#439', status: 'delivered', customer: 'Southwest Diesel', eta: 'Delivered 11:30 AM' },
  { id: '6', orderNum: '#455', status: 'pending', customer: "Bob's Repair", eta: 'Order Received' },
];

const requestQueue: RequestItem[] = [
  { id: 'r1', type: 'urgent', customer: "Bob's Repair", title: 'Unit Down — DD15 oil pump failure', time: '2 min ago', assigned: 'Jordan', status: 'open' },
  { id: 'r2', type: 'intrashop', customer: 'RWC Bay 3', title: 'Brake drum quote for Cascadia', time: '5 min ago', assigned: 'Jordan', status: 'inprogress' },
  { id: 'r3', type: 'outside', customer: 'Larry (Field)', title: 'Fleet order: 4 radiators, confirm VIN', time: '12 min ago', assigned: 'Jordan', status: 'open' },
  { id: 'r4', type: 'fleet', customer: "Bob's Repair", title: 'Will-Call pickup — 2 parts staged', time: '18 min ago', assigned: 'Jordan', status: 'inprogress' },
  { id: 'r5', type: 'outside', customer: 'Sarah (Field)', title: 'Quote request: Eaton transmission rebuild kit', time: '25 min ago', assigned: 'Jordan', status: 'open' },
  { id: 'r6', type: 'intrashop', customer: 'RWC Bay 7', title: 'DEF pump replacement — verify part #', time: '32 min ago', assigned: 'Connor', status: 'open' },
];

const chatMessages: ChatMessage[] = [
  { id: 'c1', sender: 'customer', name: 'Bob (Customer)', avatar: '/avatar-bob.png', text: 'I will order the parts.', time: '11:42 AM' },
  { id: 'c2', sender: 'outside', name: 'Outside Larry', avatar: '/avatar-larry.png', text: 'Okay, confirm with inside and I will drop them at shop.', time: '11:43 AM' },
  { id: 'c3', sender: 'inside', name: 'Me (Inside/Jordan)', avatar: '/avatar-jordan.png', text: 'Parts picked, ready for staging. Confirming Will-Call or Larry-Drop?', time: '11:45 AM' },
  { id: 'c4', sender: 'system', name: 'System (Tech/Tech1)', avatar: '/rwc-logo.png', text: 'Inventory pull confirmed for VIN: 1234. Parts are on staging rack.', time: '11:46 AM' },
];

const actionItems: ActionItem[] = [
  { id: 'a1', text: 'Order #442: Submit Will-Call request to RWC shop [AI Generated]', aiGenerated: true },
  { id: 'a2', text: 'Mike\'s Diesel: Verify VIN for 4 drums quote [AI Generated]', aiGenerated: true },
];

// ─── Status Helpers ───
const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  pending:    { label: 'PENDING',    color: 'text-amber-600',    bg: 'bg-amber-50',    border: 'border-amber-200',    icon: Clock },
  picking:    { label: 'PICKING',    color: 'text-blue-600',     bg: 'bg-blue-50',     border: 'border-blue-200',     icon: Package },
  staging:    { label: 'STAGING',    color: 'text-purple-600', bg: 'bg-purple-50',   border: 'border-purple-200',   icon: ClipboardList },
  transit:    { label: 'IN-TRANSIT', color: 'text-cyan-600',   bg: 'bg-cyan-50',     border: 'border-cyan-200',     icon: Truck },
  delivered:  { label: 'DELIVERED',  color: 'text-emerald-600',bg: 'bg-emerald-50',  border: 'border-emerald-200',  icon: CheckCircle },
};

const requestTypeConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  urgent:     { label: 'URGENT',      color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
  intrashop:  { label: 'INTRA-SHOP',  color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  outside:    { label: 'OUTSIDE',     color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  fleet:      { label: 'FLEET',       color: 'text-emerald-600',bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

// ─── Animated Ticker ───
function FulfillmentTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.5;
    const animate = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const items = [...fulfillmentOrders, ...fulfillmentOrders];

  return (
    <div className="w-full overflow-hidden bg-white/80 backdrop-blur-sm border-b border-gray-200/60 py-2">
      <div className="flex items-center gap-2 px-4">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex-shrink-0">Fulfillment Ticker</span>
        <div ref={scrollRef} className="flex gap-6 overflow-hidden whitespace-nowrap">
          {items.map((order, i) => {
            const cfg = statusConfig[order.status];
            const Icon = cfg.icon;
            return (
              <div key={`${order.id}-${i}`} className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                  <Icon className="w-3 h-3 inline mr-1" />
                  {cfg.label}
                </span>
                <span className="text-xs text-gray-600 font-mono">{order.orderNum}</span>
                <span className="text-[10px] text-gray-500">{order.customer}</span>
                {order.timeRemaining && (
                  <span className="text-[10px] text-cyan-600 font-medium">{order.timeRemaining}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───
export default function CommandCenter() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'personal' | 'location'>('personal');
  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'shop' | 'outside' | 'fleet'>('all');
  const [chatInput, setChatInput] = useState('');
  const [showHandoffModal, setShowHandoffModal] = useState(false);
  const [showBossReport, setShowBossReport] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const isLight = theme === 'light';
  const bgMain = isLight ? 'bg-[#F8F9FA]' : 'bg-[#0A0F1C]';
  const bgCard = isLight ? 'bg-white' : 'bg-white/5 backdrop-blur-md';
  const textMain = isLight ? 'text-[#1A1D29]' : 'text-white';
  const textSec = isLight ? 'text-gray-500' : 'text-gray-400';
  const borderColor = isLight ? 'border-gray-200/60' : 'border-white/10';
  const borderStrong = isLight ? 'border-gray-200' : 'border-white/10';

  // Stats
  const totalRequests = 37;
  const filledToday = 15;
  const urgentCount = requestQueue.filter(r => r.type === 'urgent' && r.status === 'open').length;
  const unfilledCount = requestQueue.filter(r => r.status === 'open').length;

  const handleAISummary = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      showToast('AI Summary generated: 3 action items, 2 urgent, 1 pending handoff', 'success');
    }, 1200);
  };

  const handlePrintBossReport = () => {
    setShowBossReport(true);
    showToast('Generating Boss Report PDF...', 'info');
  };

  const handleHandoff = () => {
    setShowHandoffModal(true);
  };

  const handleTransfer = () => {
    setShowHandoffModal(false);
    showToast('Request transferred to Connor. Handoff brief sent.', 'success');
  };

  const filteredRequests = activeTab === 'all'
    ? requestQueue
    : requestQueue.filter(r => {
        if (activeTab === 'urgent') return r.type === 'urgent';
        if (activeTab === 'shop') return r.type === 'intrashop';
        if (activeTab === 'outside') return r.type === 'outside';
        if (activeTab === 'fleet') return r.type === 'fleet';
        return true;
      });

  // ─── RENDER ───
  return (
    <div className={`min-h-screen ${bgMain} transition-colors duration-300`}>
      {/* ═══ FULFILLMENT TICKER ═══ */}
      <FulfillmentTicker />

      {/* ═══ GLOBAL NEWSFEED BANNER ═══ */}
      <div className={`${isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'} border-b px-4 py-2 flex items-center gap-2`}>
        <AlertTriangle className={`w-4 h-4 ${isLight ? 'text-amber-600' : 'text-amber-400'} flex-shrink-0`} />
        <span className={`text-xs font-medium ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
          ARIZONA CVSA BRAKE INSPECTION WEEK starts Monday. Prep heavy-duty friction inventory.
        </span>
        <span className="ml-auto text-[10px] text-gray-400">Updated 10:32 AM</span>
      </div>

      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-5">
        {/* ═══ TOP BAR ═══ */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {/* RWC Logo */}
            <div className="flex items-center gap-2">
              <img src="/rwc-logo.png" alt="RWC" className="w-10 h-10 object-contain" />
              <div>
                <div className={`text-sm font-bold ${textMain}`}>RWC Group</div>
                <div className="text-[10px] text-gray-500">Phoenix, AZ</div>
              </div>
            </div>

            <div className={`h-8 w-px ${isLight ? 'bg-gray-200' : 'bg-white/10'} mx-2`} />

            {/* Personal / Location Toggle */}
            <div className={`flex items-center gap-1 p-1 rounded-xl ${isLight ? 'bg-gray-100' : 'bg-white/5'} border ${borderColor}`}>
              <button
                onClick={() => setViewMode('personal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'personal'
                    ? `${isLight ? 'bg-white shadow-sm text-[#1A1D29]' : 'bg-cyan-500/20 text-cyan-400'} border ${viewMode === 'personal' ? (isLight ? 'border-gray-200' : 'border-cyan-500/30') : 'border-transparent'}`
                    : `${textSec} hover:text-gray-600`
                }`}
              >
                <Eye className="w-3 h-3 inline mr-1" />
                Personal View
              </button>
              <button
                onClick={() => setViewMode('location')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'location'
                    ? `${isLight ? 'bg-white shadow-sm text-[#1A1D29]' : 'bg-cyan-500/20 text-cyan-400'} border ${viewMode === 'location' ? (isLight ? 'border-gray-200' : 'border-cyan-500/30') : 'border-transparent'}`
                    : `${textSec} hover:text-gray-600`
                }`}
              >
                <MapPin className="w-3 h-3 inline mr-1" />
                Location View
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAISummary}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isLight
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/20'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:brightness-110'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              {aiLoading ? 'Generating...' : 'AI Daily Summary'}
            </button>
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isLight ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button className={`w-9 h-9 rounded-xl flex items-center justify-center relative ${isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-gray-400'}`}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </div>

        {/* ═══ MAIN GRID ═══ */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* ─── LEFT COLUMN (Stats + Requests) ─── */}
          <div className="xl:col-span-8 space-y-5">
            {/* GREETING CARD */}
            <div className={`${bgCard} border ${borderStrong} rounded-2xl p-6 ${isLight ? 'shadow-sm' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-blue-600' : 'text-cyan-400'}`}>
                      ⚡ Command Center
                    </span>
                    {viewMode === 'location' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-200">
                        Global View Enabled
                      </span>
                    )}
                  </div>
                  <h1 className={`text-3xl lg:text-4xl font-bold ${textMain} mb-2`}>
                    Good afternoon,<br />{user?.name || 'Jordan'}
                  </h1>
                  <p className={`text-sm ${textSec} max-w-lg`}>
                    Your fleet overview, savings tracker, and parts intelligence — all in one place. {viewMode === 'location' && 'Viewing all RWC Phoenix branch activity.'}
                  </p>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link to="/search" className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}`}>
                      <Search className="w-3.5 h-3.5" /> Search Parts
                    </Link>
                    <Link to="/chat" className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}`}>
                      <Bot className="w-3.5 h-3.5" /> Ask AI
                    </Link>
                    <Link to="/garage" className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}`}>
                      <Truck className="w-3.5 h-3.5" /> Virtual Garage
                    </Link>
                  </div>
                </div>

                {/* Jordan Profile Card */}
                <div className={`hidden lg:flex flex-col items-center text-center p-4 rounded-2xl ${isLight ? 'bg-gray-50 border border-gray-100' : 'bg-white/5 border border-white/10'} min-w-[140px]`}>
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-2 ring-2 ring-offset-2 ring-cyan-400/30">
                    <img src="/avatar-jordan.png" alt="Jordan" className="w-full h-full object-cover" />
                  </div>
                  <div className={`text-sm font-bold ${textMain}`}>{user?.name || 'Jordan'}</div>
                  <div className="text-[10px] text-gray-500">Inside Sales, Phoenix Branch</div>
                  <div className="text-[10px] text-gray-500">RWC Group — AZ Local Market</div>
                  <button className="mt-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-medium border border-blue-200 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3" /> Click-to-Call
                  </button>
                </div>
              </div>
            </div>

            {/* STATS ROW */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className={`${bgCard} border ${borderStrong} rounded-2xl p-4 ${isLight ? 'shadow-sm' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-500 uppercase font-medium">Active Requests</span>
                  <Activity className="w-4 h-4 text-blue-500" />
                </div>
                <div className={`text-3xl font-bold ${textMain} font-mono`}>{totalRequests}</div>
                <div className="text-[10px] text-gray-500">Total Today</div>
              </div>

              <div className={`${bgCard} border ${borderStrong} rounded-2xl p-4 ${isLight ? 'shadow-sm' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-500 uppercase font-medium">Unfilled (Triage)</span>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-3xl font-bold text-red-500 font-mono">{unfilledCount}</div>
                <div className="text-[10px] text-gray-500">Needs Action</div>
              </div>

              <div className={`${bgCard} border ${borderStrong} rounded-2xl p-4 ${isLight ? 'shadow-sm' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-500 uppercase font-medium">Total Local Parts</span>
                  <Database className="w-4 h-4 text-cyan-500" />
                </div>
                <div className={`text-3xl font-bold ${textMain} font-mono`}>2.9M</div>
                <div className="text-[10px] text-gray-500">RWC Phoenix</div>
              </div>

              <div className={`${bgCard} border ${borderStrong} rounded-2xl p-4 ${isLight ? 'shadow-sm' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-500 uppercase font-medium">Searches Today</span>
                  <Search className="w-4 h-4 text-violet-500" />
                </div>
                <div className={`text-3xl font-bold ${textMain} font-mono`}>20</div>
                <div className="text-[10px] text-gray-500">Part Lookups</div>
              </div>
            </div>

            {/* AI ACTION ITEMS */}
            <div className={`${bgCard} border ${borderStrong} rounded-2xl p-5 ${isLight ? 'shadow-sm' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${textMain} flex items-center gap-2`}>
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  Jordan's Action Items
                </h3>
                <button
                  onClick={handleAISummary}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all ${
                    isLight ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'
                  }`}
                >
                  <BrainCircuit className="w-3 h-3" />
                  {aiLoading ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              <div className="space-y-2">
                {actionItems.map(item => (
                  <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl ${isLight ? 'bg-gray-50 border border-gray-100' : 'bg-white/5 border border-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? 'bg-blue-50' : 'bg-cyan-500/10'}`}>
                        <ClipboardList className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                      </div>
                      <span className={`text-xs ${textMain}`}>{item.text}</span>
                    </div>
                    <button className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${isLight ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'}`}>
                      AI Generate
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* REQUEST QUEUE */}
            <div className={`${bgCard} border ${borderStrong} rounded-2xl p-5 ${isLight ? 'shadow-sm' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${textMain} flex items-center gap-2`}>
                  <Radio className="w-4 h-4 text-red-500" />
                  Mega-Request Queue
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-gray-400'}`}>
                    {filteredRequests.length} active
                  </span>
                </h3>
                <div className="flex items-center gap-1">
                  {(['all', 'urgent', 'shop', 'outside', 'fleet'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all capitalize ${
                        activeTab === tab
                          ? isLight ? 'bg-gray-800 text-white' : 'bg-white/15 text-white'
                          : isLight ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {tab === 'shop' ? 'Intra-Shop' : tab === 'outside' ? 'Outside' : tab === 'fleet' ? 'Fleet' : tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {filteredRequests.map(req => {
                  const cfg = requestTypeConfig[req.type];
                  return (
                    <div
                      key={req.id}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                        req.type === 'urgent' && req.status === 'open'
                          ? isLight ? 'bg-red-50 border border-red-200' : 'bg-red-500/10 border border-red-500/20'
                          : isLight ? 'bg-gray-50 border border-gray-100 hover:bg-gray-100' : 'bg-white/5 border border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border} flex-shrink-0`}>
                          {cfg.label}
                        </span>
                        <div className="min-w-0">
                          <div className={`text-xs font-medium ${textMain} truncate`}>{req.title}</div>
                          <div className="text-[10px] text-gray-500 flex items-center gap-1">
                            {req.customer} • {req.time} • Assigned: <span className={req.assigned === 'Jordan' ? (isLight ? 'text-blue-600' : 'text-cyan-400') : ''}>{req.assigned}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={handleHandoff}
                          className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${isLight ? 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`}
                        >
                          Handoff
                        </button>
                        <button className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isLight ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'}`}>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WILL-CALL WATCHLIST */}
            <div className={`${bgCard} border ${borderStrong} rounded-2xl p-5 ${isLight ? 'shadow-sm' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${textMain} flex items-center gap-2`}>
                  <Clock className="w-4 h-4 text-amber-500" />
                  Will-Call Watchlist
                </h3>
                <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-medium border border-amber-200">
                  2 parts staged {'>'} 4 hrs
                </span>
              </div>
              <div className="space-y-2">
                <div className={`flex items-center justify-between p-3 rounded-xl ${isLight ? 'bg-amber-50/50 border border-amber-100' : 'bg-amber-500/5 border border-amber-500/10'}`}>
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className={`text-xs font-medium ${textMain}`}>Order #445 — Mike's Diesel</div>
                      <div className="text-[10px] text-gray-500">Staged since 09:15 • 2 parts waiting</div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-medium border border-amber-200 hover:bg-amber-100 transition-all">
                    Follow Up
                  </button>
                </div>
              </div>
            </div>

            {/* BOSS REPORT BAR */}
            <div className={`${bgCard} border ${borderStrong} rounded-2xl p-4 ${isLight ? 'shadow-sm' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}>
                    <BarChart3 className={`w-5 h-5 ${isLight ? 'text-gray-700' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${textMain}`}>Boss Report Ready</div>
                    <div className="text-[10px] text-gray-500">{totalRequests} requests, {filledToday} filled, {urgentCount} urgent pending</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintBossReport}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}`}
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                  <button
                    onClick={() => showToast('Boss Report emailed to Parts Manager & GM', 'success')}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}`}
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </button>
                  <button
                    onClick={() => showToast('Stats shared with customer for handoff', 'success')}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${isLight ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200' : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20'}`}
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN (Chat + Profile) ─── */}
          <div className="xl:col-span-4 space-y-5">
            {/* CHAT PANEL */}
            <div className={`${bgCard} border ${borderStrong} rounded-2xl overflow-hidden ${isLight ? 'shadow-sm' : ''} flex flex-col max-h-[700px]`}>
              <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
                <div>
                  <h3 className={`text-sm font-bold ${textMain} flex items-center gap-2`}>
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    Chat Messaging
                  </h3>
                  <p className="text-[10px] text-gray-500">Three-Way Active Chat</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className={`p-1.5 rounded-lg ${isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'} transition-all`}>
                    <Phone className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className={`p-1.5 rounded-lg ${isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'} transition-all`}>
                    <Users className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Chat Thread Info */}
              <div className={`p-3 border-b ${borderColor} ${isLight ? 'bg-gray-50' : 'bg-white/5'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-xs font-bold ${textMain}`}>Bob's Repair Shop</div>
                    <div className="text-[10px] text-gray-500">Participants: 3 • Roles: Jordan (Lead), Larry (Outside), Bay Tech (Inventory)</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleHandoff}
                      className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-medium border border-blue-200 hover:bg-blue-100 transition-all"
                    >
                      Leave: Transfer
                    </button>
                    <button className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-medium border border-gray-200 hover:bg-gray-200 transition-all">
                      Print
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map(msg => {
                  const isMe = msg.sender === 'inside';
                  const isSystem = msg.sender === 'system';
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <img src={msg.avatar} alt={msg.name} className={`w-8 h-8 rounded-full object-cover flex-shrink-0 ${isSystem ? 'opacity-60' : ''}`} />
                      <div className={`max-w-[80%] ${isMe ? 'text-right' : ''}`}>
                        <div className={`text-[10px] text-gray-500 mb-0.5 ${isMe ? 'text-right' : ''}`}>
                          {msg.name} • {msg.time}
                        </div>
                        <div className={`inline-block px-3 py-2 rounded-xl text-xs ${
                          isSystem
                            ? isLight ? 'bg-gray-100 text-gray-600 border border-gray-200' : 'bg-white/5 text-gray-400 border border-white/10'
                            : isMe
                            ? isLight ? 'bg-blue-600 text-white' : 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/20'
                            : isLight ? 'bg-white text-gray-700 border border-gray-200 shadow-sm' : 'bg-white/10 text-gray-200 border border-white/10'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Summarize Button */}
              <div className={`p-3 border-t ${borderColor}`}>
                <button
                  onClick={handleAISummary}
                  className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all mb-2 ${
                    isLight
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:brightness-110'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI SUMMARIZE NOTES
                </button>
                <div className="flex items-center gap-2">
                  <button className={`px-3 py-2 rounded-xl text-[10px] font-medium transition-all ${isLight ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    <FileText className="w-3.5 h-3.5 inline mr-1" /> Print
                  </button>
                  <button className={`px-3 py-2 rounded-xl text-[10px] font-medium transition-all ${isLight ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    <Mail className="w-3.5 h-3.5 inline mr-1" /> Email Link
                  </button>
                </div>
              </div>

              {/* Chat Input */}
              <div className={`p-3 border-t ${borderColor} flex items-center gap-2`}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none transition-all ${
                    isLight
                      ? 'bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20'
                      : 'bg-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/20'
                  }`}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && chatInput.trim()) {
                      showToast('Message sent to Bob\'s Repair Shop', 'success');
                      setChatInput('');
                    }
                  }}
                />
                <button className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  isLight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-cyan-500 text-white hover:bg-cyan-400'
                }`}>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CUSTOMER GARAGE MINI */}
            <div className={`${bgCard} border ${borderStrong} rounded-2xl p-5 ${isLight ? 'shadow-sm' : ''}`}>
              <h3 className={`text-sm font-bold ${textMain} mb-3 flex items-center gap-2`}>
                <Truck className="w-4 h-4 text-emerald-500" />
                Customer Garage
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Bob's Repair", status: 'Parts on the way', count: 3, color: 'bg-blue-50 text-blue-600 border-blue-200' },
                  { name: "Mike's Diesel", status: 'Pending Will-Call', count: 2, color: 'bg-amber-50 text-amber-600 border-amber-200' },
                  { name: 'Desert Freight', status: 'Quote sent', count: 1, color: 'bg-purple-50 text-purple-600 border-purple-200' },
                ].map(garage => (
                  <div key={garage.name} className={`flex items-center justify-between p-3 rounded-xl ${isLight ? 'bg-gray-50 border border-gray-100' : 'bg-white/5 border border-white/5'}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold text-[10px]">
                        {garage.name.charAt(0)}
                      </div>
                      <div>
                        <div className={`text-xs font-medium ${textMain}`}>{garage.name}</div>
                        <div className="text-[10px] text-gray-500">{garage.status}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${garage.color}`}>
                      {garage.count} parts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className={`${bgCard} border ${borderStrong} rounded-2xl p-5 ${isLight ? 'shadow-sm' : ''}`}>
              <h3 className={`text-sm font-bold ${textMain} mb-3`}>Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Vendor Vault', icon: Database, path: '/vault' },
                  { label: 'Academy', icon: GraduationCap, path: '/academy' },
                  { label: 'Newsroom', icon: Newspaper, path: '/news' },
                  { label: 'Promos', icon: Tag, path: '/promos' },
                ].map(link => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                      isLight ? 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ HANDOFF MODAL ═══ */}
      {showHandoffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowHandoffModal(false)}>
          <div className={`bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl`} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">AI Handoff Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                <div className="text-xs font-medium text-gray-900 dark:text-white mb-1">Status</div>
                <div className="text-xs text-gray-500">2 parts staged, awaiting customer pickup or Larry-Drop confirmation</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                <div className="text-xs font-medium text-gray-900 dark:text-white mb-1">Part #</div>
                <div className="text-xs text-gray-500">FLT-LF14000NN (oil filter), BEN-K065234 (brake kit)</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                <div className="text-xs font-medium text-gray-900 dark:text-white mb-1">Next Step</div>
                <div className="text-xs text-gray-500">Confirm Will-Call pickup time or schedule Larry field drop by 2 PM</div>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Transfer to:</label>
              <select className="w-full p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white outline-none">
                <option>Connor — Inside Sales</option>
                <option>Sarah — Outside Sales</option>
                <option>Tech Bay — Inventory</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={handleTransfer} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:shadow-lg transition-all">
                Transfer & Send Brief
              </button>
              <button onClick={() => setShowHandoffModal(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BOSS REPORT MODAL ═══ */}
      {showBossReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowBossReport(false)}>
          <div className={`bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Boss Report — RWC Phoenix</h3>
              <button onClick={() => setShowBossReport(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4 mb-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{totalRequests}</div>
                  <div className="text-[10px] text-gray-500">Total Requests</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-center">
                  <div className="text-2xl font-bold text-emerald-600 font-mono">{filledToday}</div>
                  <div className="text-[10px] text-gray-500">Filled Today</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-center">
                  <div className="text-2xl font-bold text-red-500 font-mono">{urgentCount}</div>
                  <div className="text-[10px] text-gray-500">Urgent Pending</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                <div className="text-xs font-medium text-gray-900 dark:text-white mb-2">Throughput Breakdown</div>
                <div className="space-y-1 text-[10px] text-gray-500">
                  <div className="flex justify-between"><span>Intra-Shop requests</span><span className="text-gray-900 dark:text-white">12</span></div>
                  <div className="flex justify-between"><span>Outside Sales leads</span><span className="text-gray-900 dark:text-white">8</span></div>
                  <div className="flex justify-between"><span>Fleet/Installer direct</span><span className="text-gray-900 dark:text-white">17</span></div>
                  <div className="flex justify-between border-t border-gray-100 dark:border-white/10 pt-1 mt-1"><span className="font-medium">Average response time</span><span className="text-emerald-500 font-medium">4.2 min</span></div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowBossReport(false); showToast('PDF report downloaded', 'success'); }} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" /> Download PDF
              </button>
              <button onClick={() => { setShowBossReport(false); showToast('Report emailed to Parts Manager & GM', 'success'); }} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
