'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUpdateVideoMutation } from '@/redux/features/videos/videoApi';
import { useDropzone } from 'react-dropzone';
import { useCloudinaryUpload } from '@/components/uploadFiles/uploadCloudinary';

// Enhanced form validation schema
const formSchema: yup.ObjectSchema<FormData> = yup.object().shape({
  title: yup.string().required('Title is required').max(100),
  description: yup.string().required('Description is required').min(50),
  videoYoutubeLink: yup.string()
    .url('Please enter a valid URL')
    .required('YouTube link is required')
    .matches(
      /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
      'Must be a valid YouTube URL'
    ),
  videoEmbedLink: yup.string()
    .url('Please enter a valid URL')
    .required('Embed link is required'),
  videoThumbnail: yup.string()
    .url('Please enter a valid URL')
    .required('Video Thumbnail is required'),
  metaTitle: yup.string()
    .required('Meta title is required')
    .max(60, 'Meta title should be under 60 characters'),
  metaDescription: yup.string()
    .required('Meta description is required')
    .max(160, 'Meta description should be under 160 characters'),
  metaImage: yup
    .mixed<File | string>()
    .required('Meta image is required')
    .test('fileType', 'Only image files are accepted', (value) => {
      if (typeof value === 'string') return true; // Allow existing URLs
      return value instanceof File && ['image/jpeg', 'image/png', 'image/webp'].includes(value.type);
    })
});

type FormData = {
  title: string;
  description: string;
  videoYoutubeLink: string;
  videoEmbedLink: string;
  videoThumbnail: string;
  metaTitle: string;
  metaDescription: string;
  metaImage: File | string;
};

