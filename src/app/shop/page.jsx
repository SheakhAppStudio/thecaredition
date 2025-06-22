'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaCalendarAlt, FaStar, FaPhone, FaEnvelope, FaArrowRight, FaChevronLeft, FaChevronRight, FaTools, FaCar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

// interface ShopItem {
//   _id: string;
//   title: string;
//   createdAt: string;
//   content: string;
//   imageUrls: string[];
//   price?: number;
//   rating?: number;
//   productNumber?: string;
// }

export default function ShopPage() {
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const response = await axios.get("/api/shops");
        setShopItems(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching shop items:', err);
        setError('Failed to load shop items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchShopItems();
  }, []);

  const openItemDialog = (item) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const nextImage = () => {
    if (selectedItem) {
      setCurrentImageIndex(prev => 
        prev === selectedItem.imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedItem) {
      setCurrentImageIndex(prev => 
        prev === 0 ? selectedItem.imageUrls.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-16 flex flex-col justify-center items-center">
        <p className="text-xl text-gray-400 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#f56e13] hover:bg-[#d45711] text-white px-8 py-3 rounded-md font-medium transition-all duration-300 uppercase italic flex items-center gap-2"
        >
          Try Again <FaArrowRight className="text-sm" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative bg-black/60 overflow-hidden py-12 border-b border-gray-800">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/logos/backgroundlogo20.jpg"
            alt="The Car Edition Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 font-heading tracking-tight flex items-center gap-3">
                <span className="text-[#f56e13]">AUTO</span>
                <span className="text-white">TRADER SHOP</span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                Your trusted destination for quality automotive parts and accessories. Experience excellence in every detail.
              </p>
            </div>
            <div className="hidden md:flex gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#f56e13]/10 rounded-full flex items-center justify-center mb-2">
                  <FaTools className="text-[#f56e13] text-2xl" />
                </div>
                <p className="text-sm text-gray-400">Quality Parts</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#f56e13]/10 rounded-full flex items-center justify-center mb-2">
                  <FaCar className="text-[#f56e13] text-2xl" />
                </div>
                <p className="text-sm text-gray-400">Expert Service</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Shop Grid Section */}
      <section id="products" className="container mx-auto px-4 py-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-16 text-center font-heading tracking-tight"
        >
          Featured <span className="text-[#f56e13]">Products</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shopItems.map((item, index) => (
            <motion.article 
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900/80 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl hover:shadow-[#f56e13]/20 transition-all duration-500 transform hover:-translate-y-2 group"
            >
              <Link href={`/shop/${item._id}`} className="block">
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={item.imageUrls[0]}
                    alt={item.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {item.rating && (
                    <div className="absolute top-4 right-4 flex items-center bg-black/80 backdrop-blur-sm text-yellow-400 px-3 py-1.5 rounded-full text-sm font-medium">
                      <FaStar className="mr-1.5" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#f56e13] transition-colors duration-300">
                    {item.title} 
                  </h3>
                  
                  {item.productNumber && (
                    <p className="text-[#f56e13] text-sm mb-4 font-medium">
                      Product Number: #{item.productNumber}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center mb-6">
                    {item?.price && (
                      <span className="text-3xl font-bold text-white">
                        {formatPrice(item.price)}
                      </span>
                    )}
                    
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaCalendarAlt className="mr-2 text-[#f56e13]" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      View Details
                      <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                    <div
                      className="w-full bg-[#f56e13] hover:bg-[#d45711] text-white py-3 px-4 rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      Contact Now
                      <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 mt-16">
        <div className="absolute inset-0 bg-[#f56e13]/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 font-heading tracking-tight">
              Need Help Choosing <span className="text-[#f56e13]">Products?</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Our experts are ready to help you find the perfect products for your vehicle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="tel:+1234567890"
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-md font-medium transition-all duration-300 flex items-center gap-3 group min-w-[200px] justify-center"
              >
                <FaPhone className="text-[#f56e13] group-hover:scale-110 transition-transform duration-300" />
                Call Us Now
              </Link>
              <Link 
                href="mailto:shop@example.com"
                className="bg-[#f56e13] hover:bg-[#d45711] text-white px-8 py-4 rounded-md font-medium transition-all duration-300 flex items-center gap-3 group min-w-[200px] justify-center"
              >
                <FaEnvelope className="group-hover:scale-110 transition-transform duration-300" />
                Email Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}