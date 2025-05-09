'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    // Initialize slider position to start from left side
    if (sliderRef.current && scrollPosition === 0) {
      sliderRef.current.scrollLeft = 0;
      setScrollPosition(0);
    }
  }, []);

  useEffect(() => {
    // Create continuous scrolling effect from left to right
    const animationInterval = setInterval(() => {
      if (sliderRef.current) {
        // Get the total width of all items
        const totalWidth = sliderRef.current.scrollWidth;
        const containerWidth = sliderRef.current.clientWidth;
        
        // Increment scroll position (for left to right movement)
        let newPosition = scrollPosition + 1;
        
        // Reset when we reach the end
        if (newPosition >= totalWidth - containerWidth) {
          // Jump back to start without animation
          sliderRef.current.scrollLeft = 0;
          newPosition = 0;
        } else {
          // Smooth scroll to new position
          sliderRef.current.scrollLeft = newPosition;
        }
        
        setScrollPosition(newPosition);
      }
    }, 20); // Update every 20ms for smooth animation
    
    return () => clearInterval(animationInterval);
  }, [scrollPosition]);
  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-between">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/logos/backgroundlogo2.jpg"
            alt="Car Workshop"
            fill
            priority
            className="object-cover brightness-50"
          />
        </div>
        <div className="container relative z-10 text-white pt-20 flex-grow flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-white">CAR CARE</span>
            </h1>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-orange">REDEFINED</span>
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mb-8 text-gray-300">
              Professional car care services for your premium vehicle
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/services" className="bg-orange hover:bg-orange-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200">
                Explore Services
              </Link>
              <Link href="/service-estimator" className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Get Service Estimate
              </Link>
            </div>
            
            {/* Service Categories Slider */}
            <div className="relative z-10 overflow-hidden mt-8 w-full">
              {/* Removed navigation dots for continuous scrolling effect */}
              <div ref={sliderRef} className="flex space-x-8 overflow-x-auto pb-4 scrollbar-hide scroll-smooth w-full">
                {/* First set of cards */}
                {/* Engine Repair & Rebuilds */}
                <div className="flex-shrink-0 w-full md:w-1/3 min-w-[300px] bg-transparent border border-gray-700 rounded-lg p-6 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <svg className="w-8 h-8 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <h3 className="text-xl font-bold text-white">ENGINE REPAIR & REBUILDS</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Rebuild your engine with the Car Edition. Our experts are proficient in European, American and Japanese brands.
                  </p>
                </div>

                {/* Maintenance & Servicing */}
                <div className="flex-shrink-0 w-full md:w-1/3 min-w-[300px] bg-transparent border border-gray-700 rounded-lg p-6 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <svg className="w-8 h-8 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <h3 className="text-xl font-bold text-white">MAINTENANCE & SERVICING</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Whether you need oil change services, major service or even a general service, The Car Edition got you covered.
                  </p>
                </div>

                {/* Buy or Sell Your Car */}
                <div className="flex-shrink-0 w-full md:w-1/3 min-w-[300px] bg-transparent border border-gray-700 rounded-lg p-6 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <svg className="w-8 h-8 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-xl font-bold text-white">BUY OR SELL YOUR CAR</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Looking to buy your dream car or simply want to sell yours? Look no further - we can do both!
                  </p>
                </div>
                
                {/* Duplicate set for continuous scrolling */}
                {/* Engine Repair & Rebuilds */}
                <div className="flex-shrink-0 w-full md:w-1/3 min-w-[300px] bg-transparent border border-gray-700 rounded-lg p-6 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <svg className="w-8 h-8 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <h3 className="text-xl font-bold text-white">ENGINE REPAIR & REBUILDS</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Rebuild your engine with the Car Edition. Our experts are proficient in European, American and Japanese brands.
                  </p>
                </div>

                {/* Maintenance & Servicing */}
                <div className="flex-shrink-0 w-full md:w-1/3 min-w-[300px] bg-transparent border border-gray-700 rounded-lg p-6 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <svg className="w-8 h-8 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <h3 className="text-xl font-bold text-white">MAINTENANCE & SERVICING</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Whether you need oil change services, major service or even a general service, The Car Edition got you covered.
                  </p>
                </div>

                {/* Buy or Sell Your Car */}
                <div className="flex-shrink-0 w-full md:w-1/3 min-w-[300px] bg-transparent border border-gray-700 rounded-lg p-6 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <svg className="w-8 h-8 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-xl font-bold text-white">BUY OR SELL YOUR CAR</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Looking to buy your dream car or simply want to sell yours? Look no further - we can do both!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Services Section */}
      <section className="py-16 bg-black" style={{backgroundImage: 'url(/images/logos/backgroundlogo2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase">TRENDING SERVICES</h2>
            <div className="w-24 h-1 bg-orange mx-auto mt-4 mb-8"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Service Card 1 - FULL SERVICE */}
            <div className="bg-black/80 rounded-lg overflow-hidden shadow-lg border border-gray-800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-orange">FULL SERVICE <span className="ml-1 text-white">⚙️</span></h3>
                </div>
                <p className="text-xs text-orange mb-1">10% OFF FOR GOLD MEMBERS 🔶</p>
                <div className="text-white text-3xl font-bold my-4">£249</div>
                <p className="text-xs text-gray-400 mb-4">FREE TO RE-VISIT</p>
                <ul className="text-gray-300 text-sm space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Cabin filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Fuel filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Oil change</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Air filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                </ul>
                <button className="block w-full border border-red-500 hover:bg-red-500/20 text-white py-2 rounded-md font-medium transition-colors duration-200">
                  BOOK NOW
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">5,000 TCS Points</p>
              </div>
            </div>
            
            {/* Service Card 2 - INTERIM SERVICE */}
            <div className="bg-black/80 rounded-lg overflow-hidden shadow-lg border border-gray-800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-orange">INTERIM SERVICE <span className="ml-1 text-white">⚙️</span></h3>
                </div>
                <p className="text-xs text-orange mb-1">10% OFF FOR GOLD MEMBERS 🔶</p>
                <div className="text-white text-3xl font-bold my-4">£149</div>
                <p className="text-xs text-gray-400 mb-4">EVERYTHING IN BASIC, PLUS</p>
                <ul className="text-gray-300 text-sm space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Cabin filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Fuel filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Oil change</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Air filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                </ul>
                <button className="block w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium transition-colors duration-200">
                  BOOK NOW
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">3,000 TCS Points</p>
              </div>
            </div>
            
            {/* Service Card 3 - GEARBOX SERVICE */}
            <div className="bg-black/80 rounded-lg overflow-hidden shadow-lg border border-gray-800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-orange">GEARBOX SERVICE <span className="ml-1 text-white">⚙️</span></h3>
                </div>
                <p className="text-xs text-orange mb-1">10% OFF FOR GOLD MEMBERS 🔶</p>
                <div className="text-white text-3xl font-bold my-4">£299</div>
                <p className="text-xs text-gray-400 mb-4">EVERYTHING IN BASIC, PLUS</p>
                <ul className="text-gray-300 text-sm space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Cabin filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Fuel filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Oil change</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Air filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                </ul>
                <button className="block w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium transition-colors duration-200">
                  BOOK NOW
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">6,000 TCS Points</p>
              </div>
            </div>
            
            {/* Service Card 4 - TIMING BELT */}
            <div className="bg-black/80 rounded-lg overflow-hidden shadow-lg border border-gray-800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-orange">TIMING BELT <span className="ml-1 text-white">⚙️</span></h3>
                </div>
                <p className="text-xs text-orange mb-1">10% OFF FOR GOLD MEMBERS 🔶</p>
                <div className="text-white text-3xl font-bold my-4">£399</div>
                <p className="text-xs text-gray-400 mb-4">EVERYTHING IN BASIC, PLUS</p>
                <ul className="text-gray-300 text-sm space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Cabin filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Fuel filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Oil change</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Air filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                </ul>
                <button className="block w-full border border-red-500 hover:bg-red-500/20 text-white py-2 rounded-md font-medium transition-colors duration-200">
                  BOOK NOW
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">10,000 TCS Points</p>
              </div>
            </div>
            
            {/* Service Card 5 - WINTER PACKAGE */}
            <div className="bg-black/80 rounded-lg overflow-hidden shadow-lg border border-gray-800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-orange">WINTER PACKAGE <span className="ml-1 text-white">❄️</span></h3>
                </div>
                <p className="text-xs text-orange mb-1">10% OFF FOR GOLD MEMBERS 🔶</p>
                <div className="text-white text-3xl font-bold my-4">£99</div>
                <p className="text-xs text-gray-400 mb-4">EVERYTHING IN BASIC, PLUS</p>
                <ul className="text-gray-300 text-sm space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Cabin filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Fuel filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Oil change</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span>Air filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </li>
                </ul>
                <button className="block w-full border border-red-500 hover:bg-red-500/20 text-white py-2 rounded-md font-medium transition-colors duration-200">
                  BOOK NOW
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">1,000 TCS Points</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Car Brand Logos Slider */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">TRUSTED BY LEADING BRANDS</h2>
            <div className="w-24 h-1 bg-orange mx-auto mt-4"></div>
          </div>
          
          <div className="relative overflow-hidden bg-black/50 py-10 rounded-lg">
            {/* Single row of logos - sliding from left to right */}
            <div className="relative overflow-hidden py-8">
              <div className="flex space-x-20 animate-slide-left-to-right">
                {/* First set of logos */}
                <div className="w-36 h-20 relative flex-shrink-0">
                  <Image 
                    src="/images/cars/carlogo1.png" 
                    alt="Car Brand Logo 1" 
                    fill
                    style={{ objectFit: 'contain' }}
                    className="brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" 
                  />
                </div>
                <div className="w-36 h-20 relative flex-shrink-0">
                  <Image 
                    src="/images/cars/carlogo2.png" 
                    alt="Car Brand Logo 2" 
                    fill
                    style={{ objectFit: 'contain' }}
                    className="brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" 
                  />
                </div>
                <div className="w-36 h-20 relative flex-shrink-0">
                  <Image 
                    src="/images/cars/carlogo3.png" 
                    alt="Car Brand Logo 3" 
                    fill
                    style={{ objectFit: 'contain' }}
                    className="brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" 
                  />
                </div>
                <div className="w-36 h-20 relative flex-shrink-0">
                  <Image 
                    src="/images/cars/carlogo4.png" 
                    alt="Car Brand Logo 4" 
                    fill
                    style={{ objectFit: 'contain' }}
                    className="brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" 
                  />
                </div>
                
                {/* Duplicate set for continuous loop */}
                <div className="w-36 h-20 relative flex-shrink-0">
                  <Image 
                    src="/images/cars/carlogo1.png" 
                    alt="Car Brand Logo 1" 
                    fill
                    style={{ objectFit: 'contain' }}
                    className="brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" 
                  />
                </div>
                <div className="w-36 h-20 relative flex-shrink-0">
                  <Image 
                    src="/images/cars/carlogo2.png" 
                    alt="Car Brand Logo 2" 
                    fill
                    style={{ objectFit: 'contain' }}
                    className="brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" 
                  />
                </div>
                <div className="w-36 h-20 relative flex-shrink-0">
                  <Image 
                    src="/images/cars/carlogo3.png" 
                    alt="Car Brand Logo 3" 
                    fill
                    style={{ objectFit: 'contain' }}
                    className="brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" 
                  />
                </div>
                <div className="w-36 h-20 relative flex-shrink-0">
                  <Image 
                    src="/images/cars/carlogo4.png" 
                    alt="Car Brand Logo 4" 
                    fill
                    style={{ objectFit: 'contain' }}
                    className="brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" 
                  />
                </div>
              </div>
            </div>
            
            {/* Gradient overlays for smooth fade effect on sides */}
            <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-black to-transparent z-10"></div>
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-black to-transparent z-10"></div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <Image 
                src="/images/logos/about us image.jpg" 
                alt="Mechanics working on a car" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg" 
              />
            </div>
            <div className="md:w-1/2">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  <span className="text-white">Welcome to</span>
                </h2>
                <h3 className="text-4xl font-bold mb-6">
                  <span className="text-orange-500">The Car Edition</span>
                </h3>
                <div className="w-16 h-1 bg-orange-500 mb-6"></div>
                <p className="text-gray-300 mb-4">
                  The Car Edition is a trusted provider of high-quality used cars as well as a wide range of garage mechanical services. Our qualified team of mechanics are here to help you with all your car needs, whether it's a service, repair, engine rebuild, carbon clean or diagnostics.
                </p>
                <div className="flex gap-4 mt-8">
                  <Link href="/services" className="flex items-center bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-md font-medium transition-colors duration-200">
                    <span className="mr-2">+</span> EXPLORE SERVICES
                  </Link>
                  <Link href="/video" className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200">
                    <span className="mr-2">⏵</span> WELCOME VIDEO
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-orange uppercase">Popular Services</h2>
            <div className="w-24 h-1 bg-orange mx-auto mt-4 mb-8"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-gray-900 text-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Paint Protection</h3>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-gray-900 text-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Interior Detailing</h3>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-gray-900 text-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Ceramic Coating</h3>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-gray-900 text-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Engine Tuning</h3>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-gray-900 text-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Wheel Repair</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Car Showcase Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-12">Car Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="h-60 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Image
                  src="/images/logos/background image one..jpg"
                  alt="Car Showcase"
                  width={400}
                  height={300}
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-white text-center">Luxury Car</h3>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="h-60 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Image
                  src="/images/logos/background image one..jpg"
                  alt="Car Showcase"
                  width={400}
                  height={300}
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-white text-center">Sports Car</h3>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="h-60 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Image
                  src="/images/logos/background image one..jpg"
                  alt="Car Showcase"
                  width={400}
                  height={300}
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-white text-center">Electric Car</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-950 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="text-white">Why wait? Join</span>
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-orange">The Car Edition</span>
              </h3>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for exclusive offers, tips, and the latest news in automotive care and maintenance.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-900 p-6 rounded-lg">
                <form className="flex flex-col gap-4">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange"
                    required
                  />
                  <input 
                    type="email" 
                    placeholder="Your Email Address" 
                    className="px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange"
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-orange hover:bg-orange-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
                  >
                    SUBSCRIBE NOW
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">The Car Edition Pro</h3>
              <p className="text-gray-400">Premium automotive experience and showcase.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/vehicles" className="text-gray-400 hover:text-white">Vehicles</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Categories</h4>
              <ul className="space-y-2">
                <li><Link href="/vehicles/luxury" className="text-gray-400 hover:text-white">Luxury</Link></li>
                <li><Link href="/vehicles/sports" className="text-gray-400 hover:text-white">Sports</Link></li>
                <li><Link href="/vehicles/electric" className="text-gray-400 hover:text-white">Electric</Link></li>
                <li><Link href="/vehicles/suv" className="text-gray-400 hover:text-white">SUV</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} The Car Edition Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
