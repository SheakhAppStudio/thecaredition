'use client';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative h-[450px] rounded-lg overflow-hidden">
            <Image
              src="/images/logos/about us image.jpg"
              alt="Car Edition Mechanics"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-xl font-medium mb-2">Welcome to</h2>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary-500">The Car Edition</h1>
            <div className="w-16 h-1 bg-primary-500 mb-6"></div>
            <p className="text-base mb-6">The Car Edition is a trusted provider of high-quality used cars as well as a wide range of garage mechanical services. Our qualified team of mechanics are here to help you with all your car needs, whether it's a service, repair, engine rebuild, carbon clean or diagnostics.</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white hover:bg-gray-100 text-black font-medium py-2 px-4 rounded-md transition duration-300 flex items-center">
                <span className="mr-2">+</span> EXPLORE SERVICES
              </button>
              <button className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center">
                <span className="mr-2">●</span> WELCOME VIDEO
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
