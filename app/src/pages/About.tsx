import { useState } from 'react';
import { Database, Cpu, Globe, Send, Brain, FileSearch, Search } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function About() {
  const [showContactForm, setShowContactForm] = useState(false);
  const { showToast } = useToast();

  return (
    <div className="relative">
      {/* Hero with particles */}
      <div className="relative py-20 px-4 lg:px-6 overflow-hidden">
        {/* Particle canvas effect with CSS */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`line-${i}`}
              className="absolute bg-cyan-400/10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${50 + Math.random() * 100}px`,
                height: '1px',
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            The Brain Behind the Hero
          </h1>
          <p className="text-xl text-gray-400">
            Orca Labs: Proprietary Intelligence for Heavy Truck
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 pb-12 space-y-12">
        {/* Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Database, title: 'The Vault', desc: '65+ vendors. One source of truth. Every part, every spec, every cross-reference — unified.' },
            { icon: Cpu, title: 'OrKa Engine', desc: 'Sub-200ms intelligence. Zero hallucinations. Our proprietary engine delivers verified answers at speed.' },
            { icon: Globe, title: 'The Network', desc: 'Manufacturers + Dealers + Shops. United. A single ecosystem where data flows both ways.' },
          ].map(pillar => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Tech Stack Tease */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-white text-center mb-6">Powered By</h3>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: Brain, label: 'Vertex AI' },
              { icon: FileSearch, label: 'Document AI' },
              { icon: Search, label: 'Vector Search' },
            ].map(tech => {
              const Icon = tech.icon;
              return (
                <div key={tech.label} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <span className="text-xs text-gray-400">{tech.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CJ's Vision Quote */}
        <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border-l-4 border-cyan-400 rounded-r-2xl p-8">
          <blockquote className="text-xl lg:text-2xl text-white italic leading-relaxed">
            "We didn't build a parts catalog. We built a bridge between the technical and the shop floor."
          </blockquote>
          <div className="mt-4 flex items-center gap-3">
            <img src="/cj-waving.png" alt="CJ" className="w-10 h-10 object-contain" />
            <div>
              <div className="text-sm text-gray-300 font-medium">CJ</div>
              <div className="text-xs text-gray-500">Founder, Parts Hero by Orca Labs</div>
            </div>
          </div>
        </div>

        {/* Partner CTA */}
        <div className="text-center space-y-4">
          <button
            onClick={() => setShowContactForm(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold px-8 py-4 rounded-xl hover:brightness-110 hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-lg"
          >
            Join the Hero Network
          </button>
          <p className="text-sm text-gray-500">Partner with Orca Labs. Transform your parts business.</p>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-xs font-mono text-gray-600">
            &copy; 2026 Parts Hero by Orca Labs. All intelligence proprietary.
          </p>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowContactForm(false)}>
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">Join the Hero Network</h2>
            <div className="space-y-3">
              <input placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50" />
              <input placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50" />
              <input placeholder="Shop / Company" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none" />
              <textarea placeholder="Message" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50 resize-none" />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowContactForm(false); showToast('Message sent! Welcome to the network.', 'success'); }}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2.5 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
              <button
                onClick={() => setShowContactForm(false)}
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
