import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Sparkles, Wrench, Loader2 } from 'lucide-react';
import { allPartsFlat, searchParts } from '@/data/partsDatabase';
import { useCart } from '@/contexts/CartContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  parts?: typeof allPartsFlat;
  timestamp: Date;
}

function aiSearch(query: string): { response: string; parts: typeof allPartsFlat } {
  const q = query.toLowerCase();
  let parts: typeof allPartsFlat = [];
  let response = '';

  // Direct part number search
  const partNumberMatch = allPartsFlat.filter(p => p.partNumber.toLowerCase().includes(q));
  if (partNumberMatch.length > 0) {
    parts = partNumberMatch.slice(0, 5);
    response = `I found ${partNumberMatch.length} part(s) matching "${query}". Here are the top results:`;
    return { response, parts };
  }

  // Smart category routing
  if (q.includes('oil filter') || q.includes('lube filter')) {
    parts = searchParts('oil filter').slice(0, 6);
    response = `Found ${parts.length} oil filters in the Vault. The **Fleetguard LF9009** ($24.99) is our best-seller for Cummins ISX15 engines. All filters are HERO Verified with 1-year warranty.`;
  } else if (q.includes('brake chamber') || q.includes('t-30') || q.includes('t30')) {
    parts = searchParts('brake chamber').slice(0, 6);
    response = `Found ${parts.length} brake chambers. The **Bendix GC4594** T-30/30 ($89.99) is the most popular for Class 8 trucks. DOT inspection tip: Pushrod stroke must not exceed 2.0" on Type 30 chambers.`;
  } else if (q.includes('clutch')) {
    parts = searchParts('clutch').slice(0, 6);
    response = `Found ${parts.length} clutch kits. The **Eaton A-6135** 15.5" kit ($459.99) is rated for 1850 lb-ft torque. Don't forget the release bearing ($56.99)!`;
  } else if (q.includes('transmission') && q.includes('rebuild')) {
    parts = searchParts('rebuild').slice(0, 6);
    response = `Found ${parts.length} transmission rebuild kits. The **Eaton K-3338** ($899.99) for RTLO-18913A 13-speed includes bearings, synchronizers, gaskets, and seals. Typical install time: 12-16 hours.`;
  } else if (q.includes('water pump')) {
    parts = searchParts('water pump').slice(0, 6);
    response = `Found ${parts.length} water pumps. The **Cummins 2871292** ($389.99) for ISX15 includes gasket set. Pro tip: Replace the thermostat at the same time — it's cheap insurance!`;
  } else if (q.includes('belt') || q.includes('serpentine') || q.includes('tensioner')) {
    parts = searchParts('belt').slice(0, 6);
    response = `Found ${parts.length} belts and tensioners. The **Gates 9380HD** ($45.99) is rated for 500K miles. Always replace the tensioner ($89.99) and idler pulley ($34.99) with the belt!`;
  } else if (q.includes('alternator')) {
    parts = searchParts('alternator').slice(0, 6);
    response = `Found ${parts.length} alternators. The **Delco 28SI 200A** ($279.99) puts out 200 amps at idle — critical for sleeper cabs with hotel loads.`;
  } else if (q.includes('starter')) {
    parts = searchParts('starter').slice(0, 6);
    response = `Found ${parts.length} starters. The **Delco 39MT** ($329.99) is rated for 10,000+ starts. Clicking noise = bad solenoid. Slow crank = worn brushes.`;
  } else if (q.includes('compressor') || q.includes('ac ') || q.includes('a/c')) {
    parts = searchParts('compressor').slice(0, 6);
    response = `Found ${parts.length} A/C compressors. The **Sanden SD7H15** ($289.99) is the go-to for most Class 8 trucks. Don't forget the seal kit ($24.99)!`;
  } else if (q.includes('tire')) {
    parts = searchParts('tire').slice(0, 6);
    response = `Found ${parts.length} tires. **Goodyear G670** ($489.99) for regional haul, **Michelin XZE2** ($525.99) for premium steer applications. SmartWay verified!`;
  } else if (q.includes('battery')) {
    parts = searchParts('battery').slice(0, 6);
    response = `Found ${parts.length} batteries. The **Deka Intimidator AGM** ($289.99) delivers 925 CCA with deep cycle capability. Replace both batteries together!`;
  } else if (q.includes('dpf') || q.includes('particulate')) {
    parts = searchParts('dpf').slice(0, 6);
    response = `Found ${parts.length} DPF filters. The **Fleetguard FS53015** ($1,249.99) is CARB-verified for Cummins ISX 2013+. Cleaning interval: 250K-300K miles.`;
  } else if (q.includes('fuel filter') || q.includes('fuel water')) {
    parts = searchParts('fuel filter').slice(0, 6);
    response = `Found ${parts.length} fuel filters. The **Fleetguard FF5767** ($32.99) has 4-micron NanoNet media with water separation. Replace every 15K miles.`;
  } else if (q.includes('engine oil') || q.includes('motor oil')) {
    parts = searchParts('Rotella').slice(0, 6);
    response = `Found ${parts.length} engine oils. **Shell Rotella T6 5W-40** ($28.99/gal) is our top seller — full synthetic, CK-4 rated. ISX15 holds 44 quarts total.`;
  } else if (q.includes('radiator')) {
    parts = searchParts('radiator').slice(0, 6);
    response = `Found ${parts.length} radiators. The **Valeo ISX Radiator** ($789.99) features aluminum core with plastic tanks. Don't forget a new radiator cap ($9.99)!`;
  } else if (q.includes('slack adjuster')) {
    parts = searchParts('slack adjuster').slice(0, 6);
    response = `Found ${parts.length} slack adjusters. The **Bendix 801266** ($67.99) has a 5.5" arm. Torque to 25 lb-ft during install. Check: If pushrod moves more than 0.5", replace it.`;
  } else if (q.includes('brake shoe')) {
    parts = searchParts('brake shoe').slice(0, 6);
    response = `Found ${parts.length} brake shoe kits. The **Meritor 4707Q** ($124.99) includes 2 shoes with 7" wide lining. Minimum DOT lining: 1/4".`;
  } else if (q.includes('coolant')) {
    parts = searchParts('coolant').slice(0, 6);
    response = `Found ${parts.length} coolants. **Shell Rotella ELC** ($89.99) is 50/50 prediluted with 600K mile life. Check pH (8-11) and freeze point (-34°F).`;
  } else if (q.includes('light') || q.includes('headlight') || q.includes('led')) {
    parts = searchParts('LED').slice(0, 6);
    response = `Found ${parts.length} lighting products. **Grote LED Headlight** ($129.99) — 3200 lumens, 50,000-hour life, DOT approved.`;
  } else {
    parts = searchParts(q).slice(0, 6);
    if (parts.length > 0) {
      response = `Found ${parts.length} parts matching "${query}". All parts are HERO Verified with real-time stock availability.`;
    } else {
      response = `I searched the entire Vault but didn't find exact matches for "${query}". Try searching by part number, brand (Cummins, Eaton, Bendix), or category (oil filter, brake chamber, clutch, etc.). I have over ${allPartsFlat.length} parts across 11 categories!`;
    }
  }
  return { response, parts };
}

