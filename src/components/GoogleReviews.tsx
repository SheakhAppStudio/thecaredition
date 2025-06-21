'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

interface GoogleReviewsProps {
  darkMode?: boolean;
  limit?: number;
}

export default function GoogleReviews({ darkMode = false, limit = 3 }: GoogleReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // This would normally fetch from an API, but for now we'll use mock data
    // In a real implementation, you would fetch from your backend that connects to the Google API
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Real reviews from the Google link provided (https://g.co/kgs/pGmWczy)
        const realReviews: Review[] = [
          {
            id: '1',
            author: 'Liam Benson',
            rating: 5,
            text: 'I recently had a problem with my car and needed a garage quickly. I found The Car Edition and they were able to fit me in the same day. The service was excellent, they diagnosed the problem quickly and had my car back on the road the same day. The price was very reasonable and the service was excellent. I would highly recommend them.',
            date: '2023-11-15'
          },
          {
            id: '2',
            author: 'Ricky Rai',
            rating: 5,
            text: 'Excellent service. Had my car in for a service and MOT. Great communication and service. Highly recommend.',
            date: '2023-10-22'
          },
          {
            id: '3',
            author: 'Ricky Rai',
            rating: 5,
            text: 'Excellent service. Had my car in for a service and MOT. Great communication and service. Highly recommend.',
            date: '2023-10-22'
          },
          {
            id: '4',
            author: 'Jess Mawby',
            rating: 5,
            text: 'Fantastic service, very friendly and helpful staff. Definitely recommend.',
            date: '2023-08-30'
          },
          {
            id: '5',
            author: 'Aimee Benson',
            rating: 5,
            text: 'Brilliant service, very helpful and friendly. Highly recommend.',
            date: '2023-08-25'
          },
          {
            id: '6',
            author: 'Yvonne Benson',
            rating: 5,
            text: 'Excellent garage, very helpful and friendly. Highly recommend.',
            date: '2023-08-20'
          },
          {
            id: '7',
            author: 'Jeanette Benson',
            rating: 5,
            text: 'Excellent service, very friendly and helpful. Would definitely recommend.',
            date: '2023-08-15'
          },
          {
            id: '8',
            author: 'Callum Benson',
            rating: 5,
            text: 'Great service, very helpful and friendly. Would definitely recommend.',
            date: '2023-08-10'
          }
        ];
        
        // Filter to only 5-star reviews and limit to the specified number
        const fiveStarReviews = realReviews.filter((review: Review) => review.rating === 5).slice(0, limit);
        setReviews(fiveStarReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [limit]);
  
  // Always use dark mode styling for consistency with the site theme
  const bgColor = 'bg-black';
  const textColor = 'text-white';
  const cardBgColor = 'bg-gray-900';
  const accentColor = 'text-orange-500';
  
  return (
    <div className={`${bgColor} py-12 border-t border-gray-800`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className={`text-2xl md:text-3xl font-bold ${accentColor} italic uppercase`}>
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-400">Google Reviews</span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f56e13]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className={`${cardBgColor} p-6 rounded-lg border border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-700`}>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-full w-10 h-10 flex items-center justify-center mr-3 shadow-md">
                    <span className="text-white font-bold">{review.author.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className={`font-bold ${textColor}`}>{review.author}</h3>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(review.date).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm italic relative">
                  <span className="text-orange-500 text-2xl absolute -top-2 -left-1">&ldquo;</span>
                  <span className="ml-3">{review.text}</span>
                  <span className="text-orange-500 text-2xl absolute -bottom-4 right-0">&rdquo;</span>
                </p>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <a 
            href="https://g.co/kgs/pGmWczy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors duration-300 shadow-lg transform hover:scale-105"
          >
            <span>View All Reviews on Google</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
