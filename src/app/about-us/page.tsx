'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <Image 
            src="/images/logos/backgroundlogo20.jpg"
            alt="About Us Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]" />
        </div>
        
        <div className="w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold">About Us</h1>
          </motion.div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="w-full py-24 bg-[#0A0A0A]">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Welcome to The Car Edition Ltd</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-xl text-gray-400 leading-relaxed">
                Your trusted source for high-quality used cars in Huntingdon. We are committed to maintaining quality and integrity in everything we do. Each of our vehicles undergoes a rigorous inspection in our garage, meeting our strict standards for performance, safety, and reliability.
              </p>
              <p className="text-xl text-gray-400 leading-relaxed">
                We understand the significance of trust when buying a used car, which is why we provide a warranty guarantee on all our cars, ensuring you can shop with confidence.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-lg overflow-hidden"
            >
              <Image
                src="/images/logos/about us image.jpg"
                alt="Car Edition Workshop"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-24 bg-[#0F0F0F]">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-lg overflow-hidden order-2 md:order-1"
            >
              <Image
                src="/images/logos/full_service.jpg"
                alt="Our Mission"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6 order-1 md:order-2"
            >
              <p className="text-xl text-gray-400 leading-relaxed">
                We are here to help you discover the perfect car that fits your needs and budget while providing exceptional customer service and a seamless buying experience. As a reputable garage in Huntingdon, we pride ourselves on being a go-to destination for car service, repair and a variety of automotive solutions.
              </p>
              <p className="text-xl text-gray-400 leading-relaxed">
                Beyond offering top-quality used cars, our experienced mechanics specialise in various automotive services, including Carbon Clean / Walnut Blasting, and Gearbox Flush, Engine rebuilds and much more. Trust us for reliable car service in Huntingdon, as we ensure your vehicle receives the attention it deserves.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-24 bg-[#0A0A0A]">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "10", label: "Years in Business" },
              { number: "15", label: "Specialists" },
              { number: "3k+", label: "Cars Sold" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-12 bg-[#1A1A1A] rounded-lg"
              >
                <div className="text-6xl font-bold text-red-600 mb-4">{stat.number}</div>
                <div className="text-xl text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Visit Us Section */}
      <section className="w-full py-24 bg-[#0F0F0F] relative">
        <div className="absolute inset-0">
          <Image 
            src="/images/logos/rentacarimage.jpg"
            alt="Background"
            fill
            className="object-cover opacity-10"
          />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 relative z-10"
        >
          <p className="text-2xl text-gray-300 leading-relaxed text-center">
            Visit The Car Edition today and let our knowledgeable and friendly team guide you through our extensive inventory. Experience the joy of finding your dream car with us – where outstanding customer service meets a commitment to quality, reliability, and a comprehensive suite of automotive solutions, including car maintenance, service and repair.
          </p>
        </motion.div>
      </section>

      {/* Social Links */}
      <section className="w-full py-24 bg-[#0A0A0A]">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-8">Follow Us</h3>
          <div className="flex justify-center gap-6">
            {[FaFacebookF, FaInstagram, FaYoutube].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-14 h-14 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-400 hover:text-red-600 hover:scale-110 transition-all duration-300"
              >
                <Icon size={24} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
} 