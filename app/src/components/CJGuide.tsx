import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Search, Truck, ShoppingCart, MapPin, GraduationCap, MessageCircle } from 'lucide-react';

const guideSteps = [
  {
    title: 'Welcome to Parts Hero!',
    message: "Hey partner! I'm CJ — your guide through the Parts Hero Command Center. This platform is built to make finding heavy-duty truck parts faster, smarter, and easier than ever. Let me show you around!",
    icon: Sparkles,
    highlight: null,
  },
  {
    title: 'Command Center Dashboard',
    message: "This is your Mission Control. See your fleet status, active deliveries, weather alerts, and industry news all in one place. The live ticker at the top keeps you updated on recalls, DOT blitzes, and promos.",
    icon: Sparkles,
    highlight: 'dashboard',
  },
  {
    title: 'Interactive Parts Search',
    message: "Click on the truck skeleton to explore parts by system — Engine, Transmission, Brakes, and more. Enter a VIN to auto-decode your truck. Every part is HERO Verified with real specs, pricing, and cross-references.",
    icon: Search,
    highlight: 'search',
  },
  {
    title: 'Your Fleet / The Garage',
    message: "Manage all your trucks here. Click any truck to drill down into its specific parts — engine components, brake system, electrical, and more. Build custom parts lists per vehicle. Every truck is your property.",
    icon: Truck,
    highlight: 'garage',
  },
  {
    title: 'Build Sheet & Cart',
    message: "Add parts to your build sheet as you browse. One-click copy formats parts for Karmak, Procede, Oracle, CDK, or DSI. When ready, generate a professional PDF build sheet to share with your parts counter or customer.",
    icon: ShoppingCart,
    highlight: 'cart',
  },
  {
    title: 'Delivery Hero',
    message: "Track deliveries in real-time on our map — white-labeled, no third-party branding. Schedule pickups between dealers and shops. Cost breakdown shows the Uber base + Hero markup transparently.",
    icon: MapPin,
    highlight: 'deliveries',
  },
  {
    title: 'The Academy & AI Chat',
    message: "Train your team with certification modules — VIN decoding, brake systems, transmission rebuilds. And whenever you need help, click the AI chat bubble in the corner. I know 40+ real parts with specs, prices, and cross-references. Ask me anything!",
    icon: GraduationCap,
    highlight: 'academy',
  },
];

export default function CJGuide() {
  const [showGuide, setShowGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('partshero_guide_seen');
    if (!hasSeenGuide) {
      setTimeout(() => setShowGuide(true), 500);
    }
  }, []);

  const handleDismiss = () => {
    setShowGuide(false);
    setDismissed(true);
    localStorage.setItem('partshero_guide_seen', 'true');
  };

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleDismiss();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  if (!showGuide) {
    if (dismissed) return null;
    // Floating help button
    return (
      <button
        onClick={() => setShowGuide(true)}
        className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg shadow-amber-500/20 flex items-center justify-center hover:scale-110 transition-transform group"
      >
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="absolute right-14 bg-[#0F172A] border border-white/10 px-2 py-1 rounded-lg text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          CJ Guide
        </span>
      </button>
    );
  }

  const step = guideSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        {/* Close */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step indicator */}
        <div className="flex gap-1.5 mb-4">
          {guideSteps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === currentStep ? 'w-6 bg-cyan-400' : i < currentStep ? 'w-2 bg-cyan-400/50' : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* CJ Avatar */}
        <div className="flex items-center gap-3 mb-4">
          <img src="/cj-waving.png" alt="CJ" className="w-14 h-14 object-contain" />
          <div>
            <h3 className="text-base font-bold text-white">{step.title}</h3>
            <span className="text-[10px] text-amber-400">Step {currentStep + 1} of {guideSteps.length}</span>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-400 leading-relaxed mb-6">{step.message}</p>

        {/* Highlight badge */}
        {step.highlight && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <Icon className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-cyan-400 capitalize">{step.highlight} section</span>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleDismiss}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Skip tour
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium hover:brightness-110 transition-all"
          >
            {currentStep === guideSteps.length - 1 ? 'Get Started' : 'Next'}
            {currentStep < guideSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
