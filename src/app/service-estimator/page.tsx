'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getVehicleByRegistration, VehicleDetails } from '@/services/vehicleApi';
import { ServiceType, getAllServicesWithPrices } from '@/services/pricingConfig';

export default function ServiceEstimator() {
  const [regNumber, setRegNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);
  const [servicePrices, setServicePrices] = useState<Array<{service: ServiceType, price: number}>>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Calculate total price when selected services change
  useEffect(() => {
    if (servicePrices.length > 0) {
      const total = servicePrices
        .filter(item => selectedServices.includes(item.service))
        .reduce((sum, item) => sum + item.price, 0);
      setTotalPrice(total);
    }
  }, [selectedServices, servicePrices]);
  
  // Toggle service selection
  const toggleService = (service: string) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!regNumber) {
      setError('Please enter a valid registration number');
      return;
    }
    
    setLoading(true);
    setError('');
    setShowResults(false);
    
    try {
      // Get vehicle details from API
      const vehicle = await getVehicleByRegistration(regNumber);
      
      if (!vehicle) {
        setError('Could not find vehicle with that registration number');
        setLoading(false);
        return;
      }
      
      // Calculate service prices based on vehicle details
      const prices = getAllServicesWithPrices(
        vehicle.make,
        vehicle.engineCapacity,
        vehicle.yearOfManufacture
      );
      
      // Update state with results
      setVehicleDetails(vehicle);
      setServicePrices(prices);
      setShowResults(true);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching vehicle data:', err);
      setError('An error occurred while fetching vehicle data. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Hero section with background image */}
      <div className="relative pt-24 pb-12">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange/10 to-transparent opacity-30"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-orange/5 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                <span className="text-orange">Premium</span> <span className="text-white">Service Estimator</span>
              </h1>
              <div className="w-24 h-1 bg-orange mx-auto mb-6"></div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Get an instant, personalized service quote for your vehicle in seconds
              </p>
            </div>
            
            {!showResults && (
              <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-1 shadow-xl">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-8 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center">
                      <span className="text-orange font-bold">1</span>
                    </div>
                    <div className="h-0.5 w-16 bg-gray-700"></div>
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400 font-bold">2</span>
                    </div>
                    <div className="h-0.5 w-16 bg-gray-700"></div>
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400 font-bold">3</span>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-center mb-6">Enter Your Vehicle Registration</h2>
                  
                  <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="relative mb-8">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg className="w-5 h-5 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                        placeholder="Enter UK Reg (e.g., AB12 CDE)"
                        className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent text-center text-xl tracking-widest"
                        maxLength={10}
                      />
                      {error && (
                        <div className="absolute -bottom-6 left-0 right-0 text-center">
                          <p className="text-red-500 text-sm bg-red-500/10 py-1 px-2 rounded inline-block">{error}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`bg-gradient-to-r from-orange to-orange-dark text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${loading ? 'opacity-70 cursor-not-allowed' : ''} shadow-lg shadow-orange/20 w-full max-w-xs`}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Checking Vehicle...
                          </div>
                        ) : 'Get Service Estimate'}
                      </button>
                    </div>
                  </form>
                  
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-orange/20 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h3 className="font-semibold mb-1">Fast Results</h3>
                      <p className="text-gray-400 text-center text-sm">Get instant quotes in seconds</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-orange/20 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                      </div>
                      <h3 className="font-semibold mb-1">Trusted Service</h3>
                      <p className="text-gray-400 text-center text-sm">IMI certified technicians</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-orange/20 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h3 className="font-semibold mb-1">Best Price Guarantee</h3>
                      <p className="text-gray-400 text-center text-sm">We'll beat any like-for-like quote</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Vehicle Details and Service Prices */}
            {showResults && vehicleDetails && (
              <div className="bg-dark-gray bg-opacity-70 border border-gray-700 rounded-lg p-8 shadow-lg">
                {/* Vehicle Information Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-gray-700 pb-6">
                  {/* Car Icon and Details */}
                  <div className="flex items-start gap-4">
                    <div className="bg-black bg-opacity-50 p-3 rounded-lg">
                      <svg className="w-12 h-12 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">
                          {vehicleDetails.registrationNumber}
                        </h2>
                        <button className="text-orange text-sm hover:underline">
                          Edit
                        </button>
                      </div>
                      <p className="text-xl font-semibold text-white mt-1">
                        {vehicleDetails.make} {vehicleDetails.model}
                      </p>
                      <p className="text-gray-300">
                        {vehicleDetails.engineCapacity}cc {vehicleDetails.fuelType} {vehicleDetails.yearOfManufacture}
                      </p>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="flex items-start gap-4">
                    <div className="bg-black bg-opacity-50 p-3 rounded-lg">
                      <svg className="w-12 h-12 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">
                          Autocentre - London
                        </h2>
                        <button className="text-orange text-sm hover:underline">
                          Edit
                        </button>
                      </div>
                      <p className="text-gray-300 mt-1">
                        (0.81 miles away)
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-green-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Mobile fitting is available in your area</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Guarantees */}
                <div className="flex flex-wrap justify-between items-center bg-gray-800 p-4 rounded-lg mb-8">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Never beaten on price</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Technicians trained to IMI standard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>2 year work quality guarantee</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-lg font-medium mb-2">{servicePrices.length} results</p>
                </div>
                
                {/* Service Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {/* Full Service + MOT Bundle */}
                  <div className="bg-black bg-opacity-60 border border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-orange text-center py-1 text-sm font-bold">
                      BUNDLE DEAL
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-center mb-3">
                        <div className="bg-gray-800 rounded-full p-3">
                          <svg className="w-10 h-10 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-center font-bold mb-4">Full Service + MOT Bundle</h3>
                      <p className="text-2xl font-bold text-center mb-4">£{servicePrices.find(s => s.service === 'Full Service')?.price! + servicePrices.find(s => s.service === 'MOT Test')?.price! - 20}</p>
                      <button className="w-full bg-orange hover:bg-orange-dark text-white py-2 rounded-md font-medium transition-colors duration-200">
                        Select
                      </button>
                    </div>
                  </div>
                  
                  {/* Full Service */}
                  <div className="bg-black bg-opacity-60 border border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-orange text-center py-1 text-sm font-bold">
                      RECOMMENDED
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-center mb-3">
                        <div className="bg-gray-800 rounded-full p-3">
                          <svg className="w-10 h-10 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-center font-bold mb-4">Full Service</h3>
                      <p className="text-2xl font-bold text-center mb-4">£{servicePrices.find(s => s.service === 'Full Service')?.price}</p>
                      <button className="w-full bg-orange hover:bg-orange-dark text-white py-2 rounded-md font-medium transition-colors duration-200">
                        Select
                      </button>
                    </div>
                  </div>
                  
                  {/* Interim Service */}
                  <div className="bg-black bg-opacity-60 border border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-transparent text-center py-1 text-sm font-bold">
                      &nbsp;
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-center mb-3">
                        <div className="bg-gray-800 rounded-full p-3">
                          <svg className="w-10 h-10 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-center font-bold mb-4">Interim Service</h3>
                      <p className="text-2xl font-bold text-center mb-4">£{servicePrices.find(s => s.service === 'Interim Service')?.price}</p>
                      <button className="w-full bg-orange hover:bg-orange-dark text-white py-2 rounded-md font-medium transition-colors duration-200">
                        Select
                      </button>
                    </div>
                  </div>
                  
                  {/* Major Service */}
                  <div className="bg-black bg-opacity-60 border border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-transparent text-center py-1 text-sm font-bold">
                      &nbsp;
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-center mb-3">
                        <div className="bg-gray-800 rounded-full p-3">
                          <svg className="w-10 h-10 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-center font-bold mb-4">Major Service</h3>
                      <p className="text-2xl font-bold text-center mb-4">£{servicePrices.find(s => s.service === 'Major Service')?.price}</p>
                      <button className="w-full bg-orange hover:bg-orange-dark text-white py-2 rounded-md font-medium transition-colors duration-200">
                        Select
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Other Services */}
                <div className="bg-black bg-opacity-60 border border-gray-700 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold mb-4">Other Available Services</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {servicePrices
                      .filter(item => !['Full Service', 'Interim Service', 'Major Service', 'MOT Test'].includes(item.service))
                      .map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border-b border-gray-700 hover:bg-black hover:bg-opacity-30 transition-colors">
                          <span>{item.service}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-orange">£{item.price}</span>
                            <button className="bg-transparent hover:bg-orange/20 text-orange px-2 py-1 rounded border border-orange text-sm">
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setRegNumber('');
                    }}
                    className="bg-transparent hover:bg-dark-gray text-orange hover:text-orange-dark border border-orange px-4 py-2 rounded-md font-medium transition-colors duration-200 inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Check Another Vehicle
                  </button>
                  
                  <button className="bg-orange hover:bg-orange-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Book a Service
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Service Cost Estimator Section - Only show when not displaying results */}
      {!showResults && (
        <div className="bg-dark-gray py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Service Cost Estimator</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-black bg-opacity-60 border border-gray-700 p-6 rounded-lg">
                <div className="text-orange text-4xl font-bold mb-2">01</div>
                <h3 className="text-xl font-bold mb-4">Enter Registration</h3>
                <p className="text-gray-400">Simply enter your vehicle registration number in the form above.</p>
              </div>
              
              <div className="bg-black bg-opacity-60 border border-gray-700 p-6 rounded-lg">
                <div className="text-orange text-4xl font-bold mb-2">02</div>
                <h3 className="text-xl font-bold mb-4">Confirm Vehicle</h3>
                <p className="text-gray-400">We'll identify your vehicle make, model, and specifications automatically.</p>
              </div>
              
              <div className="bg-black bg-opacity-60 border border-gray-700 p-6 rounded-lg">
                <div className="text-orange text-4xl font-bold mb-2">03</div>
                <h3 className="text-xl font-bold mb-4">Get Your Estimate</h3>
                <p className="text-gray-400">Receive an instant, personalized service cost estimate based on your specific vehicle.</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/" className="bg-transparent hover:bg-dark-gray text-orange hover:text-orange-dark border border-orange px-6 py-3 rounded-md font-medium transition-colors duration-200 inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-orange hover:bg-orange-dark text-white px-4 py-3 rounded-full flex items-center shadow-lg">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          Chat with us
        </button>
      </div>
    </main>
  );
}
