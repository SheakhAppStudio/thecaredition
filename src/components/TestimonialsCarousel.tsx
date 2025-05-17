'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight, FaGoogle } from 'react-icons/fa';
import { BsStarFill } from 'react-icons/bs';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  photoUrl?: string;
}

interface TestimonialsCarouselProps {
  limit?: number;
  autoplaySpeed?: number;
}

export default function TestimonialsCarousel({ 
  limit = 8, 
  autoplaySpeed = 5000 
}: TestimonialsCarouselProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch reviews from Google
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // In a production environment, this would fetch from an API endpoint
        // that connects to the Google Places API
        const realReviews: Review[] = [
          {
            id: '1',
            author: 'Phil Woods',
            rating: 5,
            text: 'Orci facilisis gravida urna turpis ac porttitor leo idoi accumsan faucibus ipsum in dui justo aliquet tortora aliquet pharetra neque massa ametmel egeto in porttitor in quis libero faucibus.',
            date: '2023-11-15',
            photoUrl: '/images/testimonials/avatar1.jpg'
          },
          {
            id: '2',
            author: 'Sophie Moore',
            rating: 5,
            text: 'Orci facilisis gravida urna turpis ac porttitor leo idoi accumsan faucibus ipsum in dui justo aliquet tortora aliquet pharetra neque massa ametmel egeto in porttitor in quis libero faucibus.',
            date: '2023-10-22',
            photoUrl: '/images/testimonials/avatar2.jpg'
          },
          {
            id: '3',
            author: 'Mike Warren',
            rating: 5,
            text: 'Orci facilisis gravida urna turpis ac porttitor leo idoi accumsan faucibus ipsum in dui justo aliquet tortora aliquet pharetra neque massa ametmel egeto in porttitor in quis libero faucibus.',
            date: '2023-09-18',
            photoUrl: '/images/testimonials/avatar3.jpg'
          },
          {
            id: '4',
            author: 'Jessica Smith',
            rating: 5,
            text: 'Orci facilisis gravida urna turpis ac porttitor leo idoi accumsan faucibus ipsum in dui justo aliquet tortora aliquet pharetra neque massa ametmel egeto in porttitor in quis libero faucibus.',
            date: '2023-08-30',
            photoUrl: '/images/testimonials/avatar4.jpg'
          },
          {
            id: '5',
            author: 'David Johnson',
            rating: 5,
            text: 'Orci facilisis gravida urna turpis ac porttitor leo idoi accumsan faucibus ipsum in dui justo aliquet tortora aliquet pharetra neque massa ametmel egeto in porttitor in quis libero faucibus.',
            date: '2023-08-25',
            photoUrl: '/images/testimonials/avatar5.jpg'
          },
          {
            id: '6',
            author: 'Emma Wilson',
            rating: 5,
            text: 'Orci facilisis gravida urna turpis ac porttitor leo idoi accumsan faucibus ipsum in dui justo aliquet tortora aliquet pharetra neque massa ametmel egeto in porttitor in quis libero faucibus.',
            date: '2023-08-20',
            photoUrl: '/images/testimonials/avatar6.jpg'
          }
        ];
        
        // Filter to only 5-star reviews and limit to the specified number
        const fiveStarReviews = realReviews.filter(review => review.rating === 5).slice(0, limit);
        setReviews(fiveStarReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [limit]);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused || reviews.length <= 1) return;
    
    // Calculate the number of pages (each page shows 3 reviews)
    const pageCount = Math.ceil(reviews.length / 3);
    if (pageCount <= 1) return; // Don't auto-advance if there's only one page
    
    timerRef.current = setInterval(() => {
      handleNext();
    }, autoplaySpeed);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, activeIndex, reviews.length, autoplaySpeed]);

  const handlePrev = () => {
    // Each page shows 3 reviews, so we need to calculate the total number of pages
    const totalPages = Math.ceil(reviews.length / 3);
    if (totalPages <= 1) return; // Don't navigate if there's only one page
    
    setActiveIndex(prevIndex => (prevIndex - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    // Each page shows 3 reviews, so we need to calculate the total number of pages
    const totalPages = Math.ceil(reviews.length / 3);
    if (totalPages <= 1) return; // Don't navigate if there's only one page
    
    setActiveIndex(prevIndex => (prevIndex + 1) % totalPages);
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Truncate text if it's too long
  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Track window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial screen width
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-black py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4 uppercase tracking-wide">
            <span className="text-white">WHAT OUR </span>
            <span className="text-white">CLIENTS</span>
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold uppercase tracking-wide text-white mb-8">
            <span>SAY ABOUT US</span>
          </h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#f56e13]"></div>
          </div>
        ) : (
          <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            {/* Testimonials Cards Slider */}
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {/* Display multiple cards in a row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full flex-shrink-0">
                  {reviews.slice(0, 3).map((review) => (
                    <div 
                      key={review.id} 
                      className="bg-white p-6 rounded-none shadow-md flex flex-col h-full"
                    >
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <BsStarFill 
                            key={i} 
                            className={i < review.rating ? "text-yellow-400" : "text-gray-300"} 
                            size={18} 
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {review.rating} of 5
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-6 flex-grow">
                        {truncateText(review.text, 150)}
                      </p>
                      
                      <div className="flex items-center mt-auto">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          {review.photoUrl ? (
                            <Image 
                              src={review.photoUrl} 
                              alt={review.author} 
                              width={48} 
                              height={48} 
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-bold">{review.author.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 uppercase">{review.author}</h3>
                          <p className="text-gray-500 text-sm">LOS ANGELES, CA</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {reviews.length > 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full flex-shrink-0">
                    {reviews.slice(3, 6).map((review) => (
                      <div 
                        key={review.id} 
                        className="bg-white p-6 rounded-none shadow-md flex flex-col h-full"
                      >
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <BsStarFill 
                              key={i} 
                              className={i < review.rating ? "text-yellow-400" : "text-gray-300"} 
                              size={18} 
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {review.rating} of 5
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-6 flex-grow">
                          {truncateText(review.text, 150)}
                        </p>
                        
                        <div className="flex items-center mt-auto">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                            {review.photoUrl ? (
                              <Image 
                                src={review.photoUrl} 
                                alt={review.author} 
                                width={48} 
                                height={48} 
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-bold">{review.author.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 uppercase">{review.author}</h3>
                            <p className="text-gray-500 text-sm">LOS ANGELES, CA</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Navigation Controls */}
            <div className="flex justify-center mt-8 items-center">
              <button
                onClick={handlePrev}
                className="bg-transparent text-white hover:text-[#f56e13] transition-colors duration-300 mx-4"
                aria-label="Previous testimonials"
              >
                <HiOutlineChevronLeft className="w-10 h-10" />
              </button>
              
              <button
                onClick={handleNext}
                className="bg-transparent text-white hover:text-[#f56e13] transition-colors duration-300 mx-4"
                aria-label="Next testimonials"
              >
                <HiOutlineChevronRight className="w-10 h-10" />
              </button>
            </div>
          </div>
        )}
        
        {/* Call to action */}
        <div className="text-center mt-8 sm:mt-12">
          <a 
            href="https://g.co/kgs/pGmWczy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#f56e13] hover:bg-[#d15000] text-white px-5 sm:px-8 py-3 sm:py-4 rounded font-medium sm:font-bold text-sm sm:text-base transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-[#f56e13]/30"
          >
            <FaGoogle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            <span>View All Reviews on Google</span>
          </a>
        </div>
      </div>
    </div>
  );
}
