'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { VehicleDetails } from '@/services/vehicleApi';
import { availableServices, ServiceOption, calculateServicePrice } from '@/services/serviceConfig';

export default function ServiceSelection() {
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [otherService, setOtherService] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Retrieve vehicle data from localStorage on component mount
  useEffect(() => {
    try {
      // Directly access localStorage without delay
      const storedVehicle = localStorage.getItem('selectedVehicle');
      console.log('Retrieved vehicle data:', storedVehicle);
      
      if (storedVehicle) {
        try {
          const parsedVehicle = JSON.parse(storedVehicle);
          setVehicle(parsedVehicle);
        } catch (parseError) {
          console.error('Error parsing vehicle data:', parseError);
        }
      } else {
        console.warn('No vehicle data found in localStorage');
        // Redirect back to the vehicle registration page if no vehicle data
        window.location.href = '/service-estimator';
      }
    } catch (error) {
      console.error('Error retrieving vehicle data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Calculate total price whenever selected services change
  useEffect(() => {
    if (!vehicle) return;
    
    let price = 0;
    selectedServices.forEach(serviceId => {
      const service = availableServices.find(s => s.id === serviceId);
      if (service) {
        price += calculateServicePrice(service, vehicle.make, vehicle.yearOfManufacture);
      }
    });
    
    setTotalPrice(price);
  }, [selectedServices, vehicle]);
  
  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Format registration number with a space in the middle (e.g., AB12 CDE)
  const formatRegistration = (reg: string) => {
    const clean = reg.replace(/\s+/g, '').toUpperCase();
    if (clean.length > 4) {
      return `${clean.slice(0, 4)} ${clean.slice(4)}`;
    }
    return clean;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with background image */}
      <div className="relative h-64 bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/logos/backgroundlogo2.jpg"
            alt="Car Workshop"
            fill
            priority
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative flex flex-col items-center justify-center h-full">
          {/* Empty header for background only */}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-black bg-opacity-80 backdrop-blur-sm border border-gray-800 rounded-xl shadow-2xl -mt-20 relative z-10 mb-20 overflow-hidden">
          {/* Progress indicator */}
          <div className="bg-gradient-to-r from-gray-900 to-black p-6 border-b border-gray-800">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="rounded-full bg-orange-600 text-white w-8 h-8 flex items-center justify-center mr-2">1</div>
                <span className="text-gray-400">Vehicle Details</span>
              </div>
              <div className="h-px bg-gray-700 flex-grow mx-4"></div>
              <div className="flex items-center">
                <div className="rounded-full bg-orange-600 text-white w-8 h-8 flex items-center justify-center mr-2">2</div>
                <span className="text-white font-medium">Service Selection</span>
              </div>
              <div className="h-px bg-gray-700 flex-grow mx-4"></div>
              <div className="flex items-center">
                <div className="rounded-full bg-gray-700 text-white w-8 h-8 flex items-center justify-center mr-2">3</div>
                <span className="text-gray-400">Confirmation</span>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="p-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : !vehicle ? (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-500 mb-4">No Vehicle Selected</h2>
                <p className="text-gray-400 mb-6">Please go back and select a vehicle first.</p>
                <button
                  onClick={() => window.location.href = '/service-estimator'}
                  className="py-2 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition duration-300"
                >
                  Go Back
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold mb-6">Select Services for Your Vehicle</h2>
                
                {/* Vehicle summary */}
                <div className="bg-gray-900 rounded-lg p-4 mb-8 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-3 text-orange-500">Your Vehicle</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Registration</p>
                      <p className="font-bold">{formatRegistration(vehicle.registrationNumber)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Make</p>
                      <p className="font-bold">{vehicle.make}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Year</p>
                      <p className="font-bold">{vehicle.yearOfManufacture}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Engine</p>
                      <p className="font-bold">{vehicle.engineCapacity ? `${vehicle.engineCapacity}cc` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Service selection */}
                <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4 text-orange-500">Available Services</h3>
                  <p className="text-gray-300 mb-6">Select the services you're interested in:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {availableServices.map(service => {
                      const isSelected = selectedServices.includes(service.id);
                      const price = vehicle ? calculateServicePrice(service, vehicle.make, vehicle.yearOfManufacture) : service.basePrice;
                      
                      return (
                        <div 
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={`border ${isSelected ? 'border-orange-500 bg-gray-800' : 'border-gray-700 bg-gray-900'} 
                                      rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-orange-500`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-1">{service.name}</h4>
                              <p className="text-gray-400 text-sm">{service.description}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-orange-500 font-bold">£{price.toFixed(2)}</span>
                              <span className="text-xs text-gray-400">Starting from</span>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-sm text-gray-300">
                              {isSelected ? 'Selected' : 'Click to select'}
                            </span>
                            <div className={`w-6 h-6 rounded-full border ${isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-500'} flex items-center justify-center`}>
                              {isSelected && (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Other service option */}
                  <div className="mt-6">
                    <label className="block text-white font-medium mb-2">Other Service (if not listed above)</label>
                    <input
                      type="text"
                      value={otherService}
                      onChange={(e) => setOtherService(e.target.value)}
                      placeholder="Describe the service you need"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                
                {/* Price summary */}
                <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4 text-orange-500">Price Summary</h3>
                  
                  {selectedServices.length === 0 ? (
                    <p className="text-gray-300">No services selected yet.</p>
                  ) : (
                    <div>
                      <div className="space-y-2 mb-4">
                        {selectedServices.map(serviceId => {
                          const service = availableServices.find(s => s.id === serviceId);
                          if (!service || !vehicle) return null;
                          
                          const price = calculateServicePrice(service, vehicle.make, vehicle.yearOfManufacture);
                          
                          return (
                            <div key={serviceId} className="flex justify-between">
                              <span className="text-gray-300">{service.name}</span>
                              <span className="font-medium">£{price.toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="border-t border-gray-700 pt-4 mt-4 flex justify-between">
                        <span className="text-lg font-bold">Total Estimate</span>
                        <span className="text-lg font-bold text-orange-500">£{totalPrice.toFixed(2)}</span>
                      </div>
                      
                      <p className="text-sm text-gray-400 mt-2">* Final price may vary based on additional requirements and parts needed.</p>
                    </div>
                  )}
                </div>
                
                {/* Continue button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (selectedServices.length > 0 && vehicle) {
                        // Store selected services and other data in localStorage
                        localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
                        localStorage.setItem('otherService', otherService);
                        localStorage.setItem('totalPrice', totalPrice.toString());
                        
                        // Navigate to customer details page
                        window.location.href = '/service-estimator/customer-details';
                      }
                    }}
                    disabled={selectedServices.length === 0}
                    className={`py-3 px-8 rounded-lg font-bold text-lg transition duration-300 ${selectedServices.length === 0 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}
                  >
                    Continue to Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
