"use client"

import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import {useCreateServiceMutation} from "@/redux/features/service/serviceApi"
type FormData = {
  name: string;
  description: string;
  basePrice: number;
};

const ServiceForm = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset,
  } = useForm<FormData>();
  const [createService] = useCreateServiceMutation()
  const handleFormSubmit = async (data: FormData) => {
    try {
      // Prepare the final data
      const formData = {
        name: data.name,
        description: data.description,
        basePrice: Number(data.basePrice)
      };
      const res = await createService(formData)
      if(res?.data?.insertedId){
 toast.success("Service created successfully");
      reset();
      }

      
     
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error creating service. Please try again.');
    }
  };

  return (
    <main className="min-h-screen py-8">
      <Toaster />
      <form 
        onSubmit={handleSubmit(handleFormSubmit)} 
        className="bg-black rounded-xl shadow-2xl p-8 max-w-4xl mx-auto border border-orange-500/20"
      >
        <div className="flex items-center justify-between mb-8 border-b border-orange-500/30 pb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Create New Service
          </h2>
          <div className="h-1 flex-1 bg-gradient-to-r from-orange-500/10 via-orange-500/40 to-orange-500/10 mx-4"></div>
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
        
        {/* Service Title Field */}
        <div className="mb-8">
          <label htmlFor="name" className="block text-sm font-medium text-orange-300 mb-3">
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
            className="w-full px-5 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
            placeholder="Enter service name"
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
          <label htmlFor="description" className="block text-sm font-medium text-orange-300 mb-3">
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
            className="w-full px-5 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
            placeholder="Enter service description"
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
          <label htmlFor="basePrice" className="block text-sm font-medium text-orange-300 mb-3">
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
              className="w-full pl-8 pr-5 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
              placeholder="0.00"
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

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 border border-gray-700 rounded-lg text-orange-300 hover:bg-gray-800/50 hover:border-orange-400/30 transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 shadow-lg hover:shadow-orange-500/20 flex items-center disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Create Service
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

export default ServiceForm;