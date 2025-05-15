/**
 * Service Configuration
 * This file contains the configuration for available services and their base prices
 */

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
}

// List of available services with descriptions and base prices
export const availableServices: ServiceOption[] = [
  {
    id: 'walnut-blasting',
    name: 'Walnut Blasting / Carbon Clean',
    description: 'Engine decarbonisation to improve performance.',
    basePrice: 149.99
  },
  {
    id: 'diagnostics',
    name: 'Car Diagnostics',
    description: 'Comprehensive vehicle health checks.',
    basePrice: 59.99
  },
  {
    id: 'electronics-repair',
    name: 'Electronics Repair',
    description: 'Fixing electronic components and systems.',
    basePrice: 99.99
  },
  {
    id: 'interior-repair',
    name: 'Interior Repair',
    description: 'Restoration of interior trims and upholstery.',
    basePrice: 129.99
  },
  {
    id: 'mechanical-repair',
    name: 'Mechanical Repair',
    description: 'General mechanical fixes and maintenance.',
    basePrice: 119.99
  },
  {
    id: 'vehicle-servicing',
    name: 'Vehicle Servicing',
    description: 'Routine maintenance and inspections.',
    basePrice: 259.99
  },
  {
    id: 'wheel-alignment',
    name: 'Wheel Alignment & Tracking',
    description: 'Adjusting wheels for optimal alignment.',
    basePrice: 79.99
  },
  {
    id: 'new-tyres',
    name: 'New Tyres (Up to 24")',
    description: 'Tyre replacement services.',
    basePrice: 89.99
  },
  {
    id: 'wheel-balancing',
    name: 'Wheel Balancing',
    description: 'Ensuring even weight distribution across wheels.',
    basePrice: 49.99
  },
  {
    id: 'transmission-flush',
    name: 'Transmission Flush',
    description: 'Cleaning and replacing transmission fluid.',
    basePrice: 179.99
  },
  {
    id: 'engine-rebuilds',
    name: 'Engine Rebuilds',
    description: 'Comprehensive engine overhauls.',
    basePrice: 1499.99
  },
  {
    id: 'customisation',
    name: 'Customisation & Upgrades',
    description: 'Personalised modifications and enhancements.',
    basePrice: 299.99
  },
  {
    id: 'star-lights',
    name: 'Star Lights & LED Installation',
    description: 'Interior lighting upgrades.',
    basePrice: 199.99
  },
  {
    id: 'dashcam-fitting',
    name: 'Professional Dash Cam Fitting',
    description: 'Installation of front and rear dash cams.',
    basePrice: 149.99
  },
  {
    id: 'ac-regas',
    name: 'Car Air Conditioning Regas',
    description: 'Recharging and servicing of AC systems.',
    basePrice: 89.99
  }
];

/**
 * Get a service by its ID
 */
export function getServiceById(id: string): ServiceOption | undefined {
  return availableServices.find(service => service.id === id);
}

/**
 * Calculate price adjustment based on vehicle make and year
 * Premium and newer cars may have higher service costs
 */
export function calculatePriceAdjustment(make: string, year: number): number {
  // Premium brands have higher service costs
  const premiumBrands = ['BMW', 'Mercedes', 'Audi', 'Lexus', 'Jaguar', 'Land Rover', 'Porsche'];
  const isPremium = premiumBrands.some(brand => make.toLowerCase().includes(brand.toLowerCase()));
  
  // Calculate age factor (newer cars might have more complex systems)
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // Base multiplier
  let multiplier = 1.0;
  
  // Adjust for premium brands
  if (isPremium) {
    multiplier *= 1.2;
  }
  
  // Adjust for age
  if (age < 3) {
    multiplier *= 1.1; // Newer cars with complex systems
  } else if (age > 15) {
    multiplier *= 0.9; // Older cars might be simpler but parts availability could be an issue
  }
  
  return multiplier;
}

/**
 * Calculate final price for a service based on vehicle details
 */
export function calculateServicePrice(
  service: ServiceOption,
  make: string,
  year: number
): number {
  const adjustment = calculatePriceAdjustment(make, year);
  return Math.round((service.basePrice * adjustment) * 100) / 100;
}
