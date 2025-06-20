'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaYoutube, FaPlay, FaCalendarAlt, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { HeroVideoDialog } from '@/components/magicui/hero-video-dialog';

interface YouTubeVideo {
  _id: string;
  title: string;
  createdAt: string;
  videoYoutubeLink: string;
  videoThumbnail: string;
  videoEmbedLink: string;
  description: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/videos");
        setVideos(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const openVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 font-heading">
      {/* Hero Section */}
      <div className="relative bg-black/60 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/video-bg.jpg" 
            alt="Car Edition Videos Background"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <FaYoutube className="text-[#fb9929] text-5xl mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold font-heading">Our Video Gallery</h1>
            </div>
            
            <p className="text-xl text-gray-300 mb-8 font-lato">
              Watch our latest videos showcasing premium car detailing, wrapping, and customization services.
            </p>
            
            <a 
              href="https://www.youtube.com/@thecareditionltd/videos" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-medium transition-colors duration-200 inline-flex items-center uppercase italic"
            >
              <FaYoutube className="mr-2" />
              Visit Our YouTube Channel
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Videos Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center font-heading text-[#fb9929] uppercase italic">Featured Videos</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fb9929]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 font-medium transition-colors duration-200 uppercase italic"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <motion.div 
                key={video._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-[#fb9929]/20 transition-all duration-300 transform hover:-translate-y-2 border border-gray-800"
              >
               <div className="relative group cursor-pointer" onClick={() => openVideo(video.videoEmbedLink)}>
  <Image
    src={video.videoThumbnail}
    alt={video.title}
    width={640}
    height={360}
    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
  />
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <FaPlay className="text-white text-4xl" />
  </div>
</div>

                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2 font-heading text-white italic">{video.title}</h3>
                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <FaCalendarAlt className="mr-2 text-[#fb9929]" />
                    <span>{formatDate(video.createdAt)}</span>
                  </div>
                  <p className="text-gray-300 line-clamp-3 font-lato">{video.description}</p>
                  
                  <a
                    href={video?.videoYoutubeLink}
                    className="mt-4 text-[#fb9929] hover:text-white font-medium flex items-center transition-colors duration-200 italic cursor-pointer"
                    target='_blank'
                  >
                    <FaEye className="mr-2" />
                    Watch Video
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-16">
          <a 
            href="https://www.youtube.com/@thecareditionltd/videos" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-[#fb9929] text-[#fb9929] hover:bg-[#fb9929] hover:text-white px-8 py-3 font-medium transition-colors duration-200 inline-flex items-center uppercase italic"
          >
            View All Videos
          </a>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-16 mt-16 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading text-[#fb9929] uppercase italic">Want to See Our Work in Person?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-lato">
            Book a consultation with our team to discuss your vehicle's needs and see our premium services firsthand.
          </p>
          
          <Link 
            href="/contact-us" 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-medium transition-colors duration-200 inline-flex items-center uppercase italic"
          >
            Contact Us Today
          </Link>
        </div>
      </div>

      {/* Video Dialog */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 z-10 text-white hover:text-[#fb9929] transition-colors"
              aria-label="Close video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`${selectedVideo}?autoplay=1`}
                className="w-full h-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video player"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}