'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getVehicleByRegistration, isValidUKRegistration, VehicleDetails } from '@/services/vehicleApi';

interface VehicleLookupProps {
  darkMode?: boolean;
  compact?: boolean;
}

export default function VehicleLookup({ darkMode = false, compact = false }: VehicleLookupProps) {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        // Store vehicle details in localStorage for use in the service selection page
        try {
          // Make sure to stringify the vehicle object properly
          const vehicleString = JSON.stringify(vehicleData);
          localStorage.setItem('selectedVehicle', vehicleString);
          console.log('Vehicle data stored:', vehicleString);
          
          // Navigate to the service selection page
          window.location.href = '/service-estimator/service-selection';
        } catch (error) {
          console.error('Error storing vehicle data:', error);
          setError('There was an error saving your vehicle information. Please try again.');
        }
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

  const bgColor = darkMode ? 'bg-black' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-black';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-300';
  
  return (
    <div className={`${bgColor} ${textColor} ${compact ? 'p-4' : 'p-8'} rounded-lg shadow-lg`}>
      <div className="text-center mb-6">
        <h3 className={`text-xl ${compact ? 'text-lg' : 'text-2xl'} font-bold italic uppercase ${darkMode ? 'text-[#f56e13]' : 'text-[#c40b0b]'}`}>
          Check Your Vehicle
        </h3>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} ${compact ? 'text-sm' : 'text-base'} mt-2`}>
          Enter your registration to get started
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="registration" className="block text-sm font-medium mb-1">
            Vehicle Registration
          </label>
          <input
            type="text"
            id="registration"
            value={formatRegistration(registrationNumber)}
            onChange={handleRegistrationChange}
            placeholder="e.g. AB12 CDE"
            className="w-full py-3 px-4 bg-yellow-400 text-black font-bold placeholder-black/70 focus:outline-none rounded-sm uppercase"
            maxLength={10}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 ${darkMode ? 'bg-[#f56e13]' : 'bg-[#c40b0b]'} hover:bg-opacity-90 text-white font-bold transition-colors duration-200 rounded-sm relative overflow-hidden`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
              Check Vehicle
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
  );
}
