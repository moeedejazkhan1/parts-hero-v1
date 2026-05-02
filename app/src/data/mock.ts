import type { Truck, Vendor, NewsArticle, Promotion, AcademyModule, CategoryNode, TagItem, Delivery, PartResult } from '@/types';

export const mockUser = {
  id: '1',
  name: 'Jordan',
  email: 'jordan@tomsdiesel.com',
  role: 'Shop Technician' as const,
  shopName: "Tom's Diesel Repair",
  location: 'Phoenix, AZ',
};

export const fleet: Truck[] = [
  { id: '1', photo: '/truck-freightliner.jpg', year: 2019, make: 'Freightliner', model: 'Cascadia', color: 'White', vin: '1FUJGLDR55LX12345', status: 'Active', tags: ['#Freightliner', '#Cummins', '#Phoenix'], engine: 'Cummins ISX15', transmission: 'Eaton Fuller 10-speed', lastService: '2025-03-15' },
  { id: '2', photo: '/truck-international.jpg', year: 2018, make: 'International', model: 'LT Series', color: 'Red', vin: '3HSCUAPR8JN567890', status: 'In Service', tags: ['#International', '#Navistar', '#Phoenix'], engine: 'Navistar N13', transmission: 'Allison 4500', lastService: '2025-04-01' },
  { id: '3', photo: '/truck-peterbilt.jpg', year: 2020, make: 'Peterbilt', model: '579', color: 'Blue', vin: '1XPHD49X2LD987654', status: 'Needs Parts', tags: ['#Peterbilt', '#PACCAR', '#Phoenix'], engine: 'PACCAR MX-13', transmission: 'Eaton Fuller 13-speed', lastService: '2025-02-20' },
  { id: '4', photo: '/truck-kenworth.jpg', year: 2017, make: 'Kenworth', model: 'T680', color: 'Silver', vin: '1XKYDP9X2HJ456789', status: 'Active', tags: ['#Kenworth', '#Cummins', '#Phoenix'], engine: 'Cummins ISX12', transmission: 'Eaton Fuller 10-speed', lastService: '2025-03-28' },
  { id: '5', photo: '/truck-volvo.jpg', year: 2021, make: 'Volvo', model: 'VNL', color: 'Black', vin: '4V4NC9TH8NN123987', status: 'Active', tags: ['#Volvo', '#VolvoEngine', '#Phoenix'], engine: 'Volvo D13', transmission: 'I-Shift', lastService: '2025-04-10' },
  { id: '6', photo: '/truck-freightliner.jpg', year: 2016, make: 'Freightliner', model: 'Coronado', color: 'White', vin: '1FUJHCDB85LX45612', status: 'Needs Parts', tags: ['#Freightliner', '#Detroit', '#Phoenix'], engine: 'Detroit DD15', transmission: 'Eaton Fuller 10-speed', lastService: '2025-01-15' },
  { id: '7', photo: '/truck-international.jpg', year: 2022, make: 'International', model: 'HV Series', color: 'Red', vin: '3HSCUAPR9KN741258', status: 'Active', tags: ['#International', '#Navistar', '#Phoenix'], engine: 'Navistar A26', transmission: 'Allison 4000', lastService: '2025-04-18' },
  { id: '8', photo: '/truck-peterbilt.jpg', year: 2019, make: 'Peterbilt', model: '389', color: 'Blue', vin: '1XPHD49X3MD852963', status: 'In Service', tags: ['#Peterbilt', '#Cummins', '#Phoenix'], engine: 'Cummins X15', transmission: 'Eaton Fuller 18-speed', lastService: '2025-03-05' },
  { id: '9', photo: '/truck-kenworth.jpg', year: 2015, make: 'Kenworth', model: 'W900', color: 'Silver', vin: '1XKYDP9X3IK159753', status: 'Needs Parts', tags: ['#Kenworth', '#Caterpillar', '#Phoenix'], engine: 'Caterpillar C15', transmission: 'Eaton Fuller 13-speed', lastService: '2025-02-10' },
  { id: '10', photo: '/truck-volvo.jpg', year: 2020, make: 'Volvo', model: 'VNL 860', color: 'Black', vin: '4V4NC9TH9ON456321', status: 'Active', tags: ['#Volvo', '#VolvoEngine', '#Phoenix'], engine: 'Volvo D13TC', transmission: 'I-Shift Dual Clutch', lastService: '2025-04-12' },
  { id: '11', photo: '/truck-freightliner.jpg', year: 2017, make: 'Freightliner', model: 'M2 106', color: 'White', vin: '1FUJGLDR66MX78945', status: 'Active', tags: ['#Freightliner', '#Cummins', '#Phoenix'], engine: 'Cummins B6.7', transmission: 'Allison 2500', lastService: '2025-03-22' },
  { id: '12', photo: '/truck-international.jpg', year: 2021, make: 'International', model: 'MV Series', color: 'Red', vin: '3HSCUAPR0LN852741', status: 'In Service', tags: ['#International', '#Navistar', '#Phoenix'], engine: 'Navistar N9', transmission: 'Allison 3000', lastService: '2025-04-05' },
];

