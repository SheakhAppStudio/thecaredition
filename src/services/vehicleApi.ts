/**
 * Vehicle API Service
 * Connects to the UK vehicle registration API to get vehicle details
 */

// API configuration
const API_KEY = process.env.VEHICLE_API_KEY || 'YOUR_API_KEY_HERE'; // Replace with your actual API key
const API_URL = 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles';

// Types
export interface VehicleDetails {
  registrationNumber: string;
  make: string;
  model: string;
  color: string;
  fuelType: string;
  engineCapacity: number;
  yearOfManufacture: number;
  transmission: string;
  bodyType: string;
  taxStatus?: string;
  motStatus?: string;
  wheelplan?: string;
  monthOfFirstRegistration?: string;
}

/**
 * Fetches vehicle details by registration number
 * 
 * Note: This is a placeholder implementation. In a real application, you would need to:
 * 1. Securely store your API key in environment variables
 * 2. Implement proper error handling
 * 3. Add rate limiting and caching as needed
 * 
 * The UK DVLA API requires authentication and proper setup:
 * https://developer-portal.driver-vehicle-licensing.api.gov.uk/
 */
export async function getVehicleByRegistration(regNumber: string): Promise<VehicleDetails | null> {
  try {
    // For development/demo purposes, we'll use a mock response
    // In production, replace this with actual API call
    if (process.env.NODE_ENV === 'production') {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          registrationNumber: regNumber
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } else {
      // Mock response for development
      return mockVehicleResponse(regNumber);
    }
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    return null;
  }
}

/**
 * Generates a mock vehicle response for testing purposes
 */
function mockVehicleResponse(regNumber: string): VehicleDetails {
  // Extract potential year from reg number (e.g., AB12 CDE might be 2012)
  const yearMatch = regNumber.match(/\d{2}/);
  let year = 2015;
  if (yearMatch) {
    const twoDigitYear = parseInt(yearMatch[0]);
    year = twoDigitYear > 50 ? 1900 + twoDigitYear : 2000 + twoDigitYear;
  }
  
  // Generate a random make based on the first letter of the reg
  const firstLetter = regNumber.charAt(0).toUpperCase();
  const makes: Record<string, string> = {
    'A': 'Audi',
    'B': 'BMW',
    'C': 'Citroen',
    'D': 'Dacia',
    'E': 'Escort',
    'F': 'Ford',
    'G': 'Geely',
    'H': 'Honda',
    'I': 'Infiniti',
    'J': 'Jaguar',
    'K': 'Kia',
    'L': 'Land Rover',
    'M': 'Mercedes',
    'N': 'Nissan',
    'O': 'Opel',
    'P': 'Peugeot',
    'Q': 'Qoros',
    'R': 'Renault',
    'S': 'Skoda',
    'T': 'Toyota',
    'U': 'Ultima',
    'V': 'Volkswagen',
    'W': 'Wolseley',
    'X': 'Xpeng',
    'Y': 'Yamaha',
    'Z': 'Zenvo'
  };
  
  const make = makes[firstLetter] || 'Ford';
  
  // Generate model based on make
  const models: Record<string, string[]> = {
    'Audi': ['A1', 'A3', 'A4', 'A6', 'Q5', 'TT'],
    'BMW': ['1 Series', '3 Series', '5 Series', 'X3', 'X5', 'i8'],
    'Citroen': ['C1', 'C3', 'C4', 'Berlingo', 'DS3'],
    'Dacia': ['Sandero', 'Duster', 'Logan'],
    'Escort': ['XR3i', 'RS Turbo', 'Cosworth'],
    'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Mustang'],
    'Geely': ['Emgrand', 'GC9', 'Boyue'],
    'Honda': ['Civic', 'Jazz', 'CR-V', 'HR-V', 'Accord'],
    'Infiniti': ['Q30', 'Q50', 'QX70'],
    'Jaguar': ['XE', 'XF', 'F-Type', 'F-Pace'],
    'Kia': ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Sorento'],
    'Land Rover': ['Discovery', 'Range Rover', 'Defender', 'Evoque'],
    'Mercedes': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA'],
    'Nissan': ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf'],
    'Opel': ['Corsa', 'Astra', 'Insignia', 'Mokka'],
    'Peugeot': ['108', '208', '308', '3008', '5008'],
    'Qoros': ['3', '5', '7'],
    'Renault': ['Clio', 'Megane', 'Captur', 'Kadjar', 'Zoe'],
    'Skoda': ['Fabia', 'Octavia', 'Superb', 'Kodiaq', 'Karoq'],
    'Toyota': ['Aygo', 'Yaris', 'Corolla', 'Prius', 'RAV4'],
    'Ultima': ['GTR', 'Evolution', 'RS'],
    'Volkswagen': ['Polo', 'Golf', 'Passat', 'Tiguan', 'T-Roc'],
    'Wolseley': ['1500', '6/99', 'Hornet'],
    'Xpeng': ['P7', 'G3', 'P5'],
    'Yamaha': ['MT-07', 'MT-09', 'R1', 'R6'],
    'Zenvo': ['ST1', 'TS1', 'TSR']
  };
  
  const makeModels = models[make] || ['Generic Model'];
  const model = makeModels[Math.floor(Math.random() * makeModels.length)];
  
  // Generate random fuel type
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
  const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
  
  // Generate random color
  const colors = ['Black', 'White', 'Silver', 'Blue', 'Red', 'Grey', 'Green'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  // Generate random engine capacity
  const engineCapacities = [1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500, 3000];
  const engineCapacity = engineCapacities[Math.floor(Math.random() * engineCapacities.length)];
  
  // Generate random transmission
  const transmissions = ['Manual', 'Automatic', 'Semi-Automatic'];
  const transmission = transmissions[Math.floor(Math.random() * transmissions.length)];
  
  // Generate random body type
  const bodyTypes = ['Hatchback', 'Saloon', 'Estate', 'SUV', 'Coupe', 'Convertible'];
  const bodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
  
  return {
    registrationNumber: regNumber,
    make,
    model,
    color,
    fuelType,
    engineCapacity,
    yearOfManufacture: year,
    transmission,
    bodyType,
    taxStatus: 'Taxed',
    motStatus: 'Valid',
  };
}
