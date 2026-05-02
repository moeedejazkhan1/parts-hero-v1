import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserRole, User } from '@/types';
import { getCustomerType } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string, role: UserRole) => {
    // Special handling for Jordan from RWC Px
    const isJordan = email.toLowerCase().includes('jordan') || email.toLowerCase().includes('rwcpx');
    
    let name: string;
    let shopName: string;
    let location: string;

    if (isJordan) {
      name = 'Jordan';
      shopName = 'RWC Px';
      location = 'Phoenix, AZ';
    } else {
      const localPart = email.split('@')[0];
      name = localPart.charAt(0).toUpperCase() + localPart.slice(1);
      shopName = "Tom's Diesel Repair";
      location = 'Phoenix, AZ';
    }

    setUser({
      id: '1',
      name,
      email,
      role,
      shopName,
      location,
      avatar: isJordan ? undefined : undefined,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}