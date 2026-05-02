import { Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { CartProvider } from '@/contexts/CartContext';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Search from '@/pages/Search';
import Garage from '@/pages/Garage';
import Vault from '@/pages/Vault';
import Academy from '@/pages/Academy';
import News from '@/pages/News';
import Promos from '@/pages/Promos';
import Deliveries from '@/pages/Deliveries';
import Tree from '@/pages/Tree';
import Tags from '@/pages/Tags';
import About from '@/pages/About';
import Chat from '@/pages/Chat';
import { useAuth } from '@/contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Routes>
            {/* Public landing page - NO sidebar layout */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />

            {/* App pages WITH sidebar layout */}
            <Route element={<Layout />}>
              <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="garage" element={<ProtectedRoute><Garage /></ProtectedRoute>} />
              <Route path="vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
              <Route path="academy" element={<ProtectedRoute><Academy /></ProtectedRoute>} />
              <Route path="news" element={<ProtectedRoute><News /></ProtectedRoute>} />
              <Route path="promos" element={<ProtectedRoute><Promos /></ProtectedRoute>} />
              <Route path="deliveries" element={<ProtectedRoute><Deliveries /></ProtectedRoute>} />
              <Route path="tree" element={<ProtectedRoute><Tree /></ProtectedRoute>} />
              <Route path="tags" element={<ProtectedRoute><Tags /></ProtectedRoute>} />
              <Route path="chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            </Route>
          </Routes>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
