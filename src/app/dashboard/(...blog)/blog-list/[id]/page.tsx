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
import {  useUpdateBlogMutation } from '@/redux/features/blogs/blogApi';

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="border rounded p-4 h-48 bg-gray-50 animate-pulse"></div>
});

type FormData = {
  title: string;
  image: File | null;
  content: string;
  existingImageUrl?: string;
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
      existingImageUrl: ''
    }
  });
  const [updateBlog , {isLoading : updateLoading}] = useUpdateBlogMutation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const content = watch('content');

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let imageUrl = data.existingImageUrl || null;

      // Upload new image if provided
      if (data.image) {
        const uploadedUrl = await useCloudinaryUpload(data.image);
        if (!uploadedUrl) {
          toast.error('Failed to upload image');
          return;
        }
        imageUrl = uploadedUrl;
      }

      // Prepare the final data
      const formData = {
        title: data.title,
        content: data.content,
        imageUrl: imageUrl
      };

      if (isEditMode) {
        // Update existing blog
       
        const res =  await updateBlog({id: params.id, data:formData}).unwrap()
                if (res?.modifiedCount > 0) {
                  toast.success('Blog updated successfully');
                  router.push("/dashboard/blog-list")
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
    <main className="min-h-screen py-8">
      <div className="max-w-md mx-auto p-8 bg-black rounded-xl shadow-2xl border border-orange-500/20">
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

  return (
    <main className="min-h-screen py-8">
     
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
           Blog Images
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
           disabled={updateLoading}
           className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 shadow-lg hover:shadow-orange-500/20 flex items-center"
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
           </svg>
          {updateLoading ? "Updating Blog..." : "Update Blog"}
         </button>
       </div>
     </form>
     <Toaster />
   </main>
  );
};

export default BlogForm;