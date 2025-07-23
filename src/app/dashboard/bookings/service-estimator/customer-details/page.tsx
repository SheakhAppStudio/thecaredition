'use client';
import toast, { Toaster } from "react-hot-toast";
import React, { useState, useEffect, useRef } from 'react';
import { VehicleDetails } from '@/services/vehicleApi';
import axios from 'axios';
import { useRouter } from "next/navigation";


interface Service {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
}

export default function CustomerDetails() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [otherService, setOtherService] = useState('');
  console.log(otherService)
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Retrieve data from localStorage and fetch services
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get stored data
        const storedVehicle = localStorage.getItem('selectedVehicle');
        const storedServices = localStorage.getItem('selectedServices');
        const storedOtherService = localStorage.getItem('otherService');
        const storedPrice = localStorage.getItem('totalPrice');
        console.log(storedVehicle, storedServices, storedOtherService, storedPrice)
        if (storedVehicle) setVehicle(JSON.parse(storedVehicle));
        if (storedServices) setSelectedServiceIds(JSON.parse(storedServices));
        if (storedOtherService) setOtherService(storedOtherService);
        if (storedPrice) setTotalPrice(parseFloat(storedPrice));

        // Fetch services if we have IDs
        if (storedServices) {
          const serviceIds = JSON.parse(storedServices);
          if (serviceIds.length > 0) {
            setServicesLoading(true);
            const response = await axios.post('/api/services/get-by-ids', {
              ids: serviceIds
            });
            setServices(response.data);
          }
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        setServicesError('Failed to load services. Please try again.');
      } finally {
        setIsLoading(false);
        setServicesLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total price when services or vehicle changes
  useEffect(() => {
    if (services.length > 0 && vehicle) {
      const price = services.reduce((sum, service) => sum + service.basePrice, 0);
      setTotalPrice(price);
    }
  }, [services, vehicle]);

  const formatPhoneNumber = (input: string) => input.replace(/\D/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setSubmitError('Phone number is required');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      if (!vehicle?.registrationNumber) {
        toast.error('Vehicle information is missing');
      }
      
      if (selectedServiceIds.length === 0 && !otherService) {
        toast.error('No services selected');
      }
      
      // Submit to Google Apps Script
      // if (formRef.current) {
      //   // formRef.current.action = 'https://script.google.com/macros/s/AKfycbxgO6NKDDGYqwj6qWrpzQRnuz3CKgmdYQEfDyk3oiCzguKrwisG0louyp6XvOoah3IAgg/exec';
      //   // formRef.current.method = 'POST';
      //   // formRef.current.target = 'hidden-iframe';
      //   // formRef.current.submit();
        
      //   // Also save to our database
      //   // await axios.post('/api/bookings', {
      //   //   customer: { name, email, phone },
      //   //   vehicle,
      //   //   serviceIds: selectedServiceIds,
      //   //   otherService,
      //   //   totalPrice,
      //   //   status: 'New Request'
      //   // });

      //   setSubmitSuccess(true);
      //   // localStorage.removeItem('selectedVehicle');
      //   // localStorage.removeItem('selectedServices');
      //   // localStorage.removeItem('otherService');
      //   // localStorage.removeItem('totalPrice');
      // }
      console.log({
          customer: { name, email, phone },
          vehicle,
          serviceIds: selectedServiceIds,
          otherService,
          totalPrice,
          status: 'New Request'
        })
         const res =   await axios.post('/api/bookings', {
          customer: { name, email, phone },
          vehicle : vehicle?.registrationNumber,
          serviceIds: selectedServiceIds,
          otherService,
          totalPrice,
          status: 'New Request',
          isOnline : 'manual',
          confirmedPrice: totalPrice
        });
        if(res?.data?.insertedId){
            localStorage.removeItem('selectedVehicle');
        localStorage.removeItem('selectedServices');
        localStorage.removeItem('otherService');
        localStorage.removeItem('totalPrice');
            toast.success("booking successfully completed")
             setTimeout(() => {
               router.push("/dashboard/bookings/new");
            }, 1500);
           
        }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // if (servicesError) {
  //   return (
  //     <div className="min-h-screen bg-gray-950 text-white p-4 flex items-center justify-center">
  //       <div className="text-center">
  //         <p className="text-red-500 mb-4">{servicesError}</p>
  //         <button 
  //           onClick={() => window.location.reload()}
  //           className="bg-orange-500 text-white px-4 py-2 rounded"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

 return (
  <div className="min-h-screen bg-gray-50">
    <Toaster/>
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
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Customer Details</h1>
        <p className="text-gray-300 mt-2">Complete your booking information</p>
      </div>
    </div> */}

    {/* Main content */}
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-8 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Your Booking</h2>
          
          {submitSuccess ? (
            <div className="text-center p-8">
              {/* Success message */}
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit}>
              <input type="hidden" name="timestamp" value={new Date().toISOString()} />
              <input type="hidden" name="carRegistration" value={vehicle?.registrationNumber || ''} />
              <input type="hidden" name="vehicleMake" value={vehicle?.make || ''} />
              <input type="hidden" name="vehicleModel" value={vehicle?.model || ''} />
              <input type="hidden" name="vehicleYear" value={vehicle?.yearOfManufacture?.toString() || ''} />
              <input type="hidden" name="selectedServices" value={
                services.map(s => s.name).join(', ') + (otherService ? `, ${otherService}` : '')
              } />
              <input type="hidden" name="totalPrice" value={totalPrice.toString()} />
              <input type="hidden" name="notes" value={otherService || ''} />
              
              {/* Vehicle Summary */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-red-600">Vehicle Summary</h3>
                {vehicle ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Registration</p>
                      <p className="font-medium text-gray-800">{vehicle.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Make</p>
                      <p className="font-medium text-gray-800">{vehicle.make}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Model</p>
                      <p className="font-medium text-gray-800">{vehicle.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium text-gray-800">{vehicle.yearOfManufacture}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-500">No vehicle selected</p>
                )}
              </div>
              
              {/* Selected Services */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-red-600">Selected Services</h3>
                {servicesLoading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-500"></div>
                  </div>
                ) : services.length > 0 || otherService.trim() ? (
                  <div>
                    <ul className="space-y-2 mb-3">
                      {services.map(service => (
                        <li key={service._id} className="flex justify-between">
                          <span className="text-gray-600">{service.name}</span>
                          <span className="font-medium text-gray-800">£{service.basePrice.toFixed(2)}</span>
                        </li>
                      ))}
                      {otherService && <li className="text-gray-600">{otherService}</li>}
                    </ul>
                    {services.length > 0 && (
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                        <span className="font-bold text-gray-800">Total Estimate</span>
                        <span className="font-bold text-red-600">£{totalPrice.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-red-500">No services selected</p>
                )}
              </div>
              
              {/* Customer Information Form */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-red-600">Your Contact Information</h3>
                
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
              </div>
              
              {submitError && (
                <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4">
                  {submitError}
                </div>
              )}
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/bookings/service-estimator/service-selection')}
                  className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Back
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`py-2 px-6 rounded-lg font-medium ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                  } transition duration-200`}
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  </div>
);
}