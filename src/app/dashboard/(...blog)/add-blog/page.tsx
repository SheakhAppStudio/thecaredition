"use client"

import { useForm } from 'react-hook-form';
import { useState, useMemo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import 'react-quill/dist/quill.snow.css';
import AdminLayout from '@/components/AdminLayout';
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
      content: ''
    }
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const content = watch('content');

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    
    maxFiles: 1
  });

 const handleFormSubmit = async (data: FormData) => {
    try {
      let imageUrl = null;
      console.log(data?.image)
      // Upload image to Cloudinary if exists
      if (data.image) {
        imageUrl = await useCloudinaryUpload(data.image);
        console.log(imageUrl)
        if (!imageUrl) {
          alert('Failed to upload image');
          return;
        }
      }

      // Prepare the final data with Cloudinary URL
      const formData = {
        title: data.title,
        content: data.content,
        imageUrl: imageUrl // This will be null if no image was uploaded
      };

      const res = await axios.post("/api/blogs", formData)
      if(res?.data?.insertedId){
        toast.success("blog uploaded successfully")
 reset();
      setValue('content', '');
      setImagePreview(null);
      }
      // Reset form
     
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
 <main className="min-h-screen py-8">
  <Toaster />
  <form 
    onSubmit={handleSubmit(handleFormSubmit)} 
    className="bg-black rounded-xl shadow-2xl p-8 max-w-4xl mx-auto border border-orange-500/20"
  >
    <div className="flex items-center justify-between mb-8 border-b border-orange-500/30 pb-4">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
        Create New Blog
      </h2>
      <div className="h-1 flex-1 bg-gradient-to-r from-orange-500/10 via-orange-500/40 to-orange-500/10 mx-4"></div>
      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
    </div>
    
    <div className="mb-8">
      <label htmlFor="title" className="block text-sm font-medium text-orange-300 mb-3">
        Blog Title *
      </label>
      <input
        id="title"
        type="text"
        {...register('title')}
        className="w-full px-5 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
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

    <div className="mb-8">
      <label className="block text-sm font-medium text-orange-300 mb-3">
        Blog Image
      </label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive 
            ? 'border-orange-500 bg-orange-500/10' 
            : 'border-gray-700 hover:border-orange-400/50'
        }`}
      >
        <input {...getInputProps()} />
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
              {isDragActive ? 'Drop the images here' : 'Drag & drop images here, or click to select'}
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

    <div className="mb-8">
      <label className="block text-sm font-medium text-orange-300 mb-3">
        Blog Description *
      </label>
      <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={(value) => setValue('content', value, { shouldValidate: true })}
          modules={modules}
          formats={formats}
          className="bg-gray-900 text-white"
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

    <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
      <button
        type="button"
        onClick={() => {
          reset();
          setValue('content', '');
          setImagePreview(null);
        }}
        className="px-6 py-3 border border-gray-700 rounded-lg text-orange-300 hover:bg-gray-800/50 hover:border-orange-400/30 transition-all duration-200 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        Reset Form
      </button>
      <button
        type="submit"
        className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 shadow-lg hover:shadow-orange-500/20 flex items-center"
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