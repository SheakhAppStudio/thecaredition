import ServiceEstimatorComponent from '@/components/reuseableComponents/ServicesEstimator/ServiceEstimator';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const MechanicalRepairPage = () => {
  return (
    <div className="w-full bg-black overflow-hidden py-20 md:py-40">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto relative h-[50vh] md:h-[60vh] overflow-hidden px-4">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <Image
            src="/images/tyres-and-puncture.jpeg"
            alt="Mechanical Repair Services"
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Mechanical Repair
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-white leading-tight">
                Decoding Your Car: The What, Why, and How
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Clutch Repairs Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-6">Clutch Repairs</h2>
          
          <div className="space-y-4 text-white leading-relaxed mb-8">
            <p className="text-lg">
              Struggling to shift gears or catching a whiff of something burning?
            </p>
            
            <p>
              If you're finding it difficult to change gears or have detected a burning smell, it could be a sign your clutch needs attention.
              Issues such as a worn clutch plate, pressure plate, or release bearing can all impact performance. A healthy clutch is
              essential for smooth gear shifts and optimal vehicle control, so timely repairs can make all the difference.
            </p>
            
            <p>
              A mechanic will check your car for faults and talk you through any repairs you might need. There are various ways to check
              for faults, which could include a physical examination or plugging in to check your car's onboard engine management system.
            </p>
          </div>

          {/* Video Section */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl md:text-2xl font-semibold text-orange-400">
              Faulty clutch symptoms & diagnosis
            </h3>
            <p className="text-orange-400">
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

          {/* Common Clutch Symptoms */}
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-semibold text-orange-400 mb-4">
              Common symptoms of a faulty clutch
            </h3>
            <p className="text-white mb-6 italic">
              Struggling to shift gears or catching a whiff of something burning?
            </p>
            
            <div className="space-y-3 text-white">
              <p className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Slipping clutch – Engine revs increase without a matching increase in speed, especially under acceleration.</span>
              </p>
              <p className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Difficulty shifting gears – Hard or crunchy gear changes, especially into first or reverse.</span>
              </p>
              <p className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Spongy, sticking, or vibrating clutch pedal – Pedal feels unusual or fails to return smoothly.</span>
              </p>
              <p className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Burning smell – Often caused by excessive clutch slipping or overheating.</span>
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
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

        {/* Suspension Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4">
            Suspension and Shock Absorbers
          </h2>
          
          <p className="text-white text-lg italic mb-6">
            Feeling every bump? Noticing uneven tire wear or sluggish steering response? Your suspension could be the culprit.
          </p>
          
          <p className="text-white mb-6">
            It's not always easy to tell when your vehicle's suspension is starting to fail. Because suspension performance
            typically degrades gradually, you might not notice the change right away. However, warning signs to watch
            out for include:
          </p>
          
          <div className="space-y-3 text-white mb-6">
            <p className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>A rougher, bumpier ride</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Less precise or responsive steering</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>One corner of the vehicle sitting lower than the rest</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Uneven tire wear</span>
            </p>
          </div>
          
          <p className="text-white mb-8">
            If you suspect an issue, it's best to have it checked promptly. Driving with faulty suspension can lead to further
            damage to your car over time—or worse, increase your risk of an accident due to reduced handling performance.
          </p>

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

        {/* Gearbox Repairs Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4">
            Gearbox Repairs & Replacement
          </h2>
          
          <p className="text-white mb-4">
            At The Car Edition, we offer reliable gearbox repair and replacement services in Huntingdon and the
            surrounding towns and villages.
          </p>
          
          <p className="text-white mb-6">
            Our fully trained team has years of experience dealing with gearbox problems on all types of cars. As the
            gearbox plays a vital role in your vehicle, it's important to get it checked at the first sign of trouble to avoid
            further damage.
          </p>
          
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">What We Do</h3>
          
          <div className="space-y-3 text-white mb-6">
            <p className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Gearbox repairs, reconditioning, and replacements</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Work carried out on all makes and models</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Repairs for manual, automatic, and semi-automatic transmissions</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Clear explanations of any issues and solutions</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Competitive and fair pricing</span>
            </p>
          </div>
          
          <p className="text-white mb-8">
            If you suspect an issue, it's best to have it checked promptly. Driving with faulty suspension can lead to further
            damage to your car over time—or worse, increase your risk of an accident due to reduced handling performance.
          </p>

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

        {/* Gearbox Symptoms Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4">
            Common symptoms of a faulty Gearbox
          </h2>
          
          <p className="text-white italic mb-6">
            Struggling to shift gears or catching a whiff of something burning?
          </p>
          
          <p className="text-white mb-8">
            It's not always easy to tell when your vehicle's gearbox is starting to fail. Because gearbox performance
            typically degrades gradually, you might not notice the change right away. However, warning signs to watch
            out for include:
          </p>
          
          <div className="space-y-8 text-white">
            <div>
              <h4 className="text-lg md:text-xl font-semibold text-red-400 mb-2">Gears Slipping</h4>
              <p>
                If your car slips out of gear when accelerating, it's often caused by a damaged shift fork, worn gear teeth, or
                low transmission fluid. This can be dangerous, especially when overtaking, so it should be checked quickly.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg md:text-xl font-semibold text-red-400 mb-2">Lack of Acceleration</h4>
              <p>
                A delay in acceleration after changing gear is usually linked to clutch issues such as worn plates, springs, or
                air in the fluid line. Sometimes bleeding the system fixes it, but parts may need replacing.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg md:text-xl font-semibold text-red-400 mb-2">Grinding or Shaking When Shifting</h4>
              <p>
                Grinding noises or shaking during gear changes can mean worn clutch plates or faulty synchronisers. These
                parts should be replaced promptly to avoid further gearbox damage.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg md:text-xl font-semibold text-red-400 mb-2">Fluid Leaks</h4>
              <p>
                Bright orange fluid under your car often indicates a transmission leak. Check for a damaged pan or seal. If
                left, low fluid levels can cause serious gearbox damage.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg md:text-xl font-semibold text-red-400 mb-2">Gearstick Stuck</h4>
              <p>
                If the gearstick won't move, it may be due to a worn clutch linkage in manuals, or an electronic fault in
                automatics. Both require professional inspection.
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
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

        {/* Why Choose Us Section */}
        <section className="  rounded-lg mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 ">Why choose us?</h2>
          
          <div className="space-y-4 text-white">
            <p>
              We understand that car problems can be stressful, so we aim to make the repair process as simple and
              straightforward as possible. Our technicians will talk you through the issue, explain your options, and carry out
              the work quickly and professionally.
            </p>
            
            <p>
              With access to a wide range of quality parts and diagnostic tools, we're able to provide an efficient service
              and get your vehicle back on the road without unnecessary delays.
            </p>
            
            <p>
              Whether it's engine issues, brakes, suspension, exhausts, or general maintenance, bring your car to The Car
              Edition in Huntingdon—we're here to help with all your mechanical repair needs.
            </p>
          </div>
        </section>

       
      </main>
    </div>
  );
};

export default MechanicalRepairPage;