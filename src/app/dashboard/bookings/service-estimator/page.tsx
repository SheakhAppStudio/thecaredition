'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getVehicleByRegistration, isValidUKRegistration, VehicleDetails } from '@/services/vehicleApi';
import { ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function ServiceEstimator() {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [step, setStep] = useState(1);

  const formatRegistration = (reg: string) => {
    const clean = reg.replace(/\s+/g, '').toUpperCase();
    if (clean.length > 4) {
      return `${clean.slice(0, 4)} ${clean.slice(4)}`;
    }
    return clean;
  };

  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9\s]/g, '');
    setRegistrationNumber(value);
    if (error) setError(null);
    if (vehicle) setVehicle(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanReg = registrationNumber.replace(/\s+/g, '').toUpperCase();
    
    if (!cleanReg) {
      setError('Please enter a registration number');
      return;
    }
    
    if (!isValidUKRegistration(cleanReg)) {
      setError('Please enter a valid UK registration number');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const vehicleData = await getVehicleByRegistration(cleanReg);
      if (vehicleData) {
        setVehicle(vehicleData);
        setStep(2);
      } else {
        setError('Vehicle not found. Please check the registration number.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRegistration = () => {
    setStep(1);
    setVehicle(null);
  };

  const handleConfirmVehicle = () => {
    if (vehicle) {
      try {
        localStorage.setItem('selectedVehicle', JSON.stringify(vehicle));
        window.location.href = '/dashboard/bookings/service-estimator/service-selection';
      } catch (error) {
        console.error('Error storing vehicle data:', error);
        alert('There was an error saving your vehicle information. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with background */}
      {/* <div className="relative h-48 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/logos/backgroundlogo2.jpg"
            alt="Car Workshop"
            fill
            priority
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative flex flex-col items-center justify-center h-full px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Service Estimator</h1>
          <p className="text-gray-300 mt-2">Get an instant quote for your vehicle</p>
        </div>
      </div> */}

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200  mb-8 overflow-hidden">
          {/* Progress indicator */}
          <div className="bg-gray-50 p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'} font-bold mr-3`}>
                1
              </div>
              <div className="text-lg font-semibold text-gray-800">Vehicle Details</div>
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-1 ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'} font-bold mr-3`}>
                2
              </div>
              <div className="text-lg font-semibold text-gray-800">Confirm Vehicle</div>
            </div>
          </div>
          
          <div className="p-6">
            {step === 1 && (
              <div className="flex flex-col items-center">
                <div className="max-w-md w-full mb-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center">
                      <p className="text-gray-700 mb-4 text-lg font-medium">Enter registration number:</p>
                      {/* License plate style input */}
                      <div className="relative w-full max-w-md mb-4">
                        <div className="relative bg-yellow-400 rounded-lg shadow-sm border-2 border-gray-300 overflow-hidden">
                          <div className="flex">
                            <div className="bg-yellow-400 w-16 py-2 px-2 flex flex-col items-center justify-center border-r-2 border-gray-300">
                              <div className="w-12 h-6 mb-1 overflow-hidden rounded shadow-sm">
                                <img src="/images/uk-flag.png" alt="UK Flag" className="w-full h-full object-cover" />
                              </div>
                              <span className="text-blue-900 font-bold text-sm">UK</span>
                            </div>
                            <div className="flex-1 bg-white">
                              <input
                                type="text"
                                id="registration"
                                value={registrationNumber}
                                onChange={handleRegistrationChange}
                                placeholder="AB12 CDE"
                                className="w-full h-full text-2xl font-bold tracking-widest text-center uppercase border-0 focus:ring-0 focus:outline-none bg-transparent text-gray-900 py-4 px-4"
                                maxLength={10}
                                disabled={isLoading}
                                autoFocus
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading || !registrationNumber.trim()}
                      className={`w-full py-3 px-6 text-white font-bold text-lg rounded-lg ${
                        isLoading || !registrationNumber.trim() 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                      } transition duration-200 ease-in-out shadow-md`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                          Searching...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                          Search Vehicle
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {step === 2 && vehicle && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Your Vehicle</h2>
                <p className="mb-6 text-gray-600">Please confirm that these details match your vehicle.</p>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Registration</p>
                      <p className="text-xl font-bold text-gray-800">{formatRegistration(vehicle.registrationNumber)}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Make</p>
                      <p className="text-xl font-bold text-gray-800">{vehicle.make}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Year of Manufacture</p>
                      <p className="text-xl font-bold text-gray-800">{vehicle.yearOfManufacture}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Engine Size</p>
                      <p className="text-xl font-bold text-gray-800">{vehicle.engineCapacity ? `${vehicle.engineCapacity}cc` : 'Not available'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    onClick={handleEditRegistration}
                    className="py-3 px-6 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out shadow-sm flex-1"
                  >
                    Check Another Car
                  </button>
                  <button
                    onClick={handleConfirmVehicle}
                    className="py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition duration-200 ease-in-out shadow-sm flex-1"
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