import { Link, useLocation } from 'react-router';
import { useState} from 'react';
import {
  LayoutDashboard, Search, MessageSquare,
  Truck, Database, Tag, GraduationCap, Newspaper, Settings, LogOut,
  ChevronDown, Star, Sun, Moon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const mainNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Command Center', path: '/dashboard' },
  { icon: Search, label: 'Part Search', path: '/search' },
  { icon: MessageSquare, label: 'Chat / AI', path: '/chat' },
];

const dataNav: NavItem[] = [
  { icon: Truck, label: 'Garage / Fleets', path: '/garage' },
  { icon: Database, label: 'Vendor Vault', path: '/vault' },
  { icon: Tag, label: 'Promos & Deals', path: '/promos' },
  { icon: GraduationCap, label: 'Academy', path: '/academy' },
  { icon: Newspaper, label: 'Newsroom', path: '/news' },
];

export default function Navigation() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const isLight = theme === 'light';

  const navLinkClass = (path: string) => {
    const active = location.pathname === path;
    return `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
      active
        ? isLight
          ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
          : 'bg-white/10 text-white border border-white/10'
        : isLight
          ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`;
  };

  const iconClass = (path: string) => {
    const active = location.pathname === path;
    return active
      ? isLight ? 'text-blue-600' : 'text-cyan-400'
      : isLight ? 'text-gray-400 group-hover:text-gray-600' : 'text-gray-500 group-hover:text-gray-300';
  };

  return (
    <>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg ${isLight ? 'bg-white text-gray-800 shadow-lg border border-gray-200' : 'bg-white/10 text-white backdrop-blur-md border border-white/10'}`}
      >
        {expanded ? <span className="text-sm font-bold">✕</span> : <span className="text-sm font-bold">☰</span>}
      </button>

      <nav
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 border-r ${
          isLight
            ? 'bg-white border-gray-200 shadow-xl'
            : 'bg-[#0B1121]/95 backdrop-blur-xl border-white/10'
        } ${expanded ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-16 lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className={`p-5 border-b ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-white" />
            </div>
            {expanded && (
              <div>
                <div className={`text-sm font-bold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  <span className={isLight ? 'text-blue-600' : 'text-cyan-400'}>PARTS</span>HERO
                </div>
                <div className={`text-[10px] font-mono ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>COMMAND CENTER</div>
              </div>
            )}
          </Link>
        </div>

        {/* Main nav */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {mainNav.map(item => (
            <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
              <item.icon className={`w-[18px] h-[18px] ${iconClass(item.path)}`} />
              {expanded && <span className="flex-1 truncate">{item.label}</span>}
            </Link>
          ))}

          {expanded && (
            <div className={`pt-4 mt-4 border-t ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
              <div className={`px-3 mb-2 text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>
                Data & Intel
              </div>
            </div>
          )}

          {dataNav.map(item => (
            <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
              <item.icon className={`w-[18px] h-[18px] ${iconClass(item.path)}`} />
              {expanded && <span className="flex-1 truncate">{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Bottom section */}
        <div className={`p-3 border-t ${isLight ? 'border-gray-100' : 'border-white/10'} space-y-2`}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isLight ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {isLight ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
            {expanded && <span>{isLight ? 'Dark Mode' : 'Light Mode'}</span>}
          </button>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-xl transition-all ${isLight ? 'hover:bg-gray-100' : 'hover:bg-white/5'}`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img src="/avatar-jordan.png" alt="" className="w-full h-full object-cover" />
              </div>
              {expanded && (
                <div className="min-w-0 text-left flex-1">
                  <div className={`text-xs font-semibold truncate ${isLight ? 'text-gray-800' : 'text-white'}`}>
                    {user?.name || 'Jordan'}
                  </div>
                  <div className={`text-[10px] truncate ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user?.shopName || 'RWC Phoenix'}
                  </div>
                </div>
              )}
              {expanded && <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 ${isLight ? 'text-gray-400' : 'text-gray-600'}`} />}
            </button>

            {profileOpen && (
              <div className={`absolute bottom-full left-0 right-0 mb-2 p-2 rounded-xl border shadow-lg z-50 ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0F172A] border-white/10'
              }`}>
                <Link to="/settings" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  isLight ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-white/10'
                }`}>
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <button
                  onClick={logout}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    isLight ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-500/10'
                  }`}
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}