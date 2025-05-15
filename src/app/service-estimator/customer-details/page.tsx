'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VehicleDetails } from '@/services/vehicleApi';
import { ServiceOption, availableServices } from '@/services/serviceConfig';

export default function CustomerDetails() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [otherService, setOtherService] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Create references to the form and iframe
  const formRef = useRef<HTMLFormElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Retrieve data from localStorage on component mount
  useEffect(() => {
    try {
      // Get vehicle data
      const storedVehicle = localStorage.getItem('selectedVehicle');
      if (storedVehicle) {
        setVehicle(JSON.parse(storedVehicle));
      }
      
      // Get selected services
      const storedServices = localStorage.getItem('selectedServices');
      if (storedServices) {
        setSelectedServices(JSON.parse(storedServices));
      }
      
      // Get other service
      const storedOtherService = localStorage.getItem('otherService');
      if (storedOtherService) {
        setOtherService(storedOtherService);
      }
      
      // Get total price
      const storedPrice = localStorage.getItem('totalPrice');
      if (storedPrice) {
        setTotalPrice(parseFloat(storedPrice));
      }
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Format phone number
  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, '');
    return cleaned;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number (required)
    if (!phone.trim()) {
      setSubmitError('Phone number is required');
      return;
    }
    
    // Start submission
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      console.log('Starting form submission process');
      
      // Check if vehicle data exists
      if (!vehicle || !vehicle.registrationNumber) {
        throw new Error('Vehicle information is missing. Please go back and select a vehicle.');
      }
      
      // Check if services are selected
      if (selectedServices.length === 0) {
        throw new Error('No services selected. Please go back and select at least one service.');
      }
      
      // Prepare services string
      const servicesString = selectedServices.map(id => {
        const service = availableServices.find(s => s.id === id);
        return service?.name || '';
      }).join(', ') + (otherService ? `, ${otherService}` : '');
      
      // Submit the form directly to Google Apps Script if the form reference exists
      if (formRef.current) {
        // Set the form action to the Google Apps Script URL
        formRef.current.action = 'https://script.google.com/macros/s/AKfycbxgO6NKDDGYqwj6qWrpzQRnuz3CKgmdYQEfDyk3oiCzguKrwisG0louyp6XvOoah3IAgg/exec';
        formRef.current.method = 'POST';
        formRef.current.target = 'hidden-iframe'; // Submit to the iframe to prevent page redirect
        
        // Submit the form
        formRef.current.submit();
        
        console.log('Form submitted directly to Google Apps Script via hidden iframe');
        
        // If we get here, assume the submission was successful
        setTimeout(() => {
          setSubmitSuccess(true);
          
          // Clear localStorage data
          localStorage.removeItem('selectedVehicle');
          localStorage.removeItem('selectedServices');
          localStorage.removeItem('otherService');
          localStorage.removeItem('totalPrice');
          
          setIsSubmitting(false);
        }, 2000);
      } else {
        throw new Error('Form reference not available');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while submitting your request. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 pt-24">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-500">Customer Details</h1>
          <div className="h-1 w-20 bg-orange-500 mt-2"></div>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-orange-500">Customer Details</h2>
          
          {/* Hidden iframe to prevent page redirect */}
          <iframe name="hidden-iframe" style={{display: 'none'}} ref={iframeRef}></iframe>
          
          {submitSuccess ? (
            <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg text-center animate-fade-in">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center animate-success-check">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-2xl mb-2 text-orange-500 animate-slide-up">Thank You!</h3>
              <p className="text-lg mb-6 animate-slide-up animation-delay-200">Your service request has been submitted successfully.</p>
              <p className="text-gray-300 mb-8 animate-slide-up animation-delay-300">
                We've received your details and will contact you shortly to confirm your booking.
              </p>
              <div className="animate-slide-up animation-delay-400">
                <button 
                  onClick={() => window.location.href = '/service-estimator'}
                  className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                >
                  Start New Estimate
                </button>
              </div>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit}>
              {/* Hidden fields for Google Apps Script - simple direct parameters */}
              <input type="hidden" name="timestamp" value={new Date().toISOString()} />
              <input type="hidden" name="carRegistration" value={vehicle?.registrationNumber || ''} />
              <input type="hidden" name="vehicleMake" value={vehicle?.make || ''} />
              <input type="hidden" name="vehicleModel" value={vehicle?.model || ''} />
              <input type="hidden" name="vehicleYear" value={vehicle?.yearOfManufacture?.toString() || ''} />
              <input type="hidden" name="selectedServices" value={
                selectedServices.map(id => {
                  const service = availableServices.find(s => s.id === id);
                  return service?.name || '';
                }).join(', ') + (otherService ? `, ${otherService}` : '')
              } />
              <input type="hidden" name="totalPrice" value={totalPrice.toString()} />
              <input type="hidden" name="notes" value={otherService || ''} />
              
              {/* Vehicle Summary */}
              <div className="mb-6 bg-gray-800 p-4 rounded">
                <h3 className="text-lg font-semibold mb-2 text-orange-500">Vehicle Summary</h3>
                {vehicle ? (
                  <div>
                    <p><span className="font-semibold">Registration:</span> {vehicle.registrationNumber}</p>
                    <p><span className="font-semibold">Make:</span> {vehicle.make}</p>
                    <p><span className="font-semibold">Model:</span> {vehicle.model}</p>
                    <p><span className="font-semibold">Year:</span> {vehicle.yearOfManufacture}</p>
                  </div>
                ) : (
                  <p className="text-red-500">No vehicle selected. Please go back and select a vehicle.</p>
                )}
              </div>
              
              {/* Selected Services */}
              <div className="mb-6 bg-gray-800 p-4 rounded">
                <h3 className="text-lg font-semibold mb-2 text-orange-500">Selected Services</h3>
                {selectedServices.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {selectedServices.map(id => {
                      const service = availableServices.find(s => s.id === id);
                      return service ? (
                        <li key={id}>{service.name} - £{service.basePrice?.toFixed(2) || '0.00'}</li>
                      ) : null;
                    })}
                    {otherService && <li>{otherService}</li>}
                    <li className="font-bold mt-2">Total: £{totalPrice.toFixed(2)}</li>
                  </ul>
                ) : (
                  <p className="text-red-500">No services selected. Please go back and select services.</p>
                )}
              </div>
              
              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-orange-500">Your Contact Information</h3>
                
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    required
                  />
                </div>
              </div>
              
              {submitError && (
                <div className="bg-red-900 text-white p-3 rounded mb-4">
                  {submitError}
                </div>
              )}
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => window.location.href = '/service-estimator/service-selection'}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                  Back
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded disabled:bg-gray-500"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
