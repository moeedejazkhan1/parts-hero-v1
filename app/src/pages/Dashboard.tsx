import { useState, useEffect, useRef } from 'react';
import {
  Search, MessageSquare, Truck, Phone, Printer, Mail, Share2,
  Sun, Moon, Bell, AlertTriangle, CheckCircle, Clock,
  Package, MapPin, Users, ChevronRight,
  Send, Bot, FileText, X, ClipboardList,
  Sparkles, PhoneCall, Radio, BarChart3, Activity,
  Database, Newspaper, Tag, GraduationCap, BrainCircuit,
  Eye, RefreshCw, FileSearch, History, Link2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { Link } from 'react-router';

// ─── Types ───
interface FulfillmentOrder {
  id: string; orderNum: string;
  status: 'pending' | 'picking' | 'staging' | 'transit' | 'delivered';
  customer: string; timeRemaining?: string; eta?: string;
}
interface RequestItem {
  id: string; type: 'urgent' | 'intrashop' | 'outside' | 'fleet';
  customer: string; title: string; partNum?: string;
  time: string; assigned: string; status: 'open' | 'inprogress' | 'resolved';
}
interface ChatMessage {
  id: string; sender: 'customer' | 'inside' | 'outside' | 'system';
  name: string; avatar: string; text: string; time: string;
}
interface ActionItem { id: string; text: string; aiGenerated: boolean; }

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
  { id: 'r1', type: 'urgent', customer: "Bob's Repair", title: 'Unit Down — DD15 oil pump failure', partNum: 'FLT-LF14000NN', time: '2 min ago', assigned: 'Jordan', status: 'open' },
  { id: 'r2', type: 'intrashop', customer: 'RWC Bay 3', title: 'Brake drum quote for Cascadia', partNum: 'BEN-K065234', time: '5 min ago', assigned: 'Jordan', status: 'inprogress' },
  { id: 'r3', type: 'outside', customer: 'Larry (Field)', title: 'Fleet order: 4 radiators, confirm VIN', partNum: 'RAD-CAS-2024', time: '12 min ago', assigned: 'Jordan', status: 'open' },
  { id: 'r4', type: 'fleet', customer: "Bob's Repair", title: 'Will-Call pickup — 2 parts staged', partNum: 'WCH-455-001', time: '18 min ago', assigned: 'Jordan', status: 'inprogress' },
  { id: 'r5', type: 'outside', customer: 'Sarah (Field)', title: 'Quote request: Eaton transmission rebuild kit', partNum: 'EAT-RTX-15710', time: '25 min ago', assigned: 'Jordan', status: 'open' },
  { id: 'r6', type: 'intrashop', customer: 'RWC Bay 7', title: 'DEF pump replacement — verify part #', partNum: 'DEF-PMP-001', time: '32 min ago', assigned: 'Connor', status: 'open' },
];

const chatMessages: ChatMessage[] = [
  { id: 'c1', sender: 'customer', name: 'Bob (Customer)', avatar: '/avatar-bob.png', text: 'I will order the parts.', time: '11:42 AM' },
  { id: 'c2', sender: 'outside', name: 'Outside Larry', avatar: '/avatar-larry.png', text: 'Okay, confirm with inside and I will drop them at shop.', time: '11:43 AM' },
  { id: 'c3', sender: 'inside', name: 'Me (Inside/Jordan)', avatar: '/avatar-jordan.png', text: 'Parts picked, ready for staging. Confirming Will-Call or Larry-Drop?', time: '11:45 AM' },
  { id: 'c4', sender: 'system', name: 'System (Tech/Tech1)', avatar: '/rwc-logo.png', text: 'Inventory pull confirmed for VIN: 1234. Parts are on staging rack.', time: '11:46 AM' },
];

const actionItems: ActionItem[] = [
  { id: 'a1', text: 'Order #442: Submit Will-Call request to RWC shop', aiGenerated: true },
  { id: 'a2', text: 'Mike\'s Diesel: Verify VIN for 4 drums quote', aiGenerated: true },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  pending:    { label: 'PENDING',    color: 'text-amber-700',    bg: 'bg-amber-100',    border: 'border-amber-200',    icon: Clock },
  picking:    { label: 'PICKING',    color: 'text-blue-700',     bg: 'bg-blue-100',     border: 'border-blue-200',     icon: Package },
  staging:    { label: 'STAGING',    color: 'text-purple-700',   bg: 'bg-purple-100',   border: 'border-purple-200',   icon: ClipboardList },
  transit:    { label: 'IN-TRANSIT', color: 'text-cyan-700',     bg: 'bg-cyan-100',     border: 'border-cyan-200',     icon: Truck },
  delivered:  { label: 'DELIVERED',  color: 'text-emerald-700',  bg: 'bg-emerald-100',  border: 'border-emerald-200',  icon: CheckCircle },
};

const requestTypeConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  urgent:     { label: 'URGENT',      color: 'text-red-700',      bg: 'bg-red-100',      border: 'border-red-200' },
  intrashop:  { label: 'INTRA-SHOP',  color: 'text-blue-700',     bg: 'bg-blue-100',     border: 'border-blue-200' },
  outside:    { label: 'OUTSIDE',     color: 'text-amber-700',    bg: 'bg-amber-100',    border: 'border-amber-200' },
  fleet:      { label: 'FLEET',       color: 'text-emerald-700',  bg: 'bg-emerald-100',  border: 'border-emerald-200' },
};

// ─── Ticker ───
function FulfillmentTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let pos = 0;
    const animate = () => { pos += 0.5; if (pos >= el.scrollWidth / 2) pos = 0; el.scrollLeft = pos; requestAnimationFrame(animate); };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="w-full overflow-hidden bg-white/80 backdrop-blur-sm border-b border-[#E5E7EB] py-2">
      <div className="flex items-center gap-2 px-4">
        <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider flex-shrink-0">Iron in Motion</span>
        <div ref={scrollRef} className="flex gap-6 overflow-hidden whitespace-nowrap">
          {[...fulfillmentOrders, ...fulfillmentOrders].map((order, i) => {
            const cfg = statusConfig[order.status]; const Icon = cfg.icon;
            return (
              <div key={`${order.id}-${i}`} className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                  <Icon className="w-3 h-3 inline mr-1" />{cfg.label}
                </span>
                <span className="text-xs text-[#111827] font-mono">{order.orderNum}</span>
                <span className="text-[10px] text-[#4B5563]">{order.customer}</span>
                {order.timeRemaining && <span className="text-[10px] text-blue-600 font-medium">{order.timeRemaining}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CommandCenter() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'personal' | 'location'>('personal');
  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'shop' | 'outside' | 'fleet'>('all');
  const [historyTab, setHistoryTab] = useState<'current' | 'past' | 'vault'>('current');
  const [chatInput, setChatInput] = useState('');
  const [showHandoff, setShowHandoff] = useState(false);
  const [showBossReport, setShowBossReport] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const isLight = theme === 'light';

  // Auto-refresh simulation for Location View
  useEffect(() => {
    if (viewMode !== 'location') return;
    const interval = setInterval(() => setLastRefresh(new Date()), 15000);
    return () => clearInterval(interval);
  }, [viewMode]);

  const handleAISummary = () => {
    setAiLoading(true);
    setTimeout(() => { setAiLoading(false); showToast('AI Summary: 3 action items, 2 urgent, 1 handoff pending', 'success'); }, 1200);
  };

  const handleCall = (name: string) => {
    showToast(`VOIP dialing: ${name}...`, 'info');
  };

  const totalRequests = 37;
  const filledToday = 15;
  const urgentCount = requestQueue.filter(r => r.type === 'urgent' && r.status === 'open').length;
  const unfilledCount = requestQueue.filter(r => r.status === 'open').length;

  const filteredRequests = activeTab === 'all' ? requestQueue :
    requestQueue.filter(r => {
      if (activeTab === 'urgent') return r.type === 'urgent';
      if (activeTab === 'shop') return r.type === 'intrashop';
      if (activeTab === 'outside') return r.type === 'outside';
      if (activeTab === 'fleet') return r.type === 'fleet';
      return true;
    });

  // ─── LIGHT MODE STYLES ───
  const pageBg = isLight ? 'bg-[#F9FAFB]' : 'bg-[#0A0F1C]';
  const cardBg = isLight ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]' : 'bg-white/5 backdrop-blur-md';
  const headingColor = isLight ? 'text-[#111827]' : 'text-white';
  const bodyColor = isLight ? 'text-[#4B5563]' : 'text-gray-400';
  const borderColor = isLight ? 'border-[#E5E7EB]' : 'border-white/10';
  const inputBg = isLight ? 'bg-[#F3F4F6] text-[#111827] placeholder-[#9CA3AF] focus:ring-2 focus:ring-blue-500/20' : 'bg-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/20';
  const btnSecondary = isLight ? 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB] border border-[#E5E7EB]' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10';
  return (
    <div className={`min-h-screen ${pageBg} transition-colors duration-300 font-sans`}>

      {/* ═══ CJ PARSNEAU INVENTOR BAR ═══ */}
      <div className={`w-full border-b ${isLight ? 'border-[#E5E7EB] bg-white' : 'border-white/10 bg-white/5'} px-4 py-1.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <img src="/cj-avatar.png" alt="CJ Parsneau" className="w-5 h-5 rounded-full object-cover" />
          <span className={`text-[10px] font-medium ${isLight ? 'text-[#4B5563]' : 'text-gray-400'}`}>
            Built by <span className={`font-bold ${isLight ? 'text-[#111827]' : 'text-cyan-400'}`}>CJ Parsneau</span> — OrKa AI Labs
          </span>
        </div>
        <div className="flex items-center gap-3">
          {viewMode === 'location' && (
            <span className={`text-[10px] flex items-center gap-1 ${isLight ? 'text-[#4B5563]' : 'text-gray-500'}`}>
              <RefreshCw className="w-3 h-3 animate-spin" /> Refreshed {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <span className={`text-[10px] ${isLight ? 'text-[#9CA3AF]' : 'text-gray-600'}`}>v1.0.4-alpha</span>
        </div>
      </div>

      <FulfillmentTicker />

      {/* ═══ URGENT NEWS BANNER ═══ */}
      <div className={`${isLight ? 'bg-amber-100 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'} border-b px-4 py-2 flex items-center gap-2`}>
        <AlertTriangle className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-amber-400'} flex-shrink-0`} />
        <span className={`text-xs font-semibold ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
          ⚠️ ARIZONA CVSA BRAKE INSPECTION WEEK starts Monday. Prep heavy-duty friction inventory.
        </span>
        <span className="ml-auto text-[10px] text-[#9CA3AF]">Updated 10:32 AM</span>
      </div>

      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-5">
        {/* ─── TOP BAR ─── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <img src="/rwc-logo.png" alt="RWC" className="w-10 h-10 object-contain" />
            <div>
              <div className={`text-sm font-bold ${headingColor}`}>RWC Group</div>
              <div className="text-[10px] text-[#6B7280]">Phoenix, AZ</div>
            </div>
            <div className={`h-8 w-px ${isLight ? 'bg-[#E5E7EB]' : 'bg-white/10'} mx-2`} />
            <div className={`flex items-center gap-1 p-1 rounded-xl ${isLight ? 'bg-[#F3F4F6]' : 'bg-white/5'} border ${borderColor}`}>
              <button onClick={() => setViewMode('personal')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'personal' ? `${isLight ? 'bg-white shadow-sm text-[#111827]' : 'bg-cyan-500/20 text-cyan-400'} border ${isLight ? 'border-[#E5E7EB]' : 'border-cyan-500/30'}` : `${bodyColor}`}`}>
                <Eye className="w-3 h-3 inline mr-1" /> Personal View
              </button>
              <button onClick={() => setViewMode('location')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'location' ? `${isLight ? 'bg-white shadow-sm text-[#111827]' : 'bg-cyan-500/20 text-cyan-400'} border ${isLight ? 'border-[#E5E7EB]' : 'border-cyan-500/30'}` : `${bodyColor}`}`}>
                <MapPin className="w-3 h-3 inline mr-1" /> Location View
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleAISummary} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${isLight ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:brightness-110'}`}>
              <BrainCircuit className="w-3.5 h-3.5" />
              {aiLoading ? 'Generating...' : 'AI Daily Summary'}
            </button>
            <button onClick={toggleTheme} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isLight ? 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button className={`w-9 h-9 rounded-xl flex items-center justify-center relative ${isLight ? 'bg-[#F3F4F6] text-[#4B5563]' : 'bg-white/10 text-gray-400'}`}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </div>

        {/* ─── MAIN GRID ─── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-8 space-y-5">

            {/* GREETING + PROFILE */}
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-blue-600' : 'text-cyan-400'}`}>⚡ Command Center</span>
                  <h1 className={`text-3xl lg:text-4xl font-bold ${headingColor} mt-1 mb-2`}>
                    Good afternoon,<br />{user?.name || 'Jordan'}
                  </h1>
                  <p className={`text-sm ${bodyColor} max-w-lg`}>
                    Your fleet overview, request queue, and parts intelligence — all in one place.
                    {viewMode === 'location' && <span className="block mt-1 text-blue-600 font-medium"> Viewing all RWC Phoenix branch activity.</span>}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link to="/search" className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${btnSecondary}`}>
                      <Search className="w-3.5 h-3.5" /> Search Parts
                    </Link>
                    <Link to="/chat" className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${btnSecondary}`}>
                      <Bot className="w-3.5 h-3.5" /> Ask AI
                    </Link>
                    <Link to="/vault" className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${btnSecondary}`}>
                      <Database className="w-3.5 h-3.5" /> Vendor Vault
                    </Link>
                  </div>
                </div>
                <div className={`hidden lg:flex flex-col items-center text-center p-4 rounded-2xl ${isLight ? 'bg-[#F9FAFB] border border-[#E5E7EB]' : 'bg-white/5 border border-white/10'} min-w-[150px]`}>
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-2 ring-2 ring-offset-2 ring-blue-400/30">
                    <img src="/avatar-jordan.png" alt="Jordan" className="w-full h-full object-cover" />
                  </div>
                  <div className={`text-sm font-bold ${headingColor}`}>{user?.name || 'Jordan'}</div>
                  <div className="text-[10px] text-[#6B7280]">Inside Sales, Phoenix Branch</div>
                  <div className="text-[10px] text-[#6B7280]">RWC Group — AZ Local Market</div>
                  <button onClick={() => handleCall('Jordan')} className="mt-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200 flex items-center gap-1 hover:bg-blue-100 transition-all">
                    <PhoneCall className="w-3 h-3" /> Click-to-Call
                  </button>
                </div>
              </div>
            </div>

            {/* COMBINED METRIC */}
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-4 flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <div className={`text-4xl font-bold ${headingColor} font-mono tracking-tight`}>
                  {totalRequests} <span className="text-lg text-[#9CA3AF] font-normal">Requests</span>
                </div>
                <div className="h-8 w-px bg-[#E5E7EB]" />
                <div className={`text-4xl font-bold text-emerald-600 font-mono tracking-tight`}>
                  {filledToday} <span className="text-lg text-[#9CA3AF] font-normal">Filled</span>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isLight ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {unfilledCount} Unfilled • {urgentCount} Urgent
              </div>
            </div>

            {/* STATS ROW */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Active Requests', value: totalRequests, icon: Activity, color: 'text-blue-600' },
                { label: 'Unfilled (Triage)', value: unfilledCount, icon: AlertTriangle, color: 'text-red-600' },
                { label: 'Total Local Parts', value: '2.9M', icon: Database, color: 'text-cyan-600' },
                { label: 'Searches Today', value: 20, icon: Search, color: 'text-violet-600' },
              ].map(stat => (
                <div key={stat.label} className={`${cardBg} border ${borderColor} rounded-2xl p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-[#6B7280] uppercase font-semibold">{stat.label}</span>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl font-bold ${headingColor} font-mono`}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* AI ACTION ITEMS */}
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${headingColor} flex items-center gap-2`}>
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  Jordan's Action Items
                </h3>
                <button onClick={handleAISummary} className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all ${isLight ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'}`}>
                  <BrainCircuit className="w-3 h-3" />
                  {aiLoading ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              <div className="space-y-2">
                {actionItems.map(item => (
                  <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl ${isLight ? 'bg-[#F9FAFB] border border-[#E5E7EB]' : 'bg-white/5 border border-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? 'bg-blue-50' : 'bg-cyan-500/10'}`}>
                        <ClipboardList className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                      </div>
                      <span className={`text-xs ${headingColor}`}>{item.text}</span>
                    </div>
                    <button className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${isLight ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'}`}>
                      AI Generate
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* MEGA-REQUEST QUEUE */}
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${headingColor} flex items-center gap-2`}>
                  <Radio className="w-4 h-4 text-red-500" />
                  Mega-Request Queue
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isLight ? 'bg-[#F3F4F6] text-[#4B5563]' : 'bg-white/10 text-gray-400'}`}>
                    {filteredRequests.length} active
                  </span>
                </h3>
                <div className="flex items-center gap-1">
                  {(['all', 'urgent', 'shop', 'outside', 'fleet'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all capitalize ${activeTab === tab ? isLight ? 'bg-[#111827] text-white' : 'bg-white/15 text-white' : isLight ? 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                      {tab === 'shop' ? 'Intra-Shop' : tab === 'outside' ? 'Outside' : tab === 'fleet' ? 'Fleet' : tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {filteredRequests.map(req => {
                  const cfg = requestTypeConfig[req.type];
                  return (
                    <div key={req.id} className={`flex items-center justify-between p-3 rounded-xl transition-all ${req.type === 'urgent' && req.status === 'open' ? isLight ? 'bg-red-50 border border-red-200' : 'bg-red-500/10 border border-red-500/20' : isLight ? 'bg-[#F9FAFB] border border-[#E5E7EB] hover:bg-[#F3F4F6]' : 'bg-white/5 border border-white/5 hover:bg-white/10'}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border} flex-shrink-0`}>{cfg.label}</span>
                        <div className="min-w-0">
                          <div className={`text-xs font-semibold ${headingColor} truncate`}>{req.title}</div>
                          {req.partNum && (
                            <div className="text-[10px] mt-0.5">
                              <Link to="/vault" className={`inline-flex items-center gap-1 ${isLight ? 'text-blue-600 hover:text-blue-800' : 'text-cyan-400 hover:text-cyan-300'} font-medium transition-colors`}>
                                <Link2 className="w-3 h-3" /> {req.partNum}
                              </Link>
                            </div>
                          )}
                          <div className="text-[10px] text-[#6B7280] flex items-center gap-1 mt-0.5">
                            <button onClick={() => handleCall(req.customer)} className={`inline-flex items-center gap-0.5 hover:underline ${isLight ? 'text-blue-600' : 'text-cyan-400'}`}>
                              <Phone className="w-3 h-3" /> {req.customer}
                            </button>
                            • {req.time} • Assigned: <span className={req.assigned === 'Jordan' ? (isLight ? 'text-blue-600 font-semibold' : 'text-cyan-400') : ''}>{req.assigned}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => setShowHandoff(true)} className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${isLight ? 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F9FAFB]' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`}>
                          Handoff
                        </button>
                        <button className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isLight ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'}`}>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ORDER HISTORY & TRACKING */}
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${headingColor} flex items-center gap-2`}>
                  <History className="w-4 h-4 text-violet-500" />
                  Order History & Tracking
                </h3>
                <div className="flex items-center gap-1">
                  {(['current', 'past', 'vault'] as const).map(tab => (
                    <button key={tab} onClick={() => setHistoryTab(tab)} className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all capitalize ${historyTab === tab ? isLight ? 'bg-[#111827] text-white' : 'bg-white/15 text-white' : isLight ? 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                      {tab === 'current' ? 'Current Orders' : tab === 'past' ? 'Past Orders' : 'Searchable Vault'}
                  </button>
                  ))}
                </div>
              </div>

              {historyTab === 'current' && (
                <div className="space-y-2">
                  {[
                    { id: '#442', customer: "Bob's Repair", status: 'In-Transit', eta: '12:45 PM', parts: 3 },
                    { id: '#445', customer: "Mike's Diesel", status: 'Staging', eta: 'Will-Call', parts: 2 },
                    { id: '#448', customer: 'Desert Freight', status: 'Picking', eta: 'Picked by Courier', parts: 5 },
                  ].map(order => (
                    <div key={order.id} className={`flex items-center justify-between p-3 rounded-xl ${isLight ? 'bg-[#F9FAFB] border border-[#E5E7EB]' : 'bg-white/5 border border-white/5'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? 'bg-blue-50' : 'bg-cyan-500/10'}`}>
                          <Package className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                        </div>
                        <div>
                          <div className={`text-xs font-semibold ${headingColor}`}>{order.id} — {order.customer}</div>
                          <div className="text-[10px] text-[#6B7280]">{order.parts} parts • {order.status} • {order.eta}</div>
                        </div>
                      </div>
                      <Link to="/vault" className={`text-[10px] font-semibold flex items-center gap-1 ${isLight ? 'text-blue-600 hover:text-blue-800' : 'text-cyan-400 hover:text-cyan-300'} transition-colors`}>
                        <FileSearch className="w-3 h-3" /> Track
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {historyTab === 'past' && (
                <div className="space-y-2">
                  {[
                    { id: '#439', customer: 'Southwest Diesel', date: 'Yesterday', total: '$1,247.50', parts: 8 },
                    { id: '#432', customer: 'Valley Transport', date: '2 days ago', total: '$3,890.00', parts: 12 },
                  ].map(order => (
                    <div key={order.id} className={`flex items-center justify-between p-3 rounded-xl ${isLight ? 'bg-[#F9FAFB] border border-[#E5E7EB]' : 'bg-white/5 border border-white/5'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? 'bg-emerald-50' : 'bg-emerald-500/10'}`}>
                          <CheckCircle className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                        </div>
                        <div>
                          <div className={`text-xs font-semibold ${headingColor}`}>{order.id} — {order.customer}</div>
                          <div className="text-[10px] text-[#6B7280]">{order.parts} parts • {order.date} • {order.total}</div>
                        </div>
                      </div>
                      <button className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${isLight ? 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                        Reorder
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {historyTab === 'vault' && (
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 p-3 rounded-xl ${isLight ? 'bg-[#F9FAFB] border border-[#E5E7EB]' : 'bg-white/5 border border-white/5'}`}>
                    <Search className="w-4 h-4 text-[#9CA3AF]" />
                    <input placeholder="Search invoices, part numbers, pricing history..." className={`flex-1 bg-transparent text-xs ${headingColor} placeholder-[#9CA3AF] outline-none`} />
                  </div>
                  <div className="text-[10px] text-[#9CA3AF] pl-3">Try: "brake drum 2024", "invoice #439", "Cummins ISX15 pricing"</div>
                </div>
              )}
            </div>

            {/* WILL-CALL WATCHLIST */}
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${headingColor} flex items-center gap-2`}>
                  <Clock className="w-4 h-4 text-amber-500" />
                  Will-Call Watchlist
                </h3>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${isLight ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  2 parts staged {'>'} 4 hrs
                </span>
              </div>
              <div className="space-y-2">
                <div className={`flex items-center justify-between p-3 rounded-xl ${isLight ? 'bg-amber-50/60 border border-amber-200' : 'bg-amber-500/5 border border-amber-500/10'}`}>
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className={`text-xs font-semibold ${headingColor}`}>Order #445 — Mike's Diesel</div>
                      <div className="text-[10px] text-[#6B7280]">Staged since 09:15 • 2 parts waiting • <Link to="/vault" className={`${isLight ? 'text-blue-600' : 'text-cyan-400'} hover:underline`}>WCH-455-001</Link></div>
                    </div>
                  </div>
                  <button className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${isLight ? 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'}`}>
                    Follow Up
                  </button>
                </div>
              </div>
            </div>

            {/* BOSS REPORT BAR */}
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? 'bg-[#F3F4F6]' : 'bg-white/5'}`}>
                    <BarChart3 className={`w-5 h-5 ${isLight ? 'text-[#4B5563]' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${headingColor}`}>Boss Report Ready</div>
                    <div className="text-[10px] text-[#6B7280]">{totalRequests} requests, {filledToday} filled, {urgentCount} urgent pending</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowBossReport(true)} className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${btnSecondary}`}>
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                  <button onClick={() => showToast('Boss Report emailed to Parts Manager & GM', 'success')} className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${btnSecondary}`}>
                    <Mail className="w-3.5 h-3.5" /> Email
                  </button>
                  <button onClick={() => showToast('Stats shared with customer for handoff', 'success')} className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${isLight ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20'}`}>
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="xl:col-span-4 space-y-5">
            {/* CHAT */}
            <div className={`${cardBg} border ${borderColor} rounded-2xl overflow-hidden flex flex-col max-h-[700px]`}>
              <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
                <div>
                  <h3 className={`text-sm font-bold ${headingColor} flex items-center gap-2`}>
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    Chat Messaging
                  </h3>
                  <p className="text-[10px] text-[#6B7280]">Three-Way Active Chat</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleCall('Bob')} className={`p-1.5 rounded-lg ${isLight ? 'hover:bg-[#F3F4F6]' : 'hover:bg-white/10'} transition-all`} title="Call Bob">
                    <Phone className="w-4 h-4 text-[#9CA3AF]" />
                  </button>
                  <button className={`p-1.5 rounded-lg ${isLight ? 'hover:bg-[#F3F4F6]' : 'hover:bg-white/10'} transition-all`}>
                    <Users className="w-4 h-4 text-[#9CA3AF]" />
                  </button>
                </div>
              </div>

              <div className={`p-3 border-b ${borderColor} ${isLight ? 'bg-[#F9FAFB]' : 'bg-white/5'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-xs font-bold ${headingColor}`}>Bob's Repair Shop</div>
                    <div className="text-[10px] text-[#6B7280]">Participants: 3 • Jordan (Lead), Larry (Outside), Bay Tech</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setShowHandoff(true)} className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200 hover:bg-blue-100 transition-all">
                      Leave: Transfer
                    </button>
                    <button className="px-2 py-1 rounded-lg bg-[#F3F4F6] text-[#4B5563] text-[10px] font-semibold border border-[#E5E7EB] hover:bg-[#E5E7EB] transition-all">
                      Print
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map(msg => {
                  const isMe = msg.sender === 'inside';
                  const isSystem = msg.sender === 'system';
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <img src={msg.avatar} alt={msg.name} className={`w-8 h-8 rounded-full object-cover flex-shrink-0 ${isSystem ? 'opacity-60' : ''}`} />
                      <div className={`max-w-[80%] ${isMe ? 'text-right' : ''}`}>
                        <div className={`text-[10px] text-[#9CA3AF] mb-0.5 ${isMe ? 'text-right' : ''}`}>{msg.name} • {msg.time}</div>
                        <div className={`inline-block px-3 py-2 rounded-xl text-xs ${isSystem ? isLight ? 'bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]' : 'bg-white/5 text-gray-400 border border-white/10' : isMe ? isLight ? 'bg-blue-600 text-white' : 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/20' : isLight ? 'bg-white text-[#111827] border border-[#E5E7EB] shadow-sm' : 'bg-white/10 text-gray-200 border border-white/10'}`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`p-3 border-t ${borderColor}`}>
                <button onClick={handleAISummary} className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all mb-2 ${isLight ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:brightness-110'}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  AI SUMMARIZE NOTES
                </button>
                <div className="flex items-center gap-2">
                  <button className={`px-3 py-2 rounded-xl text-[10px] font-semibold transition-all ${btnSecondary}`}>
                    <FileText className="w-3.5 h-3.5 inline mr-1" /> Print
                  </button>
                  <button className={`px-3 py-2 rounded-xl text-[10px] font-semibold transition-all ${btnSecondary}`}>
                    <Mail className="w-3.5 h-3.5 inline mr-1" /> Email Link
                  </button>
                </div>
              </div>

              <div className={`p-3 border-t ${borderColor} flex items-center gap-2`}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none transition-all ${inputBg}`}
                  onKeyDown={e => { if (e.key === 'Enter' && chatInput.trim()) { showToast('Message sent', 'success'); setChatInput(''); } }} />
                <button className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isLight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-cyan-500 text-white hover:bg-cyan-400'}`}>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CUSTOMER GARAGE */}
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-5`}>
              <h3 className={`text-sm font-bold ${headingColor} mb-3 flex items-center gap-2`}>
                <Truck className="w-4 h-4 text-emerald-500" />
                Customer Garage
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Bob's Repair", status: 'Parts on the way', count: 3, color: 'bg-blue-100 text-blue-700 border-blue-200' },
                  { name: "Mike's Diesel", status: 'Pending Will-Call', count: 2, color: 'bg-amber-100 text-amber-700 border-amber-200' },
                  { name: 'Desert Freight', status: 'Quote sent', count: 1, color: 'bg-purple-100 text-purple-700 border-purple-200' },
                ].map(garage => (
                  <div key={garage.name} className={`flex items-center justify-between p-3 rounded-xl ${isLight ? 'bg-[#F9FAFB] border border-[#E5E7EB]' : 'bg-white/5 border border-white/5'}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold text-[10px]">
                        {garage.name.charAt(0)}
                      </div>
                      <div>
                        <div className={`text-xs font-semibold ${headingColor}`}>{garage.name}</div>
                        <div className="text-[10px] text-[#6B7280]">{garage.status}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${garage.color}`}>
                      {garage.count} parts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-5`}>
              <h3 className={`text-sm font-bold ${headingColor} mb-3`}>Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Vendor Vault', icon: Database, path: '/vault' },
                  { label: 'Academy', icon: GraduationCap, path: '/academy' },
                  { label: 'Newsroom', icon: Newspaper, path: '/news' },
                  { label: 'Promos', icon: Tag, path: '/promos' },
                ].map(link => (
                  <Link key={link.label} to={link.path} className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${isLight ? 'bg-[#F9FAFB] text-[#4B5563] hover:bg-[#F3F4F6] border border-[#E5E7EB]' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'}`}>
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HANDOFF MODAL */}
      {showHandoff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowHandoff(false)}>
          <div className={`bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl`} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-4">AI Handoff Summary</h3>
            <div className="space-y-3 mb-4">
              {[
                { label: 'Status', text: '2 parts staged, awaiting customer pickup or Larry-Drop confirmation' },
                { label: 'Part #', text: 'FLT-LF14000NN (oil filter), BEN-K065234 (brake kit)' },
                { label: 'Next Step', text: 'Confirm Will-Call pickup time or schedule Larry field drop by 2 PM' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10">
                  <div className="text-xs font-semibold text-[#111827] dark:text-white mb-1">{item.label}</div>
                  <div className="text-xs text-[#4B5563] dark:text-gray-500">{item.text}</div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="text-xs text-[#6B7280] mb-1 block">Transfer to:</label>
              <select className="w-full p-2 rounded-xl bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-xs text-[#111827] dark:text-white outline-none">
                <option>Connor — Inside Sales</option>
                <option>Sarah — Outside Sales</option>
                <option>Tech Bay — Inventory</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowHandoff(false); showToast('Transferred to Connor. Brief sent.', 'success'); }} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:shadow-lg transition-all">
                Transfer & Send Brief
              </button>
              <button onClick={() => setShowHandoff(false)} className="flex-1 py-2.5 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[#4B5563] dark:text-white text-sm font-semibold hover:bg-[#E5E7EB] dark:hover:bg-white/10 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOSS REPORT MODAL */}
      {showBossReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowBossReport(false)}>
          <div className={`bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#111827] dark:text-white">Boss Report — RWC Phoenix</h3>
              <button onClick={() => setShowBossReport(false)} className="p-1 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 transition-all">
                <X className="w-4 h-4 text-[#9CA3AF]" />
              </button>
            </div>
            <div className="space-y-4 mb-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-center">
                  <div className="text-2xl font-bold text-[#111827] dark:text-white font-mono">{totalRequests}</div>
                  <div className="text-[10px] text-[#6B7280]">Total Requests</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-center">
                  <div className="text-2xl font-bold text-emerald-600 font-mono">{filledToday}</div>
                  <div className="text-[10px] text-[#6B7280]">Filled Today</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-center">
                  <div className="text-2xl font-bold text-red-500 font-mono">{urgentCount}</div>
                  <div className="text-[10px] text-[#6B7280]">Urgent Pending</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10">
                <div className="text-xs font-semibold text-[#111827] dark:text-white mb-2">Throughput Breakdown</div>
                <div className="space-y-1 text-[10px] text-[#6B7280]">
                  <div className="flex justify-between"><span>Intra-Shop requests</span><span className="text-[#111827] dark:text-white font-semibold">12</span></div>
                  <div className="flex justify-between"><span>Outside Sales leads</span><span className="text-[#111827] dark:text-white font-semibold">8</span></div>
                  <div className="flex justify-between"><span>Fleet/Installer direct</span><span className="text-[#111827] dark:text-white font-semibold">17</span></div>
                  <div className="flex justify-between border-t border-[#E5E7EB] dark:border-white/10 pt-1 mt-1"><span className="font-semibold">Average response time</span><span className="text-emerald-600 font-semibold">4.2 min</span></div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowBossReport(false); showToast('PDF downloaded', 'success'); }} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" /> Download PDF
              </button>
              <button onClick={() => { setShowBossReport(false); showToast('Report emailed to Parts Manager & GM', 'success'); }} className="flex-1 py-2.5 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[#4B5563] dark:text-white text-sm font-semibold hover:bg-[#E5E7EB] dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
