/**
 * Pricing Configuration
 * This file contains the pricing structure for different car makes and service types
 * You can modify these values as needed
 */

// Service types
export enum ServiceType {
  OIL_CHANGE = 'Oil Change',
  FULL_SERVICE = 'Full Service',
  INTERIM_SERVICE = 'Interim Service',
  MAJOR_SERVICE = 'Major Service',
  MOT = 'MOT Test',
  BRAKE_PADS = 'Brake Pads Replacement',
  BRAKE_DISCS = 'Brake Discs Replacement',
  TIMING_BELT = 'Timing Belt Replacement',
  CLUTCH = 'Clutch Replacement',
  BATTERY = 'Battery Replacement',
  ALTERNATOR = 'Alternator Replacement',
  STARTER_MOTOR = 'Starter Motor Replacement',
  SUSPENSION = 'Suspension Work',
  EXHAUST = 'Exhaust Repair/Replacement',
  DIAGNOSTICS = 'Diagnostics',
  AIR_CONDITIONING = 'Air Conditioning Service',
  WHEEL_ALIGNMENT = 'Wheel Alignment',
  TYRE_REPLACEMENT = 'Tyre Replacement',
}

// Base prices for each service type
export const baseServicePrices: Record<ServiceType, number> = {
  [ServiceType.OIL_CHANGE]: 80,
  [ServiceType.FULL_SERVICE]: 180,
  [ServiceType.INTERIM_SERVICE]: 120,
  [ServiceType.MAJOR_SERVICE]: 250,
  [ServiceType.MOT]: 55,
  [ServiceType.BRAKE_PADS]: 120,
  [ServiceType.BRAKE_DISCS]: 220,
  [ServiceType.TIMING_BELT]: 350,
  [ServiceType.CLUTCH]: 450,
  [ServiceType.BATTERY]: 120,
  [ServiceType.ALTERNATOR]: 280,
  [ServiceType.STARTER_MOTOR]: 250,
  [ServiceType.SUSPENSION]: 200,
  [ServiceType.EXHAUST]: 180,
  [ServiceType.DIAGNOSTICS]: 60,
  [ServiceType.AIR_CONDITIONING]: 80,
  [ServiceType.WHEEL_ALIGNMENT]: 60,
  [ServiceType.TYRE_REPLACEMENT]: 70, // Per tyre
};

// Price multipliers for different car makes (premium cars cost more to service)
export const makeMultipliers: Record<string, number> = {
  // Premium/Luxury brands
  'Audi': 1.3,
  'BMW': 1.4,
  'Mercedes': 1.4,
  'Jaguar': 1.5,
  'Land Rover': 1.5,
  'Porsche': 1.8,
  'Bentley': 2.5,
  'Ferrari': 3.0,
  'Lamborghini': 3.0,
  'Rolls-Royce': 3.0,
  'Tesla': 1.4,
  'Lexus': 1.3,
  'Volvo': 1.3,
  'Alfa Romeo': 1.3,
  'Maserati': 2.0,
  'Aston Martin': 2.5,
  
  // Mid-range brands
  'Volkswagen': 1.1,
  'Ford': 1.0,
  'Vauxhall': 1.0,
  'Opel': 1.0,
  'Peugeot': 1.0,
  'Renault': 1.0,
  'Citroen': 1.0,
  'Toyota': 1.0,
  'Honda': 1.0,
  'Mazda': 1.1,
  'Nissan': 1.0,
  'Hyundai': 0.9,
  'Kia': 0.9,
  'Seat': 1.0,
  'Skoda': 1.0,
  'Mini': 1.2,
  'Jeep': 1.2,
  'Suzuki': 0.9,
  'Mitsubishi': 1.1,
  'Subaru': 1.2,
  
  // Budget brands
  'Dacia': 0.8,
  'Fiat': 0.9,
  'Chevrolet': 0.9,
  'Ssangyong': 0.9,
  'MG': 0.9,
};

// Additional factors that can affect pricing
export const engineSizeMultipliers: Record<string, number> = {
  'small': 0.9,  // Under 1.4L
  'medium': 1.0, // 1.4L to 2.0L
  'large': 1.2,  // 2.1L to 3.0L
  'very-large': 1.4, // Over 3.0L
};

// Age multipliers - older cars might need more work
export const ageMultipliers: Record<string, number> = {
  'new': 0.9,      // 0-3 years
  'recent': 1.0,    // 4-7 years
  'mid-age': 1.1,   // 8-12 years
  'older': 1.2,     // 13-20 years
  'vintage': 1.5,   // 20+ years
};

/**
 * Calculate the price for a specific service based on the vehicle details
 */
export function calculateServicePrice(
  make: string,
  serviceType: ServiceType,
  engineCapacity: number,
  yearOfManufacture: number
): number {
  // Get base price for the service
  const basePrice = baseServicePrices[serviceType] || 100;
  
  // Apply make multiplier
  const makeMultiplier = makeMultipliers[make] || 1.0;
  
  // Determine engine size category
  let engineSizeCategory = 'medium';
  if (engineCapacity < 1400) {
    engineSizeCategory = 'small';
  } else if (engineCapacity > 2000 && engineCapacity <= 3000) {
    engineSizeCategory = 'large';
  } else if (engineCapacity > 3000) {
    engineSizeCategory = 'very-large';
  }
  const engineMultiplier = engineSizeMultipliers[engineSizeCategory];
  
  // Determine age category
  const currentYear = new Date().getFullYear();
  const age = currentYear - yearOfManufacture;
  let ageCategory = 'recent';
  if (age <= 3) {
    ageCategory = 'new';
  } else if (age <= 7) {
    ageCategory = 'recent';
  } else if (age <= 12) {
    ageCategory = 'mid-age';
  } else if (age <= 20) {
    ageCategory = 'older';
  } else {
    ageCategory = 'vintage';
  }
  const ageMultiplier = ageMultipliers[ageCategory];
  
  // Calculate final price
  const finalPrice = basePrice * makeMultiplier * engineMultiplier * ageMultiplier;
  
  // Round to nearest pound
  return Math.round(finalPrice);
}

/**
 * Get all available services with prices for a specific vehicle
 */
export function getAllServicesWithPrices(
  make: string,
  engineCapacity: number,
  yearOfManufacture: number
): Array<{service: ServiceType, price: number}> {
  return Object.values(ServiceType).map(service => ({
    service,
    price: calculateServicePrice(make, service, engineCapacity, yearOfManufacture)
  }));
}
