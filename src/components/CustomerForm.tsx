'use client';

import { useState } from 'react';
import { ServiceType } from '@/services/pricingConfig';

interface CustomerFormProps {
  selectedServices: string[];
  vehicleDetails: any;
  totalPrice: number;
  onSubmit: (customerData: CustomerData) => void;
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  carRegistration: string;
  selectedServices: string[];
  notes: string;
}

export default function CustomerForm({ selectedServices, vehicleDetails, totalPrice, onSubmit }: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    carRegistration: vehicleDetails?.registrationNumber || '',
    selectedServices: selectedServices,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Call the parent component's onSubmit function
      onSubmit(formData);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-900 bg-opacity-20 border border-green-500 rounded-lg p-8 text-center">
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <h3 className="text-2xl font-bold mb-2 text-white">Request Submitted Successfully!</h3>
        <p className="text-gray-300 mb-6">Thank you for your service request. We'll contact you shortly to confirm your booking.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-orange hover:bg-orange-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
        >
          Start New Estimate
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 bg-opacity-80 border border-gray-700 rounded-lg p-8">
      <h3 className="text-2xl font-bold mb-6 text-white">Complete Your Service Request</h3>
      
      {submitError && (
        <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6 text-red-200">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-gray-300 mb-2">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange"
              placeholder="Enter your email address"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-gray-300 mb-2">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange"
              placeholder="Enter your phone number"
            />
          </div>
          
          <div>
            <label htmlFor="carRegistration" className="block text-gray-300 mb-2">Car Registration</label>
            <input
              type="text"
              id="carRegistration"
              name="carRegistration"
              value={formData.carRegistration}
              onChange={handleChange}
              readOnly
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-gray-400 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="notes" className="block text-gray-300 mb-2">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange"
            placeholder="Any specific requirements or questions?"
          ></textarea>
        </div>
        
        <div className="bg-gray-800 rounded-md p-4 mb-6">
          <h4 className="text-lg font-semibold mb-2 text-white">Selected Services</h4>
          <ul className="text-gray-300 mb-4">
            {selectedServices.map(service => (
              <li key={service} className="mb-1 flex items-start">
                <svg className="w-5 h-5 text-orange mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {service}
              </li>
            ))}
          </ul>
          <div className="text-xl font-bold text-white">
            Total Estimated Price: <span className="text-orange">£{totalPrice}</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-400 mb-6">
          By submitting this form, you agree to be contacted regarding your service request.
          We'll never share your information with third parties.
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-orange hover:bg-orange-dark text-white px-6 py-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Submit Service Request'
          )}
        </button>
      </form>
    </div>
  );
}
