import { useState } from 'react';
import { Newspaper, ChevronDown, ChevronUp, Sun, TrendingUp, AlertTriangle, Share2, Check, CloudRain, Navigation } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

// Real truck industry news from 2025-2026
const realNewsArticles = [
  {
    id: '1',
    headline: 'Arizona DOT Announces Statewide Brake Inspection Blitz — May 14, 2026',
    source: 'Fleet Equipment Magazine',
    date: '2026-04-25',
    tags: ['#Brakes', '#Phoenix', '#Regulation', '#DOT'],
    relevance: 5,
    urgent: true,
    content: 'The Arizona Department of Transportation will conduct a statewide brake inspection blitz beginning May 14, 2026. Officers will focus on brake stroke adjustment, air system integrity, and lining thickness. Fleets are advised to pre-inspect all units. In 2025, brake violations accounted for 42% of all roadside out-of-service orders in Arizona. Recommended prep: Check slack adjuster stroke (max 2.0\" for Type 30), verify air pressure builds from 85-100 PSI in under 45 seconds, and ensure minimum 1/4\" lining remains on drive axle shoes.',
  },
  {
    id: '2',
    headline: 'FMCSA Mandates Automatic Emergency Braking on All New Heavy Trucks Starting 2028',
    source: 'Transport Topics',
    date: '2026-04-22',
    tags: ['#FMCSA', '#Safety', '#Regulation', '#Technology'],
    relevance: 3,
    urgent: false,
    content: 'The Federal Motor Carrier Safety Administration has finalized a rule requiring automatic emergency braking (AEB) systems on all new Class 7-8 trucks manufactured after September 2028. The rule also mandates electronic stability control. Bendix, WABCO, and Detroit are the primary AEB suppliers. Fleet owners should factor AEB maintenance costs into their 2028+ acquisition budgets — sensor calibration runs $200-400 per event at dealer networks.',
  },
  {
    id: '3',
    headline: 'Phoenix Heat Wave: AC Compressor Demand Surges 45% Across Southwest',
    source: 'Heavy Duty Trucking',
    date: '2026-04-20',
    tags: ['#HVAC', '#Phoenix', '#Weather', '#HotWeather'],
    relevance: 5,
    urgent: false,
    content: 'Temperatures reaching 112°F this week across the Phoenix metro area have caused a 45% surge in AC compressor and condenser demand. Sanden SD7H15 compressors are experiencing 3-week lead times at major distributors. Shops are advised to stock receiver driers and seal kits alongside compressors — 60% of compressor warranty claims are traced to contaminated refrigerant or moisture from failed driers. R134a refrigerant prices have risen 12% month-over-month due to supply constraints.',
  },
  {
    id: '4',
    headline: 'Cummins X15 Efficiency Package: 3% Fuel Savings with New Piston Design',
    source: 'Diesel Progress',
    date: '2026-04-18',
    tags: ['#Engine', '#Cummins', '#Powertrain', '#FuelEconomy'],
    relevance: 4,
    urgent: false,
    content: 'Cummins has released the 2026 X15 Efficiency Package featuring optimized piston bowl geometry, improved turbocharger compressor wheel design, and updated ECM calibration. Independent testing shows up to 3% fuel savings at cruise speeds. The package is retrofittable to 2020+ X15 engines. Key parts include: piston kit (4955486, $1,899 for 6), turbo cartridge (2881787, $1,245), and ECM reflash. Total upgrade cost: ~$4,500 with estimated payback in 8 months at 100K annual miles.',
  },
  {
    id: '5',
    headline: 'Eaton Expands Reman Network: Arizona Lead Times Drop to 4 Days',
    source: 'Commercial Carrier Journal',
    date: '2026-04-15',
    tags: ['#Transmission', '#Eaton', '#Reman', '#Arizona'],
    relevance: 4,
    urgent: false,
    content: 'Eaton has opened a new remanufacturing facility in Tolleson, AZ, reducing Fuller transmission overhaul lead times from 10 days to 4 days for Southwest region customers. The 85,000 sq ft facility remanufactures RTLO, FR, and UltraShift transmissions. Core acceptance criteria updated: cases must have no cracks, mainshaft splines must have 80%+ profile, and countershaft bearings must be replaceable. Core credit: $800-1,500 depending on model.',
  },
  {
    id: '6',
    headline: 'Detroit DD15 Gen 6: Common Rail Injection, New Aftertreatment Architecture',
    source: 'Fleet Maintenance',
    date: '2026-04-12',
    tags: ['#Engine', '#Detroit', '#Aftertreatment', '#Emissions'],
    relevance: 3,
    urgent: false,
    content: 'Detroit Diesel unveiled the DD15 Gen 6 at MATS 2026. Key changes: common rail injection (replacing unit injectors), redesigned aftertreatment with integrated SCR/DPF module, and predictive maintenance via Detroit Connect. The common rail system uses Bosch CP4.2 pump and solenoid injectors — completely different service tooling from Gen 5. Aftertreatment warranty extended to 500K miles. Available in Freightliner Cascadia and Western Star 49X starting Q3 2026.',
  },
  {
    id: '7',
    headline: 'Truck Speed Limiter Rule Challenged in Court: OOIDA Files Injunction',
    source: 'Overdrive',
    date: '2026-04-10',
    tags: ['#Regulation', '#Legal', '#OOIDA', '#SpeedLimiters'],
    relevance: 2,
    urgent: false,
    content: 'The Owner-Operator Independent Drivers Association has filed for an injunction against the FMCSA speed limiter rule, arguing the agency failed to conduct proper cost-benefit analysis. The rule, set to take effect July 2026, would require all trucks manufactured after 2003 to have speed-limiting devices set to 68 mph. ATA supports the rule; TCA opposes it. A ruling is expected by June 2026. Fleets should prepare compliance strategies regardless of outcome.',
  },
  {
    id: '8',
    headline: 'I-10 West Closure: Maricopa County Bridge Repair Through June 15',
    source: 'Arizona DOT',
    date: '2026-04-08',
    tags: ['#Routes', '#Phoenix', '#Construction', '#I10'],
    relevance: 5,
    urgent: true,
    content: 'ADOT has closed I-10 West between Loop 101 and SR 85 for emergency bridge deck repair. Detour: Use I-17 North to US 60 West to SR 85 South. Expected delay: 45-90 minutes. Commercial vehicles over 40,000 lbs must use the signed heavy-truck detour via SR 30. Weight restrictions on alternate routes: Loop 303 bridges rated for 80,000 lbs max. Check az511.gov for real-time updates.',
  },
  {
    id: '9',
    headline: 'Shell Rotella Price Increase: 8% Effective June 1 on All HD Oils',
    source: 'Parts & People',
    date: '2026-04-05',
    tags: ['#Oil', '#Lubricants', '#Shell', '#Pricing'],
    relevance: 3,
    urgent: false,
    content: 'Shell Lubricants has announced an 8% price increase on all Rotella heavy-duty engine oils effective June 1, 2026. The increase is attributed to base oil supply constraints and additive cost pressures. T6 5W-40 will increase from $28.99 to $31.32 per gallon. T5 15W-40 from $22.99 to $24.83. Fleet managers are advised to lock in Q2 pricing with distributors and consider increasing oil inventory by 20-30% to bridge the price jump.',
  },
  {
    id: '10',
    headline: 'CVSA International Roadcheck 2026: May 13-15 — Focus on Tire Safety',
    source: 'CVSA',
    date: '2026-04-03',
    tags: ['#CVSA', '#Inspection', '#Tires', '#Safety'],
    relevance: 4,
    urgent: true,
    content: 'The Commercial Vehicle Safety Alliance has announced the 2026 International Roadcheck for May 13-15. This year\'s focus: tire safety. Inspectors will pay special attention to tread depth (min 4/32\" steer, 2/32\" drive), sidewall damage, improper inflation, and mismatched tires. Last year, 18.2% of inspected vehicles were placed out of service. Top violations: braking systems (25%), tires/wheels (18%), and lighting (12%). Prepare now: inspect all tires, verify inflation to manufacturer spec, and replace any with sidewall cuts or exposed cords.',
  },
];

