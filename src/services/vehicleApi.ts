/**
 * Vehicle API Service
 * Connects to the UK Vehicle Enquiry Service API to get vehicle details
 * https://developer-portal.driver-vehicle-licensing.api.gov.uk/apis/vehicle-enquiry-service/vehicle-enquiry-service-description.html
 */

// API route for vehicle lookup
const API_URL = '/api/vehicle-lookup';

// Types
export interface VehicleDetails {
  registrationNumber: string;
  make: string;
  model: string; // Note: DVLA API doesn't provide model directly
  color: string;
  fuelType: string;
  engineCapacity: number;
  yearOfManufacture: number;
  transmission?: string; // Not provided by DVLA API, but we might want to keep it for UI
  bodyType?: string; // Not provided by DVLA API, but we might want to keep it for UI
  taxStatus: string;
  motStatus: string;
  wheelplan: string;
  monthOfFirstRegistration: string;
  // Additional fields from DVLA API
  typeApproval?: string;
  revenueWeight?: number;
  euroStatus?: string;
  co2Emissions?: number;
  markedForExport?: boolean;
  dateOfLastV5CIssued?: string;
  taxDueDate?: string;
  artEndDate?: string;
  realDrivingEmissions?: string;
}

/**
 * Validates if a string is in a valid UK vehicle registration format
 * 
 * UK registration formats can vary, but we'll check for common patterns
 * Examples: AB12 CDE, A123 BCD, ABC 123D, etc.
 */
export function isValidUKRegistration(regNumber: string): boolean {
  // Remove all spaces and normalize
  const normalized = regNumber.replace(/\s+/g, '').toUpperCase();
  
  // Basic length check (most UK plates are 7-8 characters)
  if (normalized.length < 5 || normalized.length > 8) {
    return false;
  }
  
  // Check for valid characters (letters and numbers only)
  if (!/^[A-Z0-9]+$/.test(normalized)) {
    return false;
  }
  
  // Common UK formats (simplified)
  // This doesn't cover all edge cases but works for most common formats
  const commonFormats = [
    /^[A-Z]{2}\d{2}[A-Z]{3}$/, // AB12 CDE - Current style
    /^[A-Z]\d{3}[A-Z]{3}$/,    // A123 BCD - Older style
    /^[A-Z]{3}\d{3}[A-Z]?$/,   // ABC 123D or ABC 123 - Older style
    /^\d{3}[A-Z]{3}$/,         // 123 ABC - Older style
    /^[A-Z]\d{1,3}[A-Z]{3}$/,  // B12 ABC - Older style
    /^[A-Z]{3}\d{1,3}[A-Z]?$/, // ABC 12D or ABC 12 - Older style
  ];
  
  return commonFormats.some(format => format.test(normalized));
}

/**
 * Fetches vehicle details by registration number from the UK Vehicle Enquiry Service API
 */
export async function getVehicleByRegistration(regNumber: string): Promise<VehicleDetails | null> {
  try {
    // Clean up registration number (remove spaces, convert to uppercase)
    const cleanRegNumber = regNumber.replace(/\s+/g, '').toUpperCase();
    
    // Make the API call to our vehicle lookup API route
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        registrationNumber: cleanRegNumber
      })
    });
    
    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Vehicle API error:', { status: response.status, data: errorData });
      
      // Handle specific error cases
      if (response.status === 404) {
        throw new Error('Vehicle not found with that registration');
      } else if (response.status === 400) {
        throw new Error('Invalid registration format');
      } else if (response.status === 429) {
        throw new Error('Too many requests, please try again later');
      } else {
        throw new Error(`API error (${response.status})`);
      }
    }
    
    // Parse the API response
    const data = await response.json();
    
    // Map the API response to our VehicleDetails interface
    return {
      registrationNumber: data.registrationNumber,
      make: data.make || 'Unknown',
      model: data.model || 'Not provided by DVLA',
      color: data.colour || 'Unknown',
      fuelType: data.fuelType || 'Unknown',
      engineCapacity: data.engineCapacity || 0,
      yearOfManufacture: data.yearOfManufacture || 0,
      transmission: data.transmission || 'Unknown',
      bodyType: data.bodyType || 'Unknown',
      taxStatus: data.taxStatus || 'Unknown',
      motStatus: data.motStatus || 'Unknown',
      wheelplan: data.wheelplan || '',
      monthOfFirstRegistration: data.monthOfFirstRegistration || '',
      // Additional fields from DVLA API
      typeApproval: data.typeApproval,
      revenueWeight: data.revenueWeight,
      euroStatus: data.euroStatus,
      co2Emissions: data.co2Emissions,
      markedForExport: data.markedForExport,
      dateOfLastV5CIssued: data.dateOfLastV5CIssued,
      taxDueDate: data.taxDueDate,
      artEndDate: data.artEndDate,
      realDrivingEmissions: data.realDrivingEmissions
    };
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    if (error instanceof Error) {
      throw error; // Re-throw the error to be handled by the caller
    }
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
    wheelplan: 'NON STANDARD',
    monthOfFirstRegistration: `${year}-01`,
    typeApproval: 'M1',
    revenueWeight: 1500,
    euroStatus: 'EURO 5',
    co2Emissions: 120,
    markedForExport: false,
    dateOfLastV5CIssued: '2020-01-01',
    taxDueDate: '2025-01-01',
    artEndDate: '2025-01-01',
    realDrivingEmissions: '1'
  };
}
