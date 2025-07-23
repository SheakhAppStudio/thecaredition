"use client"

import { useForm } from 'react-hook-form';
import { useState, useMemo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import 'react-quill/dist/quill.snow.css';
import { useCloudinaryUpload } from '@/components/uploadFiles/uploadCloudinary';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="border rounded p-4 h-48 bg-gray-50 animate-pulse"></div>
});

// Define types
type FormData = {
  title: string;
  image: File | null;
  content: string;
  metaTitle: string;
  metaDescription: string;
  metaImageUrl: File | null;
};

const BlogForm = () => {
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
      metaTitle: '',
      metaDescription: '',
      metaImageUrl: null
    }
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [metaImagePreview, setMetaImagePreview] = useState<string | null>(null);
  const content = watch('content');
  const metaDescription = watch('metaDescription');

  // Main image dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('image', file, { shouldValidate: true });
      
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
      setValue('metaImageUrl', file, { shouldValidate: true });
      
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
    try {
      let imageUrl = null;
      let metaImageUrl = null;

      // Upload main image to Cloudinary if exists
      if (data.image) {
        imageUrl = await useCloudinaryUpload(data.image);
        if (!imageUrl) {
          alert('Failed to upload main image');
          return;
        }
      }

      // Upload meta image to Cloudinary if exists
      if (data.metaImageUrl) {
        metaImageUrl = await useCloudinaryUpload(data.metaImageUrl);
        if (!metaImageUrl) {
          alert('Failed to upload meta image');
          return;
        }
      }

      // Prepare the final data with Cloudinary URLs
      const formData = {
        title: data.title,
        content: data.content,
        imageUrl: imageUrl,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaImageUrl: metaImageUrl
      };

      const res = await axios.post("/api/blogs", formData)
      if(res?.data?.insertedId){
        toast.success("Blog uploaded successfully")
        reset();
        setValue('content', '');
        setImagePreview(null);
        setMetaImagePreview(null);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
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

  return (
    <main className="min-h-screen">
      <Toaster />
      <form 
        onSubmit={handleSubmit(handleFormSubmit)} 
        className="bg-white rounded-xl shadow-2xl p-4 md:p-6 border border-orange-500/20"
      >
        <div className="flex items-center justify-between mb-8 border-b border-orange-500/30 pb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Create New Blog
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
                Blog Image
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
              {errors.image && (
                <p className="mt-2 text-sm text-orange-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.image.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-3">
                Blog Description *
              </label>
              <div className="overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={(value) => setValue('content', value, { shouldValidate: true })}
                  modules={modules}
                  formats={formats}
                  className="w-full py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200"
                  placeholder="Write your blog description here..."
                  style={{ border: 'none' }}
                />
              </div>
              {errors.content && (
                <p className="mt-2 text-sm text-orange-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.content.message}
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
                  Meta Title
                </label>
                <input
                  id="metaTitle"
                  type="text"
                  {...register('metaTitle')}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-400 transition-all duration-200"
                  placeholder="Meta title for SEO"
                />
                <p className="mt-1 text-xs text-gray-500">Recommended: 50-60 characters</p>
              </div>

              <div className="mb-4">
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  id="metaDescription"
                  rows={3}
                  {...register('metaDescription')}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-400 transition-all duration-200"
                  placeholder="Meta description for SEO"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">Recommended: 150-160 characters</p>
                  <p className="text-xs text-gray-500">{metaDescription?.length || 0}/160</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Image
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
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => {
              reset();
              setValue('content', '');
              setImagePreview(null);
              setMetaImagePreview(null);
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-red-600 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reset Form
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Publish Blog
          </button>
        </div>
      </form>
    </main>
  );
};

export default BlogForm;