const vendorGradients = [
  'from-cyan-600 to-blue-700',
  'from-emerald-600 to-teal-700',
  'from-amber-600 to-orange-700',
  'from-purple-600 to-indigo-700',
  'from-rose-600 to-pink-700',
  'from-sky-600 to-cyan-700',
  'from-lime-600 to-green-700',
  'from-violet-600 to-purple-700',
  'from-fuchsia-600 to-pink-700',
  'from-teal-600 to-emerald-700',
];

// Featured vendors with real logos and partnership data
export const featuredVendors: Vendor[] = [
  { id: 'v1', name: 'Cummins', initials: 'CU', partCount: 12500, healthScore: 96, gradient: 'from-red-600 to-red-800', missingWeight: 12, missingDimensions: 8, missingCrossRef: 5, logo: '/vendors/cummins.png', tagline: 'Global power leader — engines, filtration & turbo technologies', location: 'Columbus, IN', partnershipSince: '2019', ordersThisMonth: 47, revenueYTD: '$284K', topCategory: 'Engine', rating: 4.9, responseTime: '< 2 hrs', contact: 'partner@cummins.com' },
  { id: 'v2', name: 'Eaton', initials: 'ET', partCount: 8400, healthScore: 94, gradient: 'from-blue-600 to-blue-800', missingWeight: 18, missingDimensions: 14, missingCrossRef: 9, logo: '/vendors/eaton.png', tagline: 'Intelligent power management solutions for commercial vehicles', location: 'Dublin, Ireland', partnershipSince: '2019', ordersThisMonth: 38, revenueYTD: '$196K', topCategory: 'Transmission', rating: 4.8, responseTime: '< 4 hrs', contact: 'fleet@eaton.com' },
  { id: 'v3', name: 'Bendix', initials: 'BE', partCount: 6200, healthScore: 93, gradient: 'from-cyan-600 to-sky-700', missingWeight: 22, missingDimensions: 16, missingCrossRef: 11, logo: '/vendors/bendix.png', tagline: 'Leading supplier of brake systems, air management & safety tech', location: 'Elyria, OH', partnershipSince: '2020', ordersThisMonth: 52, revenueYTD: '$312K', topCategory: 'Brake System', rating: 4.9, responseTime: '< 2 hrs', contact: 'commercial@bendix.com' },
  { id: 'v4', name: 'Fleetguard', initials: 'FG', partCount: 9800, healthScore: 95, gradient: 'from-red-500 to-rose-700', missingWeight: 15, missingDimensions: 10, missingCrossRef: 6, logo: '/vendors/fleetguard.png', tagline: 'Cummins Filtration — fuel, lube, air & hydraulic filtration', location: 'Nashville, TN', partnershipSince: '2019', ordersThisMonth: 61, revenueYTD: '$245K', topCategory: 'Filtration', rating: 4.8, responseTime: '< 3 hrs', contact: 'sales@fleetguard.com' },
  { id: 'v5', name: 'Meritor', initials: 'MR', partCount: 7600, healthScore: 91, gradient: 'from-red-700 to-red-900', missingWeight: 28, missingDimensions: 20, missingCrossRef: 14, logo: '/vendors/meritor.png', tagline: 'Axle, brake & drivetrain components for commercial vehicles', location: 'Troy, MI', partnershipSince: '2020', ordersThisMonth: 33, revenueYTD: '$178K', topCategory: 'Drivetrain', rating: 4.7, responseTime: '< 6 hrs', contact: 'cv@meritor.com' },
  { id: 'v6', name: 'Bosch', initials: 'BO', partCount: 11200, healthScore: 97, gradient: 'from-red-500 to-red-700', missingWeight: 8, missingDimensions: 6, missingCrossRef: 4, logo: '/vendors/bosch.png', tagline: 'Invented for life — automotive parts, diagnostics & systems', location: 'Stuttgart, Germany', partnershipSince: '2018', ordersThisMonth: 44, revenueYTD: '$267K', topCategory: 'Electrical', rating: 4.9, responseTime: '< 2 hrs', contact: 'diesel@bosch.com' },
  { id: 'v7', name: 'Michelin', initials: 'MI', partCount: 4500, healthScore: 92, gradient: 'from-blue-500 to-blue-700', missingWeight: 32, missingDimensions: 18, missingCrossRef: 22, logo: '/vendors/michelin.png', tagline: 'Sustainable mobility — tires & solutions for freight transport', location: 'Clermont-Ferrand, France', partnershipSince: '2021', ordersThisMonth: 29, revenueYTD: '$156K', topCategory: 'Tires', rating: 4.8, responseTime: '< 4 hrs', contact: 'truck@michelin.com' },
  { id: 'v8', name: 'Goodyear', initials: 'GY', partCount: 5200, healthScore: 90, gradient: 'from-blue-600 to-indigo-700', missingWeight: 35, missingDimensions: 22, missingCrossRef: 18, logo: '/vendors/goodyear.png', tagline: 'Commercial tire systems — trusted by fleets worldwide', location: 'Akron, OH', partnershipSince: '2021', ordersThisMonth: 31, revenueYTD: '$142K', topCategory: 'Tires', rating: 4.6, responseTime: '< 8 hrs', contact: 'fleet@goodyear.com' },
  { id: 'v9', name: 'Shell Lubricants', initials: 'SL', partCount: 3800, healthScore: 94, gradient: 'from-yellow-500 to-amber-600', missingWeight: 14, missingDimensions: 9, missingCrossRef: 7, logo: '/vendors/shell.png', tagline: 'Shell Rotella — heavy-duty engine oils & lubricants', location: 'Houston, TX', partnershipSince: '2020', ordersThisMonth: 56, revenueYTD: '$198K', topCategory: 'Lubricants', rating: 4.8, responseTime: '< 3 hrs', contact: 'b2b@shell.com' },
  { id: 'v10', name: 'WABCO', initials: 'WB', partCount: 5800, healthScore: 89, gradient: 'from-sky-500 to-blue-600', missingWeight: 38, missingDimensions: 24, missingCrossRef: 16, logo: '/vendors/wabco.png', tagline: 'Commercial vehicle safety & efficiency technologies', location: 'Brussels, Belgium', partnershipSince: '2021', ordersThisMonth: 22, revenueYTD: '$124K', topCategory: 'Brake System', rating: 4.5, responseTime: '< 12 hrs', contact: 'cv@wabco.com' },
  { id: 'v11', name: 'Detroit Diesel', initials: 'DD', partCount: 8900, healthScore: 93, gradient: 'from-gray-500 to-gray-700', missingWeight: 20, missingDimensions: 15, missingCrossRef: 10, logo: '/vendors/detroit-diesel.png', tagline: 'Premium engines, axles & transmissions for Freightliner', location: 'Detroit, MI', partnershipSince: '2019', ordersThisMonth: 41, revenueYTD: '$223K', topCategory: 'Engine', rating: 4.8, responseTime: '< 4 hrs', contact: 'parts@demanddetroit.com' },
  { id: 'v12', name: 'PACCAR Parts', initials: 'PC', partCount: 10200, healthScore: 95, gradient: 'from-blue-700 to-blue-900', missingWeight: 16, missingDimensions: 11, missingCrossRef: 8, logo: '/vendors/paccar.png', tagline: 'Genuine parts for Kenworth, Peterbilt & DAF trucks', location: 'Bellevue, WA', partnershipSince: '2018', ordersThisMonth: 49, revenueYTD: '$289K', topCategory: 'OEM', rating: 4.9, responseTime: '< 2 hrs', contact: 'parts@paccar.com' },
  { id: 'v13', name: 'Gates', initials: 'GA', partCount: 4100, healthScore: 88, gradient: 'from-red-600 to-red-800', missingWeight: 42, missingDimensions: 28, missingCrossRef: 20, logo: '/vendors/gates.png', tagline: 'Power transmission belts, hoses & hydraulics', location: 'Denver, CO', partnershipSince: '2022', ordersThisMonth: 18, revenueYTD: '$89K', topCategory: 'Belts & Hoses', rating: 4.5, responseTime: '< 8 hrs', contact: 'heavy.duty@gates.com' },
  { id: 'v14', name: 'SKF', initials: 'SK', partCount: 3600, healthScore: 91, gradient: 'from-blue-500 to-cyan-600', missingWeight: 30, missingDimensions: 19, missingCrossRef: 15, logo: '/vendors/skf.png', tagline: 'Bearings, seals, lubrication & condition monitoring', location: 'Gothenburg, Sweden', partnershipSince: '2020', ordersThisMonth: 25, revenueYTD: '$134K', topCategory: 'Bearings', rating: 4.7, responseTime: '< 6 hrs', contact: 'cv@skf.com' },
  { id: 'v15', name: 'Donaldson', initials: 'DO', partCount: 5500, healthScore: 90, gradient: 'from-sky-400 to-blue-500', missingWeight: 34, missingDimensions: 21, missingCrossRef: 17, logo: '/vendors/donaldson.png', tagline: 'Filtration solutions for diesel engines & industrial equipment', location: 'Bloomington, MN', partnershipSince: '2021', ordersThisMonth: 27, revenueYTD: '$112K', topCategory: 'Filtration', rating: 4.6, responseTime: '< 6 hrs', contact: 'fleet@donaldson.com' },
  { id: 'v16', name: 'Continental', initials: 'CO', partCount: 6800, healthScore: 92, gradient: 'from-orange-500 to-amber-600', missingWeight: 26, missingDimensions: 17, missingCrossRef: 12, logo: '/vendors/continental.png', tagline: 'Tires, automotive electronics & contitech solutions', location: 'Hanover, Germany', partnershipSince: '2020', ordersThisMonth: 35, revenueYTD: '$167K', topCategory: 'Electrical', rating: 4.7, responseTime: '< 4 hrs', contact: 'cv@continental.com' },
  { id: 'v17', name: 'Mobil Delvac', initials: 'MD', partCount: 3200, healthScore: 93, gradient: 'from-red-500 to-blue-600', missingWeight: 18, missingDimensions: 12, missingCrossRef: 9, logo: '/vendors/mobil-delvac.png', tagline: 'Premium heavy-duty diesel engine oils & lubricants', location: 'Spring, TX', partnershipSince: '2021', ordersThisMonth: 42, revenueYTD: '$145K', topCategory: 'Lubricants', rating: 4.7, responseTime: '< 4 hrs', contact: 'delvac@exxonmobil.com' },
];

