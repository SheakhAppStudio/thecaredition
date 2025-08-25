import ServiceEstimatorComponent from '@/components/reuseableComponents/ServicesEstimator/ServiceEstimator';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BrakesAndPads = () => {
  return (
 <div className="w-full bg-black overflow-hidden py-20">
      {/* Container with 16:9 aspect ratio */}

        <section className="max-w-7xl mx-auto ">
              <Image
                src="/images/tyres-and-puncture.jpeg"
                alt="Tyres and Puncture"
                width={1920}
                height={1080}
                quality={85}
                className="object-cover w-full h-[50vh]"
      
              />
            </section>



           <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-6">Brakes, Discs and Pads</h1>


        
        {/* Main Content Text */}
        <div className="space-y-4 text-white leading-relaxed mb-8">
          <p>
           At The Car Edition, we offer professional brake services, including the replacement of pads and discs, using advanced equipment to

ensure accuracy and safety. From everyday family vehicles to high-performance sports cars, we provide comprehensive braking

solutions with precision and efficiency for all makes and models.
          </p>
          

        </div>

        {/* Wet belts Section */}
        <h2 className="text-xl font-bold text-white mb-4">Are you worried about poor performing brakes?</h2>

        <div className="space-y-4 text-white leading-relaxed mb-8">
          <p>
           Planning a long trip or concerned about how your brakes are performing? Visit The Car Edition for a free, no-obligation
brake inspection.
          </p>
          
          <p>
          Our skilled technicians will thoroughly check your brake pads, discs, and overall system using professional diagnostic
equipment. You’ll receive a clear written report on their condition and, if any work is needed, a transparent quote so you
can make an informed decision.
          </p>
        </div>

        {/* Warning Section */}
        <h2 className="text-xl font-bold text-red-600 mb-4">Find out how much your brakes will cost to change by entering your vehicle information below</h2>

    

          <div className='mt-32'>
            <ServiceEstimatorComponent/>
          </div>
<section className="mt-16 py-12  rounded-lg">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold mb-5 text-white">
      When Should I Have My Car's Brakes Checked?
    </h2>

    <div className="grid md:grid-cols-1 gap-8">
      {/* Soft Pedal to the Floor */}
      <div className="">
        <h3 className="text-xl font-semibold mb-3 text-white">1. Soft Pedal to the Floor</h3>
        <p className="text-gray-300">
          If the brake pedal travels to the floor with little resistance, this signals a serious braking system fault. Potential
          causes include ineffective brake fluid or a failed master cylinder. Immediate inspection is essential.
        </p>
      </div>

      {/* Spongy Brake Pedal */}
      <div className="">
        <h3 className="text-xl font-semibold mb-3 text-white">2. Spongy Brake Pedal</h3>
        <p className="text-gray-300">
          A brake pedal that feels soft or unresponsive often indicates air in the brake lines, which prevents fluid from
          operating the system effectively. This must be corrected promptly to maintain safe stopping performance.
        </p>
      </div>

      {/* Grinding */}
      <div className="">
        <h3 className="text-xl font-semibold mb-3 text-white">3. Grinding</h3>
        <p className="text-gray-300">
          A grinding noise when braking usually means the brake pads are completely worn down, allowing metal-to-metal
          contact with the disc. Driving in this condition will damage the disc and significantly reduce braking efficiency.
        </p>
      </div>

      {/* Squeaking or Squealing */}
      <div className="">
        <h3 className="text-xl font-semibold mb-3 text-white">4. Squeaking or Squealing</h3>
        <p className="text-gray-300">
          Brake squeal can result from a seized caliper holding the pad against the disc or from built-in wear indicators
          alerting you that pads need replacing. Any persistent squeak warrants professional inspection.
        </p>
      </div>

      {/* Pulsating Brake Pedal */}
      <div className="">
        <h3 className="text-xl font-semibold mb-3 text-white">5. Pulsating Brake Pedal</h3>
        <p className="text-gray-300">
          If you feel a regular pulsation through the brake pedal, the brake disc may be warped from excessive heat, creating
          an uneven braking surface. Occasional pulsation during hard braking may be due to ABS, but regular occurrence
          should be checked.
        </p>
      </div>

      {/* Vehicle Pulling to One Side */}
      <div className="">
        <h3 className="text-xl font-semibold mb-3 text-white">6. Vehicle Pulling to One Side</h3>
        <p className="text-gray-300">
          If your vehicle pulls left or right during braking, it could be caused by a seized caliper or another hydraulic or
          mechanical issue. Professional diagnosis is recommended.
        </p>
      </div>

      {/* Brake Warning Light */}
      <div className="">
        <h3 className="text-xl font-semibold mb-3 text-white">7. Brake Warning Light</h3>
        <p className="text-gray-300">
          A brake warning light on your dashboard may indicate low brake fluid, a problem in the braking electronics, or an
          issue with the electronic parking brake. Refer to your vehicle manual for details and seek assistance promptly.
        </p>
      </div>

      {/* High Handbrake Travel */}
      <div className="">
        <h3 className="text-xl font-semibold mb-3 text-white">8. High Handbrake Travel</h3>
        <p className="text-gray-300">
          If the handbrake lever moves further than usual (typically more than 6–8 clicks in modern cars), it may require
          adjustment. Excessive travel can cause MOT failure.
        </p>
      </div>

      {/* Old Brake Fluid */}
      <div className="">
        <h3 className="text-xl font-semibold mb-3 text-white">9. Old Brake Fluid</h3>
        <p className="text-gray-300">
          Brake fluid absorbs moisture over time, reducing its performance. Replacement is typically recommended every
          two years—check your manufacturer's guidelines for your specific vehicle.
        </p>
      </div>
    </div>

 
  </div>
</section>
      </main>
    
   
    </div>
  );
};

export default BrakesAndPads;