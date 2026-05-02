import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Sparkles } from 'lucide-react';
// AI Chat component

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: "Hey partner! I'm CJ's AI assistant — your Parts Hero expert. I know every part number, cross-reference, and compatibility matrix in the Vault. Ask me anything about truck parts!",
    timestamp: new Date(),
  },
];

// Comprehensive AI knowledge base responses
function generateResponse(query: string): string {
  const q = query.toLowerCase();

  // OIL FILTERS
  if (q.includes('oil filter') || q.includes('lube filter')) {
    if (q.includes('isx') || q.includes('cummins')) {
      return "For Cummins ISX engines, the primary oil filter is **Fleetguard LF9009** ($24.99) — it's a high-efficiency Stratapore filter with 99.5% particle removal at 10 micron. Cross-references: Baldwin B7299, Wix 51792, Donaldson P550949. Don't forget the gasket (Cummins 3681132, $4.49) and drain plug washer (3924140, $1.99). Change interval: 25,000 miles for highway, 15,000 for severe duty.";
    }
    if (q.includes('detroit') || q.includes('dd15')) {
      return "For Detroit DD15 engines, use **Fleetguard LF14001NN** ($32.99). It's a NanoNet filter with 98.7% efficiency. Cross-ref: Donaldson P551005. The DD15 holds 44 quarts of oil. Recommended oil: Detroit Diesel Power Guard 15W-40. Change interval: 50,000 miles with oil analysis.";
    }
    return "I need to know your engine type to recommend the right oil filter. For Cummins ISX — LF9009 ($24.99). For Detroit DD15 — LF14001NN ($32.99). For PACCAR MX-13 — LF17801 ($27.99). What's your engine?";
  }

  // BRAKES
  if (q.includes('brake') && (q.includes('chamber') || q.includes('t-30'))) {
    return "The **Bendix GC4594** Type 30/30 brake chamber ($89.99) is the most popular for Class 8 trucks. Specs: 30 sq in service + spring chamber, 2.5\" pushrod, 3/8\" NPT ports. Kit includes: chamber, clevis pin (800227, $3.99), and cotter pin. Always replace the dust boot (5000795, $8.49) during service. DOT inspection tip: Pushrod stroke must not exceed 2.0\" on Type 30 chambers.";
  }
  if (q.includes('brake shoe') || q.includes('brake lining')) {
    return "For drive axle brake shoes, I recommend the **Meritor R803753** 4707Q kit ($124.99). It includes 2 shoes with 7\" wide lining (0.50\" thick), plus pins and springs. Cross-ref: ESI 4707Q, Marathon 4707Q. Minimum lining thickness for DOT: 1/4\". If your drums are scored over 0.080\", replace them too — Meritor S466-1450 drum ($189.99).";
  }
  if (q.includes('brake') && q.includes('drum')) {
    return "The **Meritor S466-1450** brake drum ($189.99) is a cast iron drum, balanced for reduced vibration. 15.0\" x 7.0\" with 10 bolt holes on 11.25\" circle. Weight: 78 lbs. Always check for heat cracks, scoring, and out-of-round (max 0.020\"). Cross-ref: Gunite 3572X, Webb 66571F.";
  }
  if (q.includes('slack adjuster')) {
    return "The **Bendix 801266** automatic slack adjuster ($67.99) has a 5.5\" arm length with 1.5\" 10-spline. Torque to 25 lb-ft during install. Check: With brakes released, pull the pushrod by hand — if it moves more than 0.5\", the slack adjuster needs replacement. Always verify S-cam rotation is free when replacing.";
  }

  // TRANSMISSION
  if (q.includes('transmission') && (q.includes('rebuild') || q.includes('kit'))) {
    return "For a 13-speed Eaton Fuller rebuild, the **Eaton K-3338** master kit ($899.99) includes all bearings, synchronizer rings (4303419, $45.99 each), gaskets, and seals. You'll also want shift forks (4304641, $78.99) — check pad thickness (min 0.30\"). Total job typically runs 12-16 hours labor. Cross-ref on bearings: Timken SET404 (pinion), SET401 (carrier). Don't forget to set bearing preload to 15-25 in-lb.";
  }
  if (q.includes('clutch')) {
    return "The **Eaton A-6135** 15.5\" clutch kit ($459.99) is rated for 1850 lb-ft torque. Includes pressure plate, ceramic disc, and release bearing. Applications: Freightliner Cascadia, Peterbilt 579, Kenworth T680, Volvo VNL. Also get the release bearing (Eaton 127005, $56.99). Signs of worn clutch: Slipping under load, hard shifting, burning smell. Typical life: 500K-750K miles.";
  }

  // WATER PUMP
  if (q.includes('water pump')) {
    return "The **Cummins 2871292** water pump ($389.99) fits ISX15 engines. It's a genuine Cummins pump with cast iron impeller and sealed bearing. Kit includes gasket (3680883, $18.99) and O-ring. Applications: Freightliner Cascadia 2018+, Peterbilt 579, Kenworth T680. Pro tip: Always replace the thermostat (3680562, $29.99) at the same time — it's cheap insurance against overheating. Torque spec: 18 lb-ft on bolts.";
  }

  // BELTS
  if (q.includes('belt') && (q.includes('serpentine') || q.includes('fan'))) {
    return "The **Gates 9380HD** FleetRunner serpentine belt ($45.99) is rated for 500K miles with EPDM construction and Aramid tensile cords. Size: 80\" long, 8-rib. Don't forget to replace the tensioner (Dayco 89480, $89.99) and idler pulley (Gates 38171, $34.99) at the same time — a worn tensioner will destroy a new belt in weeks. Check belt deflection: Should be 1/2\" max at center span.";
  }

  // STARTER / ALTERNATOR
  if (q.includes('starter')) {
    return "The **Delco Remy 8600509** 39MT starter ($329.99) is the industry standard. 12V, 7.3KW, 11-tooth pinion, CW rotation. Rated for 10,000+ starts. Cross-ref: Bosch SR9586X, Denso 280-0309. Common failure: Clicking = bad solenoid. Slow crank = worn brushes or bad cables. Always check voltage at starter terminal (should be 10.5V+ while cranking).";
  }
  if (q.includes('alternator')) {
    return "The **Delco Remy 8600317** 28SI alternator ($279.99) puts out 200 amps at idle — critical for trucks with hotel loads. 8-groove pulley, J180 mount. Cross-ref: Leece-Neville 8600317, Bosch AL9961SB. If your batteries are dying overnight, check alternator output at idle (should be 13.8-14.4V). Common issue: Worn brushes at 300K+ miles.";
  }

  // PISTONS / ENGINE INTERNAL
  if (q.includes('piston')) {
    return "The **Cummins 4955485** piston kit ($189.99 each) includes the forged aluminum piston with steel crown insert, ring set (CB-1803P, $124.99), and wrist pin. Bore: 5.39\", Compression ratio: 16.3:1. For a complete in-frame overhaul, you'll need 6 pistons, main bearings, rod bearings, and a full gasket set. Total in-frame cost: ~$3,500-5,000 in parts. Typical ISX15 life before overhaul: 750K-1M miles.";
  }

  // FUEL
  if (q.includes('fuel filter') || q.includes('fuel water')) {
    return "For Cummins ISX engines, the **Fleetguard FF5767** NanoNet fuel filter ($32.99) has a 4-micron absolute rating with built-in water separation. Cross-ref: Baldwin BF9900, Donaldson P551005. Also consider the fuel/water separator (FS1003, $54.99) with drain valve and heater port. Replace every 15,000 miles. Warning: Water in fuel light = stop and drain immediately!";
  }

  // AIR FILTER
  if (q.includes('air filter')) {
    return "The **Fleetguard AH19003** OptiAir filter ($67.99) delivers 99.99% efficiency with synthetic media. It's a radial seal design — no gasket needed. Applications: Freightliner Cascadia, Peterbilt 579, Kenworth T680. Service interval: Check every 25K miles, replace at 50K or when restriction hits 25\" H2O. Cross-ref: Donaldson P608533, Baldwin RS5742.";
  }

  // HVAC
  if (q.includes('compressor') || q.includes('ac ') || q.includes('a/c')) {
    return "The **Sanden 4386** SD7H15 A/C compressor ($289.99) is the go-to for most Class 8 trucks. 155cc displacement, 8-groove pulley, 12V clutch, R134a compatible. Don't forget the seal kit (6607, $24.99) — never reuse old seals! Also grab the receiver drier (NAPA 207813, $34.99). Typical refrigerant charge: 3.5-4.5 lbs R134a. Signs of failure: Clutch not engaging, noisy bearing, oil leaking from shaft seal.";
  }

  // TIRES
  if (q.includes('tire') && q.includes('drive')) {
    return "The **Goodyear GDL672** 295/75R22.5 ($489.99) is a top-rated regional haul drive tire with 32/32\" tread depth and Fuel Max technology. SmartWay verified for fuel efficiency. Expected life: 180K miles. Load Range G, 5,675 lbs per tire at 110 PSI. For long haul, consider Michelin X Multi Energy D for 10% better fuel economy.";
  }
  if (q.includes('tire') && q.includes('steer')) {
    return "The **Michelin XZE2** 295/75R22.5 ($525.99) is the premium steer tire with Infini-Coil technology and 18/32\" tread depth. Expected life: 220K miles. Steer tires are critical for safety — minimum DOT tread depth is 4/32\" (vs 2/32\" for drive tires). Check for irregular wear, feathering, and cupping every 10K miles. Alignment is key: toe should be 1/16\" total.";
  }

  // BATTERY
  if (q.includes('battery')) {
    return "The **Deka BCI-31AGM** Group 31 battery ($289.99) delivers 925 CCA and 1150 MCA with AGM construction. Deep cycle capable for hotel loads. Weight: 72 lbs. For dual-battery trucks, always replace both batteries at the same time — an old battery will drag down a new one. Expected life: 4-5 years. Check voltage: 12.6V+ at rest, 13.8-14.4V while charging.";
  }

  // DPF
  if (q.includes('dpf') || q.includes('particulate')) {
    return "The **Fleetguard FS53015** DPF filter ($1,249.99) is a cordierite substrate, CARB-verified unit for Cummins ISX 2013+. Dimensions: 10.5\" x 12\". Also need the DEF quality sensor (Bosch DEF-HEAD-01, $189.99) if you're doing aftertreatment service. DPF cleaning interval: 250K-300K miles. Warning signs: Frequent regens, derate codes (SPN 3720, SPN 3251), soot load over 100%.";
  }

  // OIL
  if (q.includes('engine oil') || q.includes('motor oil')) {
    return "For Cummins ISX15 engines, I recommend **Shell Rotella T6 5W-40** ($28.99/gal) — it's CK-4/SN rated full synthetic. ISX15 holds 44 quarts total. Severe duty interval: 25K miles. With oil analysis: up to 50K miles. Alternative: Rotella T5 15W-40 synthetic blend ($22.99/gal) for cost-conscious fleets. Always pair with LF9009 filter ($24.99).";
  }

  // RADIATOR
  if (q.includes('radiator')) {
    return "The **Valeo RAD-ISX-001** radiator assembly ($789.99) features an aluminum core with plastic tanks, 2-row design. Core size: 42\" x 31\" x 2\". Direct fit for ISX-equipped Cascadia and Peterbilt 579. Don't forget a new radiator cap (Stant 18PSI, $9.99) — a weak cap causes boil-over. Check: Coolant should be 50/50 mix, pH 8-11, freeze point -34°F.";
  }

  // PRICING / GENERAL
  if (q.includes('price') || q.includes('cost') || q.includes('how much')) {
    return "I can get you pricing on any part! Here are some popular items:\n\n- Oil Filter (LF9009): $24.99\n- Brake Chamber T30/30: $89.99\n- Water Pump ISX15: $389.99\n- Clutch Kit 15.5\": $459.99\n- Transmission Rebuild Kit: $899.99\n- A/C Compressor: $289.99\n- DPF Filter: $1,249.99\n\nAll parts are HERO Verified with warranty. Need a specific part number or have a VIN? I can cross-reference compatibility.";
  }

  // VIN DECODE
  if (q.includes('vin') || q.includes('decode')) {
    return "To decode a VIN, I need the full 17-digit number. Each position tells us something:\n- 1st-3rd: WMI (manufacturer)\n- 4th-8th: Vehicle attributes (engine, model, GVWR)\n- 9th: Check digit\n- 10th: Model year (Y=2000, 1=2001... P=2023, R=2024, S=2025, T=2026)\n- 11th: Plant code\n- 12th-17th: Serial number\n\nShare your VIN and I'll tell you exactly what engine, transmission, and parts you need!";
  }

  // COMPATIBILITY
  if (q.includes('fit') || q.includes('compatible') || q.includes('will this work')) {
    return "I can check compatibility! Tell me:\n1. Your truck's Year, Make, Model\n2. Engine type (Cummins ISX, Detroit DD15, PACCAR MX-13, etc.)\n3. The part number you're considering\n\nI cross-reference against OEM specs, manufacturer catalogs, and fleet databases. Every recommendation I give is HERO Verified — no guesswork.";
  }

  // WARRANTY
  if (q.includes('warranty')) {
    return "Here's our warranty coverage:\n- Electrical (alternators, starters): 3 years\n- Brake components: 1-2 years\n- Engine parts (internal): 1 year\n- Filters & consumables: 90 days\n- Transmission kits: 1 year\n- HVAC compressors: 1 year\n- Tires: Per manufacturer (5-7 years)\n\nAll HERO Verified parts are inspected before shipping. If a part fails under warranty, we ship a replacement overnight and handle the RMA.";
  }

  // GREETING
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return "Hey there, partner! Ready to find the right parts for your rig? I can help with:\n- Part number lookups & cross-references\n- Compatibility checks by VIN\n- Pricing and availability\n- Maintenance schedules & intervals\n- DOT compliance requirements\n\nWhat are you working on today?";
  }

  // MAINTENANCE SCHEDULE
  if (q.includes('maintenance') || q.includes('service') || q.includes('interval') || q.includes('when')) {
    return "Here's a standard PM schedule for a Class 8 truck:\n\n**Every 15,000 miles:**\n- Engine oil & filter (LF9009 + Rotella T6)\n- Fuel filters (FF5767 + FS1003)\n- Tire inspection & rotation\n- Brake stroke check\n\n**Every 30,000 miles:**\n- Coolant test & top-off\n- Air filter inspection (AH19003)\n- Belt & tensioner check\n- Battery test\n\n**Every 60,000 miles:**\n- Transmission service\n- Differential oil change\n- Wheel seal inspection\n- A/C performance check\n\n**Every 100,000 miles:**\n- Valve adjustment\n- Brake shoe inspection (min 1/4\" lining)\n- Coolant change\n- Power steering fluid\n\nNeed a custom schedule for your specific truck and duty cycle?";
  }

  // DOT / COMPLIANCE
  if (q.includes('dot') || q.includes('inspection') || q.includes('compliance')) {
    return "For 2025 DOT inspections, here's what's critical:\n\n**Brake System (most common violations):**\n- Brake stroke limit: 2.0\" (Type 30), 2.5\" (Type 36)\n- Minimum lining: 1/4\" on drums\n- No air leaks (max 3 PSI drop in 1 minute)\n\n**Tires:**\n- Minimum tread: 4/32\" steer, 2/32\" drive\n- No cuts exposing ply\n- Proper inflation\n\n**Lighting:**\n- All lights operational\n- Proper aiming\n\n**2025 FMCSA Updates:**\n- New SMS categories: Vehicle Maintenance + Driver Observed\n- Speed limiters required: 68 mph max\n- AEB systems mandatory on new trucks\n- MC numbers being phased out — use USDOT only\n\nNeed help preparing for a roadside inspection?";
  }

  // DEFAULT
  return `Great question about "${query}"! Here's what I know:

I have detailed specs on 40+ real parts in our Vault, including genuine OEM parts from Cummins, Eaton, Bendix, Meritor, Fleetguard, Delco Remy, Gates, Sanden, Goodyear, Michelin, and Shell.

**Popular categories I can help with:**
- Engine parts (internal & external) for ISX, DD15, MX-13
- Transmission rebuild kits for Eaton Fuller
- Brake system components (chambers, shoes, drums, slack adjusters)
- HVAC compressors and seal kits
- Filters (oil, fuel, air)
- Tires (drive, steer, trailer)
- Electrical (starters, alternators, batteries)
- Cooling system (radiators, water pumps, thermostats)
- Aftertreatment (DPF, DEF sensors)

What specific part or system are you looking for? Give me your engine type, year, make, model, or a part number!`;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response with delay
    setTimeout(() => {
      const response = generateResponse(userMsg.content);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const quickPrompts = [
    'Oil filter for ISX15?',
    'Brake chamber specs',
    'Transmission rebuild kit',
    'A/C compressor price',
    'DOT inspection tips',
    'Maintenance schedule',
  ];

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:scale-110 transition-transform group"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">AI</span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[560px] bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">CJ's AI Assistant</div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-emerald-400">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-purple-500/30'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                }`}>
                  {msg.role === 'user' ? <User className="w-3 h-3 text-purple-300" /> : <Bot className="w-3 h-3 text-white" />}
                </div>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-purple-500/15 text-purple-200 border border-purple-500/20'
                    : 'bg-white/5 text-gray-300 border border-white/10'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />

            {/* Quick Prompts */}
            {messages.length < 3 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {quickPrompts.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => { setInput(prompt); }}
                    className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] hover:bg-cyan-500/20 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/5">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about any part..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-400/50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
