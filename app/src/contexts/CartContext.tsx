import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useToast } from './ToastContext';

export interface CartItem {
  id: string;
  partNumber: string;
  name: string;
  brand: string;
  price: number;
  msrp: number;
  description: string;
  specs: Record<string, string>;
  applications: string[];
  inStock: boolean;
  stockQuantity: number;
  weight: string;
  warranty: string;
  verified: boolean;
  quantity: number;
  truckId?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (part: Partial<CartItem> & { id: string; name: string; partNumber: string; price: number }, quantity?: number, truckId?: string) => void;
  removeFromCart: (partId: string) => void;
  updateQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();

  const addToCart = useCallback((part: Partial<CartItem> & { id: string; name: string; partNumber: string; price: number }, quantity = 1, truckId?: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === part.id && i.truckId === truckId);
      if (existing) {
        return prev.map(i => i.id === part.id && i.truckId === truckId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        id: part.id,
        partNumber: part.partNumber,
        name: part.name,
        brand: part.brand || '',
        price: part.price,
        msrp: part.msrp || part.price * 1.5,
        description: part.description || '',
        specs: part.specs || {},
        applications: part.applications || [],
        inStock: part.inStock ?? true,
        stockQuantity: part.stockQuantity || 0,
        weight: part.weight || '',
        warranty: part.warranty || '',
        verified: part.verified ?? true,
        quantity,
        truckId,
      }];
    });
    showToast(`${part.name} added to build sheet`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((partId: string) => {
    setItems(prev => prev.filter(i => i.id !== partId));
  }, []);

  const updateQuantity = useCallback((partId: string, quantity: number) => {
    if (quantity <= 0) { setItems(prev => prev.filter(i => i.id !== partId)); return; }
    setItems(prev => prev.map(i => i.id === partId ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => { setItems([]); showToast('Build sheet cleared', 'info'); }, [showToast]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
