'use client';

import Image from 'next/image';
import GoogleReviews from '@/components/GoogleReviews';
import VehicleLookupExact from '@/components/VehicleLookupExact';

export default function TurbosPage() {

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
              TURBOS
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-300">
              Expert turbocharger repair, replacement and upgrades for all vehicle makes and models
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-10 bg-black border-t border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">£1,200+</p>
              <p className="text-sm text-gray-400">Average cost for turbo replacement</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">5★ Rated</p>
              <p className="text-sm text-gray-400">Trusted turbo specialists with proven results</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">200+</p>
              <p className="text-sm text-gray-400">Turbo repairs and replacements completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">OEM & Aftermarket</p>
              <p className="text-sm text-gray-400">Options available for all budgets</p>
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
            <h2 className="text-2xl font-bold mb-6 text-white">Signs of Turbo Problems</h2>
            <p className="mb-4 text-gray-300">Turbochargers are complex components that can develop issues over time. Here are some common signs that your turbo might be failing:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Loss of Power:</h3>
            <p className="mb-4 text-gray-300">A noticeable decrease in acceleration and overall engine performance is often the first sign of turbo problems. You may experience sluggish response, especially during acceleration or when climbing hills.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Unusual Noise:</h3>
            <p className="mb-4 text-gray-300">A high-pitched whining or whistling noise (like a kettle) can indicate turbo bearing wear or damage. This noise is often most noticeable during acceleration or when the turbo is under load.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Excessive Smoke:</h3>
            <p className="mb-4 text-gray-300">Blue/gray smoke from the exhaust can indicate oil leaking into the exhaust system through a damaged turbo seal. This smoke is typically more visible during acceleration after the vehicle has been idling.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Warning Light:</h3>
            <p className="mb-4 text-gray-300">The check engine light or boost pressure warning light may illuminate if the turbo is not performing correctly. Modern vehicles have sensors that can detect issues with boost pressure or exhaust gas recirculation related to turbo performance.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-orange-500">Oil Consumption:</h3>
            <p className="mb-4 text-gray-300">Increased oil consumption without visible leaks can be a sign of oil being drawn into the exhaust system through a failing turbo. If you're needing to top up your oil more frequently than usual, your turbo may be the culprit.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions about Turbos</h2>
            <button className="text-orange-500 hover:underline">Expand all</button>
          </div>
          
          <div className="space-y-4">
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">What does a turbocharger do?</summary>
              <div className="mt-4">
                <p className="text-gray-300">A turbocharger increases an engine's power output by forcing more air into the combustion chamber. It uses the engine's exhaust gases to spin a turbine, which in turn spins a compressor that pressurizes incoming air. This allows more fuel to be added, resulting in more power from each explosion in the cylinders.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">How long do turbos typically last?</summary>
              <div className="mt-4">
                <p className="text-gray-300">With proper maintenance, a turbocharger can last the lifetime of the engine, often 150,000 to 200,000 miles. However, their lifespan is heavily dependent on maintenance, driving habits, and oil quality. Regular oil changes with the correct grade of oil are crucial for turbo longevity.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">Can I drive with a failing turbo?</summary>
              <div className="mt-4">
                <p className="text-gray-300">While you might be able to drive with early signs of turbo failure, it's not recommended. A failing turbo can quickly deteriorate and potentially cause more serious engine damage. If the turbo fails completely while driving, it can send metal debris into the engine or cause oil leaks that may lead to engine fires.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">Is it better to repair or replace a turbo?</summary>
              <div className="mt-4">
                <p className="text-gray-300">This depends on the extent of the damage and the age of the turbo. Minor issues like sticking variable vanes or wastegate problems can often be repaired. However, if there's significant shaft play, wheel damage, or housing cracks, a complete replacement is usually the better option. Our technicians can assess your specific situation and recommend the most cost-effective solution.</p>
              </div>
            </details>
            
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <summary className="font-semibold cursor-pointer text-white">What maintenance helps prevent turbo failure?</summary>
              <div className="mt-4">
                <p className="text-gray-300">Regular oil changes with high-quality oil are the most important factor in turbo longevity. Additionally, allowing proper warm-up time before driving hard, letting the engine idle for a minute or two after hard driving, using quality air filters, and addressing any engine issues promptly can all help extend turbo life.</p>
              </div>
            </details>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-10 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to fix your turbo issues?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Our expert technicians are ready to help with your turbocharger needs. Get a personalized quote today.</p>
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