// Legacy vendor list for compatibility
const vendorNames = [
  'RWC Group', 'Cummins', 'Eaton', 'Detroit Diesel', 'PACCAR Parts',
  'Bendix', 'Meritor', 'WABCO', 'Shell Lubricants', 'Fleetguard',
  'Bosch', 'Delphi', 'Continental', 'Goodyear', 'Michelin',
  'Bridgestone', 'Haldex', 'SAP', 'SKF', 'Gates',
  'Dayco', 'TRW', 'Mann+Hummel', 'Donaldson', 'Parker',
  'Freightliner Custom Chassis', 'Volvo Trucks', 'Mack Trucks', 'Navistar', 'Kenworth',
  'Peterbilt', 'Western Star', 'Isuzu', 'Hino', 'Fuso',
  'Chevron', 'Valvoline', 'Castrol', 'Mobil Delvac', 'Rotella',
  'Phillips 66', 'Prestone', 'Peak', 'Grote', 'Truck-Lite',
  'Peterson Manufacturing', 'Optronics', 'Maxxima', 'Code 3', 'Whelen',
  'Hella', 'Osram', 'Koito', 'Varroc', 'Magneti Marelli',
  'Valeo', 'Denso', 'NGK', 'Federal-Mogul', 'Mahle',
  'Schaeffler', 'ContiTech', 'Hutchinson', 'Trelleborg', 'Pirelli',
];

