import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard, Search, Truck, GraduationCap, Newspaper,
  Tag, MapPin, Database, GitBranch, Menu, X, LogOut, MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/chat', label: 'AI Chat', icon: MessageSquare },
  { path: '/garage', label: 'Garage', icon: Truck },
  { path: '/vault', label: 'Vault', icon: Database },
  { path: '/academy', label: 'Academy', icon: GraduationCap },
  { path: '/news', label: 'News', icon: Newspaper },
  { path: '/promos', label: 'Promos', icon: Tag },
  { path: '/deliveries', label: 'Deliveries', icon: MapPin },
];

const adminItems = [
  { path: '/tree', label: 'Learning Tree', icon: GitBranch },
  { path: '/tags', label: 'Meta Tags', icon: Tag },
];

export default function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'Admin' || user?.role === 'Manufacturer';
  const allItems = isAdmin ? [...navItems, ...adminItems] : navItems;

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-[72px] bg-[#0A0F1C]/80 backdrop-blur-xl border-r border-white/5 z-40">
        <div className="flex items-center justify-center h-16 border-b border-white/5">
          <div className="text-[10px] font-bold leading-tight text-center">
            <span className="text-white">P</span><span className="text-cyan-400">H</span>
          </div>
        </div>
        <nav className="flex-1 flex flex-col items-center gap-1 py-3">
          {allItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-14 h-[52px] rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 shadow-[0_0_16px_rgba(0,217,255,0.15)]'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span className="text-[9px] mt-0.5 font-medium leading-tight text-center px-0.5">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col items-center gap-2 py-3 border-t border-white/5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
            {user?.name?.[0] || 'U'}
          </div>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center w-14 h-10 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0A0F1C]/90 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-4">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="text-sm font-bold">
          <span className="text-white">PARTS</span><span className="text-cyan-400">HERO</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
          {user?.name?.[0] || 'U'}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-14 bg-[#0A0F1C]/95 backdrop-blur-xl z-30 p-6">
          <nav className="flex flex-col gap-1">
            {allItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => { handleLogout(); setMobileOpen(false); }}
            className="flex items-center gap-3 px-4 py-3 mt-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </>
  );
}
