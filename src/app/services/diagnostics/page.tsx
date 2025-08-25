"use client";

import Image from "next/image";
import Link from "next/link";

export default function DiagnosticsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header section - empty space */}
      <div className="h-16 bg-black"></div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-20">
        <div className="">
          <div className="bg-black ">
            <div className=" mb-8">
              <h1 className="text-4xl md:text-5xl font-bold my-4 italic">
                Car Diagnostics
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Decoding Your Car: The What, Why, and How
              </p>
            </div>
          </div>
        </div>
        
        <div className="w-full h-full">
          <Image
            src="/images/car-diognistics-cambridge.jpg"
            alt="Car Service"
            width={600}
            height={400}
            className="w-full h-[50vh] object-cover"
            priority
          />
        </div>
        
        <div className="space-y-5">
          <p className="text-orange-400">
            Listen to what your car is telling you
          </p>
          
          <p className="">
            Navigating the intricacies of car diagnostics can be a daunting task, especially for beginners who are not well-versed
            in the world of automotive technology. In the UK, where efficient and reliable transportation is essential, understanding
            how to address errors and problems is crucial. This comprehensive guide aims to demystify car diagnostics, providing
            beginners with a detailed roadmap to identify, understand, and resolve common issues that may arise.
          </p>
          
          <p className="">
            Are you experiencing issues which you can't diagnose?
          </p>
          
          <p className="text-orange-400">
            Diognose your car today with
          </p>
          
          <p className="text-orange-400">
            The Car Edition for as little as £59.99
          </p>
          
          <p className="">
            At The Car Edition, we take the guesswork out of vehicle diagnostics with our cutting-edge technology, designed to
            pinpoint issues quickly and accurately.
          </p>
          
          <p className="">
            Whether it's decoding complex OBD-II error codes, interpreting dashboard warning lights, or uncovering hidden
            problems beneath the surface, our advanced systems give you clear, reliable answers. By combining industry-leading
            diagnostic tools with expert knowledge, we help you understand exactly what's going on with your vehicle, saving you
            time, money, and unnecessary stress.
          </p>
          
          <p className="">
            With us, you can rest easy knowing your car is in capable hands and that we'll get you back on the road with
            confidence.
          </p>

          <div className="flex gap-3 mt-6">
            <Link
              href="/service-estimator"
              className="bg-[#ff0000] hover:bg-[#cc0000] text-white px-4 py-2 text-sm font-medium transition-colors duration-200 text-center"
            >
              Book Now
            </Link>
            <button className="border border-white hover:border-[#ff0000] text-white hover:text-[#ff0000] px-4 py-2 text-sm font-medium transition-colors duration-200">
              Chat With Us
            </button>
          </div>
        </div>
        
        <section className="bg-black text-white mt-10">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 p-8">
            {/* Left Side - Contact Info */}
            <div className="w-full h-full">
              <Image
                src="/images/car-diognistics-cambridge.jpg"
                alt="Car Service"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Right Side - Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Send Us a Message
              </h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-gray-800 text-white p-3 rounded"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-gray-800 text-white p-3 rounded"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full bg-gray-800 text-white p-3 rounded"
                />
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  className="w-full bg-gray-800 text-white p-3 rounded"
                ></textarea>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    className="accent-red-600"
                  />
                  <label htmlFor="privacy" className="text-sm">
                    I accept the privacy policy
                  </label>
                </div>
                <button
                  type="submit"
                  className="bg-[#ff0000] hover:bg-[#cc0000] px-6 py-2 rounded text-white"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
        
        <div className="space-y-5 mt-10">
          <p>Understanding the On-Board Diagnostics (OBD) System: The On-Board Diagnostics (OBD) system is the gateway to your car's health. Learn how to
locate and interpret the OBD port in your vehicle. We'll delve into the importance of OBD in monitoring various systems and identifying potential
problems.</p>
          
          <p>OBD-II and Its Significance: In the UK, most cars manufactured after 2001 are equipped with the OBD-II system. Explore the significance of OBD-II, its
standardised codes, and how it simplifies the diagnostic process for both professionals and DIY enthusiasts.</p>
          
          <p>Common Warning Signs and Error Codes: Decoding dashboard warning lights is essential. Get acquainted with the meaning behind common
dashboard warning lights, unraveling the mystery behind each signal and what action needs to be taken. Navigate through the alphabet soup of
OBD-II trouble codes, providing a comprehensive dictionary of common codes.</p>
          
          <p>DIY Car Diagnostics: Equip yourself with the fundamental tools needed for basic car diagnostics. From OBD-II scanners to multimeters, learn which
tools are essential for beginners and how to use them effectively. Follow a step-by-step guide on how to conduct basic car diagnostics, guiding you
through the process of identifying potential issues with your vehicle.</p>
          
          <p>Seeking Professional Help: Understand the limitations of DIY diagnostics and learn when it's time to seek professional help. Explore tips for selecting a
reliable and skilled mechanic in the UK, discussing scenarios where a certified mechanic's expertise becomes invaluable.</p>
          
          <p>Preventative Maintenance and Long-Term Care: Learn how regular maintenance can prevent potential issues and keep your vehicle in optimal
condition. This section will empower beginners to take a proactive approach to vehicle maintenance, from proper storage practices to addressing
issues promptly.</p>
          
          <p>With this comprehensive guide, we aim to empower UK drivers with the knowledge and tools to navigate the world of car diagnostics confidently.
Whether you're decoding warning lights or conducting your first OBD-II scan, understanding the basics of car diagnostics lays the foundation for a
smoother and more reliable driving experience in the UK.</p>
        </div>
      </div>
    </main>
  );
}