"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface VideoPlayerProps {
  videoId: string;
  thumbnailSrc: string;
}

export default function VideoPlayer({ videoId, thumbnailSrc }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isPlaying) return;
    
    // Create YouTube iframe only after user clicks
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;
    iframe.title = 'YouTube video player';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    
    // Clear the container and append the iframe
    if (playerContainerRef.current) {
      playerContainerRef.current.innerHTML = '';
      playerContainerRef.current.appendChild(iframe);
    }
    
    return () => {
      // Clean up if component unmounts
      if (playerContainerRef.current) {
        playerContainerRef.current.innerHTML = '';
      }
    };
  }, [videoId, isPlaying]);
  
  return (
    <div className="bg-[#f56e13] rounded-lg overflow-hidden mt-6 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 relative p-3">
          {!isPlaying ? (
            <div 
              className="relative aspect-video cursor-pointer group" 
              onClick={() => setIsPlaying(true)}
            >
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e11d48" className="w-8 h-8">
                    <path d="M8 5.14v14l11-7-11-7z" />
                  </svg>
                </div>
              </div>
              <Image
                src={thumbnailSrc}
                alt="Video Thumbnail"
                width={300}
                height={200}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ) : (
            <div className="aspect-video" ref={playerContainerRef}></div>
          )}
        </div>
        <div className="md:w-1/2 p-4">
          <p className="text-white text-base">
            At The Car Edition, you'll get a personalised video of your service! 🎥
          </p>
          <Link href="/service-estimator" className="inline-block mt-4 bg-white hover:bg-gray-100 text-black px-6 py-2 rounded-md uppercase text-sm transition-colors duration-200">
            BOOK SERVICE
          </Link>
        </div>
      </div>
    </div>
  );
}
