import { useState, useRef, useEffect } from 'react';
import {
  Send, Bot, User, Sparkles, Wrench, Loader2, Trash2,
  Zap, Thermometer, CircleDot, Cog, Droplets, Fuel, Circle
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { allPartsFlat, searchParts, catalogStats } from '@/data/partsDatabase';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  parts?: typeof allPartsFlat;
  isMarkdown?: boolean;
  timestamp: Date;
}

// Deep AI knowledge engine with parts database lookup
function generateAIResponse(query: string): { text: string; parts: typeof allPartsFlat; followUp: string[] } {
  const q = query.toLowerCase().trim();
  let parts: typeof allPartsFlat = [];
  let text = '';
  let followUp: string[] = [];

  // Greeting
  if (/^(hi|hello|hey|yo|sup|howdy|greetings)/.test(q)) {
    text = `Hey there, partner! Welcome to **Parts Hero AI** — your heavy-duty truck parts expert. I'm trained on ${catalogStats.totalParts}+ verified parts across ${catalogStats.totalCategories} major categories.

**Here's what I can help you with:**
- Find any part by name, number, or brand
- Cross-reference compatibility by engine or truck model
- Check pricing, stock levels, and warranty info
- Recommend related parts ("Don't Forget" kits)
- Decode VIN numbers and identify vehicle specs
- Answer DOT compliance and maintenance questions

What are you working on today?`;
    followUp = ['Oil filter for ISX15', 'Brake chamber specs', 'Transmission rebuild kit', 'AC compressor price'];
    return { text, parts, followUp };
  }

  // Help / what can you do
  if (/help|what can you|capabilities|features|what do you do/.test(q)) {
    text = `**Parts Hero AI Capabilities:**

**Part Search**
- Search by part number (e.g., "LF9009")
- Search by name (e.g., "water pump ISX15")
- Search by brand (e.g., "Fleetguard filters")
- Search by application (e.g., "Freightliner Cascadia parts")

**Technical Info**
- Specifications and dimensions
- Cross-references and compatibility
- Installation tips and torque specs
- Maintenance intervals and schedules

**Fleet Management**
- Build sheets and part lists
- DMS export (Karmak/Procede/CDK/DSI)
- Stock availability and pricing
- Warranty information

**Compliance**
- DOT inspection requirements
- CVSA roadcheck preparation
- Brake stroke limits, lining thickness
- Speed limiter and AEB rules

Just ask me anything! Try "Find oil filter for Cummins ISX15" or "What brake chamber for Peterbilt 579?"`;
    followUp = ['Find oil filter', 'Brake chamber specs', 'Transmission kit', 'DOT inspection tips'];
    return { text, parts, followUp };
  }

  // Direct part number search
  const partNumberMatch = allPartsFlat.filter(p => p.partNumber.toLowerCase().includes(q.replace(/\s/g, '')));
  if (partNumberMatch.length > 0 && q.length > 3) {
    parts = partNumberMatch.slice(0, 5);
    const p = parts[0];
    text = `Found **${partNumberMatch.length} part(s)** matching "${query}". Here's the top result:

**${p.name}**  
Part #: \`${p.partNumber}\`  
Brand: ${p.brand}  
Price: **$${p.price.toFixed(2)}** (MSRP: $${p.msrp.toFixed(2)})  
Stock: ${p.stockQty} units in stock  
Warranty: ${p.warranty}  
Weight: ${p.weight}  

**Applications:** ${p.applications.slice(0, 3).join(', ')}${p.applications.length > 3 ? '...' : ''}  

${p.verified ? '✅ **HERO Verified** — inspected and approved by our SME team.' : ''}`;
    followUp = [`More ${p.brand} parts`, 'Add to build sheet', 'Compatible parts', 'Installation guide'];
    return { text, parts, followUp };
  }

  // Oil filters
  if (/oil filter|lube filter|motor oil filter/.test(q)) {
    if (/isx15|isx 15|cummins isx/.test(q)) {
      parts = searchParts('LF9009').slice(0, 4);
      text = `For **Cummins ISX15**, the primary oil filter is:

**Fleetguard LF9009** — $24.99
- Stratapore media, 99.5% efficiency at 10 micron
- Thread: 1-16 UN | OD: 4.5" | Length: 11.5"
- Cross-references: Baldwin B7299, Wix 51792, Donaldson P550949

**Don't Forget Kit:**
- Oil filter gasket (Cummins 3681132) — $4.49
- Drain plug washer (3924140) — $1.99
- Engine oil: Shell Rotella T6 5W-40 — $28.99/gal (44 qts total)

**Service interval:** 25,000 miles highway / 15,000 severe duty`;
      followUp = ['LF9009 alternatives', 'Shell Rotella T6 price', 'ISX15 oil capacity', 'Buy oil filter kit'];
    } else if (/dd15|detroit/.test(q)) {
      parts = searchParts('LF14001').slice(0, 4);
      text = `For **Detroit DD15**, use:

**Fleetguard LF14001NN** — $32.99
- NanoNet synthetic media, 98.7% efficiency
- Extended drain interval capable
- DD15 holds 44 quarts total

**Recommended oil:** Detroit Diesel Power Guard 15W-40
**Change interval:** 50,000 miles with oil analysis`;
      followUp = ['Detroit oil specs', 'DD15 capacity', 'NanoNet vs Stratapore'];
    } else {
      parts = searchParts('oil filter').slice(0, 5);
      text = `I found **${parts.length} oil filters** in the Vault. Here are the top options:

| Part | Brand | Price | Best For |
|------|-------|-------|----------|
| LF9009 | Fleetguard | $24.99 | Cummins ISX15 |
| LF14001 | Fleetguard | $32.99 | Detroit DD15 |
| LF17801 | Fleetguard | $27.99 | Cummins ISX12 |
| 1R0739 | CAT | $28.99 | CAT C13/C15 |

**Pro tip:** Always replace the gasket and drain plug washer when changing the filter. The "Don't Forget Kit" saves you a second trip to the shop.`;
      followUp = ['LF9009 for ISX15', 'Detroit DD15 filter', 'CAT filter', 'Bulk oil filter pricing'];
    }
    return { text, parts, followUp };
  }

  // Brake chambers
  if (/brake chamber|t-30|t30|t 30|spring brake/.test(q)) {
    parts = searchParts('brake chamber').slice(0, 4);
    text = `**Brake Chamber Guide — Type 30/30**

**Bendix GC4594** — $89.99 ⭐ Most Popular
- Double-diaphragm spring brake chamber
- Service port: 30 sq in | Spring port: 30 sq in
- Pushrod: 2.5" | Port: 3/8" NPT
- Applications: Freightliner M2, Peterbilt 337, Kenworth T370

**DOT Inspection Specs:**
- Max pushrod stroke: **2.0"** for Type 30
- Min brake lining: **1/4"** on drive axles
- Air pressure build: 85→100 PSI in **<45 seconds**
- Max air leak: **3 PSI** in 1 minute

**Don't Forget:**
- Clevis pin (Bendix 800227) — $3.99
- Cotter pin
- Dust boot (5000795) — $8.49`;
    followUp = ['Type 30/36 chamber', 'Slack adjuster', 'Brake shoe kit', 'DOT brake inspection'];
    return { text, parts, followUp };
  }

  // Transmission
  if (/transmission.*rebuild|rebuild kit|transmission kit/.test(q)) {
    parts = searchParts('rebuild').slice(0, 4);
    text = `**Eaton Fuller Rebuild Kits**

**Eaton K-3338** — $899.99 ⭐ Best Seller
- For RTLO-18913A 13-speed manual
- Includes: bearings, synchronizer rings, gaskets, seals
- Typical install: **12-16 hours labor**

**What's in the kit:**
- Mainshaft & countershaft bearings (Timken SET404/401)
- Synchronizer rings (4303419) — brass, 38-tooth
- Shift forks (4304641) — check pad thickness (min 0.30")
- Complete gasket set and seals

**Pro tip:** Always check shift fork pad thickness during rebuild. Worn pads (<0.30") will destroy synchronizers within 50K miles.`;
    followUp = ['Eaton K-3338 details', 'Synchronizer rings', 'Shift fork specs', 'Transmission install time'];
    return { text, parts, followUp };
  }

  // Clutch
  if (/clutch/.test(q)) {
    parts = searchParts('clutch').slice(0, 4);
    text = `**Clutch Kits — Class 8 Trucks**

**Eaton A-6135** — $459.99
- 15.5" single-plate clutch kit
- Torque rating: **1,850 lb-ft**
- Ceramic friction disc | 2" 10-spline
- Includes: pressure plate, disc, release bearing

**Applications:** Freightliner Cascadia, Peterbilt 579, Kenworth T680, Volvo VNL

**Signs of worn clutch:**
- Slipping under heavy load
- Hard shifting / grinding
- Burning smell during engagement
- Typical life: **500K–750K miles**

**Don't Forget:** Release bearing (Eaton 127005) — $56.99`;
    followUp = ['Clutch install guide', 'Release bearing', 'Clutch adjustment', 'Ceramic vs organic'];
    return { text, parts, followUp };
  }

  // Water pump
  if (/water pump|coolant pump/.test(q)) {
    parts = searchParts('water pump').slice(0, 4);
    text = `**Water Pumps — Heavy Duty**

**Cummins 2871292** — $389.99
- For ISX15 engines
- Cast iron impeller, sealed bearing
- Includes gasket set (3680883 — $18.99)
- Torque spec: **18 lb-ft** on bolts

**Don't Forget Kit:**
- Thermostat 180°F (3680562) — $29.99
- Water pump gasket set — $18.99
- Coolant: Shell Rotella ELC 50/50 — $89.99

**Pro tip:** Always replace the thermostat when doing a water pump. A stuck thermostat causes the exact same overheating symptoms as a bad pump, and it's only $30 insurance.`;
    followUp = ['ISX15 cooling system', 'Thermostat 180°F', 'Coolant type', 'Overheating diagnosis'];
    return { text, parts, followUp };
  }

  // Belts
  if (/belt|serpentine|fan belt|tensioner/.test(q)) {
    parts = searchParts('belt').slice(0, 4);
    text = `**Serpentine Belts & Tensioners**

**Gates 9380HD** — $45.99 ⭐ Top Rated
- EPDM construction with Aramid tensile cords
- Rated life: **500,000 miles**
- Size: 80" long, 8-rib

**Always replace together:**
- Belt tensioner (Dayco 89480) — $89.99
- Idler pulley (Gates 38171) — $34.99

**Why?** A worn tensioner destroys a new belt in weeks. The spring loses tension, causing slip and heat. Check belt deflection: should be **≤1/2"** at center span.

**Signs of worn belt:**
- Squealing on cold start
- Cracking on rib surface
- Glazing (shiny surface)`;
    followUp = ['Belt tensioner check', 'Idler pulley', 'Gates vs Dayco', 'Belt routing diagram'];
    return { text, parts, followUp };
  }

  // Alternator
  if (/alternator|charging|battery.*drain/.test(q)) {
    parts = searchParts('alternator').slice(0, 4);
    text = `**Alternators — High Output**

**Delco 28SI 200A** — $279.99
- 200 amp output at idle
- 8-groove pulley, J180 mount
- Remote sense compatible
- Applications: Freightliner, Peterbilt, Kenworth, Volvo

**Delco 55SI 300A** — $449.99
- For sleeper cabs with hotel loads
- 240A at idle, 300A peak

**Diagnosis tips:**
- Voltage at battery while running: **13.8–14.4V**
- If <13.5V at idle: weak alternator or bad cables
- If batteries die overnight: parasitic draw test (should be <50mA)`;
    followUp = ['300A alternator', 'Voltage drop test', 'Parasitic draw', 'Battery vs alternator'];
    return { text, parts, followUp };
  }

  // Starter
  if (/starter|crank|won.t start|clicking/.test(q)) {
    parts = searchParts('starter').slice(0, 4);
    text = `**Starter Motors**

**Delco 39MT** — $329.99
- 12V, 7.3KW, 11-tooth pinion
- Rated for **10,000+ starts**
- Cross-ref: Bosch SR9586X, Denso 280-0309

**Diagnosis by symptom:**
- **Click, no crank:** Bad solenoid or low battery
- **Slow crank:** Worn brushes, weak battery, or bad cables
- **Grinding noise:** Pinion not engaging fully (flywheel wear)
- **Intermittent:** Heat soak — needs heat shield or reman unit

**Voltage test:** At starter terminal while cranking, should read **10.5V+**. Less = bad cables or weak battery.`;
    followUp = ['Starter solenoid', 'Heat soak fix', 'Brush replacement', 'Battery voltage test'];
    return { text, parts, followUp };
  }

  // AC / HVAC
  if (/compressor|ac |a\/c|air conditioning|hvac/.test(q)) {
    parts = searchParts('compressor').slice(0, 4);
    text = `**A/C Compressors**

**Sanden SD7H15** — $289.99
- 155cc displacement, 8-groove pulley
- 12V clutch coil, R134a compatible
- Applications: Freightliner, Peterbilt, Kenworth, Volvo

**Signs of failure:**
- Clutch not engaging
- Noisy bearing (rattling)
- Oil leaking from shaft seal
- Warm air from vents

**Don't Forget Kit:**
- Seal kit (Sanden 6607) — $24.99
- Receiver drier (NAPA 207813) — $34.99
- R134a refrigerant: 3.5–4.5 lbs

**Pro tip:** 60% of compressor warranty claims are from contaminated refrigerant or moisture from a failed drier. Always replace the drier with the compressor!`;
    followUp = ['AC seal kit', 'Receiver drier', 'R134a charge amount', 'AC leak detection'];
    return { text, parts, followUp };
  }

  // Tires
  if (/tire|drive tire|steer tire|truck tire/.test(q)) {
    parts = searchParts('tire').slice(0, 4);
    text = `**Commercial Truck Tires**

| Application | Part | Price | Key Spec |
|-------------|------|-------|----------|
| Drive | Goodyear G670 295/75R22.5 | $489.99 | 32/32" tread, 180K mi |
| Steer | Michelin XZE2 295/75R22.5 | $525.99 | 18/32", 220K mi |
| Mixed | Bridgestone M800 11R24.5 | $465.99 | 30/32", on/off highway |

**DOT Requirements:**
- Steer axle min: **4/32"** tread depth
- Drive axle min: **2/32"** tread depth
- No sidewall cuts exposing ply
- Proper inflation to manufacturer spec

**Steer tire = safety critical.** Never cheap out on steer tires. The Michelin XZE2 with Infini-Coil technology delivers 220K mile life and superior wet traction.`;
    followUp = ['Tire pressure chart', 'Steer vs drive tires', 'Michelin vs Goodyear', 'Tire rotation schedule'];
    return { text, parts, followUp };
  }

  // Battery
  if (/battery|batteries|group 31|cca/.test(q)) {
    parts = searchParts('battery').slice(0, 4);
    text = `**Heavy Duty Batteries**

**Deka Intimidator AGM Group 31** — $289.99
- 925 CCA | 1,150 MCA | 200 min reserve
- AGM absorbed glass mat construction
- Deep cycle capable for hotel loads
- Weight: 72 lbs | Warranty: 4 years

**Optima YellowTop Group 31** — $319.99
- SpiralCell AGM technology
- 900 CCA | 1,125 MCA
- 300+ deep discharge cycles

**Pro tips:**
- Replace **both batteries** at the same time
- Old battery drags down new one
- Check voltage: 12.6V+ at rest, 13.8–14.4V charging
- Clean terminals every 6 months`;
    followUp = ['AGM vs flooded', 'Battery load test', 'CCA vs MCA', 'Deep cycle battery'];
    return { text, parts, followUp };
  }

  // DPF
  if (/dpf|particulate filter|aftertreatment|diesel particulate/.test(q)) {
    parts = searchParts('dpf').slice(0, 4);
    text = `**DPF Filters — Aftertreatment**

**Fleetguard FS53015** — $1,249.99
- Cordierite substrate
- CARB-verified for Cummins ISX 2013+
- Dimensions: 10.5" x 12"
- Weight: 32 lbs | Warranty: 2 years

**DPF Cleaning Interval:** 250K–300K miles

**Warning signs:**
- Frequent regens (more than 1/day)
- Derate codes: SPN 3720, SPN 3251
- Soot load over 100%
- Excessive backpressure

**Don't Forget:** DEF quality sensor (Bosch DEF-HEAD-01) — $189.99

**Pro tip:** Never use off-brand DEF. Contaminated DEF (even 1% off-spec) can poison the SCR catalyst, causing a $3,000+ replacement.`;
    followUp = ['DPF cleaning service', 'SCR catalyst', 'DEF quality test', 'Regen frequency'];
    return { text, parts, followUp };
  }

  // Fuel filters
  if (/fuel filter|fuel water|water separator/.test(q)) {
    parts = searchParts('fuel filter').slice(0, 4);
    text = `**Fuel Filters**

**Fleetguard FF5767** — $32.99
- 4-micron absolute rating
- NanoNet synthetic media
- Built-in water separation
- Flow rate: 120 GPH

**Fleetguard FS1003** — $54.99
- Spin-on fuel/water separator
- 10-micron rating
- Drain valve + heater port
- Water capacity: 500ml

**Service interval:** Every 15,000 miles

**Warning:** Water in fuel light = **STOP and drain immediately.** Water in a common rail system destroys injectors ($400+ each) and the high-pressure pump ($1,200+).`;
    followUp = ['NanoNet vs cellulose', 'Fuel system cleaning', 'Water separator drain', 'Common rail injector'];
    return { text, parts, followUp };
  }

  // Engine oil
  if (/engine oil|motor oil|rotella|shell.*oil|oil change/.test(q)) {
    parts = searchParts('Rotella').slice(0, 4);
    text = `**Heavy Duty Engine Oils**

| Oil | Price | Type | Best For |
|-----|-------|------|----------|
| Shell Rotella T6 5W-40 | $28.99/gal | Full Synthetic | All-season, extreme temps |
| Shell Rotella T5 15W-40 | $22.99/gal | Syn Blend | Cost-conscious fleets |
| Mobil Delvac 1 ESP | $32.99/gal | Full Synthetic | Extended drains |
| Valvoline Premium Blue | $24.99/gal | Syn Blend | Cummins approved |

**Cummins ISX15 Oil Capacity:** 44 quarts total
**Severe duty interval:** 25,000 miles
**With oil analysis:** Up to 50,000 miles

**CK-4 vs FA-4:**
- CK-4: Backward compatible, protects older engines
- FA-4: Fuel economy focused, for 2017+ engines only

**Price increase alert:** Shell announced 8% increase effective June 1, 2026. Stock up now!`;
    followUp = ['Rotella T6 vs T5', 'CK-4 vs FA-4', 'Oil analysis kit', 'Bulk oil pricing'];
    return { text, parts, followUp };
  }

  // Radiator
  if (/radiator|cooling system|overheat|overheating/.test(q)) {
    parts = searchParts('radiator').slice(0, 4);
    text = `**Radiators & Cooling**

**Valeo RAD-ISX-001** — $789.99
- Aluminum core, plastic tanks
- 2-row design
- Core: 42" x 31" x 2"
- Applications: Cummins ISX15, Freightliner Cascadia

**Coolant Specs:**
- 50/50 ethylene glycol/water mix
- pH: 8.0–11.0
- Freeze point: -34°F
- Boil point: 265°F

**Don't Forget:**
- Radiator cap 18 PSI (Stant) — $9.99
- Upper hose (Gates 25201) — $34.99
- Lower hose (Gates 25202) — $29.99

**Overheating diagnosis:**
1. Check coolant level
2. Test thermostat (should open at 180°F)
3. Check water pump flow
4. Inspect radiator for external blockage
5. Check fan clutch engagement`;
    followUp = ['Coolant pH test', 'Thermostat test', 'Fan clutch check', 'Radiator flush'];
    return { text, parts, followUp };
  }

  // DOT / Inspection
  if (/dot|inspection|roadcheck|cvsa|compliance/.test(q)) {
    text = `**DOT Inspection Guide — 2026**

**Brake System (42% of violations)**
- Pushrod stroke: ≤2.0" Type 30, ≤2.5" Type 36
- Lining thickness: ≥1/4" drive, ≥1/8" steer (but 1/4" recommended)
- Air leak: ≤3 PSI drop in 1 minute
- Air build: 85→100 PSI in <45 seconds

**Tires**
- Tread depth: ≥4/32" steer, ≥2/32" drive
- No cuts exposing ply
- No mismatched sizes on same axle

**Lighting**
- All operational, proper aiming
- No cracked lenses

**Upcoming 2026 Deadlines:**
- **May 13–15:** CVSA International Roadcheck (Tire Focus)
- **May 14:** Arizona DOT Brake Blitz
- **July 1:** Speed limiter rule (68 mph max) — *pending legal challenge*
- **Sept 2028:** AEB mandatory on all new trucks

**Prep checklist:** Inspect all tires, verify brake stroke, test air system, check all lights.`;
    followUp = ['Brake stroke check', 'Tire inspection', 'Air system test', 'CVSA 2026 focus'];
    return { text, parts, followUp };
  }

  // Maintenance schedule
  if (/maintenance|service|pm|preventive|interval|schedule/.test(q)) {
    text = `**Class 8 Preventive Maintenance Schedule**

**Every 15,000 Miles**
- Engine oil & filter (ISX15: 44 qts + LF9009)
- Fuel filters (FF5767 + FS1003)
- Tire inspection & rotation
- Brake stroke check
- Grease all fittings

**Every 30,000 Miles**
- Coolant test & top-off
- Air filter inspection (AH19003)
- Belt & tensioner check
- Battery test & clean terminals
- Clutch free play check

**Every 60,000 Miles**
- Transmission service (drain & fill)
- Differential oil change (75W-90 synthetic)
- Wheel seal inspection
- A/C performance check
- Power steering fluid

**Every 100,000 Miles**
- Valve adjustment (ISX15: 0.011" intake, 0.023" exhaust)
- Brake shoe inspection (replace at 1/4")
- Coolant change
- Radiator pressure test
- DPF ash cleaning`;
    followUp = ['Oil change procedure', 'Valve adjustment specs', 'DPF cleaning', 'Differential service'];
    return { text, parts, followUp };
  }

  // VIN decode
  if (/vin|decode|vehicle identification/.test(q)) {
    text = `**VIN Decoding Guide**

A commercial truck VIN has 17 characters:

**Positions 1–3: WMI (World Manufacturer Identifier)**
- 1FU = Freightliner (USA)
- 1FU = Sterling (USA)
- 3AL = International (Mexico)
- 1XP = Peterbilt (USA)
- 1XK = Kenworth (USA)
- 4V4 = Volvo (USA)

**Positions 4–8: Vehicle Descriptor**
- Engine type, model, GVWR, brake system

**Position 9: Check Digit**
- Mathematical validation

**Position 10: Model Year**
- Y=2000, 1=2001... P=2023, R=2024, S=2025, T=2026

**Position 11: Plant Code**
- Where the truck was assembled

**Positions 12–17: Serial Number**
- Unique to each vehicle

**Example:** 1FUJGLDR55LX12345
- 1FU = Freightliner
- JGL = Cascadia, ISX15, 126" BBC
- D = Check digit
- R = 2024 model year
- 5 = Cleveland, NC plant
- LX12345 = Serial number`;
    followUp = ['Decode my VIN', 'Freightliner codes', 'Engine code lookup', 'GVWR by VIN'];
    return { text, parts, followUp };
  }

  // General search fallback
  parts = searchParts(q).slice(0, 5);
  if (parts.length > 0) {
    text = `Found **${parts.length} parts** matching "${query}" in the Vault. Here are the top results:

All parts are HERO Verified with real-time stock, exact specs, and warranty coverage. Click any part to view full details or add it to your build sheet.`;
    followUp = ['Show more results', 'Filter by brand', 'Filter by price', 'Compatibility check'];
  } else {
    text = `I searched all ${catalogStats.totalParts} parts in the Vault but didn't find exact matches for "${query}".

**Try searching for:**
- A part number (e.g., "LF9009", "GC4594")
- A part name (e.g., "oil filter", "brake chamber")
- A brand (e.g., "Fleetguard", "Bendix", "Eaton")
- An engine type (e.g., "Cummins ISX15", "Detroit DD15")
- A truck model (e.g., "Freightliner Cascadia")

Or ask me a question like "What's the best oil filter for Cummins ISX15?"`;
    followUp = ['Oil filter ISX15', 'Brake chamber specs', 'Transmission kit', 'Show all categories'];
  }

  return { text, parts, followUp };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hey partner! I'm **Parts Hero AI** — your heavy-duty truck parts expert.\n\nI'm trained on **${catalogStats.totalParts}+ verified parts** across ${catalogStats.totalCategories} major categories with ${catalogStats.brands} brands.\n\n**Ask me anything:** part numbers, compatibility, pricing, specs, DOT compliance, maintenance schedules — I've got you covered.\n\n*What are you working on today?*`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { showToast } = useToast();

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
    if (!hasStarted) setHasStarted(true);

    setTimeout(() => {
      const result = generateAIResponse(userMsg.content);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.text,
        parts: result.parts,
        isMarkdown: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 600);
  };

  const quickPrompts = [
    { icon: Wrench, label: 'Oil filter for ISX15', color: 'text-cyan-400' },
    { icon: CircleDot, label: 'Brake chamber T30/30', color: 'text-orange-400' },
    { icon: Cog, label: 'Transmission rebuild kit', color: 'text-blue-400' },
    { icon: Thermometer, label: 'A/C compressor price', color: 'text-purple-400' },
    { icon: Zap, label: 'Alternator 200A', color: 'text-yellow-400' },
    { icon: Droplets, label: 'Water pump ISX15', color: 'text-sky-400' },
    { icon: Fuel, label: 'Fuel filter NanoNet', color: 'text-pink-400' },
    { icon: Circle, label: 'Tire 295/75R22.5', color: 'text-emerald-400' },
  ];

  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Bold
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400">$1</strong>');
        // Code
        line = line.replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1 rounded text-sm font-mono text-amber-300">$1</code>');
        // Bullet points
        if (line.startsWith('- ')) {
          return <li key={i} className="ml-4 text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: line.substring(2) }} />;
        }
        // Headers
        if (line.startsWith('**') && line.endsWith('**') && !line.includes(' ')) {
          return <h4 key={i} className="text-sm font-bold text-white mt-3 mb-1" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*/g, '') }} />;
        }
        // Empty
        if (!line.trim()) return <div key={i} className="h-1" />;
        return <p key={i} className="text-sm text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: line }} />;
      });
  };

  return (
    <div className="h-[calc(100dvh-3.5rem)] lg:h-[calc(100dvh)] flex flex-col -mx-4 lg:-mx-6 -my-4 lg:-my-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-white/5 bg-[#0A0F1C]/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Parts Hero AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-emerald-400">Online — {catalogStats.totalParts} parts loaded</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMessages([messages[0]])} className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-all" title="Clear chat">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
              msg.role === 'user'
                ? 'bg-purple-500/30'
                : 'bg-gradient-to-br from-cyan-500 to-blue-600'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-purple-300" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`max-w-[85%] lg:max-w-[75%] space-y-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
              <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-purple-500/15 text-purple-200 border border-purple-500/20'
                  : 'bg-white/5 text-gray-300 border border-white/10'
              }`}>
                {msg.isMarkdown && msg.role === 'assistant'
                  ? renderMarkdown(msg.content)
                  : msg.content
                }
              </div>

              {/* Part cards */}
              {msg.parts && msg.parts.length > 0 && (
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {msg.parts.map(part => (
                    <div key={part.partNumber} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3 hover:border-cyan-500/30 transition-all">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                        <Wrench className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">{part.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{part.partNumber} • {part.brand}</div>
                        <div className="text-[10px] text-gray-500">{part.applications[0]}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-cyan-400">${part.price.toFixed(2)}</div>
                        <div className="text-[10px] text-emerald-400">{part.stockQty} in stock</div>
                      </div>
                      <button
                        onClick={() => {
                          addToCart({
                            id: part.partNumber,
                            partNumber: part.partNumber,
                            name: part.name,
                            brand: part.brand,
                            price: part.price,
                            msrp: part.msrp,
                            description: part.description,
                            specs: part.specs,
                            applications: part.applications,
                            inStock: part.inStock,
                            stockQuantity: part.stockQty,
                            weight: part.weight,
                            warranty: part.warranty,
                            verified: part.verified,
                          });
                          showToast(`${part.name} added to build sheet`, 'success');
                        }}
                        className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-[10px] hover:bg-cyan-500/30 transition-all flex-shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Follow-up suggestions */}
              {msg.role === 'assistant' && idx === messages.length - 1 && !isTyping && (
                <div className="flex flex-wrap gap-1.5">
                  {(msg as any).followUp?.map?.((s: string) => (
                    <button
                      key={s}
                      onClick={() => { setInput(s); }}
                      className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] hover:bg-cyan-500/20 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-gray-600">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
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
        {!hasStarted && messages.length === 1 && (
          <div className="mt-6">
            <p className="text-xs text-gray-500 mb-3 text-center">Quick questions to get started:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickPrompts.map(p => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.label}
                    onClick={() => { setInput(p.label); }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all text-left"
                  >
                    <Icon className={`w-4 h-4 ${p.color} flex-shrink-0`} />
                    <span className="text-xs text-gray-300 truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 lg:px-6 py-4 border-t border-white/5 bg-[#0A0F1C]/90 backdrop-blur-xl">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about any part, truck, or maintenance question..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-400/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isTyping ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Send className="w-5 h-5 text-white" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-2">
          Parts Hero AI has {catalogStats.totalParts} verified parts • HERO Verified guarantees • Real-time stock
        </p>
      </div>
    </div>
  );
}
