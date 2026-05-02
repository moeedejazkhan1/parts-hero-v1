import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import type { UserRole } from '@/types';

interface RoleGroup {
  label: string;
  color: string;
  roles: UserRole[];
}

const roleGroups: RoleGroup[] = [
  {
    label: 'Part Manufacturer',
    color: 'text-purple-400',
    roles: [
      'Part Manufacturer - Sales',
      'Part Manufacturer - Data Management',
      'Parts Manufacturer - Marketing and Promotions Manager',
    ],
  },
  {
    label: 'Dealer',
    color: 'text-amber-400',
    roles: [
      'Dealer - Inside Sales',
      'Dealer - Outside Sales',
      'Dealer - Tech',
      'Dealer - Parts Manager',
      'Dealer - Service Manager',
      'Dealer - GM',
    ],
  },
  {
    label: 'Installer',
    color: 'text-emerald-400',
    roles: [
      'Installer - In Shop',
      'Installer - Mobile',
      'Installer - Fleet',
      'Installer - Owner Operator',
    ],
  },
];

// Flat list for quick lookup


// Role preview descriptions
function getRolePreview(role: UserRole): string {
  const previews: Record<UserRole, string> = {
    'Part Manufacturer - Sales': 'Vault + Product Catalog + Order Management + Analytics',
    'Part Manufacturer - Data Management': 'Vault + Data Quality + Content Management + API Access',
    'Parts Manufacturer - Marketing and Promotions Manager': 'Vault + Promotions + Campaigns + Partner Analytics',
    'Dealer - Inside Sales': 'Part Search + Quotes + Orders + Customer Management',
    'Dealer - Outside Sales': 'Part Search + Fleet Garage + Mobile Quotes + Territory Map',
    'Dealer - Tech': 'Part Search + Academy + Repair Guides + Diagnostic Tools',
    'Dealer - Parts Manager': 'Inventory + Vendor Vault + Procurement + Stock Alerts',
    'Dealer - Service Manager': 'Fleet Garage + Work Orders + Tech Schedules + Parts Requests',
    'Dealer - GM': 'Full Dashboard + Reports + P&L + Team Performance + Promotions',
    'Installer - In Shop': 'Part Search + Garage + Repair History + Invoicing',
    'Installer - Mobile': 'Part Search + Mobile Dispatch + GPS + Quick Order',
    'Installer - Fleet': 'Fleet Garage + Bulk Ordering + PM Schedules + DOT Compliance',
    'Installer - Owner Operator': 'Part Search + Garage + Savings Tracker + Rewards',
  };
  return previews[role] || 'Command Center Access';
}

export default function Login() {
  const [email, setEmail] = useState('jordan@rwcpx.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('Installer - In Shop');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    login(email, password, role);
    showToast('Welcome back, partner!', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo + CJ Avatar */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold tracking-tight">
                <span className="text-white">PARTS</span>
                <span className="text-cyan-400">HERO</span>
              </div>
            </div>
            <img
              src="/cj-avatar.png"
              alt="CJ"
              className="w-16 h-16 object-contain drop-shadow-lg"
            />
          </div>

          <h1 className="text-xl font-bold text-white text-center mb-1">
            Welcome to the Parts Hero Partner Platform
          </h1>
          <p className="text-sm text-gray-400 text-center mb-6">
            Sign in to your Command Center
          </p>

          {/* Email */}
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 outline-none transition-all"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Role Selector - Grouped Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-white/20 transition-all"
              >
                <span className={role ? 'text-white' : 'text-gray-500'}>
                  {role || 'Select Role'}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    showRoleDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showRoleDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#0F172A] border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl max-h-[360px] overflow-y-auto">
                  {roleGroups.map((group) => (
                    <div key={group.label}>
                      {/* Group Header */}
                      <div
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${group.color} bg-white/5`}
                      >
                        {group.label}
                      </div>
                      {/* Group Roles */}
                      {group.roles.map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            setRole(r);
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left hover:bg-white/5 transition-colors ${
                            role === r
                              ? 'text-cyan-400 bg-cyan-500/10'
                              : 'text-gray-300'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Role preview */}
            <div className="text-xs text-gray-500 font-mono bg-white/5 rounded-lg px-3 py-2">
              <span className="text-gray-400">Access level:</span>{' '}
              <span className="text-cyan-400">{role}</span>
              <span className="text-gray-600 mx-1">|</span>
              {getRolePreview(role)}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-xl hover:brightness-110 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] transition-all"
            >
              Enter Command Center
            </button>
            <button
              onClick={() => setShowRequestModal(true)}
              className="w-full border border-white/20 text-white font-medium py-3 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all"
            >
              Request Access
            </button>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs font-mono text-gray-600 mt-6">
          Powered by Orca Labs
        </p>
      </div>

      {/* Request Access Modal */}
      {showRequestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowRequestModal(false)}
        >
          <div
            className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-white mb-4">
              Join the Hero Network
            </h2>
            <div className="space-y-3">
              <input
                placeholder="Full Name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400/50 outline-none"
              />
              <input
                placeholder="Company Name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400/50 outline-none"
              />
              <input
                placeholder="Email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400/50 outline-none"
              />
              {/* Grouped role select for request modal */}
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none">
                <option value="" disabled selected>
                  Select your role...
                </option>
                <optgroup label="Part Manufacturer">
                  <option>Part Manufacturer - Sales</option>
                  <option>Part Manufacturer - Data Management</option>
                  <option>
                    Parts Manufacturer - Marketing and Promotions Manager
                  </option>
                </optgroup>
                <optgroup label="Dealer">
                  <option>Dealer - Inside Sales</option>
                  <option>Dealer - Outside Sales</option>
                  <option>Dealer - Tech</option>
                  <option>Dealer - Parts Manager</option>
                  <option>Dealer - Service Manager</option>
                  <option>Dealer - GM</option>
                </optgroup>
                <optgroup label="Installer">
                  <option>Installer - In Shop</option>
                  <option>Installer - Mobile</option>
                  <option>Installer - Fleet</option>
                  <option>Installer - Owner Operator</option>
                </optgroup>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  showToast(
                    'Request submitted! We will contact you shortly.',
                    'success'
                  );
                }}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2.5 rounded-xl hover:brightness-110 transition-all"
              >
                Submit Request
              </button>
              <button
                onClick={() => setShowRequestModal(false)}
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