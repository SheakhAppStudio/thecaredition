"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaPlay, FaYoutube } from 'react-icons/fa';
import moment from 'moment';
import { Link } from 'lucide-react';
import ServiceEstimator from '@/app/service-estimator/page';
const TypeAndPuncture = () => {

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);



  const openVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };




  

  return (
    <div className="w-full bg-black overflow-hidden">
      {/* Container with 16:9 aspect ratio */}
      <section className="max-w-screen mx-auto pt-20">
        <Image
          src="/images/tyres-and-puncture.jpeg"
          alt="Tyres and Puncture"
          width={1920}
          height={1080}
          quality={85}
          className="object-cover w-full h-[80vh]"

        />
      </section>
      <section className='max-w-7xl mx-auto mt-20'>
<div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-20'>
            <div className='p-4'>
              <Image
          src="/images/tyres-and-puncture.jpeg"
          alt="Tyres and Puncture"
          width={1920}
          height={1080}
          quality={85}
          className="object-cover w-full h-40"

        />
        </div>
        <div className='space-y-4 p-4'>
          <h1 className='text-4xl font-bold text-white mb-4'>Tyres, wheels & Puncture Repair</h1>
          <p className='text-gray-400 mb-6'>
           At The Car Edition, we offer professional tire changing services
          </p>

        </div>
         </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 '>
                <div className='p-4'>
              <Image
          src="/images/tyres-and-puncture.jpeg"
          alt="Tyres and Puncture"
          width={1920}
          height={1080}
          quality={85}
          className="object-cover aspect-16/16"

        />
        </div>
        <div>
          <p className='text-gray-400 p-4'>
            Our team is equipped to handle all types of tires, ensuring your vehicle is safe and ready for the road. Whether you need a quick tire change or a complete wheel replacement, we have you covered.
          </p>
          <p className='text-gray-400 p-4'>
            Our team is equipped to handle all types of tires, ensuring your vehicle is safe and ready for the road. Whether you need a quick tire change or a complete wheel replacement, we have you covered.
          </p>
          <p className='text-gray-400 p-4'>
            Our team is equipped to handle all types of tires, ensuring your vehicle is safe and ready for the road. Whether you need a quick tire change or a complete wheel replacement, we have you covered.
          </p>
        </div>
      </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 '> 
          <div className='p-4'>
            <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="group relative bg-[#1A1A1A]  overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 border border-white/5 transition-all duration-500 hover:-translate-y-1 max-w-full"
              >
                <div 
                  className="relative aspect-video cursor-pointer overflow-hidden" 
                  onClick={() => openVideo("https://www.youtube.com/embed/TxbGIr-3fLE?si=92581HitDXT5ViAu")}
                >
                  <Image
                    src={"https://res.cloudinary.com/dc3czyqsb/image/upload/v1749854142/photo-1484807352052-23338990c6c6_mu5fwb.jpg"}
                    alt={"Welcome Video "}
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
                    <span>{moment("2025-06-19T04:33:42.322+00:00").format("DD MMM YYYY")}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-4 line-clamp-2 text-white group-hover:text-red-500 transition-colors duration-300">
                     Tyres and Puncture
                  </h3>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => openVideo("https://www.youtube.com/embed/TxbGIr-3fLE?si=92581HitDXT5ViAu")}
                      className="text-white hover:text-red-500 text-sm font-medium transition-colors duration-300 flex items-center gap-2 hover:gap-3"
                    >
                      Watch Now
                      <FaPlay className="text-xs" />
                    </button>
                    
                    <a
                      href={"https://www.youtube.com/live/TxbGIr-3fLE?si=92581HitDXT5ViAu"}
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
        <div className='p-4 space-y-8'>
          <p className='text-gray-400 mb-4'>Regular services like puncture repair, wheel balancing,