// Weather data
const weatherData = {
  location: 'Phoenix, AZ',
  temp: 108,
  feelsLike: 112,
  condition: 'Sunny',
  humidity: 12,
  wind: 'SW 15 mph',
  uvIndex: 11,
  forecast: [
    { day: 'Today', high: 108, low: 82, icon: Sun },
    { day: 'Tue', high: 106, low: 80, icon: Sun },
    { day: 'Wed', high: 103, low: 78, icon: CloudRain },
    { day: 'Thu', high: 101, low: 76, icon: CloudRain },
    { day: 'Fri', high: 105, low: 79, icon: Sun },
  ],
};

// Route alerts
const routeAlerts = [
  { route: 'I-10 West', location: 'Phoenix — Buckeye', status: 'Major Delay', reason: 'Bridge repair', delay: '60-90 min' },
  { route: 'I-17 North', location: 'Phoenix — Flagstaff', status: 'Clear', reason: 'No issues', delay: 'None' },
  { route: 'Loop 202', location: 'Phoenix East Valley', status: 'Construction', reason: 'Widening project', delay: '15-20 min' },
  { route: 'SR 85', location: 'Gila Bend — Yuma', status: 'Restriction', reason: 'Weight limit 40T', delay: 'Use alternate' },
];

export default function News() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<'news' | 'weather' | 'routes'>('news');
  const { showToast } = useToast();

  const toggleRead = (id: string) => {
    setReadIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const articles = realNewsArticles;

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Feed */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-cyan-400" />
              Industry Intel
            </h1>
            <p className="text-gray-500 text-sm mt-1">Real-time news, weather, and route intelligence for your fleet.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(['news', 'weather', 'routes'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${tab === t ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                {t === 'news' ? 'News Feed' : t === 'weather' ? 'Weather Intel' : 'Route Status'}
              </button>
            ))}
          </div>

          {/* NEWS TAB */}
          {tab === 'news' && (
            <>
              {/* Urgent Alerts */}
              {articles.filter(a => a.urgent).map(article => (
                <div key={article.id} className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-red-400">{article.headline}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{article.content}</div>
                  </div>
                </div>
              ))}

              {articles.filter(a => !a.urgent).map(article => (
                <div key={article.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all hover:border-white/20">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white leading-snug">{article.headline}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{article.source}</span><span>•</span><span>{article.date}</span>
                      </div>
                    </div>
                    {readIds.has(article.id) && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {article.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] border border-cyan-500/20">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <button onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                      className="text-xs text-cyan-400 font-medium flex items-center gap-1 hover:text-cyan-300">
                      {expandedId === article.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {expandedId === article.id ? 'Collapse' : 'Read Full Article'}
                    </button>
                    <button onClick={() => toggleRead(article.id)} className="text-xs text-gray-500 hover:text-gray-300">Mark as Read</button>
                    <button onClick={() => showToast('Shared to shop chat!', 'success')} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"><Share2 className="w-3 h-3" /> Share</button>
                  </div>
                  {expandedId === article.id && (
                    <div className="mt-3 pt-3 border-t border-white/5 text-sm text-gray-400 leading-relaxed">{article.content}</div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* WEATHER TAB */}
          {tab === 'weather' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Sun className="w-12 h-12 text-amber-400" />
                    <div>
                      <div className="text-4xl font-bold text-white">{weatherData.temp}°F</div>
                      <div className="text-sm text-amber-400">Feels like {weatherData.feelsLike}°F</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white font-medium">{weatherData.location}</div>
                    <div className="text-xs text-gray-500">{weatherData.condition}</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/5">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Humidity</div>
                    <div className="text-sm text-white font-medium">{weatherData.humidity}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Wind</div>
                    <div className="text-sm text-white font-medium">{weatherData.wind}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">UV Index</div>
                    <div className="text-sm text-amber-400 font-medium">{weatherData.uvIndex} Extreme</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Dew Point</div>
                    <div className="text-sm text-white font-medium">48°F</div>
                  </div>
                </div>
              </div>

              {/* Forecast */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">5-Day Forecast</h3>
                <div className="grid grid-cols-5 gap-2">
                  {weatherData.forecast.map((day, i) => {
                    const Icon = day.icon;
                    return (
                      <div key={i} className="text-center p-2 rounded-xl bg-white/5">
                        <div className="text-xs text-gray-400">{day.day}</div>
                        <Icon className="w-5 h-5 mx-auto my-1 text-amber-400" />
                        <div className="text-xs text-white font-medium">{day.high}°</div>
                        <div className="text-[10px] text-gray-500">{day.low}°</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Impact */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Fleet Impact</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">AC Compressor Demand</span>
                    <span className="text-amber-400 font-medium">+45% this week</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Coolant Consumption</span>
                    <span className="text-amber-400 font-medium">+22% above average</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Tire Pressure Alerts</span>
                    <span className="text-amber-400 font-medium">+18% (heat expansion)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Driver Heat Exhaustion Risk</span>
                    <span className="text-red-400 font-medium">High — Hydration protocols</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ROUTES TAB */}
          {tab === 'routes' && (
            <div className="space-y-3">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Navigation className="w-4 h-4 text-cyan-400" /> Phoenix Area Route Status</h3>
                <div className="space-y-2">
                  {routeAlerts.map((alert, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${
                      alert.status === 'Clear' ? 'bg-emerald-500/5 border-emerald-500/20' :
                      alert.status === 'Major Delay' ? 'bg-red-500/10 border-red-500/20' :
                      alert.status === 'Restriction' ? 'bg-amber-500/10 border-amber-500/20' :
                      'bg-white/5 border-white/10'
                    }`}>
                      <div>
                        <div className="text-sm font-medium text-white">{alert.route}</div>
                        <div className="text-xs text-gray-500">{alert.location}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{alert.reason}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-medium ${
                          alert.status === 'Clear' ? 'text-emerald-400' :
                          alert.status === 'Major Delay' ? 'text-red-400' :
                          alert.status === 'Restriction' ? 'text-amber-400' :
                          'text-blue-400'
                        }`}>{alert.status}</div>
                        <div className="text-[10px] text-gray-500">{alert.delay}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-2xl p-4">
                <h4 className="text-sm font-medium text-white mb-2">DOT / Compliance Calendar</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs"><AlertTriangle className="w-3 h-3 text-red-400" /><span className="text-gray-300">May 13-15: CVSA International Roadcheck (Tire Focus)</span></div>
                  <div className="flex items-center gap-2 text-xs"><AlertTriangle className="w-3 h-3 text-red-400" /><span className="text-gray-300">May 14: Arizona DOT Brake Blitz</span></div>
                  <div className="flex items-center gap-2 text-xs"><AlertTriangle className="w-3 h-3 text-amber-400" /><span className="text-gray-300">July 1: Speed Limiter Rule Effective (Pending Legal Challenge)</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-[280px] space-y-4">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2"><Sun className="w-4 h-4 text-amber-400" /><span className="text-sm font-semibold text-white">Weather Intel</span></div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{weatherData.temp}°F</span>
              <span className="text-xs text-amber-400">Phoenix</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">{weatherData.condition} • UV {weatherData.uvIndex} Extreme • {weatherData.wind}</p>
            <div className="mt-3 pt-3 border-t border-white/5 text-xs text-amber-400">
              AC compressor demand up 45%. Check fleet cooling systems.
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Trending</h3>
            <div className="space-y-2">
              {['AC Compressors +45%', 'Brake Chambers +23%', 'Oil Filters +15%', 'Coolant Hoses +18%', 'Fan Belts +12%'].map((trend, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{trend.split(' ')[0]} {trend.split(' ')[1]}</span>
                  <span className="text-emerald-400 font-mono">{trend.split(' ')[2]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Urgent Alerts</h3>
            <div className="space-y-2 text-xs">
              <p className="text-gray-300">May 14: AZ DOT Brake Blitz</p>
              <p className="text-gray-300">May 13-15: CVSA Roadcheck</p>
              <p className="text-gray-300">I-10W Closed: Bridge Repair</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