export const vendors: Vendor[] = vendorNames.map((name, i) => {
  const featured = featuredVendors.find(v => v.name === name);
  if (featured) return featured;
  return {
    id: `v${i}`,
    name,
    initials: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    partCount: Math.floor(Math.random() * 8000) + 500,
    healthScore: Math.floor(Math.random() * 30) + 70,
    gradient: vendorGradients[i % vendorGradients.length],
    missingWeight: Math.floor(Math.random() * 200),
    missingDimensions: Math.floor(Math.random() * 150),
    missingCrossRef: Math.floor(Math.random() * 100),
  };
});

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    headline: 'Arizona DOT Announces Brake Inspection Blitz: May 14',
    source: 'Fleet Equipment Magazine',
    date: '2025-04-20',
    image: '/truck-freightliner.jpg',
    tags: ['#Brakes', '#Phoenix', '#Regulation'],
    relevance: 3,
    content: 'The Arizona Department of Transportation has announced a statewide brake inspection blitz beginning May 14. Fleets are advised to pre-inspect brake chambers, slack adjusters, and air lines. Over 40% of roadside violations last year were brake-related.',
    urgent: true,
  },
  {
    id: '2',
    headline: 'Cummins Unveils Next-Gen X15 Efficiency Package',
    source: 'Diesel Progress',
    date: '2025-04-18',
    image: '/truck-peterbilt.jpg',
    tags: ['#Engine', '#Cummins', '#Powertrain'],
    relevance: 2,
    content: 'Cummins has released details on the 2026 X15 Efficiency Package, promising up to 3% fuel savings through optimized piston design and improved turbocharger efficiency.',
  },
  {
    id: '3',
    headline: 'Phoenix Heat Wave: AC Compressor Demand Up 40%',
    source: 'Transport Topics',
    date: '2025-04-15',
    image: '/truck-volvo.jpg',
    tags: ['#AC', '#Phoenix', '#Weather', '#HotWeather'],
    relevance: 4,
    content: 'With temperatures exceeding 108°F this week, shops across Phoenix are reporting a 40% spike in AC compressor and condenser demand. Experts recommend stocking Sanden and Carrier components.',
  },
  {
    id: '4',
    headline: 'Eaton Expands Transmission Reman Network to Southwest',
    source: 'Heavy Duty Trucking',
    date: '2025-04-12',
    image: '/truck-international.jpg',
    tags: ['#Transmission', '#Eaton', '#Reman'],
    relevance: 1,
    content: 'Eaton has added three new remanufacturing facilities in Arizona and New Mexico, reducing lead times for Fuller transmission overhauls from 10 days to 4 days.',
  },
  {
    id: '5',
    headline: 'FMCSA Updates Hours of Service Guidance for 2025',
    source: 'Commercial Carrier Journal',
    date: '2025-04-10',
    image: '/truck-kenworth.jpg',
    tags: ['#Regulation', '#FMCSA', '#Fleet'],
    relevance: 2,
    content: 'New HOS guidance clarifies sleeper berth provisions and adverse driving condition exceptions. Fleet managers should review ELD configuration requirements.',
  },
  {
    id: '6',
    headline: 'RWC Group Launches Summer Oil Promo: Buy 4 Get Filter Kit Free',
    source: 'Parts & People',
    date: '2025-04-08',
    image: '/truck-peterbilt.jpg',
    tags: ['#Oil', '#RWC', '#Promotion', '#Engine'],
    relevance: 3,
    content: 'RWC Group is offering a summer promotion on Shell Rotella T6 and Fleetguard filters. Buy 4 gallons of oil and receive a complimentary filter kit.',
  },
  {
    id: '7',
    headline: 'Freightliner Issues Service Bulletin for Cascadia Air Dryer',
    source: 'Fleet Maintenance',
    date: '2025-04-05',
    image: '/truck-freightliner.jpg',
    tags: ['#Freightliner', '#AirSystem', '#Brakes'],
    relevance: 1,
    content: 'A service bulletin has been issued for 2019-2021 Cascadia models regarding potential air dryer cartridge contamination. Dealers are advised to inspect units during routine PMs.',
  },
  {
    id: '8',
    headline: 'Agricultural Sector Sees 15% Increase in Class 8 Registrations',
    source: 'Overdrive',
    date: '2025-04-02',
    image: '/truck-international.jpg',
    tags: ['#Agriculture', '#Market', '#Fleet'],
    relevance: 0,
    content: 'The agricultural sector has driven a 15% year-over-year increase in Class 8 truck registrations in the Southwest region, according to ACT Research data.',
  },
];

