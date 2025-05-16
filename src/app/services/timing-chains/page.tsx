'use client';

import Image from 'next/image';
import GoogleReviews from '@/components/GoogleReviews';
import VehicleLookupExact from '@/components/VehicleLookupExact';

export default function TimingChainsPage() {

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
              TIMING CHAINS
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-300">
              Expert timing chain replacement and repair services for all vehicle makes and models
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-10 bg-black border-t border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">£768.92</p>
              <p className="text-sm text-gray-400">Average cost to replace a timing chain</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">5★ Rated</p>
              <p className="text-sm text-gray-400">Repair your timing chain with us with confidence</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">132</p>
              <p className="text-sm text-gray-400">Timing chains/belts replaced since 2022</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">Specialists</p>
              <p className="text-sm text-gray-400">In European, Japanese and American brands</p>
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
            <h2 className="text-2xl font-bold mb-6 text-white">What is a Timing Chain?</h2>
            <p className="mb-4 text-gray-300">A timing chain is a critical engine component that synchronizes the rotation of the crankshaft and camshaft(s). This precise synchronization ensures that the engine's valves open and close at the exact right moments during each cylinder's intake and exhaust strokes, allowing your engine to run smoothly and efficiently.</p>
            
            <p className="mb-4 text-gray-300">Unlike timing belts (made of rubber compounds), timing chains are metal components designed to last longer - often for the lifetime of the vehicle. However, they can still wear out over time and require replacement to prevent catastrophic engine damage.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Signs of a Failing Timing Chain:</h3>
            <p className="mb-4 text-gray-300">Be alert for these warning signs that indicate your timing chain may need professional attention:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-300">
              <li className="mb-2">Engine making rattling, whirring, or buzzing noises, especially on startup</li>
              <li className="mb-2">Metal shavings found in the engine oil during oil changes</li>
              <li className="mb-2">Engine misfiring or running rough at idle</li>
              <li className="mb-2">Check engine light illuminated with timing-related error codes</li>
              <li className="mb-2">Noticeable decrease in engine performance or acceleration</li>
              <li className="mb-2">Engine won't start or turns over but fails to fire</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Why Choose The Car Edition for Timing Chain Repair?</h3>
            <p className="mb-4 text-gray-300">Our master technicians have specialized training and extensive experience with timing chain replacements across all major European, Japanese, and American vehicle makes. We utilize advanced diagnostic equipment to accurately assess timing chain wear before recommending any repairs.</p>
            
            <p className="mb-4 text-gray-300">We exclusively use high-quality OEM or equivalent parts and follow manufacturer-specific procedures for each vehicle type. Our comprehensive service includes:</p>
            
            <ul className="list-disc pl-6 mb-6 text-gray-300">
              <li className="mb-2">Complete diagnostic assessment of timing chain and related components</li>
              <li className="mb-2">Replacement of timing chain, tensioners, guides, and associated hardware</li>
              <li className="mb-2">Installation of new gaskets and seals to prevent oil leaks</li>
              <li className="mb-2">Precise timing adjustment according to manufacturer specifications</li>
              <li className="mb-2">Thorough testing to ensure proper engine operation</li>
              <li className="mb-2">12-month/12,000-mile warranty on all timing chain replacements</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions on timing chain replacement</h2>
            <button className="text-orange-500 hover:underline">Expand all</button>
          </div>
          
          <div className="space-y-4">
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">What does a timing chain do?</summary>
              <div className="mt-4">
                <p className="text-gray-300">The timing chain is a crucial component that synchronizes the rotation of the crankshaft and camshaft, ensuring that the engine's valves open and close at the proper times during each cylinder's intake and exhaust strokes. This precise timing is essential for optimal engine performance, fuel efficiency, and emissions control.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">How complex is a timing chain repair?</summary>
              <div className="mt-4">
                <p className="text-gray-300">Timing chain repair is considered a complex job that requires specialized tools and expertise. The process typically involves removing several components to access the timing chain, including the front cover of the engine. Due to its complexity, it's best left to professional mechanics with experience in this specific repair.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">What will happen if my timing chain breaks or is damaged?</summary>
              <div className="mt-4">
                <p className="text-gray-300">If a timing chain breaks while the engine is running, it can cause catastrophic damage. In interference engines (where the valves and pistons share the same space at different times), a broken timing chain can cause the pistons to hit the valves, resulting in bent valves, damaged pistons, and potentially a complete engine failure requiring replacement.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">Is it worth replacing a timing chain?</summary>
              <div className="mt-4">
                <p className="text-gray-300">Yes, it's definitely worth replacing a timing chain if it's showing signs of wear or has reached its recommended replacement interval. The cost of replacing a timing chain is significantly less than the cost of repairing engine damage caused by a failed timing chain. Consider it preventative maintenance that protects your engine and extends its lifespan.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">When should a timing chain be replaced?</summary>
              <div className="mt-4">
                <p className="text-gray-300">Unlike timing belts that have specific mileage replacement intervals, timing chains are designed to last the lifetime of the engine. However, they can still wear out. Many manufacturers recommend inspection around 80,000 to 120,000 miles. If you notice symptoms like engine rattling, poor performance, or the check engine light comes on with timing-related codes, it may be time for a replacement.</p>
              </div>
            </details>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-10 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get your timing chain checked?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Our expert technicians are ready to help with your timing chain service needs. Get a personalized quote today.</p>
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
