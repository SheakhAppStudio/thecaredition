"use client"

import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import { useUpdateServiceMutation } from "@/redux/features/service/serviceApi";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Service {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
}

type FormData = {
  name: string;
  description: string;
  basePrice: number;
};

const ServiceEditForm = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updateService] = useUpdateServiceMutation();

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset,
    setValue
  } = useForm<FormData>();

  // Fetch service data
  useEffect(() => {
    const fetchService = async () => {
      try {
        if (id) {
          const res = await axios.get(`/api/services/${id}`);
          setService(res.data);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        toast.error('Failed to load service data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchService();
  }, [id]);

  // Pre-fill form when service data loads
  useEffect(() => {
    if (service) {
      setValue('name', service.name);
      setValue('description', service.description);
      setValue('basePrice', service.basePrice);
    }
  }, [service, setValue]);

  const handleFormSubmit = async (data: FormData) => {
    try {
      if (!id) {
        throw new Error('Service ID is missing');
      }

      const response = await updateService({
        id :id,
        data: {
          name: data.name.trim(),
          description: data.description.trim(),
          basePrice: Number(data.basePrice)
        }
      }).unwrap();
console.log(response?.result)
      if ( response?.result?.modifiedCount > 0) {
        toast.success("Service updated successfully");
        router.push('/dashboard/services-list');
      } 
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Error updating service. Please try again.');
    }
  };

 if (isLoading) {
  return (
    <main className="min-h-screen">
      <div className="bg-white rounded-xl shadow-2xl  p-4 md:p-6 border border-orange-500/20">
        <div className="flex flex-col items-center justify-center h-96 space-y-6">
          {/* Animated logo/icon */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-orange-500/10 animate-ping"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-white animate-pulse" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                />
              </svg>
            </div>
          </div>

          {/* Loading text with animated dots */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-medium bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
             Loading Service Data
            </h3>
            <p className="text-orange-300/80 flex justify-center items-center">
              Loading
              <span className="flex space-x-1 ml-1">
                <span className="animate-bounce inline-block h-1 w-1 rounded-full bg-orange-400 [animation-delay:-0.3s]"></span>
                <span className="animate-bounce inline-block h-1 w-1 rounded-full bg-orange-500 [animation-delay:-0.15s]"></span>
                <span className="animate-bounce inline-block h-1 w-1 rounded-full bg-orange-600"></span>
              </span>
            </p>
          </div>

          {/* Contained progress bar */}
          <div className="w-full overflow-hidden rounded-full h-1.5 bg-gray-800 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
              style={{
                width: '100%',
                transform: 'translateX(-100%)',
                animation: 'progress 1.5s ease-in-out infinite',
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* CSS for proper progress animation */}
      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </main>
  );
}

  if (!service) return <div>Service not found</div>;

  return (
    <main className="min-h-screen ">
      <Toaster />
      <form 
        onSubmit={handleSubmit(handleFormSubmit)} 
        className="bg-white rounded-xl shadow-2xl  p-4 md:p-6 border border-orange-500/20"
      >
        <div className="flex items-center justify-between mb-8 border-b border-orange-500/30 pb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Update Service
          </h2>
          <div className="h-1 flex-1 bg-gradient-to-r from-orange-500/10 via-orange-500/40 to-orange-500/10 mx-4"></div>
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        </div>
        
        {/* Service Name Field */}
        <div className="mb-8">
          <label htmlFor="name" className="block text-sm font-medium text-black mb-3">
            Service Name *
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { 
              required: 'Name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters'
              }
            })}
            className="w-full px-5 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
             text-black placeholder-gray-500 transition-all duration-200"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-orange-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Service Description Field */}
        <div className="mb-8">
          <label htmlFor="description" className="block text-sm font-medium text-black mb-3">
            Service Description *
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description', { 
              required: 'Description is required',
              minLength: {
                value: 10,
                message: 'Description must be at least 10 characters'
              }
            })}
            className="w-full px-5 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-orange-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Base Price Field */}
        <div className="mb-8">
          <label htmlFor="basePrice" className="block text-sm font-medium text-black mb-3">
            Base Price *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">£</span>
            <input
              id="basePrice"
              type="number"
              step="0.01"
              min="0"
              {...register('basePrice', { 
                required: 'Base price is required',
                min: {
                  value: 0.01,
                  message: 'Price must be greater than 0'
                }
              })}
              className="w-full pl-8 pr-5  px-5 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200"
            />
          </div>
          {errors.basePrice && (
            <p className="mt-2 text-sm text-orange-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.basePrice.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-6 ">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border  border-red-600  text-red-600 hover:text-white hover:bg-gradient-to-r  hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Update Service
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

export default ServiceEditForm;