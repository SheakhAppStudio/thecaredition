import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative min-h-[100vh] md:min-h-[90vh] flex flex-col px-28 lg:items-start items-center justify-start">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/logos/backgroundlogo2.jpg"
          alt="Car Workshop"
          fill
          className="object-cover brightness-50 w-full h-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          style={{ 
            objectPosition: 'center 20%'
          }}
        />
      </div>
      
      <div className="relative z-10 text-white px-4 h-full flex justify-start pt-[45vh] md:pt-[25vh]">
        <div className="flex flex-col items-center justify-center lg:justify-start w-full md:items-start mb-0 md:mb-0 -mt-16 md:mt-0">
          <div className="text-center md:text-left md:max-w-3xl w-full">
            <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold mb-2 uppercase italic">
              <span className="text-white italic">CAR CARE</span>
            </h1>
            <h2 className="text-5xl sm:text-6xl md:text-6xl font-bold mb-4 sm:mb-6 uppercase italic" style={{ color: '#fb9929' }}>
              REDEFINED
            </h2>
            <div className="mt-6 text-center md:text-left">
              <Link href="/service-estimator" className="inline-block bg-red-600 text-white px-6 py-3 text-base font-medium uppercase italic">
                CALL US FOR AN ESTIMATE
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <ServiceCategories />
    </section>
  );
};

const ServiceCategories = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 pb-4 md:pb-16 overflow-hidden">
      <div className="px-28">
        <div className="hidden md:grid md:grid-cols-3 justify-between">
          <ServiceItem 
            icon="/images/icons/SERVICE ICON white.png"
            title="ENGINE REPAIR & REBUILDS"
            description="Rebuild your engine with The Car Edition. Our experts are proficient in European, American and Japanese brands."
          />
          
          <ServiceItem 
            icon="/images/icons/SERVICE ICON white.png"
            title="MAINTENANCE & SERVICING"
            description="Whether you need oil change services, major service or even a general service, The Car Edition got you covered."
            center
          />
          
          <ServiceItem 
            icon="/images/icons/CAR_3.png"
            title="BUY OR SELL YOUR CAR"
            description="Looking to buy your dream car or simply want to sell yours? Look no further - we can do both!"
            end
          />
        </div>
        
        <MobileServiceCategories />
      </div>
    </div>
  );
};

const ServiceItem = ({ icon, title, description, center = false, end = false }) => {
  return (
    <div className={`flex items-start ${center ? 'justify-center' : end ? 'justify-end' : ''}`}>
      <div className="mr-4">
        <Image
          src={icon}
          alt={`${title} Icon`}
          width={32}
          height={32}
          className="w-8 h-8"
        />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white uppercase mb-1 italic">{title}</h3>
        <p className="text-gray-300 text-xs italic">
          {description.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
};

const MobileServiceCategories = () => {
  const services = [
    {
      icon: "/images/icons/SERVICE ICON white.png",
      title: "ENGINE REPAIR & REBUILDS",
      description: "Rebuild your engine with The Car Edition.\nOur experts are proficient in European,\nAmerican and Japanese brands."
    },
    {
      icon: "/images/icons/SERVICE ICON white.png",
      title: "MAINTENANCE & SERVICING",
      description: "Whether you need oil change services,\nmajor service or even a general service,\nThe Car Edition got you covered."
    },
    {
      icon: "/images/icons/CAR_3.png",
      title: "BUY OR SELL YOUR CAR",
      description: "Looking to buy your dream car\nor simply want to sell yours?\nLook no further - we can do both!"
    }
  ];

  return (
    <div className="md:hidden overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-200%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
            min-width: 100%;
          }
        `}</style>
        
        {services.map((service, index) => (
          <div key={index} className="inline-flex items-start mx-4">
            <ServiceItem {...service} />
          </div>
        ))}
        
        {/* Duplicate first item for continuous scrolling */}
        <div className="inline-flex items-start mx-4">
          <ServiceItem {...services[0]} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;