import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  MessageSquare, Truck, BarChart3, Shield,
  Zap, TrendingUp, Star,
  CheckCircle2, Clock, Users, ArrowRight, Play, X,
  MapPin, Phone, Mail, Twitter, Linkedin,
  Menu, BrainCircuit, Sparkles, CircleDot, Gauge,
  Layers, Eye, Megaphone, LineChart
} from 'lucide-react';
import { featuredVendors } from '@/data/mock';

/* ─── Animated Counter ─── */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const count = useCountUp(value);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ─── Marquee Ticker ─── */
const tickerItems = [
  '495+ Parts Cataloged', '17 Vendor Partners', '$3.2M YTD Revenue',
  '650+ Orders This Month', '65+ Vendors in Network', '4.7 Avg Vendor Rating',
  '96% Cummins Health Score', 'Phoenix AZ · Columbus IN · Stuttgart DE',
];

/* ─── Features Data ─── */
const features = [
  { icon: BrainCircuit, title: 'AI-Powered Part Search', desc: 'Natural language queries across 495+ real parts. Ask "oil filter for 2019 Cascadia" and get instant, accurate matches with cross-references.', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { icon: MessageSquare, title: 'Parts Hero AI Assistant', desc: 'Trained GPT-style chatbot with deep knowledge of 20+ parts categories. Get instant answers, part recommendations, and troubleshooting guidance.', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { icon: Truck, title: 'Fleet Management', desc: 'Build your digital garage with VIN decoding, maintenance scheduling, DOT compliance alerts, and parts-to-truck matching.', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Weekly activity tracking, cost savings vs MSRP, vendor health scores, trending parts, and inventory gap analysis — all in one dashboard.', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { icon: Shield, title: 'Vendor Vault & Quality', desc: '67+ vendors with health scores, verification queues, SKU upload tracking, and gap analysis. Only verified, high-quality parts make it through.', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { icon: Zap, title: 'Delivery Intelligence', desc: 'Track deliveries in real-time with ETAs, route alerts, weather impact analysis, and proactive delay notifications.', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
];

/* ─── How It Works ─── */
const steps = [
  { num: '01', title: 'Search or Ask AI', desc: 'Use natural language, part numbers, or VIN decoding to find exactly what your fleet needs across 495+ verified parts.' },
  { num: '02', title: 'Compare & Save', desc: 'See real OEM cross-references, MSRP vs Hero pricing, stock availability, and vendor ratings — all side by side.' },
  { num: '03', title: 'Order & Track', desc: 'Add to cart, place orders with 17+ featured vendors, and track deliveries in real-time with weather-aware ETAs.' },
];

/* ─── Testimonials ─── */
const testimonials = [
  { name: 'Mike Torres', role: 'Fleet Manager', company: 'Desert Freight Lines', quote: 'Parts Hero cut our parts sourcing time by 60%. The AI chat is like having a parts expert on call 24/7. We saved $47K in the first quarter alone.', avatar: 'MT' },
  { name: 'Sarah Chen', role: 'Shop Supervisor', company: 'Southwest Diesel Repair', quote: 'The Vendor Vault gives us confidence. We know every part is verified, and the health scores help us choose the right supplier every time.', avatar: 'SC' },
  { name: 'James Rodriguez', role: 'Operations Director', company: 'Valley Transport Solutions', quote: 'We manage 34 trucks and Parts Hero\'s fleet garage is a game changer. DOT compliance alerts alone have saved us from 3 potential violations.', avatar: 'JR' },
];

/* ─── Pricing ─── */
const plans = [
  { name: 'Starter', price: '$0', period: '/month', desc: 'For small shops exploring the platform', features: ['Search 495+ parts', 'AI Chat (50 queries/mo)', '3-truck garage', 'Basic delivery tracking', 'Email support'], cta: 'Get Started Free', popular: false },
  { name: 'Professional', price: '$149', period: '/month', desc: 'For growing fleets needing full access', features: ['Unlimited AI Chat', 'Unlimited fleet garage', 'Advanced analytics', 'Vendor direct ordering', 'Priority support', 'DOT compliance alerts', 'Weather-aware routing'], cta: 'Start 14-Day Trial', popular: true },
  { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large fleets and dealer networks', features: ['Everything in Pro', 'Dedicated account manager', 'Custom vendor onboarding', 'API access', 'White-label options', 'SSO & team management', 'SLA guarantee'], cta: 'Contact Sales', popular: false },
];

/* ─── Nav ─── */
function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'AI Assistant', href: '#ai' },
    { label: 'Vendors', href: '#vendors' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0F1C]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
            <span className="text-black font-bold text-sm">PH</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-bold text-lg tracking-tight">Parts Hero</span>
            <span className="text-[10px] text-cyan-400 font-medium uppercase tracking-widest hidden sm:inline">by Orka AI Labs</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign In</Link>
          <Link to="/login" className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold transition-all">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden p-2 text-gray-400" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0A0F1C]/95 backdrop-blur-xl border-b border-white/5 px-4 py-4 space-y-3">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="block text-sm text-gray-400 hover:text-white" onClick={() => setMobileOpen(false)}>{l.label}</a>
          ))}
          <Link to="/login" className="block w-full text-center py-2 rounded-lg bg-cyan-500 text-black text-sm font-semibold" onClick={() => setMobileOpen(false)}>
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}

