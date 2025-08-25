"use client";
import React from 'react'
import Image from 'next/image'

import ServiceEstimatorComponent from '@/components/reuseableComponents/ServicesEstimator/ServiceEstimator';
const TypeAndPuncture = () => {








  

  return (
    <div className="w-full bg-black overflow-hidden">
      {/* Container with 16:9 aspect ratio */}
      <section className="max-w-7xl mx-auto pt-20">
        <Image
          src="/images/tyres-and-puncture.jpeg"
          alt="Tyres and Puncture"
          width={1920}
          height={1080}
          quality={85}
          className="object-cover w-full h-[50vh]"

        />
      </section>
      <section className='max-w-7xl mx-auto mt-20'>
<div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
         <h1 className='text-4xl font-bold text-white mb-4'>Tyres, wheels & Puncture Repair</h1>
        <div className='space-y-4 p-4'>
         
            <div className="flex gap-3 ">
                  <button  className="bg-[#ff0000] hover:bg-[#cc0000] text-white px-4 py-2 text-sm font-medium transition-colors duration-200 text-center">
                    Book Now
                  </button>
                  <button className="border border-white hover:border-[#ff0000] text-white hover:text-[#ff0000] px-4 py-2 text-sm font-medium transition-colors duration-200">
                    Chat With Us
                  </button>
                </div>

        </div>
         </div>
      <div className='grid grid-cols-1 space-y-5 '>
            
          <p className='text-gray-400 '>
           AtTheCarEdition,weofferprofessionaltirechangingservicesusingadvancedequipmentthathandlestiresupto24inches.From
everydayfamilycarstohigh-performancesportscars,weprovidecomprehensivetiresolutionsforalltypesofvehiclesefficiently
andwithprecision.
          </p>
          <p className='text-gray-400 '>
         WhyIsItImportanttoMaintainGoodTyresonYourCar?
          </p>
          <p className='text-gray-400 '>
          Maintaininggoodtyresislikemakingsureyourshoeshavepropergripbeforeheadingoutonahike.Tyresaretheonly
partofyourcarthattouchestheroad,sotheirconditionmatters—alot.From safebrakingtostablecornering,healthy
tyresplayacrucialroleinhowyourcarperforms.
          </p>
          <p className='text-gray-400 '>
    Regularserviceslikepuncturerepair,wheelbalancing,andtracking(alignment)helpyourtyreswearevenly,lastlonger,
andkeepyourdrivesmoothandefficient.Thinkofitasgivingyourcarthefoundationitneedstostaysafe,steady,and
road-ready.
          </p>
     
      </div>
        <div className='grid grid-cols-1  gap-20 '> 
       
        <div className='p-4 space-y-8'>
          <p className='text-gray-400 mb-4'>We have you covered for:</p>
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
       
        </div>
        </div>
</div>

      </section>
       <section className='max-w-7xl mx-auto mt-20'> 
        <h1 className='text-white'>Enquire below and book in a free tyre check with us at The Car Edition</h1>
   <div className='mt-32'>
              <ServiceEstimatorComponent/>
            </div>
    </section>

   
    </div>
  )
}

export default TypeAndPuncture