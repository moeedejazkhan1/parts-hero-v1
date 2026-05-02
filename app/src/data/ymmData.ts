export interface Manufacturer {
  name: string;
  logo: string;
  color: string;
  yearRanges: YearRange[];
}

export interface YearRange {
  label: string;
  start: number;
  end: number;
  models: TruckModel[];
}

export interface TruckModel {
  name: string;
  engines: string[];
  systems: SystemCategory[];
}

export interface SystemCategory {
  id: string;
  name: string;
  subcategories: string[];
  partCount: number;
}

// ============== STEP 1: Define common systems ==============
const commonSystems: SystemCategory[] = [
  {
    id: 'engine',
    name: 'Engine',
    subcategories: ['Engine Blocks', 'Cylinder Heads', 'Pistons & Rings', 'Gaskets', 'Camshafts', 'Timing Components'],
    partCount: 2847,
  },
  {
    id: 'fuel',
    name: 'Fuel System',
    subcategories: ['Injectors', 'Fuel Pumps', 'Fuel Filters', 'Transfer Pumps', 'Fuel Lines'],
    partCount: 1523,
  },
  {
    id: 'exhaust',
    name: 'Exhaust & DEF',
    subcategories: ['DPF', 'DOC', 'SCR Catalyst', 'DEF Pumps', 'Exhaust Manifolds', 'Aftertreatment Sensors'],
    partCount: 967,
  },
  {
    id: 'transmission',
    name: 'Transmission',
    subcategories: ['Gearboxes', 'Clutches', 'Flywheels', 'PTOs', 'Transmission Controls'],
    partCount: 1245,
  },
  {
    id: 'differential',
    name: 'Drivetrain',
    subcategories: ['Differentials', 'Drive Shafts', 'U-Joints', 'Axle Housings', 'Wheel Seals'],
    partCount: 892,
  },
  {
    id: 'brakes',
    name: 'Brakes',
    subcategories: ['Air Disc Brakes', 'Drum Brakes', 'Slack Adjusters', 'Air Compressors', 'ABS Modules'],
    partCount: 1456,
  },
  {
    id: 'suspension',
    name: 'Suspension',
    subcategories: ['Air Springs', 'Shock Absorbers', 'Leaf Springs', 'Torque Rods', 'U-Bolts'],
    partCount: 734,
  },
  {
    id: 'steering',
    name: 'Steering',
    subcategories: ['Steering Gears', 'Tie Rods', 'Power Steering Pumps', 'King Pins'],
    partCount: 521,
  },
  {
    id: 'electrical',
    name: 'Electrical',
    subcategories: ['Alternators', 'Starters', 'Batteries', 'Sensors', 'Wiring Harnesses', 'LED Lighting'],
    partCount: 2156,
  },
  {
    id: 'hvac',
    name: 'HVAC & Cooling',
    subcategories: ['Compressors', 'Condensers', 'Radiators', 'Thermostats', 'Heater Cores'],
    partCount: 678,
  },
  {
    id: 'cab',
    name: 'Cab Components',
    subcategories: ['Seats', 'Mirrors', 'Bumpers', 'Grilles', 'Hoods', 'Fenders'],
    partCount: 1823,
  },
  {
    id: 'fifth-wheel',
    name: 'Fifth Wheel & Coupling',
    subcategories: ['Fifth Wheels', 'King Pins', 'Slider Kits', 'Release Handles'],
    partCount: 234,
  },
];

// ============== STEP 2: Define manufacturer-specific system copies ==============
// MUST be defined BEFORE manufacturers array!

const peterbiltSystems = commonSystems.map(s => ({ ...s, partCount: Math.floor(s.partCount * 1.1) }));
const kenworthSystems = commonSystems.map(s => ({ ...s, partCount: Math.floor(s.partCount * 1.05) }));
const freightlinerSystems = commonSystems.map(s => ({ ...s, partCount: Math.floor(s.partCount * 1.15) }));
const internationalSystems = commonSystems.map(s => ({ ...s, partCount: Math.floor(s.partCount * 0.95) }));
const mackSystems = commonSystems.map(s => ({ ...s, partCount: Math.floor(s.partCount * 0.9) }));
const volvoSystems = commonSystems.map(s => ({ ...s, partCount: Math.floor(s.partCount * 1.0) }));
const westernStarSystems = commonSystems.map(s => ({ ...s, partCount: Math.floor(s.partCount * 0.8) }));
const fordSystems = commonSystems.map(s => ({ ...s, partCount: Math.floor(s.partCount * 0.85) }));
const chevySystems = commonSystems.map(s => ({ ...s, partCount: Math.floor(s.partCount * 0.75) }));
const ramSystems = commonSystems.map(s => ({ ...s, partCount: Math.floor(s.partCount * 0.7) }));

