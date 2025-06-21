'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getVehicleByRegistration, isValidUKRegistration, VehicleDetails } from '@/services/vehicleApi';

// Define CSS variables to match the website theme
const styles = {
  orange: 'rgb(234, 88, 12)', // text-orange
  orangeDark: 'rgb(194, 65, 12)', // hover:bg-orange-dark
};

export default function ServiceEstimator() {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [step, setStep] = useState(1); // Step 1: Enter reg, Step 2: Confirm vehicle

  // Format registration number with a space in the middle (e.g., AB12 CDE)
  const formatRegistration = (reg: string) => {
    const clean = reg.replace(/\s+/g, '').toUpperCase();
    if (clean.length > 4) {
      return `${clean.slice(0, 4)} ${clean.slice(4)}`;
    }
    return clean;
  };

  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters, numbers and spaces
    const value = e.target.value.replace(/[^A-Za-z0-9\s]/g, '');
    setRegistrationNumber(value);
    
    // Clear any previous errors when user starts typing again
    if (error) setError(null);
    
    // Reset vehicle data if user changes registration
    if (vehicle) setVehicle(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    
    // Clean up registration number
    const cleanReg = registrationNumber.replace(/\s+/g, '').toUpperCase();
    
    // Basic validation
    if (!cleanReg) {
      setError('Please enter a registration number');
      return;
    }
    
    // Validate UK registration format
    if (!isValidUKRegistration(cleanReg)) {
      setError('Please enter a valid UK registration number');
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Call the API to get vehicle details
      const vehicleData = await getVehicleByRegistration(cleanReg);
      
      if (vehicleData) {
        setVehicle(vehicleData);
        setStep(2); // Move to vehicle confirmation step
      } else {
        setError('Vehicle not found. Please check the registration number.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRegistration = () => {
    setStep(1); // Go back to registration input
    setVehicle(null); // Clear vehicle data
  };

  const handleConfirmVehicle = () => {
    // Store vehicle details in localStorage for use in the service selection page
    if (vehicle) {
      try {
        // Make sure to stringify the vehicle object properly
        const vehicleString = JSON.stringify(vehicle);
        localStorage.setItem('selectedVehicle', vehicleString);
        console.log('Vehicle data stored:', vehicleString);
        
        // Navigate to the service selection page
        // Use direct window.location.href assignment instead of setTimeout
        window.location.href = '/service-estimator/service-selection';
      } catch (error) {
        console.error('Error storing vehicle data:', error);
        alert('There was an error saving your vehicle information. Please try again.');
      }
    }
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
        {/* No title in header */}
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
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-orange' : 'bg-gray-700'} text-white font-bold mr-3 shadow-lg`}>1</div>
              <div className="text-lg font-semibold text-white">Vehicle Details</div>
              <div className="flex-1 h-1 mx-4 bg-gray-700">
                <div className={`h-1 ${step >= 2 ? 'bg-orange' : 'bg-gray-700'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-orange' : 'bg-gray-700'} text-white font-bold mr-3 shadow-lg`}>2</div>
              <div className="text-lg font-semibold text-white">Confirm Vehicle</div>
            </div>
          </div>
          
          <div className="p-6">
            {step === 1 && (
              <div className="flex flex-col items-center">
                <div className="max-w-md w-full mb-10">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex flex-col items-center">
                      <p className="text-white mb-3 text-lg font-medium">enter registration number:</p>
                      {/* License plate style input */}
                      <div className="relative w-full max-w-md mb-2">
                        {/* Shadow and tilt effect for realism */}
                        <div className="absolute inset-0 bg-gray-900 rounded-lg transform rotate-0.5 translate-x-0.5 translate-y-0.5 shadow-xl"></div>
                        <div className="relative bg-yellow-400 rounded-lg shadow-lg border-2 border-gray-700 overflow-hidden">
                          <div className="flex">
                            <div className="bg-yellow-400 w-20 py-3 px-2 flex flex-col items-center justify-center border-r-2 border-gray-700">
                              <div className="w-14 h-8 mb-1 overflow-hidden rounded shadow-sm">
                                <img src="/images/uk-flag.png" alt="UK Flag" className="w-full h-full object-cover" />
                              </div>
                              <span className="text-blue-900 font-bold text-xl">UK</span>
                            </div>
                            <div className="flex-1 bg-white bg-opacity-5 backdrop-blur-sm">
                              <input
                                type="text"
                                id="registration"
                                value={registrationNumber}
                                onChange={handleRegistrationChange}
                                placeholder="AB12 CDE"
                                className="w-full h-full text-3xl font-bold tracking-widest text-center uppercase border-0 focus:ring-0 focus:outline-none bg-transparent text-black py-6 px-4"
                                maxLength={10}
                                disabled={isLoading}
                                autoFocus
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading || !registrationNumber.trim()}
                      className={`w-full py-5 px-8 text-white font-bold text-xl rounded-lg ${
                        isLoading || !registrationNumber.trim() 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-orange to-orange-600 hover:from-orange-600 hover:to-orange-700'
                      } transition duration-300 ease-in-out shadow-xl transform hover:scale-102 relative overflow-hidden`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Searching...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                          </svg>
                          Search Vehicle
                        </span>
                      )}
                      {/* Subtle shine effect */}
                      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-x-45 translate-x-full transition-transform duration-1000 ease-out animate-shine"></div>
                    </button>
                    
                    {/* Add animation for shine effect */}
                    <style jsx>{`
                      @keyframes shine {
                        0% { transform: translateX(-100%) skewX(-45deg); }
                        100% { transform: translateX(200%) skewX(-45deg); }
                      }
                      .animate-shine {
                        animation: shine 3s infinite;
                      }
                    `}</style>
                  </form>
                </div>
              </div>
            )}

            {step === 2 && vehicle && (
              <div>
                <h2 className="text-3xl font-bold mb-4 text-white">Confirm Your Vehicle</h2>
                <p className="mb-8 text-gray-300 text-lg">Please confirm that these details match your vehicle.</p>
                
                <div className="bg-black bg-opacity-50 p-8 rounded-lg mb-8 border border-gray-700 shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <p className="text-sm text-gray-400 mb-1">Registration</p>
                      <p className="text-2xl font-bold text-white">{formatRegistration(vehicle.registrationNumber)}</p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <p className="text-sm text-gray-400 mb-1">Make</p>
                      <p className="text-2xl font-bold text-white">{vehicle.make}</p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <p className="text-sm text-gray-400 mb-1">Year of Manufacture</p>
                      <p className="text-2xl font-bold text-white">{vehicle.yearOfManufacture}</p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <p className="text-sm text-gray-400 mb-1">Engine Size</p>
                      <p className="text-2xl font-bold text-white">{vehicle.engineCapacity ? `${vehicle.engineCapacity}cc` : 'Not available'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 mt-10">
                  <button
                    onClick={handleEditRegistration}
                    className="py-4 px-6 bg-gray-800 text-white font-bold text-lg rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105 flex-1"
                  >
                    Check Another Car
                  </button>
                  <button
                    onClick={handleConfirmVehicle}
                    className="py-4 px-6 bg-orange hover:bg-orange-dark text-white font-bold text-lg rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105 flex-1"
                  >
                    Confirm & Continue
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
