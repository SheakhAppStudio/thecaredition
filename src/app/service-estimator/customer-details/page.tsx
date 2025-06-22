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
    
    // if (!phone.trim()) {
    //   setSubmitError('Phone number is required');
    //   return;
    // }
    
    // setIsSubmitting(true);
    // setSubmitError(null);
    
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
          status: 'New Request'
        });
        if(res?.data?.insertedId){
            localStorage.removeItem('selectedVehicle');
        localStorage.removeItem('selectedServices');
        localStorage.removeItem('otherService');
        localStorage.removeItem('totalPrice');
            toast.success("booking successfully completed")
            router.push("/")
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
    <div className="min-h-screen bg-gray-950 text-white p-4 pt-24">
      <Toaster/>
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-500">Customer Details</h1>
          <div className="h-1 w-20 bg-orange-500 mt-2"></div>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-orange-500">Customer Details</h2>
          
          <iframe name="hidden-iframe" style={{display: 'none'}} ref={iframeRef}></iframe>
          
          {submitSuccess ? (
            <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg text-center animate-fade-in">
              {/* Success UI remains the same */}
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
                  <p className="text-red-500">No vehicle selected</p>
                )}
              </div>
              
              {/* Selected Services */}
              <div className="mb-6 bg-gray-800 p-4 rounded">
                <h3 className="text-lg font-semibold mb-2 text-orange-500">Selected Services</h3>
                {servicesLoading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                ) : services.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {services.map(service => (
                      <li key={service._id}>
                        {service.name} - £{service.basePrice.toFixed(2)}
                      </li>
                    ))}
                    {otherService && <li>{otherService}</li>}
                    <li className="font-bold mt-2">Total: £{totalPrice.toFixed(2)}</li>
                  </ul>
                ) : (
                  <p className="text-red-500">No services selected</p>
                )}
              </div>
              
              {/* Customer Information Form */}
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
                    required
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