// ============== STEP 3: Define skeleton zone map ==============
export const skeletonZoneMap: Record<string, { name: string; categories: string[] }> = {
  'engine-hood': { name: 'Engine / Hood', categories: ['engine', 'fuel'] },
  'cab': { name: 'Cab', categories: ['cab', 'electrical', 'hvac'] },
  'exhaust-def': { name: 'Exhaust / DEF', categories: ['exhaust'] },
  'frame-chassis': { name: 'Frame / Chassis', categories: ['suspension', 'fifth-wheel'] },
  'front-axle': { name: 'Front Axle / Steering', categories: ['steering', 'brakes'] },
  'rear-axle': { name: 'Rear Axle / Drivetrain', categories: ['differential', 'transmission'] },
  'brakes': { name: 'Brakes', categories: ['brakes'] },
  'suspension': { name: 'Suspension', categories: ['suspension'] },
  'fifth-wheel': { name: 'Fifth Wheel / Coupling', categories: ['fifth-wheel'] },
  'fuel-tank': { name: 'Fuel Tank', categories: ['fuel'] },
  'electrical': { name: 'Electrical / Lights', categories: ['electrical'] },
  'cooling': { name: 'Cooling', categories: ['hvac'] },
};

// ============== STEP 4: Define manufacturers array LAST ==============
export const manufacturers: Manufacturer[] = [
  {
    name: 'Peterbilt',
    logo: '/logos/logo-peterbilt.jpg',
    color: '#C41E3A',
    yearRanges: [
      {
        label: '2020 – 2025',
        start: 2020,
        end: 2025,
        models: [
          { name: '579', engines: ['PACCAR MX-13', 'Cummins X15'], systems: peterbiltSystems },
          { name: '389', engines: ['Cummins X15', 'Detroit DD15'], systems: peterbiltSystems },
          { name: '567', engines: ['PACCAR MX-11', 'Cummins X12'], systems: peterbiltSystems },
        ],
      },
      {
        label: '2015 – 2019',
        start: 2015,
        end: 2019,
        models: [
          { name: '579', engines: ['PACCAR MX-13', 'Cummins ISX15'], systems: peterbiltSystems },
          { name: '389', engines: ['Cummins ISX15', 'Detroit DD15'], systems: peterbiltSystems },
          { name: '567', engines: ['PACCAR MX-13'], systems: peterbiltSystems },
        ],
      },
      {
        label: '2010 – 2014',
        start: 2010,
        end: 2014,
        models: [
          { name: '386', engines: ['Cummins ISX', 'Detroit DD15'], systems: peterbiltSystems },
          { name: '388', engines: ['Cummins ISX15'], systems: peterbiltSystems },
          { name: '384', engines: ['Cummins ISB', 'PACCAR PX-8'], systems: peterbiltSystems },
        ],
      },
    ],
  },
  {
    name: 'Kenworth',
    logo: '/logos/logo-kenworth.jpg',
    color: '#E31837',
    yearRanges: [
      {
        label: '2020 – 2025',
        start: 2020,
        end: 2025,
        models: [
          { name: 'T680', engines: ['PACCAR MX-13', 'Cummins X15'], systems: kenworthSystems },
          { name: 'W990', engines: ['Cummins X15', 'Detroit DD15'], systems: kenworthSystems },
          { name: 'T880', engines: ['PACCAR MX-13', 'Cummins X12'], systems: kenworthSystems },
        ],
      },
      {
        label: '2015 – 2019',
        start: 2015,
        end: 2019,
        models: [
          { name: 'T680', engines: ['PACCAR MX-13', 'Cummins ISX15'], systems: kenworthSystems },
          { name: 'T880', engines: ['PACCAR MX-13', 'Cummins ISX15'], systems: kenworthSystems },
          { name: 'W900', engines: ['Cummins ISX15'], systems: kenworthSystems },
        ],
      },
      {
        label: '2010 – 2014',
        start: 2010,
        end: 2014,
        models: [
          { name: 'T660', engines: ['Cummins ISX', 'Detroit DD15'], systems: kenworthSystems },
          { name: 'T700', engines: ['Cummins ISX15'], systems: kenworthSystems },
          { name: 'T370', engines: ['PACCAR PX-8', 'Cummins ISB'], systems: kenworthSystems },
        ],
      },
    ],
  },
  {
    name: 'Freightliner',
    logo: '/logos/logo-freightliner.jpg',
    color: '#A0A0A0',
    yearRanges: [
      {
        label: '2020 – 2025',
        start: 2020,
        end: 2025,
        models: [
          { name: 'Cascadia', engines: ['Detroit DD15', 'Cummins X15'], systems: freightlinerSystems },
          { name: 'M2 106', engines: ['Detroit DD8', 'Cummins B6.7'], systems: freightlinerSystems },
          { name: '122SD', engines: ['Detroit DD13', 'Cummins X12'], systems: freightlinerSystems },
        ],
      },
      {
        label: '2015 – 2019',
        start: 2015,
        end: 2019,
        models: [
          { name: 'Cascadia', engines: ['Detroit DD15', 'Cummins ISX15'], systems: freightlinerSystems },
          { name: 'M2 106', engines: ['Detroit DD8', 'Cummins ISB6.7'], systems: freightlinerSystems },
          { name: 'Coronado', engines: ['Detroit DD15', 'Cummins ISX15'], systems: freightlinerSystems },
        ],
      },
      {
        label: '2010 – 2014',
        start: 2010,
        end: 2014,
        models: [
          { name: 'Cascadia', engines: ['Detroit DD15', 'Cummins ISX15'], systems: freightlinerSystems },
          { name: 'M2 106', engines: ['Cummins ISB6.7', 'Mercedes MBE900'], systems: freightlinerSystems },
          { name: 'Coronado', engines: ['Detroit DD15'], systems: freightlinerSystems },
        ],
      },
    ],
  },
  {
    name: 'International',
    logo: '/logos/logo-international.jpg',
    color: '#0055A4',
    yearRanges: [
      {
        label: '2020 – 2025',
        start: 2020,
        end: 2025,
        models: [
          { name: 'LT Series', engines: ['Navistar A26', 'Cummins X15'], systems: internationalSystems },
          { name: 'RH Series', engines: ['Navistar A26', 'Cummins X15'], systems: internationalSystems },
          { name: 'HV Series', engines: ['Navistar A26', 'Cummins B6.7'], systems: internationalSystems },
        ],
      },
      {
        label: '2015 – 2019',
        start: 2015,
        end: 2019,
        models: [
          { name: 'ProStar', engines: ['Navistar N13', 'Cummins ISX15'], systems: internationalSystems },
          { name: 'Lonestar', engines: ['Navistar N13', 'Cummins ISX15'], systems: internationalSystems },
          { name: 'HV Series', engines: ['Navistar N9', 'Cummins ISB6.7'], systems: internationalSystems },
        ],
      },
      {
        label: '2010 – 2014',
        start: 2010,
        end: 2014,
        models: [
          { name: 'ProStar', engines: ['Navistar MaxxForce 13', 'Cummins ISX15'], systems: internationalSystems },
          { name: 'Lonestar', engines: ['Navistar MaxxForce 13', 'Cummins ISX15'], systems: internationalSystems },
          { name: 'TranStar', engines: ['Navistar MaxxForce 11', 'Cummins ISB'], systems: internationalSystems },
        ],
      },
    ],
  },
  {
    name: 'Mack',
    logo: '/logos/logo-mack.jpg',
    color: '#333333',
    yearRanges: [
      {
        label: '2020 – 2025',
        start: 2020,
        end: 2025,
        models: [
          { name: 'Anthem', engines: ['Mack MP8', 'Mack MP7'], systems: mackSystems },
          { name: 'Granite', engines: ['Mack MP8', 'Mack MP7'], systems: mackSystems },
          { name: 'Pinnacle', engines: ['Mack MP8'], systems: mackSystems },
        ],
      },
      {
        label: '2015 – 2019',
        start: 2015,
        end: 2019,
        models: [
          { name: 'Anthem', engines: ['Mack MP8', 'Mack MP7'], systems: mackSystems },
          { name: 'Granite', engines: ['Mack MP8', 'Mack MP7'], systems: mackSystems },
          { name: 'Pinnacle', engines: ['Mack MP8'], systems: mackSystems },
        ],
      },
      {
        label: '2010 – 2014',
        start: 2010,
        end: 2014,
        models: [
          { name: 'Pinnacle', engines: ['Mack MP8', 'Mack MP7'], systems: mackSystems },
          { name: 'Titan', engines: ['Mack MP10'], systems: mackSystems },
          { name: 'Granite', engines: ['Mack MP8', 'Mack MP7'], systems: mackSystems },
        ],
      },
    ],
  },
  {
    name: 'Volvo',
    logo: '/logos/logo-volvo.jpg',
    color: '#003B7E',
    yearRanges: [
      {
        label: '2020 – 2025',
        start: 2020,
        end: 2025,
        models: [
          { name: 'VNL 760', engines: ['Volvo D13', 'Volvo D11'], systems: volvoSystems },
          { name: 'VNL 860', engines: ['Volvo D13'], systems: volvoSystems },
          { name: 'VNR 640', engines: ['Volvo D11', 'Volvo D13'], systems: volvoSystems },
        ],
      },
      {
        label: '2015 – 2019',
        start: 2015,
        end: 2019,
        models: [
          { name: 'VNL 670', engines: ['Volvo D13', 'Volvo D11'], systems: volvoSystems },
          { name: 'VNL 780', engines: ['Volvo D13'], systems: volvoSystems },
          { name: 'VNM 200', engines: ['Volvo D11'], systems: volvoSystems },
        ],
      },
      {
        label: '2010 – 2014',
        start: 2010,
        end: 2014,
        models: [
          { name: 'VNL 670', engines: ['Volvo D13', 'Volvo D16'], systems: volvoSystems },
          { name: 'VNL 780', engines: ['Volvo D13', 'Volvo D16'], systems: volvoSystems },
          { name: 'VNM 430', engines: ['Volvo D11', 'Volvo D13'], systems: volvoSystems },
        ],
      },
    ],
  },
  {
    name: 'Western Star',
    logo: '/logos/logo-westernstar.jpg',
    color: '#8B0000',
    yearRanges: [
      {
        label: '2020 – 2025',
        start: 2020,
        end: 2025,
        models: [
          { name: '49X', engines: ['Detroit DD15', 'Cummins X15'], systems: westernStarSystems },
          { name: '47X', engines: ['Detroit DD13', 'Cummins X12'], systems: westernStarSystems },
          { name: '57X', engines: ['Detroit DD15', 'Cummins X15'], systems: westernStarSystems },
        ],
      },
      {
        label: '2015 – 2019',
        start: 2015,
        end: 2019,
        models: [
          { name: '5700XE', engines: ['Detroit DD15', 'Cummins ISX15'], systems: westernStarSystems },
          { name: '4900EX', engines: ['Detroit DD15', 'Cummins ISX15'], systems: westernStarSystems },
          { name: '4700SF', engines: ['Detroit DD13'], systems: westernStarSystems },
        ],
      },
      {
        label: '2010 – 2014',
        start: 2010,
        end: 2014,
        models: [
          { name: '4900EX', engines: ['Detroit DD15', 'Cummins ISX15'], systems: westernStarSystems },
          { name: '4800TS', engines: ['Detroit DD13'], systems: westernStarSystems },
          { name: '4700SF', engines: ['Detroit DD13'], systems: westernStarSystems },
        ],
      },
    ],
  },
  {
    name: 'Ford',
    logo: '/logos/logo-ford.jpg',
    color: '#003478',
    yearRanges: [
      {
        label: '2020 – 2025',
        start: 2020,
        end: 2025,
        models: [
          { name: 'F-650', engines: ['Ford 7.3L V8', 'Cummins B6.7'], systems: fordSystems },
          { name: 'F-750', engines: ['Cummins B6.7', 'Ford 7.3L V8'], systems: fordSystems },
          { name: 'F-600', engines: ['Ford 6.7L V8'], systems: fordSystems },
        ],
      },
      {
        label: '2015 – 2019',
        start: 2015,
        end: 2019,
        models: [
          { name: 'F-650', engines: ['Cummins ISB6.7', 'Ford 6.8L V10'], systems: fordSystems },
          { name: 'F-750', engines: ['Cummins ISB6.7'], systems: fordSystems },
          { name: 'F-550', engines: ['Ford 6.7L PowerStroke'], systems: fordSystems },
        ],
      },
      {
        label: '2010 – 2014',
        start: 2010,
        end: 2014,
        models: [
          { name: 'F-650', engines: ['Cummins ISB6.7', 'Ford 6.8L V10'], systems: fordSystems },
          { name: 'F-750', engines: ['Cummins ISB6.7'], systems: fordSystems },
          { name: 'F-550', engines: ['Ford 6.7L PowerStroke'], systems: fordSystems },
        ],
      },
    ],
  },
  {
    name: 'Chevrolet',
    logo: '/logos/logo-chevrolet.jpg',
    color: '#D19A2A',
    yearRanges: [
      {
        label: '2020 – 2025',
        start: 2020,
        end: 2025,
        models: [
          { name: 'Silverado 5500HD', engines: ['Duramax 6.6L V8', 'Cummins B6.7'], systems: chevySystems },
          { name: 'Silverado 6500HD', engines: ['Duramax 6.6L V8', 'Cummins B6.7'], systems: chevySystems },
          { name: 'Silverado 4500HD', engines: ['Duramax 6.6L V8'], systems: chevySystems },
        ],
      },
      {
        label: '2015 – 2019',
        start: 2015,
        end: 2019,
        models: [
          { name: 'Silverado 5500HD', engines: ['Duramax 6.6L V8', 'Cummins ISB6.7'], systems: chevySystems },
          { name: 'Silverado 6500HD', engines: ['Duramax 6.6L V8', 'Cummins ISB6.7'], systems: chevySystems },
          { name: 'Silverado 4500HD', engines: ['Duramax 6.6L V8'], systems: chevySystems },
        ],
      },
      {
        label: '2010 – 2014',
        start: 2010,
        end: 2014,
        models: [
          { name: 'Silverado 3500HD', engines: ['Duramax 6.6L V8'], systems: chevySystems },
          { name: 'Kodiak C5500', engines: ['Duramax 6.6L V8'], systems: chevySystems },
          { name: 'TopKick C6500', engines: ['Duramax 6.6L V8'], systems: chevySystems },
        ],
      },
    ],
  },
  {
    name: 'Ram',
    logo: '/logos/logo-ram.jpg',
    color: '#000000',
    yearRanges: [
      {
        label: '2020 – 2025',
        start: 2020,
        end: 2025,
        models: [
          { name: 'Ram 5500 Chassis Cab', engines: ['Cummins 6.7L I6', 'Hemi 6.4L V8'], systems: ramSystems },
          { name: 'Ram 4500 Chassis Cab', engines: ['Cummins 6.7L I6', 'Hemi 6.4L V8'], systems: ramSystems },
          { name: 'ProMaster 3500', engines: ['Pentastar 3.6L V6'], systems: ramSystems },
        ],
      },
      {
        label: '2015 – 2019',
        start: 2015,
        end: 2019,
        models: [
          { name: 'Ram 5500 Chassis Cab', engines: ['Cummins 6.7L I6', 'Hemi 6.4L V8'], systems: ramSystems },
          { name: 'Ram 4500 Chassis Cab', engines: ['Cummins 6.7L I6', 'Hemi 6.4L V8'], systems: ramSystems },
          { name: 'ProMaster 3500', engines: ['Pentastar 3.6L V6'], systems: ramSystems },
        ],
      },
      {
        label: '2010 – 2014',
        start: 2010,
        end: 2014,
        models: [
          { name: 'Ram 5500 Chassis Cab', engines: ['Cummins 6.7L I6', 'Hemi 6.4L V8'], systems: ramSystems },
          { name: 'Ram 4500 Chassis Cab', engines: ['Cummins 6.7L I6', 'Hemi 6.4L V8'], systems: ramSystems },
          { name: 'Dodge Ram 3500', engines: ['Cummins 6.7L I6'], systems: ramSystems },
        ],
      },
    ],
  },
];