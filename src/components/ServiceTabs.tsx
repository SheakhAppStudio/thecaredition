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

export default function ServiceTabs() {
  const [activeTab, setActiveTab] = useState('full-service');
  const [animating, setAnimating] = useState(false);
  const [activeSection, setActiveSection] = useState('maintenance'); // 'maintenance' or 'specialist'
  
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
  
  // Specialist mechanical work services
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
    <div className="bg-black py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveSection('maintenance')}
              className={`px-6 py-2 text-sm font-medium ${activeSection === 'maintenance' ? 'bg-[#ff0000] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} rounded-l-lg focus:z-10 focus:outline-none`}
            >
              Maintenance & Servicing
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('specialist')}
              className={`px-6 py-2 text-sm font-medium ${activeSection === 'specialist' ? 'bg-[#ff0000] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} rounded-r-lg focus:z-10 focus:outline-none`}
            >
              Specialist Mechanical Work
            </button>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-white text-center mb-10 italic uppercase tracking-wider">
          {activeSection === 'maintenance' ? 'MAINTENANCE AND SERVICING' : 'SPECIALIST MECHANICAL WORK'}
        </h2>
        
        {activeSection === 'maintenance' ? (
          <div className="flex flex-col md:flex-row max-w-4xl mx-auto">
            {/* Left side - Service tabs */}
            <div className="md:w-1/3 border-r border-gray-800">
              <div className="flex flex-col pr-6 h-[350px]">
                {Object.values(services).map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleTabChange(service.id)}
                    className={`text-left py-2 text-white hover:text-[#ff0000] transition-colors relative ${activeTab === service.id ? 'font-bold' : ''}`}
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
            <div className="md:w-2/3 pl-6">
              <div className={`${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 h-[350px]`}>
                <div className="mb-4">
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
                  <p className="text-gray-300 text-xs mt-1">
                    {activeService.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
                  {activeService.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-white mr-1 text-xs">✓</span>
                      <span className="text-white text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3 mt-4">
                  <Link href="/service-estimator" className="bg-[#ff0000] hover:bg-[#cc0000] text-white px-4 py-1.5 text-sm font-medium transition-colors duration-200 text-center">
                    Book Now
                  </Link>
                  <button className="border border-white hover:border-[#ff0000] text-white hover:text-[#ff0000] px-4 py-1.5 text-sm font-medium transition-colors duration-200">
                    Chat With Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {specialistServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2 italic">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 italic">{service.description}</p>
                  <Link 
                    href={service.link} 
                    className="inline-block bg-[#ff0000] hover:bg-[#cc0000] text-white px-4 py-2 text-sm font-medium transition-colors duration-200 text-center"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