/* ─── Main Landing Page ─── */
export default function Landing() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white">
      <LandingNav />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/8 rounded-full blur-[160px]" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/8 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />

        <div className="max-w-7xl mx-auto px-4 lg:px-6 relative">
          {/* Badge */}
                    {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">About Us / Inventor's Page — Due Diligence & Platform Overview</span>
            </div>
          </div>

          {/* Headline */}
                    <h1 className="text-4xl lg:text-7xl font-bold text-center leading-tight mb-6">
            <span className="text-white">Parts Hero by OrKa AI Labs</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500">
              Investor & Partner Overview
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-gray-400 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
            Parts Hero by <span className="text-cyan-400 font-medium">Orka AI Labs</span> combines AI-powered search, 
            real vendor data, fleet management, and predictive analytics to transform how commercial 
            truck fleets find, buy, and track parts.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/login" className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-lg transition-all hover:shadow-xl hover:shadow-cyan-500/20 flex items-center gap-2">
              Launch Platform <ArrowRight className="w-5 h-5" />
            </Link>
            <button onClick={() => setDemoOpen(true)} className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold text-lg transition-all flex items-center gap-2">
              <Play className="w-5 h-5" /> Watch Demo
            </button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { value: 495, suffix: '+', label: 'Parts Cataloged', color: 'text-cyan-400' },
              { value: 17, suffix: '', label: 'Featured Vendors', color: 'text-emerald-400' },
              { value: 67, suffix: '+', label: 'Total Vendors', color: 'text-amber-400' },
              { value: 3, suffix: '.2M', prefix: '$', label: 'YTD Revenue', color: 'text-violet-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center">
                <div className={`text-3xl lg:text-4xl font-bold font-mono ${stat.color}`}>
                  {stat.prefix}<Counter value={stat.value} />{stat.suffix}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TICKER ═══════════════════════ */}
      <div className="border-y border-white/5 bg-white/[0.02] py-3 overflow-hidden">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-sm text-gray-400 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              {item}
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } } .animate-marquee { animation: marquee 20s linear infinite; }`}</style>
      </div>

      {/* ═══════════════════════ PROBLEM / SOLUTION ═══════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">The Problem</span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-4">Parts Procurement is <span className="text-red-400">Broken</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Fleet managers waste hours hunting parts across dozens of vendors. Manual processes, outdated catalogs, and no visibility into pricing or availability.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: '4+ Hours Wasted Daily', desc: 'Average time shop technicians spend searching for parts across vendor websites, phone calls, and catalogs.', color: 'text-red-400', bg: 'bg-red-500/10' },
              { icon: Eye, title: 'No Price Transparency', desc: 'MSRP vs actual pricing hidden. Fleets overpay by 15-30% because they can\'t compare across vendors in one place.', color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { icon: CircleDot, title: 'Data Silos Everywhere', desc: 'Each vendor has their own catalog format. No cross-referencing, no standardized specs, no unified search.', color: 'text-orange-400', bg: 'bg-orange-500/10' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FEATURES ═══════════════════════ */}
      <section id="features" className="py-20 lg:py-28 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
        <div className="max-w-7xl mx-auto px-4 lg:px-6 relative">
          <div className="text-center mb-16">
            <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Platform</span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-4">Everything Your Fleet Needs</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">One platform. Six powerful capabilities. From AI search to delivery tracking, Parts Hero covers the entire parts lifecycle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className={`group bg-white/5 backdrop-blur-md border ${f.border} rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300`}>
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ AI SHOWCASE ═══════════════════════ */}
      <section id="ai" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                <BrainCircuit className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-400 font-medium">AI-Powered Intelligence</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Ask. Find. <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Order.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Parts Hero AI is trained on 495+ real heavy-duty truck parts across 11 categories and 20+ subcategories. 
                Ask natural questions like <span className="text-cyan-400">"What's the best oil filter for a 2019 Freightliner Cascadia?"</span> and get 
                instant, accurate answers with part numbers, pricing, and availability.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Trained on real OEM data: Cummins, Eaton, Bendix, Fleetguard, Meritor',
                  'Natural language search across part numbers, specs, applications',
                  'Cross-reference lookup: find compatible parts across brands',
                  'Parts recommendations with "Add to Cart" integration',
                  'Follow-up suggestions for related maintenance items',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-semibold transition-all">
                Try AI Chat <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: Mock Chat */}
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/10 rounded-3xl blur-2xl" />
              <div className="relative bg-[#0F172A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                {/* Chat Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <BrainCircuit className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Parts Hero AI</div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-[10px] text-emerald-400">Online</span>
                    </div>
                  </div>
                </div>
                {/* Chat Messages */}
                <div className="p-5 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div className="bg-white/5 rounded-xl rounded-tl-none px-4 py-3 max-w-[85%]">
                      <p className="text-sm text-gray-300">What oil filter do I need for a 2019 Freightliner Cascadia with DD15 engine?</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                      <BrainCircuit className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl rounded-tl-none px-4 py-3 max-w-[90%]">
                      <p className="text-sm text-gray-200 mb-2">For your 2019 Cascadia DD15, I recommend the <strong className="text-cyan-400">Fleetguard LF14000NN</strong>:</p>
                      <div className="bg-white/5 rounded-lg p-3 mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400">Part #</span>
                          <span className="text-white font-mono">FLT-LF14000NN</span>
                        </div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400">Hero Price</span>
                          <span className="text-emerald-400 font-medium">$24.50</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Stock</span>
                          <span className="text-emerald-400">142 in stock</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium">Add to Cart</button>
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs">View Alternatives</button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Input */}
                <div className="px-5 py-4 border-t border-white/5 flex gap-2">
                  <div className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-500">Ask about any truck part...</div>
                  <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]" />
        <div className="max-w-7xl mx-auto px-4 lg:px-6 relative">
          <div className="text-center mb-16">
            <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Workflow</span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-4">Three Steps to Smarter Parts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
                )}
                <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500 font-mono">{step.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ VENDOR PARTNERS ═══════════════════════ */}
      <section id="vendors" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Partnerships</span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">17 featured vendor partners with verified catalogs, real-time health monitoring, and direct ordering integration.</p>
          </div>

          {/* Logo Wall */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-12">
            {featuredVendors.map(v => (
              <div key={v.id} className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center hover:border-cyan-500/30 transition-all hover:-translate-y-0.5">
                <div className="w-16 h-16 flex items-center justify-center mb-2">
                  {v.logo ? (
                    <img src={v.logo} alt={v.name} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="text-white font-bold text-lg">{v.initials}</span>
                  )}
                </div>
                <span className="text-xs text-gray-500 text-center group-hover:text-gray-300 transition-colors">{v.name}</span>
              </div>
            ))}
          </div>

          {/* Vendor Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total SKUs Available', value: featuredVendors.reduce((a, v) => a + v.partCount, 0).toLocaleString() },
              { label: 'Average Vendor Health', value: `${Math.round(featuredVendors.reduce((a, v) => a + v.healthScore, 0) / featuredVendors.length)}%` },
              { label: 'Avg Response Time', value: '< 4 hrs' },
              { label: 'Verified Parts', value: '100%' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-white font-mono">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ DATA INTELLIGENCE ═══════════════════════ */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 lg:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Dashboard Preview */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-3xl blur-2xl" />
                <div className="relative bg-[#0F172A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
                  {/* Mock Dashboard */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-amber-400" /><div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs text-gray-500 ml-2">Command Center</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[{l:'Total Parts',v:'495',t:'+12%'}, {l:'Deliveries',v:'8',t:'+2'}, {l:'Savings',v:'$1.4K',t:'+8%'}, {l:'Searches',v:'87',t:'-3%'}].map((s,i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-3">
                        <div className="text-[10px] text-gray-500 mb-1">{s.l}</div>
                        <div className="text-sm font-bold text-white font-mono">{s.v}</div>
                        <div className="text-[10px] text-emerald-400">{s.t}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-3">Weekly Activity</div>
                    <div className="flex items-end gap-1 h-16">
                      {[40,65,30,80,55,25,15].map((h,i) => (
                        <div key={i} className="flex-1 bg-cyan-500/30 rounded-t" style={{height:`${h}%`}} />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                      <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full -rotate-90"><circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none"/><circle cx="32" cy="32" r="28" stroke="#06b6d4" strokeWidth="4" fill="none" strokeDasharray="120 175" strokeLinecap="round"/></svg>
                      <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-bold text-cyan-400">67%</span></div>
                    </div>
                    <div><div className="text-sm text-white font-medium">Stock Availability</div><div className="text-xs text-gray-500">Parts in stock now</div></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                <LineChart className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400 font-medium">Data Intelligence</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Your Fleet. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Your Data.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                The Parts Hero Command Center gives you real-time visibility into every aspect of your parts 
                operations. Track searches, monitor savings vs MSRP, manage deliveries, and get proactive alerts.
              </p>

              <div className="space-y-4">
                {[
                  { icon: TrendingUp, title: 'Cost Tracking', desc: 'Compare Hero pricing vs MSRP across your entire purchase history. See exactly how much you save.' },
                  { icon: Gauge, title: 'Vendor Health Scores', desc: 'Real-time health monitoring for all 67+ vendors. Track SKU completeness, response times, and data quality.' },
                  { icon: Megaphone, title: 'Proactive Alerts', desc: 'DOT inspection blitz warnings, recall notifications, weather alerts, and low-stock warnings — delivered instantly.' },
                  { icon: Layers, title: 'Category Analytics', desc: 'Understand your fleet\'s parts consumption patterns. Engine parts 28%, brakes 21%, transmission 17%, and more.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Testimonials</span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-4">Trusted by Fleet Professionals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PRICING ═══════════════════════ */}
      <section id="pricing" className="py-20 lg:py-28 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[180px]" />
        <div className="max-w-7xl mx-auto px-4 lg:px-6 relative">
          <div className="text-center mb-16">
            <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Pricing</span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Start free, scale as your fleet grows. No hidden fees, no surprises.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`relative bg-white/5 backdrop-blur-md border rounded-2xl p-6 ${plan.popular ? 'border-cyan-500/30 shadow-xl shadow-cyan-500/5' : 'border-white/10'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white font-mono">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-black'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="relative bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 backdrop-blur-md border border-white/10 rounded-3xl p-10 lg:p-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-[60px]" />
            <div className="relative">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">Ready to Transform Your Fleet Operations?</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                Join 200+ fleets already using Parts Hero to save time, reduce costs, and keep their trucks on the road.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/login" className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-lg transition-all hover:shadow-xl hover:shadow-cyan-500/20 flex items-center gap-2">
                  Launch Parts Hero <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="mailto:sales@orkaalabs.com" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold text-lg transition-all">
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="border-t border-white/5 bg-[#070B14] py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                  <span className="text-black font-bold text-sm">PH</span>
                </div>
                <span className="text-white font-bold">Parts Hero</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                The intelligence platform for heavy-duty truck parts procurement. Built by Orka AI Labs.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Twitter className="w-4 h-4 text-gray-400" /></div>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Linkedin className="w-4 h-4 text-gray-400" /></div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                {['Part Search', 'AI Assistant', 'Fleet Garage', 'Vendor Vault', 'Analytics'].map(l => (
                  <li key={l}><span className="text-sm text-gray-500 hover:text-cyan-400 transition-colors cursor-pointer">{l}</span></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {['About Orka AI Labs', 'Careers', 'Blog', 'Press Kit', 'Contact'].map(l => (
                  <li key={l}><span className="text-sm text-gray-500 hover:text-cyan-400 transition-colors cursor-pointer">{l}</span></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-500"><Mail className="w-3.5 h-3.5" /> hello@orkaalabs.com</li>
                <li className="flex items-center gap-2 text-sm text-gray-500"><Phone className="w-3.5 h-3.5" /> (602) 555-0147</li>
                <li className="flex items-center gap-2 text-sm text-gray-500"><MapPin className="w-3.5 h-3.5" /> Phoenix, AZ</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-600">&copy; 2025 Orka AI Labs. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer">Privacy Policy</span>
              <span className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer">Terms of Service</span>
              <span className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer">Cookie Settings</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {demoOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setDemoOpen(false)}>
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-8 max-w-lg w-full text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Interactive Demo</h3>
            <p className="text-gray-400 mb-6">Sign in to the platform to experience the full Parts Hero demo with live AI chat, vendor vault, and fleet management.</p>
            <div className="flex gap-3">
              <Link to="/login" className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-all">
                Launch Platform
              </Link>
              <button onClick={() => setDemoOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
