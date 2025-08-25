import Image from 'next/image'
import React from 'react'

const AirConditioning = () => {
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
          className="object-cover w-full h-full"

        />
        </div>
        <div className='space-y-4 p-4'>
          <h1 className='text-4xl font-bold text-white mb-4'>Air Conditioning</h1>
          <div>
          <p className='text-gray-400 p-4'>
            Our team is equipped to handle all types of air conditioning issues, ensuring your vehicle is comfortable and cool. Whether you need a quick recharge or a complete system overhaul, we have you covered.
          </p>
          <p className='text-gray-400 p-4'>
            Our team is equipped to handle all types of air conditioning issues, ensuring your vehicle is comfortable and cool. Whether you need a quick recharge or a complete system overhaul, we have you covered.
          </p>
          <p className='text-gray-400 p-4'>
            Our team is equipped to handle all types of tires, ensuring your vehicle is safe and ready for the road. Whether you need a quick tire change or a complete wheel replacement, we have you covered.
          </p>
        </div>
<h1 className='text-4xl font-bold text-white mb-4'>Need your interior repaired?</h1>

  <section className="bg-black text-white py-12 -mt-60">
      <div className="max-w-7xl mx-auto  gap-10 border border-gray-800 rounded-lg p-8">
        {/* Left Side - Contact Info */}
       

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
         </div>

       </div>
      </section>

   <section className="px-4  py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold italic mb-8">Why Should I Have My Car Serviced?</h2>
          
          <div className="grid gap-8">
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
              <h3 className="text-2xl font-bold italic mb-4 text-white">What Does a Full Car Service Include?</h3>
              <p className="text-gray-200">
                A full car service is a holistic examination involving 40 checks, encompassing engine, brakes, wheels, tires, steering, exhaust, and more. From oil and filter changes to in-depth inspections, it ensures your car is in optimal condition.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold italic mb-4 text-white">When Should I Get a Full Car Service?</h3>
              <p className="text-gray-200">
                Ideally, a full car service is recommended every 12 months or 12,000 miles, whichever comes first. For those seeking more regular checks, an interim service every 6,000 miles or 6 months provides additional peace of mind.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold italic mb-4 text-white">How Much Does a Full Service Cost and How Long Does It Take?</h3>
              <p className="text-gray-200">
                The cost of a full service varies, and at The Car Edition, it ranges from £160-£290. The process takes approximately 3 hours, ensuring a thorough examination without prolonged downtime for your vehicle.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold italic mb-4 text-white">Difference Between Full Service and MOT?</h3>
              <p className="text-gray-200">
                While an MOT focuses on safety, a full car service delves into worn components and potential issues, making it a more comprehensive assessment. Both are essential for your vehicle's well-being, with a full service addressing a broader spectrum.
              </p>
            </div>
          </div>
        </div>
      </section>
   
    </div>
  )
}

export default AirConditioning