and tracking (alignment) help your tyres wear evenly, last
longer, and keep your drive smooth and efficient. Think of
it as giving your car the foundation it needs to stay safe,
steady, and road-ready.</p>
          <ul className='list-none list-inside space-y-3'>
            <li className='text-gray-400 flex gap-5 items-center'>  <div className="mr-4">
                              <Image
                                src="/images/icons/SERVICE ICON white.png"
                                alt="Engine Repair Icon"
                                width={32}
                                height={32}
                                className="w-8 h-8"
                              />
                            </div>Wheel Balancing & Tracking</li>
            <li className='text-gray-400 flex gap-5 items-center'>  <div className="mr-4">
                              <Image
                                src="/images/icons/SERVICE ICON white.png"
                                alt="Engine Repair Icon"
                                width={32}
                                height={32}
                                className="w-8 h-8"
                              />
                            </div>Access to Premium & Budget Tyres</li>
            <li className='text-gray-400 flex gap-5 items-center'>   <div className="mr-4">
                              <Image
                                src="/images/icons/SERVICE ICON white.png"
                                alt="Engine Repair Icon"
                                width={32}
                                height={32}
                                className="w-8 h-8"
                              />
                            </div>Freetyre tread and air checks</li>
            <li className='text-gray-400 flex gap-5 items-center'>   <div className="mr-4">
                              <Image
                                src="/images/icons/SERVICE ICON white.png"
                                alt="Engine Repair Icon"
                                width={32}
                                height={32}
                                className="w-8 h-8"
                              />
                            </div>Puncture Repair</li>
          </ul>
           <div className="flex gap-3 mt-6">
                  <button  className="bg-[#ff0000] hover:bg-[#cc0000] text-white px-4 py-2 text-sm font-medium transition-colors duration-200 text-center">
                    Book Now
                  </button>
                  <button className="border border-white hover:border-[#ff0000] text-white hover:text-[#ff0000] px-4 py-2 text-sm font-medium transition-colors duration-200">
                    Chat With Us
                  </button>
                </div>
        </div>
        </div>
</div>

      </section>
       <section>
      <ServiceEstimator/>
    </section>
        <section className="bg-black text-white py-12 px-4 md:px-12 -mt-60">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 border border-gray-800 rounded-lg p-8">
        {/* Left Side - Contact Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
          
          <div className="mb-6">
            <p className="font-medium">Our Location</p>
            <p className="text-sm">
              Cinch Storage: Unit 4 St Margarets Way, <br />
              Stukeley Meadows Industrial Estate, <br />
              Huntingdon PE29 6EB
            </p>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-red-400 text-sm underline mt-1 inline-block">Get Directions</a>
          </div>

          <div className="mb-6">
            <p className="font-medium">Phone Number</p>
            <p className="text-sm">01480 759004</p>
          </div>

          <div className="mb-6">
            <p className="font-medium">Email Address</p>
            <p className="text-sm">info@thecaredition.co.uk</p>
          </div>

          <div className="mb-6">
            <p className="font-medium">Business Hours</p>
            <p className="text-sm">Monday – Friday: 9:00 AM – 6:00 PM</p>
            <p className="text-sm">Saturday: 10:00 AM – 4:00 PM</p>
            <p className="text-sm">Sunday: Closed</p>
          </div>

          <div className="mt-6">
            <p className="font-medium mb-2">Follow Us</p>
            <div className="flex gap-4 text-xl">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Your Name" className="w-full bg-gray-800 text-white p-3 rounded" />
            <input type="email" placeholder="Email Address" className="w-full bg-gray-800 text-white p-3 rounded" />
            <input type="text" placeholder="Phone Number" className="w-full bg-gray-800 text-white p-3 rounded" />
            <textarea placeholder="Your Message" rows={5} className="w-full bg-gray-800 text-white p-3 rounded"></textarea>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="privacy" className="accent-red-600" />
              <label htmlFor="privacy" className="text-sm">I accept the privacy policy</label>
            </div>
            <button type="submit" className="bg-[#ff0000] hover:bg-[#cc0000] px-6 py-2 rounded text-white">Send Message</button>
          </form>
        </div>
      </div>
    </section>
   
    </div>
  )
}

export default TypeAndPuncture