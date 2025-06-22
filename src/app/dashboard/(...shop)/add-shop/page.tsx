"use client"

import { useForm } from 'react-hook-form';
import { useState, useMemo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useCloudinaryUpload } from '@/components/uploadFiles/uploadCloudinary';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="border rounded p-4 h-48 bg-gray-50 animate-pulse"></div>
});

type FormData = {
  title: string;
  images: FileList | null;
  content: string;
};

const ShopForm = () => {
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
      images: null,
      content: ''
    }
  });
  
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const content = watch('content');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      setValue('images', files, { shouldValidate: true });
      
      // Create previews
      const newPreviews: string[] = [];
      for (let i = 0; i < Math.min(files.length, 20); i++) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newPreviews.push(event.target.result as string);
            if (newPreviews.length === Math.min(files.length, 20)) {
              setImagePreviews(newPreviews);
            }
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
    
    // Create new FileList without the removed image
    const dataTransfer = new DataTransfer();
    const currentFiles = watch('images');
    if (currentFiles) {
      for (let i = 0; i < currentFiles.length; i++) {
        if (i !== index) {
          dataTransfer.items.add(currentFiles[i]);
        }
      }
      setValue('images', dataTransfer.files);
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      let imageUrls: string[] = [];
      
      // Upload images if they exist
      if (data.images && data.images.length > 0) {
        const uploadPromises = [];
        for (let i = 0; i < data.images.length; i++) {
          uploadPromises.push(useCloudinaryUpload(data.images[i]));
        }
        
        const results = await Promise.all(uploadPromises);
        imageUrls = results.filter(url => url !== null) as string[];
        
        if (imageUrls.length === 0) {
          toast.error('Failed to upload images');
          return;
        }
      }

      // Prepare the final data
      const formData = {
        title: data.title,
        content: data.content,
        imageUrls: imageUrls
      };
      console.log(formData)
      const res = await axios.post("/api/shops", formData);
      if (res?.data?.insertedId) {
        toast.success("Shop created successfully");
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error creating shop. Please try again.');
    }
  };

  const resetForm = () => {
    reset();
    setValue('content', '');
    setImagePreviews([]);
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
        Create New Shop
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
        Shop Title *
      </label>
      <input
        id="title"
        type="text"
        {...register('title', { required: 'Title is required' })}
        className="w-full px-5 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
        placeholder="Enter shop name"
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
        Shop Images (Max 20)
      </label>
      <input
        type="file"
        id="images"
        multiple
        accept="image/jpeg, image/jpg, image/png, image/webp"
        onChange={handleImageChange}
        className="w-full px-5 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500/20 file:text-orange-400 hover:file:bg-orange-500/30 transition-all duration-200"
      />
      
      {imagePreviews.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img 
                  src={preview} 
                  alt={`Preview ${index + 1}`} 
                  className="h-24 w-full object-cover rounded-lg border border-orange-500/20"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-orange-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <p className="text-sm text-orange-300 mt-3">
            {imagePreviews.length} image(s) selected
          </p>
        </div>
      )}
    </div>

    <div className="mb-8">
      <label className="block text-sm font-medium text-orange-300 mb-3">
        Description *
      </label>
      <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={(value) => setValue('content', value, { shouldValidate: true })}
          modules={modules}
          formats={formats}
          className="bg-gray-900 text-white"
          placeholder="Write your shop description here..."
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
        onClick={resetForm}
        className="px-6 py-3 border border-gray-700 rounded-lg text-orange-300 hover:bg-gray-800/50 hover:border-orange-400/30 transition-all duration-200 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        Reset
      </button>
      <button
        type="submit"
        className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 shadow-lg hover:shadow-orange-500/20 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Create Shop
      </button>
    </div>
  </form>
</main>
  );
};

export default ShopForm;