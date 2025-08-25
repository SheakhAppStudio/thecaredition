import ServiceEstimatorComponent from '@/components/reuseableComponents/ServicesEstimator/ServiceEstimator';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const TimingChainsPage = () => {
  return (
    <div className="w-full bg-black overflow-hidden py-20 md:py-40">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto relative h-[50vh] md:h-[60vh] overflow-hidden px-4">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <Image
            src="/images/tyres-and-puncture.jpeg"
            alt="Timing Chains and Wet Belts"
            layout="fill"
            objectFit="cover"
            className="opacity-60"
          />
        </div>
        
        {/* Red Overlay with Diagonal Cut */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-red-900"
            style={{
              clipPath: 'polygon(0% 0%, 60% 0%, 45% 100%, 0% 100%)'
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-4 md:px-8 w-full">
            <div className="max-w-md">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Timing chains &<br />
                Wet belts
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Timing Chains Section */}
        <section className="mb-12 md:mb-16">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Timing chains</h1>
          
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Is your car underperforming?</h2>
          
          <div className="space-y-4 text-white leading-relaxed mb-8">
            <p>
              The timing chain sits inside the engine, connecting the crankshaft to the camshaft and controlling the 
              opening and closing of the inlet and exhaust valves during the piston's stroke cycle. Made of metal and 
              similar to a bicycle chain, it plays a vital role in engine performance. To run efficiently and last longer, it 
              requires regular lubrication from engine oil.
            </p>
            
            <p>
              A mechanic will check your car for faults and talk you through any repairs you might need. There are 
              various ways to check for faults, which could include a physical examination or plugging in to check your 
              car's onboard engine management system.
            </p>
          </div>
        </section>

        {/* Wet Belts Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Wet belts</h2>
          
          <div className="space-y-4 text-white leading-relaxed mb-8">
            <p>
              A wet belt is a type of timing belt that runs inside the engine, immersed in oil. It connects the crankshaft to 
              the camshaft, controlling the opening and closing of the engine's valves.
            </p>
            
            <p>
              Unlike dry timing belts, wet belts are lubricated by engine oil, which helps them last longer and run more 
              quietly. However, they wear out over time, and if they fail, they can cause severe engine damage. Regular 
              inspection and replacement according to the manufacturer's schedule is essential to keep your engine 
              safe.
            </p>
          </div>
        </section>

        {/* Warning Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-6">DO NOT ignore your timing chain/wet belt</h2>
          
          <div className="space-y-4 text-white leading-relaxed mb-8">
            <p>
              Replacing your timing chain or wet belt on time is absolutely crucial. Leave it too long and you risk 
              catastrophic engine damage — in some cases, the engine can be destroyed beyond repair, leaving your 
              car completely unusable.
            </p>
            
            <p>
              These parts aren't designed to last forever. A worn chain can suddenly snap, and a wet belt can break 
              down in the oil, sending debris through the engine and blocking vital oil passages. Either failure often 
              means the entire engine is written off.
            </p>
            
            <p>
              The safest approach? Never wait for failure. Always follow your manufacturer's maintenance schedule and 
              book a replacement when it's due. If your car is reaching high mileage, or you're unsure when the last 
              replacement was done, it's far better to be safe — book an appointment and let our technicians check it 
              before it's too late.
            </p>
          </div>
        </section>

        {/* Video Section */}
        <section className="mb-12 md:mb-16">
          <div className="space-y-4">
            <p className="text-lg md:text-xl text-orange-400">
              Below Owen explains common symptoms and problems
            </p>
            
            <div className="w-full md:w-1/2 aspect-video">
              <iframe 
                className="w-full h-full" 
                src="https://www.youtube.com/embed/LXb3EKWsInQ?si=JuWqW08d4j9VwaWd" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* Replacement Indicators Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-semibold text-orange-400 mb-6">
            When to replace your timing chain/wet belt
          </h2>
          
          <div className="space-y-4 text-white mb-8">
            <p className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Loss of engine power – the car feels sluggish or underperforms</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Squeaking or rattling noises – especially from the timing cover area</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Poor ignition timing – hard starts or misfiring</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>High mileage – most chains should be checked or replaced around 100,000 miles</span>
            </p>
            <p>
              If you notice any of these symptoms, it's time to have your timing chain inspected before it fails completely.
            </p>
          </div>

          <div className="flex gap-4">
            <Link 
              href="/service-estimator" 
              className="bg-[#ff0000] hover:bg-[#cc0000] text-white px-6 py-3 font-medium transition-colors duration-200 text-center"
            >
              Book Now
            </Link>
            <button className="border border-white hover:border-[#ff0000] text-white hover:text-[#ff0000] px-6 py-3 font-medium transition-colors duration-200">
              Chat With Us
            </button>
          </div>
        </section>

        {/* Service Estimator Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-semibold text-orange-400 mb-6 text-center">
            Find out how much your timing belt/chain will cost to replace below
          </h2>
          
          <div className="mt-8 md:mt-12">
            <ServiceEstimatorComponent/>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TimingChainsPage;