export const promotions: Promotion[] = [
  {
    id: '1',
    title: 'RWC Summer Oil Change Bundle',
    description: 'Buy 4 gallons, get filter kit free. Valid for Shell Rotella T6 and Fleetguard LF9009.',
    vendor: 'RWC Group',
    vendorInitials: 'RW',
    vendorGradient: 'from-cyan-600 to-blue-700',
    image: '/truck-peterbilt.jpg',
    tags: ['#Cummins', '#Engine', '#Oil', '#Phoenix', '#HotWeather'],
    relevanceScore: 98,
    expiryDays: 3,
    claimed: false,
  },
  {
    id: '2',
    title: 'Cummins ISX Overhaul Kit Special',
    description: 'Complete in-frame overhaul kit with pistons, liners, bearings, and gasket set.',
    vendor: 'Cummins',
    vendorInitials: 'CU',
    vendorGradient: 'from-red-600 to-rose-700',
    image: '/truck-freightliner.jpg',
    tags: ['#Cummins', '#Engine', '#Powertrain', '#Phoenix'],
    relevanceScore: 92,
    expiryDays: 7,
    claimed: false,
  },
  {
    id: '3',
    title: 'Eaton Fuller Transmission Rebuild Kit',
    description: 'Master rebuild kit for 10-speed transmissions. Includes synchronizers, bearings, and gaskets.',
    vendor: 'Eaton',
    vendorInitials: 'ET',
    vendorGradient: 'from-purple-600 to-indigo-700',
    image: '/truck-kenworth.jpg',
    tags: ['#Eaton', '#Transmission', '#Powertrain'],
    relevanceScore: 85,
    expiryDays: 5,
    claimed: true,
  },
  {
    id: '4',
    title: 'Bendix Brake Chamber Blowout Sale',
    description: 'Type 30/30 brake chambers at clearance pricing. While supplies last.',
    vendor: 'Bendix',
    vendorInitials: 'BE',
    vendorGradient: 'from-amber-600 to-orange-700',
    image: '/truck-international.jpg',
    tags: ['#Bendix', '#Brakes', '#Chassis', '#Phoenix'],
    relevanceScore: 88,
    expiryDays: 2,
    claimed: false,
  },
  {
    id: '5',
    title: 'Freightliner AC Compressor Kit — Hot Weather Special',
    description: 'Sanden SD7H15 compressor kit with clutch, seals, and refrigerant oil.',
    vendor: 'PACCAR Parts',
    vendorInitials: 'PA',
    vendorGradient: 'from-sky-600 to-cyan-700',
    image: '/truck-volvo.jpg',
    tags: ['#PACCAR', '#AC', '#HotWeather', '#Phoenix'],
    relevanceScore: 95,
    expiryDays: 4,
    claimed: false,
  },
  {
    id: '6',
    title: 'Meritor Differential Bearing Kit',
    description: 'Complete bearing and seal kit for RT-40-145 and RT-46-160 differentials.',
    vendor: 'Meritor',
    vendorInitials: 'ME',
    vendorGradient: 'from-emerald-600 to-teal-700',
    image: '/truck-freightliner.jpg',
    tags: ['#Meritor', '#Differential', '#Powertrain'],
    relevanceScore: 76,
    expiryDays: 10,
    claimed: false,
  },
];

