'use client';

import Image from 'next/image';
import GoogleReviews from '@/components/GoogleReviews';
import VehicleLookupExact from '@/components/VehicleLookupExact';

export default function EngineRebuildsPage() {

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
              ENGINE REBUILDS
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-300">
              Revitalize your vehicle with our professional engine rebuild service for all makes and models
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-10 bg-black border-t border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">£2,500+</p>
              <p className="text-sm text-gray-400">Average cost for a complete engine rebuild</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">5★ Rated</p>
              <p className="text-sm text-gray-400">Trust our expert technicians with your engine rebuild</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">75+</p>
              <p className="text-sm text-gray-400">Engine rebuilds completed since 2022</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">All Makes</p>
              <p className="text-sm text-gray-400">Specialists in all major vehicle brands</p>
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
            <h2 className="text-3xl font-bold text-orange-500 italic uppercase">Get A Quote Today</h2>
            <p className="text-gray-300 mt-2">Enter your registration to check your vehicle details and get a personalized quote</p>
          </div>
          <VehicleLookupExact />
        </div>
      </section>

      {/* Information Section */}
      <section className="py-10 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gray-900 bg-opacity-50 p-8 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-white">When Does Your Engine Need a Rebuild?</h2>
            <p className="mb-4 text-gray-300">Engine rebuilds are major repairs that involve disassembling the engine, inspecting and cleaning components, and replacing worn parts. Here are some signs that your engine might need a rebuild:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Excessive Smoke:</h3>
            <p className="mb-4 text-gray-300">Blue smoke from the exhaust indicates oil burning, which could mean worn valve seals, piston rings, or cylinder walls.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Loss of Power:</h3>
            <p className="mb-4 text-gray-300">A significant decrease in engine performance and power could indicate internal engine problems that might require a rebuild.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Knocking Sounds:</h3>
            <p className="mb-4 text-gray-300">Loud knocking or tapping noises from the engine can indicate worn bearings or other internal components that are failing.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Oil Consumption:</h3>
            <p className="mb-4 text-gray-300">If your vehicle is consuming oil at an abnormal rate without visible leaks, internal engine components may be worn.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Compression Loss:</h3>
            <p className="mb-4 text-gray-300 italic">Low compression in one or more cylinders often indicates serious internal engine problems that may require a rebuild to fix properly.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions about Engine Rebuilds</h2>
            <button className="text-orange-500 hover:underline">Expand all</button>
          </div>
          
          <div className="space-y-4">
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">What is an engine rebuild?</summary>
              <div className="mt-4">
                <p className="text-gray-300">An engine rebuild involves disassembling the entire engine, inspecting all components, replacing worn or damaged parts, and then reassembling it with new gaskets, seals, and bearings. This process essentially gives your engine a second life without the cost of a complete replacement.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">How long does an engine rebuild take?</summary>
              <div className="mt-4">
                <p className="text-gray-300">A typical engine rebuild can take anywhere from 15 to 25 hours of labor time, which usually translates to about 1-2 weeks in the shop. The exact timeframe depends on the engine's complexity, parts availability, and whether any unexpected issues are discovered during disassembly.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">Is an engine rebuild worth it?</summary>
              <div className="mt-4">
                <p className="text-gray-300">An engine rebuild is often worth it if your vehicle is otherwise in good condition and you plan to keep it for several more years. It's significantly less expensive than buying a new vehicle, and a properly rebuilt engine can last nearly as long as a new one. It's particularly worthwhile for classic cars or vehicles with sentimental value.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">What's the difference between an engine rebuild and an engine replacement?</summary>
              <div className="mt-4">
                <p className="text-gray-300">An engine rebuild involves keeping your original engine block and replacing only the worn or damaged internal components. An engine replacement means removing your entire engine and installing a different one (either new or remanufactured). Rebuilds are typically less expensive and allow you to keep your original engine, which is important for classic cars or maintaining vehicle originality.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">How many miles will a rebuilt engine last?</summary>
              <div className="mt-4">
                <p className="text-gray-300">A properly rebuilt engine can last as long as a new engine, potentially providing another 100,000+ miles of service. The longevity depends on several factors including the quality of parts used, the skill of the technician performing the rebuild, and how well the vehicle is maintained afterward.</p>
              </div>
            </details>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-10 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to discuss an engine rebuild?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Our expert technicians are ready to help with your engine rebuild needs. Get a personalized quote today.</p>
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
