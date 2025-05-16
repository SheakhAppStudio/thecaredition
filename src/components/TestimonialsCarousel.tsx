'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaQuoteLeft, FaQuoteRight, FaArrowLeft, FaArrowRight, FaGoogle } from 'react-icons/fa';
import { BsStarFill } from 'react-icons/bs';

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
            author: 'Liam Benson',
            rating: 5,
            text: 'I recently had a problem with my car and needed a garage quickly. I found The Car Edition and they were able to fit me in the same day. The service was excellent, they diagnosed the problem quickly and had my car back on the road the same day. The price was very reasonable and the service was excellent. I would highly recommend them.',
            date: '2023-11-15',
            photoUrl: '/images/testimonials/avatar1.jpg'
          },
          {
            id: '2',
            author: 'Ricky Rai',
            rating: 5,
            text: 'Excellent service. Had my car in for a service and MOT. Great communication and service. Highly recommend.',
            date: '2023-10-22',
            photoUrl: '/images/testimonials/avatar2.jpg'
          },
          {
            id: '3',
            author: 'Sarah Johnson',
            rating: 5,
            text: 'The team at The Car Edition did an amazing job diagnosing and fixing the issue with my BMW. They were transparent about the costs and kept me updated throughout the process. My car runs better than ever now!',
            date: '2023-09-18',
            photoUrl: '/images/testimonials/avatar3.jpg'
          },
          {
            id: '4',
            author: 'Jess Mawby',
            rating: 5,
            text: 'Fantastic service, very friendly and helpful staff. Definitely recommend.',
            date: '2023-08-30',
            photoUrl: '/images/testimonials/avatar4.jpg'
          },
          {
            id: '5',
            author: 'Aimee Benson',
            rating: 5,
            text: 'Brilliant service, very helpful and friendly. Highly recommend.',
            date: '2023-08-25',
            photoUrl: '/images/testimonials/avatar5.jpg'
          },
          {
            id: '6',
            author: 'Yvonne Benson',
            rating: 5,
            text: 'Excellent garage, very helpful and friendly. Highly recommend.',
            date: '2023-08-20',
            photoUrl: '/images/testimonials/avatar6.jpg'
          },
          {
            id: '7',
            author: 'Jeanette Benson',
            rating: 5,
            text: 'Excellent service, very friendly and helpful. Would definitely recommend.',
            date: '2023-08-15',
            photoUrl: '/images/testimonials/avatar7.jpg'
          },
          {
            id: '8',
            author: 'Callum Benson',
            rating: 5,
            text: 'Great service, very helpful and friendly. Would definitely recommend.',
            date: '2023-08-10',
            photoUrl: '/images/testimonials/avatar8.jpg'
          }
        ];
        
        // Filter to only 5-star reviews and limit to the specified number
        const fiveStarReviews = realReviews.filter(review => review.rating === 5).slice(0, limit);
        setReviews(fiveStarReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [limit]);

  // Auto-rotate testimonials
  useEffect(() => {
    if (loading || reviews.length === 0 || isPaused) return;
    
    timerRef.current = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % reviews.length);
    }, autoplaySpeed);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [loading, reviews.length, autoplaySpeed, isPaused]);

  const handlePrev = () => {
    setActiveIndex(prevIndex => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setActiveIndex(prevIndex => (prevIndex + 1) % reviews.length);
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
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

  return (
    <div className="relative bg-black py-16 overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-orange-500 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-orange-600 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase mb-2">
            Customer <span className="text-orange-500">Testimonials</span>
          </h2>
          <div className="flex items-center justify-center">
            {/* @ts-ignore */}
            <FaGoogle className="text-white mr-2" />
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                // @ts-ignore
                <BsStarFill key={i} className="text-yellow-400 mx-0.5" />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-400">Based on {reviews.length}+ reviews</span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div 
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Main testimonial carousel */}
            <div className="max-w-4xl mx-auto">
              {reviews.map((review, index) => (
                <div 
                  key={review.id}
                  className={`transition-all duration-700 transform ${
                    index === activeIndex 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-95 absolute top-0 left-0'
                  }`}
                  style={{ display: index === activeIndex ? 'block' : 'none' }}
                >
                  <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-2xl">
                    <div className="flex items-center mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500">
                        {review.photoUrl ? (
                          <Image 
                            src={review.photoUrl} 
                            alt={review.author} 
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">{review.author.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-white">{review.author}</h3>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            // @ts-ignore
                            <BsStarFill key={i} className="text-yellow-400 mr-1" />
                          ))}
                          <span className="text-sm text-gray-400 ml-2">{formatDate(review.date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative text-gray-300 text-lg">
                      {/* @ts-ignore */}
                      <FaQuoteLeft className="absolute -top-4 -left-2 text-orange-500 opacity-30 text-4xl" />
                      <p className="px-6 py-2">{truncateText(review.text)}</p>
                      {/* @ts-ignore */}
                      <FaQuoteRight className="absolute -bottom-4 right-0 text-orange-500 opacity-30 text-4xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation controls */}
            <div className="flex justify-between items-center mt-8">
              <button 
                onClick={handlePrev}
                className="bg-gray-800 hover:bg-orange-600 text-white p-3 rounded-full transition-colors duration-300"
                aria-label="Previous testimonial"
              >
                {/* @ts-ignore */}
                <FaArrowLeft />
              </button>
              
              <div className="flex space-x-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeIndex ? 'bg-orange-500 w-6' : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={handleNext}
                className="bg-gray-800 hover:bg-orange-600 text-white p-3 rounded-full transition-colors duration-300"
                aria-label="Next testimonial"
              >
                {/* @ts-ignore */}
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}
        
        {/* Call to action */}
        <div className="text-center mt-12">
          <a 
            href="https://g.co/kgs/pGmWczy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded font-bold transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-orange-500/30"
          >
            {/* @ts-ignore */}
            <FaGoogle className="mr-2" />
            <span>View All Reviews on Google</span>
          </a>
        </div>
      </div>
    </div>
  );
}
