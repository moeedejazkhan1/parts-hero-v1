// ---- Customer Type Roles (3 groups, 14 total) ----
export type ManufacturerRole =
  | 'Part Manufacturer - Sales'
  | 'Part Manufacturer - Data Management'
  | 'Parts Manufacturer - Marketing and Promotions Manager';

export type DealerRole =
  | 'Dealer - Inside Sales'
  | 'Dealer - Outside Sales'
  | 'Dealer - Tech'
  | 'Dealer - Parts Manager'
  | 'Dealer - Service Manager'
  | 'Dealer - GM';

export type InstallerRole =
  | 'Installer - In Shop'
  | 'Installer - Mobile'
  | 'Installer - Fleet'
  | 'Installer - Owner Operator';

export type UserRole = ManufacturerRole | DealerRole | InstallerRole;

// Helper to determine customer type from role
export type CustomerType = 'manufacturer' | 'dealer' | 'installer';

export function getCustomerType(role: UserRole): CustomerType {
  if (role.startsWith('Part') || role.startsWith('Parts')) return 'manufacturer';
  if (role.startsWith('Dealer')) return 'dealer';
  return 'installer';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  shopName: string;
  location: string;
  avatar?: string;
}

export interface Truck {
  id: string;
  photo: string;
  year: number;
  make: string;
  model: string;
  color: string;
  vin: string;
  status: 'Active' | 'In Service' | 'Needs Parts';
  tags: string[];
  engine: string;
  transmission: string;
  lastService: string;
}

export interface Vendor {
  id: string;
  name: string;
  initials: string;
  partCount: number;
  healthScore: number;
  gradient: string;
  missingWeight: number;
  missingDimensions: number;
  missingCrossRef: number;
  logo?: string;
  tagline?: string;
  location?: string;
  partnershipSince?: string;
  ordersThisMonth?: number;
  revenueYTD?: string;
  topCategory?: string;
  rating?: number;
  responseTime?: string;
  contact?: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  date: string;
  image: string;
  tags: string[];
  relevance: number;
  content: string;
  urgent?: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  vendor: string;
  vendorInitials: string;
  vendorGradient: string;
  image: string;
  tags: string[];
  relevanceScore: number;
  expiryDays: number;
  claimed: boolean;
}

export interface AcademyModule {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  icon: string;
  certified: boolean;
}

export interface CategoryNode {
  id: string;
  name: string;
  level: number;
  icon: string;
  children?: CategoryNode[];
  active: boolean;
  description?: string;
  tags?: string[];
  relatedModules?: string[];
}

export interface TagItem {
  id: string;
  name: string;
  type: 'location' | 'vendor' | 'part' | 'customer' | 'weather';
  count: number;
  color: string;
}

export interface Delivery {
  id: string;
  invoiceNumber: string;
  itemDescription: string;
  from: string;
  to: string;
  status: 'En Route' | 'Picked Up' | 'Delivered';
  progress: number;
  eta: string;
  uberBase: number;
  heroMarkup: number;
  total: number;
}

export interface BuildSheetItem {
  id: string;
  partNumber: string;
  partName: string;
  source: string;
  verified: boolean;
}

export interface SearchFilter {
  make?: string;
  year?: string;
  category?: string;
  subcategory?: string;
  component?: string;
}

export interface PartResult {
  id: string;
  partNumber: string;
  partName: string;
  source: string;
  verified: boolean;
  dontForget: string[];
}
