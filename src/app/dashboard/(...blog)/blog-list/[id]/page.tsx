"use client"

import { useForm } from 'react-hook-form';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams, useRouter } from 'next/navigation';
import 'react-quill/dist/quill.snow.css';
import { useCloudinaryUpload } from '@/components/uploadFiles/uploadCloudinary';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { useUpdateBlogMutation } from '@/redux/features/blogs/blogApi';

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="border rounded p-4 h-48 bg-gray-50 animate-pulse"></div>
});

type FormData = {
  title: string;
  image: File | null;
  content: string;
  existingImageUrl?: string;
  metaTitle: string;
  metaDescription: string;
  metaImage: File | null;
  existingMetaImageUrl?: string;
};

const BlogForm = () => {
  const params = useParams();
  const router = useRouter();
  const isEditMode = !!params.id;
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      image: null,
      content: '',
      existingImageUrl: '',
      metaTitle: '',
      metaDescription: '',
      metaImage: null,
      existingMetaImageUrl: ''
    }
  });

  const [updateBlog, {isLoading: updateLoading}] = useUpdateBlogMutation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [metaImagePreview, setMetaImagePreview] = useState<string | null>(null);
  const content = watch('content');
  const metaDescription = watch('metaDescription');

  // Fetch blog data for editing
  useEffect(() => {
    if (isEditMode) {
      const fetchBlogData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`/api/blogs/${params.id}`);
          const blogData = response.data;
          
          setValue('title', blogData.title);
          setValue('content', blogData.content);
          setValue('existingImageUrl', blogData.imageUrl);
          setImagePreview(blogData.imageUrl);
          setValue('metaTitle', blogData.metaTitle || '');
          setValue('metaDescription', blogData.metaDescription || '');
          setValue('existingMetaImageUrl', blogData.metaImageUrl || '');
          setMetaImagePreview(blogData.metaImageUrl || null);
        } catch (error) {
          toast.error('Failed to fetch blog data');
          console.error('Fetch error:', error);
          router.push('/admin/blogs');
        } finally {
          setIsLoading(false);
        }
      };

      fetchBlogData();
    }
  }, [isEditMode, params.id, router, setValue]);

  // Main image dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('image', file, { shouldValidate: true });
      setValue('existingImageUrl', ''); // Clear existing URL when new image is uploaded
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [setValue]);

  const { getRootProps: getMainImageRootProps, getInputProps: getMainImageInputProps, isDragActive: isMainImageDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  // Meta image dropzone
  const onMetaImageDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('metaImage', file, { shouldValidate: true });
      setValue('existingMetaImageUrl', ''); // Clear existing URL when new image is uploaded
      
      const reader = new FileReader();
      reader.onload = () => {
        setMetaImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [setValue]);

  const { getRootProps: getMetaImageRootProps, getInputProps: getMetaImageInputProps, isDragActive: isMetaImageDragActive } = useDropzone({
    onDrop: onMetaImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let imageUrl = data.existingImageUrl || null;
      let metaImageUrl = data.existingMetaImageUrl || null;

      // Upload main image if provided
      if (data.image) {
        const uploadedUrl = await useCloudinaryUpload(data.image);
        if (!uploadedUrl) {
          toast.error('Failed to upload main image');
          return;
        }
        imageUrl = uploadedUrl;
      }

      // Upload meta image if provided
      if (data.metaImage) {
        const uploadedUrl = await useCloudinaryUpload(data.metaImage);
        if (!uploadedUrl) {
          toast.error('Failed to upload meta image');
          return;
        }
        metaImageUrl = uploadedUrl;
      }

      // Prepare the final data
      const formData = {
        title: data.title,
        content: data.content,
        imageUrl: imageUrl,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaImageUrl: metaImageUrl
      };

      if (isEditMode) {
        // Update existing blog
        const res = await updateBlog({id: params.id, data: formData}).unwrap();
        if (res?.modifiedCount > 0) {
          toast.success('Blog updated successfully');
          router.push("/dashboard/blog-list");
        }
      } else {
        // Create new blog
        const res = await axios.post("/api/blogs", formData);
        if (res?.data?.insertedId) {
          toast.success("Blog created successfully");
          reset();
          setValue('content', '');
          setImagePreview(null);
          setMetaImagePreview(null);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Error ${isEditMode ? 'updating' : 'creating'} blog. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'link', 'image'
  ];

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <div className="bg-white rounded-xl shadow-2xl p-4 md:p-6 border border-orange-500/20">
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
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
                {isEditMode ? 'Loading Blog Data' : 'Preparing Blog Form'}
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
          <style jsx>{`
            @keyframes progress {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Toaster />
      <form 
        onSubmit={handleSubmit(handleFormSubmit)} 
        className="bg-white rounded-xl shadow-2xl p-4 md:p-6 border border-orange-500/20"
      >
        <div className="flex items-center justify-between mb-8 border-b border-orange-500/30 pb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            {isEditMode ? 'Update Blog' : 'Create New Blog'}
          </h2>
          <div className="h-1 flex-1 bg-gradient-to-r from-orange-500/10 via-orange-500/40 to-orange-500/10 mx-4"></div>
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-black mb-3">
                Blog Title *
              </label>
              <input
                id="title"
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-5 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200"
                placeholder="Enter blog name"
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

            <div>
              <label className="block text-sm font-medium text-black mb-3">
                Blog Image *
              </label>
              <div
                {...getMainImageRootProps()}
                className={`border rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isMainImageDragActive 
                    ? 'border-orange-500 bg-orange-500/10' 
                    : 'border-gray-700 hover:border-orange-400/50'
                }`}
              >
                <input {...getMainImageInputProps()} />
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-full max-w-md mx-auto">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-60 w-full object-cover rounded-lg mb-4 border border-orange-500/20"
                      />
                      <div className="absolute -bottom-3 left-0 right-0 flex justify-center">
                        <span className="px-4 py-1 bg-orange-600 text-white text-xs font-medium rounded-full shadow-lg">
                          Click or drag to replace
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">
                      {isMainImageDragActive ? 'Drop the image here' : 'Drag & drop image here, or click to select'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Supports: JPG, PNG, WEBP (Max 20MB)</p>
                  </div>
                )}
              </div>
              {(!imagePreview && !isEditMode) && (
                <p className="mt-2 text-sm text-orange-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Blog image is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-3">
                Blog Content *
              </label>
              <div className="overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={(value) => setValue('content', value, { shouldValidate: true })}
                  modules={modules}
                  formats={formats}
                  className="w-full py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200"
                  placeholder="Write your blog content here..."
                  style={{ border: 'none' }}
                />
              </div>
              {errors.content && (
                <p className="mt-2 text-sm text-orange-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Blog content is required
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Meta Data */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">SEO Meta Data</h3>
              
              <div className="mb-4">
                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title *
                </label>
                <input
                  id="metaTitle"
                  type="text"
                  {...register('metaTitle', { required: 'Meta title is required' })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-400 transition-all duration-200"
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

              <div className="mb-4">
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description *
                </label>
                <textarea
                  id="metaDescription"
                  rows={3}
                  {...register('metaDescription', { 
                    required: 'Meta description is required',
                    maxLength: {
                      value: 160,
                      message: 'Meta description should not exceed 160 characters'
                    }
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-400 transition-all duration-200"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Image *
                </label>
                <div
                  {...getMetaImageRootProps()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ${
                    isMetaImageDragActive 
                      ? 'border-orange-500 bg-orange-500/10' 
                      : 'border-gray-300 hover:border-orange-400/50'
                  }`}
                >
                  <input {...getMetaImageInputProps()} />
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
                {(!metaImagePreview && !isEditMode) && (
                  <p className="mt-2 text-sm text-orange-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Meta image is required
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => {
              router.back()
             
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-red-600 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || updateLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting || updateLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {isEditMode ? 'Update Blog' : 'Publish Blog'}
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

export default BlogForm;