export const academyModules: AcademyModule[] = [
  { id: '1', title: 'VIN Decoding Mastery', description: 'Learn to decode any commercial truck VIN to extract year, make, model, engine, and factory specs.', progress: 80, totalLessons: 10, completedLessons: 8, icon: 'Search', certified: false },
  { id: '2', title: 'The Learning Tree — Category Intelligence', description: 'Navigate the 16 major category branches and understand how components relate.', progress: 40, totalLessons: 12, completedLessons: 5, icon: 'GitBranch', certified: false },
  { id: '3', title: 'All-Makes Selling', description: 'Techniques for selling parts across Freightliner, International, Peterbilt, and more.', progress: 0, totalLessons: 8, completedLessons: 0, icon: 'Truck', certified: false },
  { id: '4', title: 'Build Sheet Generation', description: 'Create professional build sheets with part lists, kit suggestions, and verified sources.', progress: 0, totalLessons: 6, completedLessons: 0, icon: 'FileText', certified: false },
  { id: '5', title: 'Brake System Deep Dive', description: 'Master air brake systems, ABS, brake chambers, slack adjusters, and compliance.', progress: 0, totalLessons: 14, completedLessons: 0, icon: 'CircleDot', certified: false },
  { id: '6', title: 'Engine External Components', description: 'Belts, tensioners, pulleys, alternators, starters, and cooling system parts.', progress: 0, totalLessons: 10, completedLessons: 0, icon: 'Cog', certified: false },
];