export default function AISearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const result = aiSearch(userMsg.content);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        parts: result.parts,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  const suggestions = [
    'Oil filter for Cummins ISX15',
    'Brake chamber T-30/30',
    'Transmission rebuild kit',
    'A/C compressor',
    'Clutch kit 15.5 inch',
    'Water pump ISX15',
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-24 z-40 w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/70 backdrop-blur-md">
      <div className="bg-[#0F172A] border border-white/10 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Parts Hero AI Search</h3>
              <p className="text-xs text-gray-500">{allPartsFlat.length} parts in the Vault</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">What parts do you need?</h4>
              <p className="text-sm text-gray-500 mb-6">Ask me anything — part numbers, brands, categories, or describe what you're fixing.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map(s => (
                  <button key={s} onClick={() => { setInput(s); }}
                    className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs hover:bg-purple-500/20 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-purple-500/30' : 'bg-gradient-to-br from-purple-500 to-indigo-600'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-purple-300" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] space-y-3`}>
                <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-purple-500/15 text-purple-200 border border-purple-500/20'
                    : 'bg-white/5 text-gray-300 border border-white/10'
                }`}>
                  {msg.content}
                </div>
                {msg.parts && msg.parts.length > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {msg.parts.map(part => (
                      <div key={part.partNumber} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3 hover:border-cyan-500/30 transition-all">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                          <Wrench className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-white truncate">{part.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono">{part.partNumber} • {part.brand}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold text-cyan-400">${part.price.toFixed(2)}</div>
                          <div className="text-[10px] text-emerald-400">{part.stockQty} in stock</div>
                        </div>
                        <button
                          onClick={() => { addToCart({...part, id: part.partNumber, stockQuantity: part.stockQty, inStock: part.inStock}); }}
                          className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-[10px] hover:bg-cyan-500/30 transition-all flex-shrink-0"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/5">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Search parts by name, number, brand, or category..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-400/50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-11 h-11 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isTyping ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Send className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
