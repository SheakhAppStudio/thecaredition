"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type ServiceType = {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
};

const Services = () => {
    const [activeTab, setActiveTab] = useState('full-service');
    const [animating, setAnimating] = useState(false);

    const services: Record<string, ServiceType> = {
      'winter-package': {
        id: 'winter-package',
        title: 'Winter Package',
        price: 'From £129+ VAT',
        description: 'A Winter Package will include all the below. Please contact us for a quote',
        features: [
          'Oil Change',
          'Cabin Filter',
          'Fuel Filter',
          'Oil Filter',
          'Air Filter',
          'Pollen Filter',
          'Free Screen Wash',
          'Free Tyre Check',
          'Winter Preparation'
        ]
      },
      'full-service': {
        id: 'full-service',
        title: 'Full Service',
        price: 'From £169+ VAT',
        description: 'A Full Service will include all the below. Please contact us for a quote',
        features: [
          'Oil Change',
          'Cabin Filter',
          'Fuel Filter',
          'Oil Filter',
          'Air Filter',
          'Pollen Filter',
          'Free Screen Wash',
          'Free Tyre Check',
          'Free Tyre Check'
        ]
      },
      'major-service': {
        id: 'major-service',
        title: 'Major Service',
        price: 'From £249+ VAT',
        description: 'A Major Service will include all the below. Please contact us for a quote',
        features: [
          'Oil Change',
          'Cabin Filter',
          'Fuel Filter',
          'Oil Filter',
          'Air Filter',
          'Pollen Filter',
          'Free Screen Wash',
          'Free Tyre Check',
          'Brake Fluid Change',
          'Spark Plugs',
          'Full Diagnostics'
        ]
      },
      'interim-service': {
        id: 'interim-service',
        title: 'Interim Service',
        price: 'From £99+ VAT',
        description: 'An Interim Service will include all the below. Please contact us for a quote',
        features: [
          'Oil Change',
          'Oil Filter',
          'Free Screen Wash',
          'Free Tyre Check'
        ]
      },
      'filters-only': {
        id: 'filters-only',
        title: 'Filters Only',
        price: 'From £79+ VAT',
        description: 'A Filters Only service will include all the below. Please contact us for a quote',
        features: [
          'Cabin Filter',
          'Fuel Filter',
          'Oil Filter',
          'Air Filter',
          'Pollen Filter'
        ]
      },
      'fuel-filter-oil': {
        id: 'fuel-filter-oil',
        title: 'Fuel Filter + Oil',
        price: 'From £89+ VAT',
        description: 'A Fuel Filter + Oil service will include all the below. Please contact us for a quote',
        features: [
          'Oil Change',
          'Fuel Filter',
          'Oil Filter'
        ]
      },
      'bespoke': {
        id: 'bespoke',
        title: 'Bespoke',
        price: 'Custom Quote',
        description: 'Our Bespoke service is tailored to your specific needs. Please contact us for a quote',
        features: [
          'Custom Service Options',
          'Tailored to Your Vehicle',
          'Personalized Care'
        ]
      }
    };
    
    const handleTabChange = (tabId: string) => {
      if (tabId === activeTab) return;
      setAnimating(true);
      setTimeout(() => {
        setActiveTab(tabId);
        setTimeout(() => {
          setAnimating(false);
        }, 300);
      }, 300);
    };
    
    const activeService = services[activeTab];
    
    const specialistServices = [
      {
        id: 'timing-chains',
        title: 'Timing Chains',
        description: 'Expert timing chain replacement and repair services',
        link: '/services/timing-chains'
      },
      {
        id: 'engine-rebuilds',
        title: 'Engine Rebuilds',
        description: 'Complete engine rebuild and restoration services',
        link: '/services/engine-rebuilds'
      },
      {
        id: 'turbos',
        title: 'Turbos',
        description: 'Turbocharger repair, replacement and upgrades',
        link: '/services/turbos'
      },
      {
        id: 'diagnostics',
        title: 'Diagnostics',
        description: 'Advanced diagnostic services for all vehicle issues',
        link: '/services/diagnostics'
      }
    ];
  
  return (
     <main className="text-white font-heading bg-black pt-40">
      {/* Hero Section */}
      <section className='px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32'>
        <div className='flex flex-col text-left space-y-4 max-w-6xl mx-auto'>
          <h1 className='text-4xl font-bold italic'>Vehicle Servicing & Maintenance</h1>
          <h3 className='text-xl font-medium italic'>Understanding the Importance of a Car Service</h3>
        </div>
      </section>

      {/* What is Car Service Section */}
      <section className='px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 mt-8'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
          <div className='space-y-4'>
            <h2 className='text-3xl text-orange-400'>What is Car Service?</h2>
            <p className='text-gray-200'>
              Car service is essentially a regular health check-up, but for your vehicle. Think of it as a comprehensive examination that ensures all components work harmoniously, preventing unexpected breakdowns. From brakes to engine and everything in between, a thorough inspection can unveil potential issues before they escalate.
            </p>
            <p>Explore some of the services below</p>
          </div>
          <div className='w-full h-full'>
            <Image
              src="https://i.postimg.cc/yY3PY8H1/U5A9230.jpg"
              alt="Car Service"
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* Services Tabs Section */}
      <section className='px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 mt-16'>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side - Service tabs */}
            <div className="border-r border-gray-800 pr-6">
              <div className="flex flex-col h-[350px] overflow-y-auto">
                {Object.values(services).map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleTabChange(service.id)}
                    className={`text-left py-3 px-2 text-white hover:text-[#ff0000] transition-colors relative ${activeTab === service.id ? 'font-bold' : ''}`}
                  >
                    <span className="text-base italic">{service.title}</span>
                    {activeTab === service.id && (
                      <div className="absolute left-0 bottom-0 w-full h-0.5 bg-[#ff0000]"></div>
                    )}
                  </button>
                ))}
                <p className="text-gray-500 text-xs mt-4">
                  * Prices may vary based on vehicle make and model.
                </p>
              </div>
            </div>
            
            {/* Right side - Service details */}
            <div className="pl-0 md:pl-6">
              <div className={`${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 h-[350px] flex flex-col justify-between`}>
                <div>
                  <div className="mb-4">
                    <Image
                      src="/images/logos/full_service.jpg"
                      alt={activeService.title}
                      width={300}
                      height={200}
                      className="w-auto h-auto object-contain"
                      priority
                    />
                  </div>
                  
                  <h3 className="text-lg font-bold text-white">
                    {activeService.price}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {activeService.description}
                  </p>
                
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                    {activeService.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-white mr-2 text-xs mt-1">✓</span>
                        <span className="text-white text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Link href="/service-estimator" className="bg-[#ff0000] hover:bg-[#cc0000] text-white px-4 py-2 text-sm font-medium transition-colors duration-200 text-center">
                    Book Now
                  </Link>
                  <button className="border border-white hover:border-[#ff0000] text-white hover:text-[#ff0000] px-4 py-2 text-sm font-medium transition-colors duration-200">
                    Chat With Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Service Section */}
      <section className="px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 py-40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold italic mb-8">Why Should I Have My Car Serviced?</h2>
          
          <div className="grid  gap-8">
            <div className="space-y-6">
              <div>
                <p className="mt-2 text-gray-200">
                Pocket the Savings : Regular service helps identify potential issues early, saving you from hefty expenses down the road. Addressing minor problems promptly is more cost-effective than dealing with major breakdowns.
                </p>
              </div>
              
              <div>
               
                <p className="mt-2 text-gray-200">
                Fuel-Efficient :  A well-serviced car not only saves you money on major repairs but also contributes to better fuel economy. When all components work seamlessly, your vehicle consumes less fuel.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                
                <p className="mt-2 text-gray-200">
                Lasts Longer :  A regularly serviced car tends to have a longer lifespan. Timely replacements and attention to detail during service keep the original parts intact, prolonging your car's life.
                </p>
              </div>
              
              <div>
                
                <p className="mt-2 text-gray-200">
                Resale Value & Insurance :  A strong service history enhances your car's resale value. Insurers also consider service records to assess the pre-accident worth of your vehicle.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 space-y-10">
            <div>
              <h3 className="text-2xl font-bold italic mb-4">What Does a Full Car Service Include?</h3>
              <p className="text-gray-200">
                A full car service is a holistic examination involving 40 checks, encompassing engine, brakes, wheels, tires, steering, exhaust, and more. From oil and filter changes to in-depth inspections, it ensures your car is in optimal condition.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold italic mb-4">When Should I Get a Full Car Service?</h3>
              <p className="text-gray-200">
                Ideally, a full car service is recommended every 12 months or 12,000 miles, whichever comes first. For those seeking more regular checks, an interim service every 6,000 miles or 6 months provides additional peace of mind.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold italic mb-4">How Much Does a Full Service Cost and How Long Does It Take?</h3>
              <p className="text-gray-200">
                The cost of a full service varies, and at The Car Edition, it ranges from £160-£290. The process takes approximately 3 hours, ensuring a thorough examination without prolonged downtime for your vehicle.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold italic mb-4">Difference Between Full Service and MOT?</h3>
              <p className="text-gray-200">
                While an MOT focuses on safety, a full car service delves into worn components and potential issues, making it a more comprehensive assessment. Both are essential for your vehicle's well-being, with a full service addressing a broader spectrum.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Services