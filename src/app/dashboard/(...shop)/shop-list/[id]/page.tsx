"use client"

import { useForm } from 'react-hook-form';
import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCloudinaryUpload } from '@/components/uploadFiles/uploadCloudinary';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useUpdateShopMutation } from '@/redux/features/shops/shopApi';

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="border rounded p-4 h-48 bg-gray-50 animate-pulse"></div>
});

type FormData = {
  title: string;
  images: FileList | null;
  content: string;
  existingImages?: string[];
};

const ShopForm = () => {
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
      images: null,
      content: '',
      existingImages: []
    }
  });
    const [updateShop, {data : updatedData}] = useUpdateShopMutation();
  const [imagePreviews, setImagePreviews] = useState<(string | {url: string, isExisting: boolean})[]>([]);
  const content = watch('content');

  // Fetch shop data for editing
  useEffect(() => {
    if (isEditMode) {
      const fetchShopData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`/api/shops/${params.id}`);
          const shopData = response.data;
          
          setValue('title', shopData.title);
          setValue('content', shopData.content);
          setValue('existingImages', shopData.imageUrls || []);
          
          // Create previews for existing images
          if (shopData.imageUrls?.length) {
            setImagePreviews(shopData.imageUrls.map((url : any) => ({ url, isExisting: true })));
          }
        } catch (error) {
          toast.error('Failed to fetch shop data');
          console.error('Fetch error:', error);
          router.push('/admin/shops');
        } finally {
          setIsLoading(false);
        }
      };

      fetchShopData();
    }
  }, [isEditMode, params.id, router, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      setValue('images', files, { shouldValidate: true });
      
      // Create previews for new files only
      const newPreviews: string[] = [];
      for (let i = 0; i < Math.min(files.length, 20 - imagePreviews.length); i++) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newPreviews.push(event.target.result as string);
            if (newPreviews.length === Math.min(files.length, 20 - imagePreviews.length)) {
              setImagePreviews(prev => [...prev, ...newPreviews]);
            }
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const removeImage = (index: number) => {
  const newPreviews = [...imagePreviews];
  const removed = newPreviews.splice(index, 1);
  setImagePreviews(newPreviews);
  
  // If removed image was a new file (string), update the FileList
  if (typeof removed[0] === 'string') {
    const dataTransfer = new DataTransfer();
    const currentFiles = watch('images');
    if (currentFiles) {
      for (let i = 0; i < currentFiles.length; i++) {
        // Create object URL to compare with preview
        const fileUrl = URL.createObjectURL(currentFiles[i]);
        // Only keep files that still exist in previews
        if (newPreviews.some(preview => 
          typeof preview === 'string' && 
          preview === fileUrl
        )) {
          dataTransfer.items.add(currentFiles[i]);
        }
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(fileUrl);
      }
      setValue('images', dataTransfer.files.length ? dataTransfer.files : null);
    }
  } else {
    // If removed image was existing (object with url property)
    const removedImage = removed[0] as { url: string; isExisting: boolean } | undefined;
    if (removedImage) {
      const existing = watch('existingImages') || [];
      setValue('existingImages', existing.filter(url => url !== removedImage.url));
    }
  }
};

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let imageUrls: string[] = [...(data.existingImages || [])];
      
      // Upload new images if they exist
      if (data.images && data.images.length > 0) {
        const uploadPromises = [];
        for (let i = 0; i < data.images.length; i++) {
          uploadPromises.push(useCloudinaryUpload(data.images[i]));
        }
        
        const results = await Promise.all(uploadPromises);
        const newUrls = results.filter(url => url !== null) as string[];
        imageUrls = [...imageUrls, ...newUrls];
        
        if (newUrls.length === 0 && data.images.length > 0) {
          toast.error('Failed to upload new images');
          return;
        }
      }

      // Prepare the final data
      const formData = {
        title: data.title,
        content: data.content,
        imageUrls: imageUrls
      };

      if (isEditMode) {
        // Update existing shop
        const res = await updateShop({id: params.id, data:formData}).unwrap()
                if (res?.modifiedCount > 0) {
                  toast.success('Shop updated successfully');
                  router.push('/dashboard/shop-list');
                }
      } 
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Error ${isEditMode ? 'updating' : 'creating'} shop. Please try again.`);
    } finally {
      setIsSubmitting(false);
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
              {isEditMode ? 'Loading Shop Data' : 'Preparing Shop Form'}
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
  <Toaster />
  <form 
    onSubmit={handleSubmit(handleFormSubmit)} 
    className="bg-black rounded-xl shadow-2xl p-8 max-w-4xl mx-auto border border-orange-500/20"
  >
    <div className="flex items-center justify-between mb-8 border-b border-orange-500/30 pb-4">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
        {isEditMode ? 'Edit Shop' : 'Create New Shop'}
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
        className="w-full px-5 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        placeholder="Enter shop name"
        disabled={isSubmitting}
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
        className="w-full px-5 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500/20 file:text-orange-400 hover:file:bg-orange-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={isSubmitting || imagePreviews.length >= 20}
      />
      
      {imagePreviews.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img 
                  src={typeof preview === 'string' ? preview : preview.url} 
                  alt={`Preview ${index + 1}`} 
                  className="h-24 w-full object-cover rounded-lg border border-orange-500/20"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-orange-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {typeof preview !== 'string' && (
                  <span className="absolute bottom-1 left-1 bg-orange-500 text-white text-xs px-1 rounded">
                    Existing
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-orange-300 mt-3">
            {imagePreviews.length} image(s) selected
            {imagePreviews.length >= 20 && (
              <span className="ml-2 text-orange-400">(Maximum reached)</span>
            )}
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
          value={content || ''}
          onChange={(value) => setValue('content', value, { shouldValidate: true })}
          modules={modules}
          formats={formats}
          className="bg-gray-900 text-white h-64"
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
        onClick={() => isEditMode ? router.push('/admin/shops') : resetForm()}
        className="px-6 py-3 border border-gray-700 rounded-lg text-orange-300 hover:bg-gray-800/50 hover:border-orange-400/30 transition-all duration-200 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isEditMode ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
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
        className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 shadow-lg hover:shadow-orange-500/20 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {isEditMode ? 'Updating...' : 'Creating...'}
          </span>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {isEditMode ? 'Update Shop' : 'Create Shop'}
          </>
        )}
      </button>
    </div>
  </form>
</main>
  );
};

export default ShopForm;