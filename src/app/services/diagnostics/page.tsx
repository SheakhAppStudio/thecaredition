'use client';

import Image from 'next/image';
import GoogleReviews from '@/components/GoogleReviews';
import VehicleLookupExact from '@/components/VehicleLookupExact';

export default function DiagnosticsPage() {

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header section - empty space */}
      <div className="h-16 bg-black"></div>
      
      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 relative z-10 mb-10 mt-10">
        <div className="bg-black bg-opacity-80 backdrop-blur-sm border border-gray-800 rounded-xl shadow-2xl p-8 mb-10">
          <div className="text-center mb-8">
            <span className="text-orange-500 text-sm font-medium uppercase tracking-wider">SPECIALIST MECHANICAL WORK</span>
            <h1 className="text-4xl md:text-5xl font-bold my-4 uppercase italic">
              DIAGNOSTICS
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-300">
              State-of-the-art diagnostic services for all vehicle makes and models
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-10 bg-black border-t border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">£89</p>
              <p className="text-sm text-gray-400">Starting price for full diagnostic service</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">5★ Rated</p>
              <p className="text-sm text-gray-400">Highly rated diagnostic services</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">1000+</p>
              <p className="text-sm text-gray-400">Diagnostic checks performed annually</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">Latest Equipment</p>
              <p className="text-sm text-gray-400">Advanced diagnostic tools for accurate results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews darkMode={true} limit={3} />
      
      {/* Vehicle Lookup Section */}
      <section className="py-10 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-orange-500 italic uppercase">Book Your Diagnostic Check Today</h2>
            <p className="text-gray-300 mt-2">Enter your registration to check your vehicle details and get a personalized quote</p>
          </div>
          <VehicleLookupExact />
        </div>
      </section>

      {/* Information Section */}
      <section className="py-10 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gray-900 bg-opacity-50 p-8 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-white">Our Diagnostic Services</h2>
            <p className="mb-4 text-gray-300">Our comprehensive diagnostic service uses the latest technology to identify problems with your vehicle's systems. Here's what our diagnostic service includes:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Engine Diagnostics:</h3>
            <p className="mb-4 text-gray-300">We can identify issues with your engine management system, emissions, fuel system, and more using specialized diagnostic equipment. Our advanced scanners can read manufacturer-specific codes that generic tools miss.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Electrical System Testing:</h3>
            <p className="mb-4 text-gray-300">Our technicians can diagnose problems with your vehicle's electrical systems, including battery, alternator, and starter motor issues. We use specialized equipment to test voltage drops, parasitic draws, and circuit integrity.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">ABS & Traction Control:</h3>
            <p className="mb-4 text-gray-300">We can identify faults in your anti-lock braking system and traction control systems to ensure your vehicle remains safe to drive. Our diagnostic tools can access these safety-critical systems and pinpoint exactly which component is failing.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Sensor Testing:</h3>
            <p className="mb-4 text-gray-300">Modern vehicles rely on numerous sensors to function properly. We test all sensors to ensure they're providing accurate data to your vehicle's computer systems. This includes oxygen sensors, mass airflow sensors, crankshaft position sensors, and many more.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Comprehensive Report:</h3>
            <p className="mb-4 text-gray-300">After our diagnostic check, we provide you with a detailed report explaining any issues found and our recommended solutions, allowing you to make informed decisions about repairs. We'll explain everything in plain English and prioritize repairs based on safety and urgency.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions about Car Diagnostics</h2>
            <button className="text-orange-500 hover:underline">Expand all</button>
          </div>
          
          <div className="space-y-4">
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">What exactly is a car diagnostic check?</summary>
              <div className="mt-4">
                <p className="text-gray-300">A car diagnostic check involves connecting a specialized computer tool to your vehicle's onboard computer system. This tool can read information from the various sensors and modules throughout your vehicle, identifying error codes and performance issues that might not be immediately apparent. It's like giving your car a thorough health check-up.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">How long does a diagnostic check take?</summary>
              <div className="mt-4">
                <p className="text-gray-300">A basic diagnostic scan can be completed in as little as 30 minutes. However, if we need to perform more in-depth testing or if multiple systems need to be checked, it may take 1-2 hours. Our technicians will always keep you informed about the expected timeframe for your specific situation.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">When should I get a diagnostic check?</summary>
              <div className="mt-4">
                <p className="text-gray-300">You should consider getting a diagnostic check if your check engine light is on, you notice unusual noises or performance issues, before purchasing a used car, or as part of regular maintenance (annually is recommended). Early diagnosis can prevent small issues from becoming major problems.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">Can diagnostics fix my car?</summary>
              <div className="mt-4">
                <p className="text-gray-300">The diagnostic process itself doesn't fix your car—it identifies what's wrong. Think of it like a medical diagnosis: the doctor needs to determine what's wrong before prescribing treatment. Once we've identified the issue through diagnostics, we can then recommend and perform the necessary repairs to fix the problem.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">Is a diagnostic check worth the money?</summary>
              <div className="mt-4">
                <p className="text-gray-300">Absolutely. A diagnostic check is a cost-effective way to identify problems early, potentially saving you from expensive repairs down the line. It also eliminates guesswork in repairs, ensuring that you're only paying for the work your car actually needs, rather than replacing parts unnecessarily through trial and error.</p>
              </div>
            </details>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-10 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready for a professional diagnostic check?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Our expert technicians are ready to help identify and solve your vehicle issues. Get a personalized quote today.</p>
          <div className="flex justify-center">
            <a href="/service-estimator" className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-lg font-bold text-xl transition-colors duration-300 shadow-lg transform hover:scale-105">
              Get a Quote
            </a>
          </div>
          <p className="mt-6 text-gray-400">Or call us directly: <a href="tel:01480700700" className="text-orange-400 hover:text-orange-300">01480 700 700</a></p>
        </div>
      </section>
    </main>
  );
}