export const learningTree: CategoryNode[] = [
  {
    id: 'cat1', name: '1. AIR SYSTEM', level: 1, icon: 'Wind', active: true,
    description: 'Air brake system components including compressors, dryers, lines, and chambers.',
    tags: ['#Bendix', '#WABCO', '#Haldex'],
    children: [
      { id: 'cat1-1', name: 'Air Compressor', level: 2, icon: 'Wind', active: true, children: [
        { id: 'cat1-1-1', name: 'Compressor Kits', level: 3, icon: 'Wind', active: true },
        { id: 'cat1-1-2', name: 'Governor', level: 3, icon: 'Wind', active: true },
      ]},
      { id: 'cat1-2', name: 'Air Dryer', level: 2, icon: 'Wind', active: true, children: [
        { id: 'cat1-2-1', name: 'Cartridges', level: 3, icon: 'Wind', active: true },
        { id: 'cat1-2-2', name: 'Valves', level: 3, icon: 'Wind', active: true },
      ]},
      { id: 'cat1-3', name: 'Brake Chambers', level: 2, icon: 'Wind', active: true },
    ],
  },
  {
    id: 'cat2', name: '2. BRAKE SYSTEM', level: 1, icon: 'CircleDot', active: true,
    description: 'Foundation brakes, drums, rotors, pads, linings, and ABS components.',
    tags: ['#Bendix', '#Meritor', '#WABCO'],
    children: [
      { id: 'cat2-1', name: 'Foundation Brakes', level: 2, icon: 'CircleDot', active: true, children: [
        { id: 'cat2-1-1', name: 'Brake Shoes', level: 3, icon: 'CircleDot', active: true },
        { id: 'cat2-1-2', name: 'Brake Drums', level: 3, icon: 'CircleDot', active: true },
      ]},
      { id: 'cat2-2', name: 'ABS', level: 2, icon: 'CircleDot', active: true },
      { id: 'cat2-3', name: 'Slack Adjusters', level: 2, icon: 'CircleDot', active: true },
    ],
  },
  {
    id: 'cat3', name: '3. POWERTRAIN', level: 1, icon: 'Cog', active: true,
    description: 'Engine, transmission, differential, driveshaft, and axle components.',
    tags: ['#Cummins', '#Eaton', '#Detroit', '#Meritor'],
    children: [
      { id: 'cat3-1', name: 'Engine – External', level: 2, icon: 'Cog', active: true, children: [
        { id: 'cat3-1-1', name: 'Belts & Tensioners', level: 3, icon: 'Cog', active: true },
        { id: 'cat3-1-2', name: 'Alternators', level: 3, icon: 'Cog', active: true },
        { id: 'cat3-1-3', name: 'Starters', level: 3, icon: 'Cog', active: true },
      ]},
      { id: 'cat3-2', name: 'Engine – Internal', level: 2, icon: 'Cog', active: true, children: [
        { id: 'cat3-2-1', name: 'Pistons & Liners', level: 3, icon: 'Cog', active: true },
        { id: 'cat3-2-2', name: 'Bearings', level: 3, icon: 'Cog', active: true },
      ]},
      { id: 'cat3-3', name: 'Transmission', level: 2, icon: 'Cog', active: true, children: [
        { id: 'cat3-3-1', name: 'Rebuild Kits', level: 3, icon: 'Cog', active: true },
        { id: 'cat3-3-2', name: 'Shifters', level: 3, icon: 'Cog', active: true },
      ]},
      { id: 'cat3-4', name: 'Differential', level: 2, icon: 'Cog', active: true },
      { id: 'cat3-5', name: 'Driveshaft', level: 2, icon: 'Cog', active: true },
    ],
  },
  {
    id: 'cat4', name: '4. CHASSIS', level: 1, icon: 'Truck', active: true,
    description: 'Frame, suspension, steering, and fifth wheel components.',
    tags: ['#Freightliner', '#Hendrickson', '#TRW'],
    children: [
      { id: 'cat4-1', name: 'Suspension', level: 2, icon: 'Truck', active: true },
      { id: 'cat4-2', name: 'Steering', level: 2, icon: 'Truck', active: true },
    ],
  },
  {
    id: 'cat5', name: '5. ELECTRICAL', level: 1, icon: 'Zap', active: true,
    description: 'Batteries, alternators, starters, wiring, sensors, and lighting.',
    tags: ['#Bosch', '#Delphi', '#Grote'],
    children: [
      { id: 'cat5-1', name: 'Batteries', level: 2, icon: 'Zap', active: true },
      { id: 'cat5-2', name: 'Lighting', level: 2, icon: 'Zap', active: true },
      { id: 'cat5-3', name: 'Sensors', level: 2, icon: 'Zap', active: true },
    ],
  },
  {
    id: 'cat6', name: '6. COOLING SYSTEM', level: 1, icon: 'Droplets', active: true,
    description: 'Radiators, charge air coolers, water pumps, thermostats, and hoses.',
    tags: ['#Fleetguard', '#BorgWarner', '#Dayco'],
    children: [
      { id: 'cat6-1', name: 'Radiator', level: 2, icon: 'Droplets', active: true },
      { id: 'cat6-2', name: 'Water Pump', level: 2, icon: 'Droplets', active: true },
    ],
  },
  {
    id: 'cat7', name: '7. HVAC', level: 1, icon: 'Thermometer', active: true,
    description: 'Heating, ventilation, and air conditioning components.',
    tags: ['#Sanden', '#Carrier', '#HotWeather'],
    children: [
      { id: 'cat7-1', name: 'Compressor', level: 2, icon: 'Thermometer', active: true },
      { id: 'cat7-2', name: 'Condenser', level: 2, icon: 'Thermometer', active: true },
    ],
  },
  {
    id: 'cat8', name: '8. FUEL SYSTEM', level: 1, icon: 'Fuel', active: true,
    description: 'Fuel injection, pumps, filters, tanks, and lines.',
    tags: ['#Bosch', '#Delphi', '#Fleetguard'],
    children: [
      { id: 'cat8-1', name: 'Injection Pump', level: 2, icon: 'Fuel', active: true },
      { id: 'cat8-2', name: 'Fuel Filters', level: 2, icon: 'Fuel', active: true },
    ],
  },
  {
    id: 'cat9', name: '9. EXHAUST', level: 1, icon: 'Wind', active: true,
    description: 'Aftertreatment, DPF, SCR, DOC, mufflers, and pipes.',
    tags: ['#Fleetguard', '#Donaldson'],
    children: [
      { id: 'cat9-1', name: 'DPF', level: 2, icon: 'Wind', active: true },
      { id: 'cat9-2', name: 'SCR', level: 2, icon: 'Wind', active: true },
    ],
  },
  {
    id: 'cat10', name: '10. CAB & BODY', level: 1, icon: 'Square', active: true,
    description: 'Cab interior, exterior panels, mirrors, bumpers, and hood.',
    tags: ['#Freightliner', '#PACCAR'],
    children: [
      { id: 'cat10-1', name: 'Mirrors', level: 2, icon: 'Square', active: true },
      { id: 'cat10-2', name: 'Bumpers', level: 2, icon: 'Square', active: true },
    ],
  },
  {
    id: 'cat11', name: '11. TIRES & WHEELS', level: 1, icon: 'Circle', active: true,
    description: 'Tires, rims, wheel seals, bearings, and lug nuts.',
    tags: ['#Goodyear', '#Michelin', '#Bridgestone'],
    children: [
      { id: 'cat11-1', name: 'Drive Tires', level: 2, icon: 'Circle', active: true },
      { id: 'cat11-2', name: 'Steer Tires', level: 2, icon: 'Circle', active: true },
    ],
  },
  {
    id: 'cat12', name: '12. LUBRICANTS', level: 1, icon: 'Droplet', active: true,
    description: 'Engine oil, transmission fluid, coolant, grease, and additives.',
    tags: ['#Shell', '#Valvoline', '#Mobil'],
    children: [
      { id: 'cat12-1', name: 'Engine Oil', level: 2, icon: 'Droplet', active: true },
      { id: 'cat12-2', name: 'Transmission Fluid', level: 2, icon: 'Droplet', active: true },
    ],
  },
  {
    id: 'cat13', name: '13. FILTERS', level: 1, icon: 'Filter', active: true,
    description: 'Oil, fuel, air, hydraulic, and cabin filters.',
    tags: ['#Fleetguard', '#Mann', '#Donaldson'],
    children: [
      { id: 'cat13-1', name: 'Oil Filters', level: 2, icon: 'Filter', active: true },
      { id: 'cat13-2', name: 'Air Filters', level: 2, icon: 'Filter', active: true },
    ],
  },
  {
    id: 'cat14', name: '14. TOOLS & EQUIPMENT', level: 1, icon: 'Wrench', active: false,
    description: 'Shop tools, diagnostic equipment, and service supplies.',
    tags: ['#SnapOn', '#MacTools'],
    children: [
      { id: 'cat14-1', name: 'Diagnostic Scanners', level: 2, icon: 'Wrench', active: false },
      { id: 'cat14-2', name: 'Hand Tools', level: 2, icon: 'Wrench', active: false },
    ],
  },
  {
    id: 'cat15', name: '15. SAFETY & COMPLIANCE', level: 1, icon: 'Shield', active: true,
    description: 'Safety equipment, DOT compliance items, and emergency supplies.',
    tags: ['#DOT', '#Regulation'],
    children: [
      { id: 'cat15-1', name: 'Fire Extinguishers', level: 2, icon: 'Shield', active: true },
      { id: 'cat15-2', name: 'Reflective Tape', level: 2, icon: 'Shield', active: true },
    ],
  },
  {
    id: 'cat16', name: '16. ACCESSORIES', level: 1, icon: 'Package', active: false,
    description: 'Chrome, floor mats, seat covers, and custom accessories.',
    tags: ['#Chrome', '#Custom'],
    children: [
      { id: 'cat16-1', name: 'Chrome Trim', level: 2, icon: 'Package', active: false },
      { id: 'cat16-2', name: 'Interior', level: 2, icon: 'Package', active: false },
    ],
  },
];

