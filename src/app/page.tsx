'use client';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { FaCarSide, FaTools, FaOilCan, FaCogs, FaWrench, FaUserCog } from 'react-icons/fa';
import { MdElectricCar, MdOutlineCleaningServices } from 'react-icons/md';
import { BsStarFill } from 'react-icons/bs';

// These components aren't needed or don't exist in the project
import VideoPlayer from '@/components/VideoPlayer';
import ServiceTabs from '@/components/ServiceTabs';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

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

  // Reference for the services slider
  const servicesSliderRef = useRef<HTMLDivElement>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  
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
  
  // Auto-scrolling effect for services slider
  useEffect(() => {
    if (!autoScrollEnabled) return;
    
    const servicesInterval = setInterval(() => {
      if (servicesSliderRef.current) {
        servicesSliderRef.current.scrollLeft += 1;
        
        // Reset when we reach the end
        if (servicesSliderRef.current.scrollLeft >= servicesSliderRef.current.scrollWidth - servicesSliderRef.current.clientWidth - 10) {
          servicesSliderRef.current.scrollLeft = 0;
        }
      }
    }, 30);
    
    return () => clearInterval(servicesInterval);
  }, [autoScrollEnabled]);
  return (
    <main className="bg-black text-white font-heading">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-between">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/logos/backgroundlogo2.jpg"
            alt="Car Workshop"
            fill
            priority
            className="object-cover brightness-50 w-full h-full"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            style={{ objectPosition: 'center' }}
          />
        </div>
        <div className="container mx-auto relative z-10 text-white px-4 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-16 flex items-center justify-center sm:justify-start">
          <div className="max-w-3xl w-full text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 uppercase italic">
              <span className="text-white">CAR CARE</span>
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 uppercase italic">
              <span style={{ color: '#fb9929' }}>REDEFINED</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mb-6 sm:mb-8 text-gray-300 mx-auto sm:mx-0">
              Professional car care services for your premium vehicle
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-16 justify-center sm:justify-start">
              <Link href="/service-estimator" className="text-white px-8 py-3 font-medium transition-colors duration-200 flex items-center uppercase italic hover:bg-red-800" style={{ backgroundColor: '#c40b0b' }}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Get Service Estimate
              </Link>
            </div>
            
            {/* Service Categories Slider */}
            <div className="relative z-10 overflow-hidden w-full py-12 mt-4">
              {/* Desktop view - static grid for larger screens */}
              <div className="hidden lg:block w-full">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {/* Engine Repair & Rebuilds */}
                    <div className="text-center">
                      <svg className="w-12 h-12 text-white mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <h3 className="text-xl font-bold text-white uppercase mb-4">ENGINE REPAIR & REBUILDS</h3>
                      <p className="text-gray-300 text-sm">
                        Rebuild your engine with The Car Edition. Our experts are proficient in European, American and Japanese brands.
                      </p>
                    </div>

                    {/* Maintenance & Servicing */}
                    <div className="text-center">
                      <svg className="w-12 h-12 text-white mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                      <h3 className="text-xl font-bold text-white uppercase mb-4">MAINTENANCE & SERVICING</h3>
                      <p className="text-gray-300 text-sm">
                        Whether you need oil change services, major service or even a general service, The Car Edition got you covered.
                      </p>
                    </div>

                    {/* Buy or Sell Your Car */}
                    <div className="text-center">
                      <svg className="w-12 h-12 text-white mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <h3 className="text-xl font-bold text-white uppercase mb-4">BUY OR SELL YOUR CAR</h3>
                      <p className="text-gray-300 text-sm">
                        Looking to buy your dream car or simply want to sell yours? Look no further - we can do both!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile view - marquee for smaller screens */}
              <div className="lg:hidden w-full">
                <div className="marquee-container w-full mx-auto" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <div className="marquee-content" style={{ display: 'inline-block', animation: 'marquee 30s linear infinite' }}>
                    {/* Engine Repair & Rebuilds */}
                    <div className="inline-block mx-8 w-72 text-center">
                      <svg className="w-12 h-12 text-white mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <h3 className="text-xl font-bold text-white uppercase mb-4">ENGINE REPAIR & REBUILDS</h3>
                      <p className="text-gray-300 text-sm whitespace-normal">
                        Rebuild your engine with The Car Edition. Our experts are proficient in European, American and Japanese brands.
                      </p>
                    </div>

                    {/* Maintenance & Servicing */}
                    <div className="inline-block mx-8 w-72 text-center">
                      <svg className="w-12 h-12 text-white mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                      <h3 className="text-xl font-bold text-white uppercase mb-4">MAINTENANCE & SERVICING</h3>
                      <p className="text-gray-300 text-sm whitespace-normal">
                        Whether you need oil change services, major service or even a general service, The Car Edition got you covered.
                      </p>
                    </div>

                    {/* Buy or Sell Your Car */}
                    <div className="inline-block mx-8 w-72 text-center">
                      <svg className="w-12 h-12 text-white mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <h3 className="text-xl font-bold text-white uppercase mb-4">BUY OR SELL YOUR CAR</h3>
                      <p className="text-gray-300 text-sm whitespace-normal">
                        Looking to buy your dream car or simply want to sell yours? Look no further - we can do both!
                      </p>
                    </div>
                    
                    {/* Duplicate for continuous scrolling */}
                    {/* Engine Repair & Rebuilds */}
                    <div className="inline-block mx-8 w-72 text-center">
                      <svg className="w-12 h-12 text-white mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <h3 className="text-xl font-bold text-white uppercase mb-4">ENGINE REPAIR & REBUILDS</h3>
                      <p className="text-gray-300 text-sm whitespace-normal">
                        Rebuild your engine with The Car Edition. Our experts are proficient in European, American and Japanese brands.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10% Off Banner */}
      <section style={{ backgroundColor: '#f56e13', padding: '1.25rem 0', position: 'relative', marginTop: '100px' }}>
        <div className="container mx-auto px-4">
          <p style={{ color: 'white', textAlign: 'center', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-poppins)', margin: '0' }}>
            GET 10% OFF YOUR FIRST SERVICE + FREE BRAKE FLUID TOP UP WHEN YOU SIGN UP TO OUR REWARDS PROGRAM!
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 mt-6 bg-black" style={{backgroundImage: 'url(/images/logos/background-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(255,255,255,0.1)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase">TRENDING SERVICES</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Service Card 1 - FULL SERVICE */}
            <div className="bg-[#222] rounded-lg overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-white mr-2">⚙️</span>
                  <h3 className="text-base font-bold text-[#f56e13] whitespace-nowrap">FULL SERVICE</h3>
                </div>
                <p className="text-xs text-[#f56e13] mb-1">10% OFF FOR GOLD MEMBERS</p>
                <div className="text-white text-3xl font-bold my-4">£249</div>
                <p className="text-xs text-gray-400 mb-4">FREE TO RE-VISIT</p>
                <div className="flex flex-col space-y-2 mb-6">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Cabin filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Fuel filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Oil change</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Air filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                </div>
                <button className="block w-full bg-red-500 hover:bg-red-600 text-white py-2 font-medium transition-colors duration-200">
                  BOOK NOW
                </button>
              </div>
            </div>
            
            {/* Service Card 2 - INTERIM SERVICE */}
            <div className="bg-[#222] rounded-lg overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-white mr-2">⚙️</span>
                  <h3 className="text-base font-bold text-[#f56e13] whitespace-nowrap">INTERIM SERVICE</h3>
                </div>
                <p className="text-xs text-[#f56e13] mb-1">10% OFF FOR GOLD MEMBERS</p>
                <div className="text-white text-3xl font-bold my-4">£149</div>
                <p className="text-xs text-gray-400 mb-4">EVERYTHING IN BASIC, PLUS</p>
                <div className="flex flex-col space-y-2 mb-6">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Cabin filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Fuel filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Oil change</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Air filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                </div>
                <button className="block w-full bg-red-500 hover:bg-red-600 text-white py-2 font-medium transition-colors duration-200">
                  BOOK NOW
                </button>
              </div>
            </div>
            
            {/* Service Card 3 - GEARBOX SERVICE */}
            <div className="bg-[#222] rounded-lg overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-white mr-2">⚙️</span>
                  <h3 className="text-base font-bold text-[#f56e13] whitespace-nowrap">GEARBOX SERVICE</h3>
                </div>
                <p className="text-xs text-[#f56e13] mb-1">10% OFF FOR GOLD MEMBERS</p>
                <div className="text-white text-3xl font-bold my-4">£299</div>
                <p className="text-xs text-gray-400 mb-4">EVERYTHING IN BASIC, PLUS</p>
                <div className="flex flex-col space-y-2 mb-6">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Cabin filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Fuel filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Oil change</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Air filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                </div>
                <button className="block w-full bg-red-500 hover:bg-red-600 text-white py-2 font-medium transition-colors duration-200">
                  BOOK NOW
                </button>
              </div>
            </div>
            
            {/* Service Card 4 - TIMING BELT */}
            <div className="bg-[#222] rounded-lg overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-white mr-2">⚙️</span>
                  <h3 className="text-base font-bold text-[#f56e13] whitespace-nowrap">TIMING BELT</h3>
                </div>
                <p className="text-xs text-[#f56e13] mb-1">10% OFF FOR GOLD MEMBERS</p>
                <div className="text-white text-3xl font-bold my-4">£399</div>
                <p className="text-xs text-gray-400 mb-4">EVERYTHING IN BASIC, PLUS</p>
                <div className="flex flex-col space-y-2 mb-6">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Cabin filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Fuel filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Oil change</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Air filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                </div>
                <button className="block w-full bg-red-500 hover:bg-red-600 text-white py-2 font-medium transition-colors duration-200">
                  BOOK NOW
                </button>
              </div>
            </div>
            
            {/* Service Card 5 - WINTER PACKAGE */}
            <div className="bg-[#222] rounded-lg overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-white mr-2">❄️</span>
                  <h3 className="text-base font-bold text-[#f56e13] whitespace-nowrap">WINTER PACKAGE</h3>
                </div>
                <p className="text-xs text-[#f56e13] mb-1">10% OFF FOR GOLD MEMBERS</p>
                <div className="text-white text-3xl font-bold my-4">£99</div>
                <p className="text-xs text-gray-400 mb-4">EVERYTHING IN BASIC, PLUS</p>
                <div className="flex flex-col space-y-2 mb-6">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Cabin filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Fuel filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Oil change</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-300">Air filter</span>
                    <span className="ml-auto text-gray-500">ⓘ</span>
                  </div>
                </div>
                <button className="block w-full bg-red-500 hover:bg-red-600 text-white py-2 font-medium transition-colors duration-200">
                  BOOK NOW
                </button>
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
            <div className="w-24 h-1 bg-[#f56e13] mx-auto mt-4"></div>
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
      <section className="py-16 bg-[#191717]">
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
                <h2 className="text-2xl font-bold mb-2 uppercase">
                  <span className="text-white">Welcome to</span>
                </h2>
                <h3 className="text-4xl font-bold mb-6 uppercase italic">
                  <span className="text-[#f56e13]">The Car Edition</span>
                </h3>
                <div className="w-16 h-1 bg-[#f56e13] mb-6"></div>
                <p className="text-gray-300 mb-4">
                  The Car Edition is a trusted provider of high-quality used cars as well as a wide range of garage mechanical services. Our qualified team of mechanics are here to help you with all your car needs, whether it's a service, repair, engine rebuild, carbon clean or diagnostics.
                </p>
                <div className="flex gap-4 mt-8">
                  <Link href="/services" className="flex items-center bg-white text-black hover:bg-gray-200 px-6 py-3 clip-path-polygon font-medium transition-colors duration-200 uppercase">
                    <span className="mr-2 text-red-600">+</span> Explore Services
                  </Link>
                  <Link href="/video" className="flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 clip-path-polygon font-medium transition-colors duration-200 uppercase">
                    <span className="mr-2">⏵</span> Welcome Video
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Popular Services */}
      <section className="py-16 bg-[#191717]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#f56e13] uppercase italic font-poppins">POPULAR SERVICES</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            {/* Service 1 */}
            <div className="text-center">
              <div className="mb-4 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1 text-white italic font-poppins">Servicing & Maintenance</h3>
              <p className="text-[#f56e13] text-xs italic font-poppins">Service, Oil Change, Filters</p>
            </div>
            
            {/* Service 2 */}
            <div className="text-center">
              <div className="mb-4 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 4h-4l-3-3H8L5 4H1v2h18V4zm-3 15H8c-1.65 0-3-1.35-3-3V9h14v7c0 1.65-1.35 3-3 3z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1 text-white italic font-poppins">Engine & Mechanical Repair</h3>
              <p className="text-[#f56e13] text-xs italic font-poppins">Clutch, Gearbox, Suspension</p>
            </div>
            
            {/* Service 3 */}
            <div className="text-center">
              <div className="mb-4 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1 text-white italic font-poppins">Engine Rebuilds</h3>
              <p className="text-[#f56e13] text-xs italic font-poppins">Full engine rebuilds</p>
            </div>
            
            {/* Service 4 */}
            <div className="text-center">
              <div className="mb-4 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1 text-white italic font-poppins">Tyres & Puncture Repair</h3>
              <p className="text-[#f56e13] text-xs italic font-poppins">Tyre replacement</p>
            </div>
            
            {/* Service 5 */}
            <div className="text-center">
              <div className="mb-4 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1 text-white italic font-poppins">Brakes</h3>
              <p className="text-[#f56e13] text-xs italic font-poppins">Brakes, Discs & Pads</p>
            </div>
            
            {/* Service 6 */}
            <div className="text-center">
              <div className="mb-4 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1 text-white italic font-poppins">In Car Entertainment</h3>
              <p className="text-[#f56e13] text-xs italic font-poppins">Dash Cam, Star Lights, Audio</p>
            </div>
            
            {/* Service 7 */}
            <div className="text-center">
              <div className="mb-4 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1 text-white italic font-poppins">Interior Repair</h3>
              <p className="text-[#f56e13] text-xs italic font-poppins">Upholstery Repair</p>
            </div>
            
            {/* Service 8 */}
            <div className="text-center">
              <div className="mb-4 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1 text-white italic font-poppins">Air Conditioning</h3>
              <p className="text-[#f56e13] text-xs italic font-poppins">Re-gas & diagnose</p>
            </div>
            
            {/* Service 9 */}
            <div className="text-center">
              <div className="mb-4 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1 text-white italic font-poppins">Diagnostics</h3>
              <p className="text-[#f56e13] text-xs italic font-poppins">Problem/symptoms</p>
            </div>
            
            {/* Service 10 */}
            <div className="text-center">
              <div className="mb-4 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1 text-white italic font-poppins">Customisation & Upgrades</h3>
              <p className="text-[#f56e13] text-xs italic font-poppins">Turbo, Remap, Exhausts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gold Members Club Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 italic">
                Join our Gold Members Club
                <br />
                <span className="text-black">and enjoy exclusive benefits!</span>
              </h2>
              <p className="text-black text-sm mb-6">
                Join our Gold Members Club and earn points for every service
                visit you schedule with us. The more points you collect, the
                bigger the rewards! Plus, we'll send you a reminder 30 days
                before your next MOT and service! Enjoy 5,000 sign up points!
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white uppercase font-bold py-3 px-8 clip-path-polygon transition-colors duration-200">
                CLAIM 5K NOW
              </button>
            </div>
            <div className="md:w-1/2">
              <div className="relative max-w-md mx-auto">
                <div className="absolute top-0 right-0 bg-black p-3 z-10">
                  <p className="text-white text-xs font-bold">BEST CAR</p>
                  <p className="text-[#f56e13] text-lg font-bold">RENT</p>
                  <p className="text-white text-lg font-bold">DEALS</p>
                  <a href="#" className="inline-block mt-1 text-xs text-[#f56e13] border-b border-[#f56e13]">SEE ALL OFFERS</a>
                </div>
                <Image
                  src="/images/logos/rentacarimage.jpg"
                  alt="Gold Members Club"
                  width={400}
                  height={240}
                  className="w-full object-cover h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 p-2 bg-black bg-opacity-50">
                  <button className="text-white hover:text-[#f56e13] transition-colors">&#8592;</button>
                  <button className="text-white hover:text-[#f56e13] transition-colors">2</button>
                  <button className="text-white hover:text-[#f56e13] transition-colors">&#8594;</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Service Your Car Section */}
      <section className="py-16 bg-[#191717]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left side - 3D Car Image */}
            <div className="md:w-1/2 relative">
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                <Image
                  src="/images/logos/3dcarpic.png"
                  alt="3D Car"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  style={{filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.5))'}}
                />
              </div>
            </div>
            
            {/* Right side - Text and Video */}
            <div className="md:w-1/2">
              <h2 className="text-white text-2xl font-medium mb-2">
                Why service your car with
              </h2>
              <h3 className="text-[#f56e13] text-4xl font-bold mb-6 italic">
                The Car Edition?
              </h3>
              <div className="w-16 h-1 bg-[#f56e13] mb-6"></div>
              
              <p className="text-gray-300 mb-6">
                The Car Edition is a trusted provider of high-quality used cars as well
                as a wide range of garage mechanic services. Our qualified team of
                mechanics is here to help you with all your car needs, whether it's a
                service, repair, engine rebuilds, carbon clean or diagnostics.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <a href="/services" className="inline-flex items-center bg-white text-black hover:bg-gray-200 px-6 py-3 clip-path-polygon font-medium transition-colors duration-200 uppercase">
                  <span className="mr-2">+</span> VIEW OPTIONS
                </a>
                <a href="/about" className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 clip-path-polygon font-medium transition-colors duration-200 uppercase">
                  <span className="mr-2">?</span> WHY CHOOSE US?
                </a>
              </div>
              
              {/* Video Player Component */}
              <VideoPlayer 
                videoId="-Jz8jyMPt2U" 
                thumbnailSrc="/images/logos/youtube_logo.jpg" 
              />

            </div>
          </div>
        </div>
      </section>

      {/* Maintenance and Servicing Section */}
      <ServiceTabs />

      {/* Specialist Mechanical Work and Diagnostics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black uppercase italic mb-8">Specialist Mechanical Work and Diagnostics</h2>
            <p className="text-lg text-[#f56e13] italic font-medium">Expert Technicians for All Your Vehicle Needs</p>
          </div>
          
          {/* Sliding services carousel */}
          <div className="relative overflow-hidden" 
            onMouseEnter={() => setAutoScrollEnabled(false)}
            onMouseLeave={() => setAutoScrollEnabled(true)}
          >
            {/* Slider container */}
            <div className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide scroll-smooth snap-x snap-mandatory" ref={servicesSliderRef}>
              
              {/* Service 1: Timing Chains */}
              <div className="flex-shrink-0 w-full md:w-1/4 lg:w-1/5 min-w-[280px] snap-start">
                <div className="relative aspect-square overflow-hidden" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}>
                  <Image
                    src="/images/services/serviceimage1.jpg"
                    alt="Timing Chains"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-base font-semibold mb-2">TIMING CHAINS</h3>
                    <p className="text-xs mb-4">Our engine rebuild service at The Car Edition in Huntingdon is like a makeover for your car.</p>
                    <Link href="/services/timing-chains" className="text-xs font-semibold tracking-wider uppercase flex items-center text-white hover:text-[#f56e13] transition-colors">
                      Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Service 2: Engine Rebuilds */}
              <div className="flex-shrink-0 w-full md:w-1/4 lg:w-1/5 min-w-[280px] snap-start">
                <div className="relative aspect-square overflow-hidden" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}>
                  <Image
                    src="/images/services/serviceimage2.jpg"
                    alt="Engine Rebuilds"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-base font-semibold mb-2">ENGINE REBUILDS</h3>
                    <p className="text-xs mb-4">Our engine rebuild service at The Car Edition in Huntingdon is like a makeover for your car.</p>
                    <Link href="/services/engine-rebuilds" className="text-xs font-semibold tracking-wider uppercase flex items-center text-white hover:text-[#f56e13] transition-colors">
                      Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Service 3: Turbos */}
              <div className="flex-shrink-0 w-full md:w-1/4 lg:w-1/5 min-w-[280px] snap-start">
                <div className="relative aspect-square overflow-hidden" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}>
                  <Image
                    src="/images/services/serviceimage3.jpg"
                    alt="Turbos"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-base font-semibold mb-2">TURBOS</h3>
                    <p className="text-xs mb-4">Our turbo repair and replacement service ensures optimal performance for your turbocharged engine.</p>
                    <Link href="/services/turbos" className="text-xs font-semibold tracking-wider uppercase flex items-center text-white hover:text-[#f56e13] transition-colors">
                      Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Service 4: Transmission */}
              <div className="flex-shrink-0 w-full md:w-1/4 lg:w-1/5 min-w-[280px] snap-start">
                <div className="relative aspect-square overflow-hidden" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}>
                  <Image
                    src="/images/services/serviceimage4.jpg"
                    alt="Transmission"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-base font-semibold mb-2">TRANSMISSION</h3>
                    <p className="text-xs mb-4">Expert transmission repair and maintenance to keep your vehicle shifting smoothly and reliably.</p>
                    <Link href="/services/transmission" className="text-xs font-semibold tracking-wider uppercase flex items-center text-white hover:text-[#f56e13] transition-colors">
                      Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Service 5: Diagnostics */}
              <div className="flex-shrink-0 w-full md:w-1/4 lg:w-1/5 min-w-[280px] snap-start">
                <div className="relative aspect-square overflow-hidden" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}>
                  <Image
                    src="/images/services/serviceimage5.jpg"
                    alt="Diagnostics"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-base font-semibold mb-2">DIAGNOSTICS</h3>
                    <p className="text-xs mb-4">Advanced diagnostic services to identify and resolve issues with precision and accuracy.</p>
                    <Link href="/services/diagnostics" className="text-xs font-semibold tracking-wider uppercase flex items-center text-white hover:text-[#f56e13] transition-colors">
                      Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Duplicate cards for infinite scroll effect */}
              {/* Service 1: Timing Chains (duplicate) */}
              <div className="flex-shrink-0 w-full md:w-1/4 lg:w-1/5 min-w-[280px] snap-start">
                <div className="relative aspect-square overflow-hidden" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}>
                  <Image
                    src="/images/services/serviceimage1.jpg"
                    alt="Timing Chains"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-base font-semibold mb-2">TIMING CHAINS</h3>
                    <p className="text-xs mb-4">Our engine rebuild service at The Car Edition in Huntingdon is like a makeover for your car.</p>
                    <Link href="/service-estimator" className="text-xs font-semibold tracking-wider uppercase flex items-center text-white hover:text-[#f56e13] transition-colors">
                      Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation arrows */}
            <button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full z-10 ml-2"
              onClick={() => {
                setAutoScrollEnabled(false);
                if (servicesSliderRef.current) {
                  servicesSliderRef.current.scrollLeft -= 300;
                }
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full z-10 mr-2"
              onClick={() => {
                setAutoScrollEnabled(false);
                if (servicesSliderRef.current) {
                  servicesSliderRef.current.scrollLeft += 300;
                }
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Schedule an Appointment Section */}
      <section className="relative overflow-hidden bg-white py-16">
        {/* Top corner shape */}
        <div className="absolute top-0 left-0 w-full h-24">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full h-full">
            <path d="M0 0L1440 0V60C1440 93.1371 1413.14 120 1380 120H60C26.8629 120 0 93.1371 0 60V0Z" fill="#030712" />
          </svg>
        </div>
        
        {/* Clean white background */}
        <div className="absolute inset-0 bg-white pointer-events-none">
        </div>
        
        <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Text content */}
            <div className="lg:w-1/2 z-10">
              <div className="mb-6">
                <span className="inline-block text-red-600 font-semibold tracking-wider uppercase text-sm mb-2">VISIT US</span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase leading-tight mb-4">SCHEDULE AN <br />APPOINTMENT TODAY</h2>
                <p className="text-gray-700 mb-8">
                  At The Car Edition in Huntingdon, our mechanical repair service is all about keeping your car's engine ticking happily.
                </p>
                <Link href="/service-estimator" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-sm transition-colors duration-300 uppercase tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Schedule an Appointment
                </Link>
              </div>
            </div>
            
            {/* 3D Car Image with enhanced effects */}
            <div className="lg:w-1/2 relative perspective-[1000px] z-20">
              {/* Clean space for car */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[70%] rotate-y-[-5deg] z-0"></div>
              
              {/* Car image with 3D transforms */}
              <div className="relative w-full h-[450px] transform translate-z-32 rotate-y-[5deg] scale-110 hover:scale-115 transition-transform duration-700">
                <div className="absolute inset-0 transform translate-y-[-20px] translate-x-[30px]">
                  <Image
                    src="/images/services/appointmentimage.jpg"
                    alt="3D Car"
                    fill
                    className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)]"
                    style={{
                      filter: 'drop-shadow(0 30px 20px rgba(0,0,0,0.3))',
                      transform: 'translateZ(100px)'
                    }}
                  />
                </div>
              </div>
              
              {/* Multiple layered shadows for depth */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[85%] h-8 bg-black/15 rounded-full blur-xl z-0"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[70%] h-4 bg-black/20 rounded-full blur-lg z-0"></div>
              
              {/* Reflection effect */}
              <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[80%] h-[20px] bg-gradient-to-b from-white/30 to-transparent rounded-full blur-sm"></div>
              
              {/* Clean space without pop-out indicators */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom corner shape */}
        <div className="absolute bottom-0 left-0 w-full h-24">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0 w-full h-full transform rotate-180">
            <path d="M0 0L1440 0V60C1440 93.1371 1413.14 120 1380 120H60C26.8629 120 0 93.1371 0 60V0Z" fill="#030712" />
          </svg>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsCarousel limit={6} autoplaySpeed={6000} />

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 bg-gray-950 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center md:text-left">
                <span className="text-white">Why wait? Join</span>
              </h2>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center md:text-left">
                <span className="text-[#f56e13]">The Car Edition</span>
              </h3>
              <p className="text-gray-400 mb-4 text-center md:text-left text-sm sm:text-base">
                Subscribe to our newsletter for exclusive offers, tips, and the latest news in automotive care and maintenance.
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg">
                <form className="flex flex-col gap-3 sm:gap-4">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="px-4 py-2 sm:py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#f56e13] text-sm sm:text-base"
                    required
                  />
                  <input 
                    type="email" 
                    placeholder="Your Email Address" 
                    className="px-4 py-2 sm:py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#f56e13] text-sm sm:text-base"
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-[#f56e13] hover:bg-[#d15000] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors duration-200 text-sm sm:text-base"
                  >
                    SUBSCRIBE NOW
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}
