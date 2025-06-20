'use client'; // Add this at the top for Next.js 13+ App Router

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Toaster } from 'react-hot-toast';

// Define form validation schema
const formSchema = yup.object().shape({
  title: yup.string().required('Title is required').max(100),
  description: yup.string().required('Description is required').min(50),
  videoYoutubeLink: yup.string().url('Please enter a valid URL').required('Video link is required'),
  videoEmbedLink: yup.string().url('Please enter a valid URL').required('Video link is required'),
  videoThumbnail: yup.string().url('Please enter a valid URL').required('Video Thumbnail is required')
});

type FormData = yup.InferType<typeof formSchema>;

export default function VideoForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm<FormData>({
    resolver: yupResolver(formSchema)
  });

  const onSubmit = async(data: FormData) => {
     const res = await axios.post("/api/videos", data)
      if(res?.data?.insertedId){
        toast.success("blog uploaded successfully")
 reset();
     
      }
  };

  return (
  <main className="min-h-screen py-8">
  <Toaster />
  <div className="max-w-md mx-auto p-8 bg-black rounded-xl shadow-2xl border border-orange-500/20">
    <div className="flex items-center justify-between mb-8 border-b border-orange-500/30 pb-4">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
        Add New Video
      </h2>
      <div className="h-1 flex-1 bg-gradient-to-r from-orange-500/10 via-orange-500/40 to-orange-500/10 mx-4"></div>
      <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
    
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-orange-300 mb-2">
          Title *
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 ${
            errors.title ? 'border-orange-500' : 'border-gray-700'
          }`}
        />
        {errors.title && (
          <p className="mt-2 text-sm text-orange-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-orange-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 ${
            errors.description ? 'border-orange-500' : 'border-gray-700'
          }`}
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

      {/* Video Embed URL Field */}
      <div>
        <label htmlFor="videoEmbedLink" className="block text-sm font-medium text-orange-300 mb-2">
          Video Embed URL *
        </label>
        <input
          id="videoEmbedLink"
          type="url"
          {...register('videoEmbedLink')}
          className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 ${
            errors.videoEmbedLink ? 'border-orange-500' : 'border-gray-700'
          }`}
        />
        {errors.videoEmbedLink && (
          <p className="mt-2 text-sm text-orange-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.videoEmbedLink.message}
          </p>
        )}
      </div>

      {/* Video YouTube URL Field */}
      <div>
        <label htmlFor="videoYoutubeLink" className="block text-sm font-medium text-orange-300 mb-2">
          Video YouTube URL *
        </label>
        <input
          id="videoYoutubeLink"
          type="url"
          {...register('videoYoutubeLink')}
          className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 ${
            errors.videoYoutubeLink ? 'border-orange-500' : 'border-gray-700'
          }`}
        />
        {errors.videoYoutubeLink && (
          <p className="mt-2 text-sm text-orange-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.videoYoutubeLink.message}
          </p>
        )}
      </div>

      {/* Video Thumbnail Field */}
      <div>
        <label htmlFor="videoThumbnail" className="block text-sm font-medium text-orange-300 mb-2">
          Video Thumbnail URL *
        </label>
        <input
          id="videoThumbnail"
          type="url"
          {...register('videoThumbnail')}
          className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 ${
            errors.videoThumbnail ? 'border-orange-500' : 'border-gray-700'
          }`}
        />
        {errors.videoThumbnail && (
          <p className="mt-2 text-sm text-orange-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.videoThumbnail.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800">
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-2 border border-gray-700 rounded-lg text-orange-300 hover:bg-gray-800/50 hover:border-orange-400/30 transition-all duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reset
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 shadow-lg hover:shadow-orange-500/20 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
          Submit
        </button>
      </div>
    </form>
  </div>
</main>
  );
}