export default function VideoForm() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metaImagePreview, setMetaImagePreview] = useState<string | null>(null);
  const isEditMode = !!params.id;
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    setValue,
    watch,
    trigger
  } = useForm<FormData>({
    resolver: yupResolver(formSchema)
  });

  const metaDescription = watch('metaDescription');

  // Meta image dropzone
  const onMetaImageDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('metaImage', file, { shouldValidate: true });
      
      const reader = new FileReader();
      reader.onload = () => {
        setMetaImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      trigger('metaImage');
    }
  }, [setValue, trigger]);

  const { getRootProps: getMetaImageRootProps, getInputProps: getMetaImageInputProps, isDragActive: isMetaImageDragActive } = useDropzone({
    onDrop: onMetaImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchVideoData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`/api/videos/${params.id}`);
          const videoData = response.data;
          
          // Set form values with fetched data
          setValue('title', videoData.title);
          setValue('description', videoData.description);
          setValue('videoYoutubeLink', videoData.videoYoutubeLink);
          setValue('videoEmbedLink', videoData.videoEmbedLink);
          setValue('videoThumbnail', videoData.videoThumbnail);
          setValue('metaTitle', videoData.metaTitle || '');
          setValue('metaDescription', videoData.metaDescription || '');
          setValue('metaImage', videoData.metaImage || '');
          setMetaImagePreview(videoData.metaImage || null);
        } catch (error) {
          toast.error('Failed to fetch video data');
          console.error('Fetch error:', error);
          router.push('/admin/videos');
        } finally {
          setIsLoading(false);
        }
      };

      fetchVideoData();
    }
  }, [isEditMode, params.id, router, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let metaImageUrl = typeof data.metaImage === 'string' ? data.metaImage : null;
      
      // Upload new meta image if it's a file
      if (data.metaImage instanceof File) {
        metaImageUrl = await useCloudinaryUpload(data.metaImage);
        if (!metaImageUrl) {
          toast.error('Failed to upload meta image');
          return;
        }
      }

      const videoData = {
        ...data,
        metaImage: metaImageUrl
      };

      if (isEditMode) {
        // Update existing video
        const res = await updateVideo({ id: params.id, data: videoData }).unwrap();
        if (res?.modifiedCount > 0) {
          toast.success('Video updated successfully');
          router.push('/dashboard/video-list');
        }
      } else {
        // Create new video
        const res = await axios.post("/api/videos", videoData);
        if (res?.data?.insertedId) {
          toast.success("Video created successfully");
          reset();
          setMetaImagePreview(null);
          router.push('/admin/videos');
        }
      }
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} video`);
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <div className="bg-white rounded-xl shadow-2xl p-4 md:p-6 border border-orange-500/20">
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
            {/* Loading animation */}
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

            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                {isEditMode ? 'Loading Video Data' : 'Preparing Video Form'}
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
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Toaster position="top-center" />
      <div className="bg-white rounded-xl shadow-2xl p-4 md:p-6 border border-orange-500/20">
        <div className="flex items-center justify-between mb-8 border-b border-orange-500/30 pb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            {isEditMode ? 'Update Video' : 'Add New Video'}
          </h2>
          <div className="h-1 flex-1 bg-gradient-to-r from-orange-500/10 via-orange-500/40 to-orange-500/10 mx-4"></div>
          <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Video Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  {...register('title')}
                  disabled={isSubmitting}
                  className={`w-full px-5 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200 ${
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
                <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description')}
                  disabled={isSubmitting}
                  className={`w-full px-5 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200 ${
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
                <label htmlFor="videoEmbedLink" className="block text-sm font-medium text-black mb-2">
                  Video Embed URL *
                </label>
                <input
                  id="videoEmbedLink"
                  type="url"
                  {...register('videoEmbedLink')}
                  disabled={isSubmitting}
                  className={`w-full px-5 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200 ${
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
                <label htmlFor="videoYoutubeLink" className="block text-sm font-medium text-black mb-2">
                  Video YouTube URL *
                </label>
                <input
                  id="videoYoutubeLink"
                  type="url"
                  {...register('videoYoutubeLink')}
                  disabled={isSubmitting}
                  className={`w-full px-5 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200 ${
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
                <label htmlFor="videoThumbnail" className="block text-sm font-medium text-black mb-2">
                  Video Thumbnail URL *
                </label>
                <input
                  id="videoThumbnail"
                  type="url"
                  {...register('videoThumbnail')}
                  disabled={isSubmitting}
                  className={`w-full px-5 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200 ${
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
            </div>

            {/* Right Column - Meta Data */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">SEO Meta Data</h3>
                
                {/* Meta Title */}
                <div className="mb-4">
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title *
                  </label>
                  <input
                    id="metaTitle"
                    type="text"
                    {...register('metaTitle')}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-400 transition-all duration-200 ${
                      errors.metaTitle ? 'border-orange-500' : 'border-gray-300'
                    }`}
                    placeholder="Meta title for SEO"
                  />
                  {errors.metaTitle && (
                    <p className="mt-1 text-sm text-orange-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.metaTitle.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Recommended: 50-60 characters</p>
                </div>

                {/* Meta Description */}
                <div className="mb-4">
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description *
                  </label>
                  <textarea
                    id="metaDescription"
                    rows={3}
                    {...register('metaDescription')}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-400 transition-all duration-200 ${
                      errors.metaDescription ? 'border-orange-500' : 'border-gray-300'
                    }`}
                    placeholder="Meta description for SEO"
                  />
                  {errors.metaDescription && (
                    <p className="mt-1 text-sm text-orange-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.metaDescription.message}
                    </p>
                  )}
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">Recommended: 150-160 characters</p>
                    <p className="text-xs text-gray-500">{metaDescription?.length || 0}/160</p>
                  </div>
                </div>

                {/* Meta Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Image *
                  </label>
                  <div
                    {...getMetaImageRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ${
                      isMetaImageDragActive 
                        ? 'border-orange-500 bg-orange-500/10' 
                        : errors.metaImage 
                          ? 'border-orange-500' 
                          : 'border-gray-300 hover:border-orange-400/50'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input {...getMetaImageInputProps()} disabled={isSubmitting} />
                    {metaImagePreview ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={metaImagePreview} 
                          alt="Meta Preview" 
                          className="max-h-40 w-full object-cover rounded-lg mb-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">Click or drag to replace</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-500">
                          {isMetaImageDragActive ? 'Drop the image here' : 'Click to upload'}
                        </p>
                        <p className="text-xs text-gray-400">Optimal size: 1200×630 pixels</p>
                      </div>
                    )}
                  </div>
                  {errors.metaImage && (
                    <p className="mt-2 text-sm text-orange-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.metaImage.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => isEditMode ? router.back() : reset()}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-red-600 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditMode ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Reset
                </>
              )}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUpdating}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {isSubmitting || isUpdating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Updating...' : 'Submitting...'}
                </span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  {isEditMode ? 'Update Video' : 'Submit'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}