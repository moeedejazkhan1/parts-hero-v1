import { useEffect } from 'react';
import { Outlet } from 'react-router';
import Navigation from '@/components/Navigation';
import { useTheme } from '@/contexts/ThemeContext';

export default function Layout() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    document.body.style.backgroundColor = isLight ? '#F8F9FA' : '#0A0F1C';
    document.body.style.color = isLight ? '#1A1D29' : '#FFFFFF';
  }, [isLight]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isLight ? 'bg-[#F8F9FA]' : 'bg-[#0A0F1C]'}`}>
      <Navigation />
      <main className="lg:ml-64 min-h-screen transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
