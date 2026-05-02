import { Outlet, useLocation } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import Navigation from '@/components/Navigation';
import WireframeBackground from '@/components/WireframeBackground';
import AIChat from '@/components/AIChat';
import CJGuide from '@/components/CJGuide';
import CartDrawer from '@/components/CartDrawer';
import AISearch from '@/components/AISearch';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Layout() {
  const { isAuthenticated } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="relative min-h-screen bg-[#0A0F1C] text-white">
      <WireframeBackground />
      {isAuthenticated && <Navigation />}
      <main className={`relative z-10 ${isAuthenticated ? 'lg:ml-[72px] pt-14 lg:pt-0' : ''} min-h-screen`}>
        <Outlet />
      </main>

      {!isLogin && (
        <>
          <AIChat />
          <CJGuide />
          <CartDrawer />
          <AISearch />

          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg shadow-emerald-500/20 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">{totalItems}</span>
            )}
          </button>
        </>
      )}
    </div>
  );
}
