'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaYoutube, FaPlay, FaCalendarAlt, FaEye, FaArrowRight } from 'react-icons/fa';
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
    <div className="min-h-screen bg-black text-white pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/video-bg.jpg" 
            alt="Car Edition Videos Background"
            fill
            className="object-cover opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black to-black/95" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full bg-white/5 border border-white/10">
              <FaYoutube className="text-white text-sm mr-2" />
              <span className="text-white text-sm">THE CAR EDITION VIDEOS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Premium Auto Content
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Discover our exclusive collection of automotive excellence through detailed video showcases and expert insights.
            </p>
            <a 
              href="https://www.youtube.com/@thecareditionltd/videos" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full text-white font-medium transition-all duration-300"
            >
              <FaYoutube className="text-xl" />
              <span>Visit Our Channel</span>
              <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Videos Grid */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">
            Featured Videos
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Explore our latest automotive transformations and expert services
          </p>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-300 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300"
            >
              Try Again
              <FaArrowRight className="text-sm" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <motion.article 
                key={video._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-[#1A1A1A] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 border border-white/5 transition-all duration-500 hover:-translate-y-1"
              >
                <div 
                  className="relative aspect-video cursor-pointer overflow-hidden" 
                  onClick={() => openVideo(video.videoEmbedLink)}
                >
                  <Image
                    src={video.videoThumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 shadow-lg shadow-red-500/20">
                      <FaPlay className="text-white text-lg ml-1" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-[#1A1A1A]">
                  <div className="flex items-center text-xs text-red-500 mb-3 font-medium">
                    <FaCalendarAlt className="mr-2" />
                    <span>{formatDate(video.createdAt)}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-4 line-clamp-2 text-white group-hover:text-red-500 transition-colors duration-300">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => openVideo(video.videoEmbedLink)}
                      className="text-white hover:text-red-500 text-sm font-medium transition-colors duration-300 flex items-center gap-2 hover:gap-3"
                    >
                      Watch Now
                      <FaPlay className="text-xs" />
                    </button>
                    
                    <a
                      href={video?.videoYoutubeLink}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaYoutube className="text-lg" />
                      <span className="text-xs font-medium">YouTube</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
        
        <div className="text-center mt-16">
          <a 
            href="https://www.youtube.com/@thecareditionltd/videos" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
          >
            View All Videos
            <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
          <div className="relative p-12 md:p-16 bg-gradient-to-r from-gray-900 to-black border border-white/10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <h4 className="text-white font-medium mb-4 uppercase tracking-wider">Get Started Today</h4>
              <h2 className="text-4xl font-bold mb-6 text-white">
                Experience Premium Auto Care
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Book a consultation with our expert team to discuss your vehicle's needs and discover our premium automotive services.
              </p>
              <Link 
                href="/contact-us" 
                className="group inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full text-white font-medium hover:shadow-lg hover:shadow-red-600/20 transition-all duration-300"
              >
                Contact Us Today
                <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Dialog */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl mx-4">
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 z-10 w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center text-white hover:bg-red-600/20 transition-all duration-300"
              aria-label="Close video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                src={`${selectedVideo}?autoplay=1`}
                className="w-full aspect-video"
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