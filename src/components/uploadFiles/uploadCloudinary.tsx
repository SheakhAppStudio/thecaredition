import axios from 'axios';

const useCloudinaryUpload = async (file: File) => {
  interface UploadToCloudinaryResponse {
    secure_url: string;
  }
console.log(file)

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'IMC_PRESET'); // Set this in your Cloudinary settings

    // Automatically detect file type
    let resourceType: 'raw' | 'image' | 'video' = 'raw';
    if (file.type.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.type.startsWith('video/')) {
      resourceType = 'video';
    }

    try {
      const res = await axios.post<UploadToCloudinaryResponse>(
        `https://api.cloudinary.com/v1_1/dw3rzftte/${resourceType}/upload`,
        formData
      );
      console.log(res.data.secure_url)
      return res.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return null;
    }
 


};

export { useCloudinaryUpload };