export const tags: TagItem[] = [
  { id: 't1', name: 'Phoenix', type: 'location', count: 23, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 't2', name: 'Tucson', type: 'location', count: 8, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 't3', name: 'Dallas', type: 'location', count: 15, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 't4', name: 'RWC', type: 'vendor', count: 45, color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { id: 't5', name: 'Cummins', type: 'vendor', count: 32, color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { id: 't6', name: 'Eaton', type: 'vendor', count: 28, color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { id: 't7', name: 'Brake', type: 'part', count: 67, color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { id: 't8', name: 'Engine', type: 'part', count: 45, color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { id: 't9', name: 'Transmission', type: 'part', count: 33, color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { id: 't10', name: "Tom's Diesel", type: 'customer', count: 12, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 't11', name: 'Desert Fleet', type: 'customer', count: 8, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 't12', name: 'HotWeather', type: 'weather', count: 9, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 't13', name: 'Monsoon', type: 'weather', count: 3, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
];

export const deliveries: Delivery[] = [
  { id: 'd1', invoiceNumber: '4421', itemDescription: 'Eaton Fuller Filter Kit', from: 'RWC Group — Phoenix Distribution Center', to: "Tom's Diesel Repair — 4821 W Jefferson St", status: 'En Route', progress: 70, eta: '4 min', uberBase: 10.00, heroMarkup: 3.00, total: 13.00 },
  { id: 'd2', invoiceNumber: '4420', itemDescription: 'Cummins ISX Overhaul Gasket Set', from: 'Cummins Southwest — 3200 E Broadway Rd', to: "Tom's Diesel Repair — 4821 W Jefferson St", status: 'Picked Up', progress: 35, eta: '22 min', uberBase: 12.50, heroMarkup: 3.75, total: 16.25 },
  { id: 'd3', invoiceNumber: '4418', itemDescription: 'Bendix Air Dryer Cartridge (2x)', from: 'Bendix Direct — 1500 N 51st Ave', to: "Tom's Diesel Repair — 4821 W Jefferson St", status: 'Delivered', progress: 100, eta: 'Delivered', uberBase: 8.00, heroMarkup: 2.40, total: 10.40 },
];

export const partResults: PartResult[] = [
  { id: 'p1', partNumber: 'LF9009', partName: 'Fleetguard Oil Filter — Cummins ISX', source: 'Web', verified: true, dontForget: ['Gasket', 'O-Ring', 'Drain Plug Washer'] },
  { id: 'p2', partNumber: 'K-3338', partName: 'Eaton Fuller Transmission Rebuild Kit', source: 'Web', verified: true, dontForget: ['Synchronizer Ring', 'Bearing Set', 'Gasket Kit'] },
  { id: 'p3', partNumber: 'GC4594', partName: 'Bendix Type 30/30 Brake Chamber', source: 'Web', verified: false, dontForget: ['Clevis Pin', 'Cotter Pin', 'Dust Boot'] },
  { id: 'p4', partNumber: '23536438', partName: 'Detroit Diesel Fuel Injector — DD15', source: 'Web', verified: true, dontForget: ['Hold Down Clamp', 'Seal Washer', 'Return Line'] },
  { id: 'p5', partNumber: '4318275', partName: 'Cummins ISX15 Water Pump', source: 'Web', verified: true, dontForget: ['Gasket', 'O-Ring', 'Thermostat'] },
];

export const recentActivity = [
  { action: 'Searched: Eaton Transmission Filter', time: '2h ago' },
  { action: 'Added: 2019 Freightliner Cascadia to Fleet', time: 'Yesterday' },
  { action: 'Completed: VIN Decoding Mastery module', time: '3d ago' },
  { action: 'Claimed: RWC Summer Oil Change Bundle', time: '4d ago' },
  { action: 'Dispatched: Delivery #4418 to shop', time: '5d ago' },
];
