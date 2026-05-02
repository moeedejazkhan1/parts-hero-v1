import { X, Minus, Plus, Trash2, Wrench, FileText, Copy, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { useState } from 'react';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyForDMS = () => {
    const lines = items.map(i => `${i.quantity}x ${i.partNumber} - ${i.name} ($${i.price.toFixed(2)})`);
    const text = `PARTS HERO BUILD SHEET\n${new Date().toLocaleDateString()}\n\n${lines.join('\n')}\n\nTotal: $${totalPrice.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Copied for Karmak/Procede/CDK/DSI', 'success');
  };

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      )}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#0F172A] border-l border-white/10 z-50 transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Build Sheet</h2>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-medium">{totalItems} items</span>
            )}
          </div>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-col h-[calc(100%-140px)] overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <Wrench className="w-12 h-12 text-gray-700 mb-3" />
              <p className="text-gray-500 text-sm">Your build sheet is empty</p>
              <p className="text-gray-600 text-xs mt-1">Browse parts and add them here</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id + (item.truckId || '')} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{item.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{item.partNumber}</div>
                    <div className="text-xs text-cyan-400 font-medium mt-0.5">${item.price.toFixed(2)}</div>
                    {item.truckId && <div className="text-[10px] text-gray-600 mt-0.5">For truck: {item.truckId}</div>}
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-400 transition-colors p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm text-white w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-sm font-medium text-white">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0F172A] border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Total</span>
              <span className="text-lg font-bold text-cyan-400 font-mono">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={copyForDMS} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition-all">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy for DMS'}
              </button>
              <button onClick={() => showToast('PDF Build Sheet generated!', 'success')} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-medium hover:brightness-110 transition-all">
                <FileText className="w-3.5 h-3.5" /> Generate PDF
              </button>
            </div>
            <button onClick={clearCart} className="w-full mt-2 py-2 text-[10px] text-gray-600 hover:text-gray-400 transition-colors">Clear Build Sheet</button>
          </div>
        )}
      </div>
    </>
  );
}
