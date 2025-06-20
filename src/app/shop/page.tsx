'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaCalendarAlt, FaStar, FaPhone, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShopItem {
  _id: string;
  title: string;
  createdAt: string;
  content: string;
  imageUrls: string[];
  price?: number;
  rating?: number;
  productNumber?: string;
}

export default function ShopPage() {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const response = await axios.get<ShopItem[]>("/api/shops");
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

  const openItemDialog = (item: ShopItem) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price: number) => {
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
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 font-medium transition-colors duration-200 uppercase italic"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative bg-black/60 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://plus.unsplash.com/premium_photo-1686730540270-93f2c33351b6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FyJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D" 
            alt="Shop Background"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
              Premium Auto Shop
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              Discover our exclusive collection of high-quality auto parts, accessories, and detailing products.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Shop Grid Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center font-heading text-amber-500 uppercase italic">
          Featured Products
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shopItems.map((item, index) => (
            <motion.article 
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-gray-800"
            >
              <div 
                className="relative h-64 w-full cursor-pointer" 
               
              >
                <Image
                  src={item.imageUrls[0]}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold line-clamp-2 font-heading text-white italic">
                    {item.title} 
                  </h3>
                  
                  {item.rating && (
                    <div className="flex items-center text-yellow-400 bg-gray-800 px-2 py-1 rounded">
                      <FaStar className="mr-1" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                
                {item.productNumber && (
                  <p className="text-amber-500 text-sm mb-2">
                    Product Number : #{item.productNumber}
                  </p>
                )}
                
                <div className="flex justify-between items-center mb-4">
                  {item?.price && (
                    <span className="text-2xl font-bold text-amber-500">
                      {formatPrice(item.price)}
                    </span>
                  )}
                  
                  <div className="flex items-center text-gray-400 text-sm">
                    <FaCalendarAlt className="mr-2 text-amber-500" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              <div className="  flex items-center justify-center gap-10" >
                 
                  <button className="w-full bg-orange-600 hover:bg-amber-700 text-white py-2 font-medium transition-colors duration-200 uppercase " onClick={() => openItemDialog(item)}>
                    View Details
                  </button>
                
                <button
                  onClick={() => openItemDialog(item)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 font-medium transition-colors duration-200 uppercase "
                >
                  Contact Now
                </button>
              </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black py-16 mt-16 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading text-amber-500 uppercase italic">
            Need Help Choosing Products?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Our experts are ready to help you find the perfect products for your vehicle.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="tel:+1234567890"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 font-medium transition-colors duration-200 inline-flex items-center justify-center gap-2"
            >
              <FaPhone /> Call Us
            </Link>
            <Link 
              href="mailto:shop@example.com"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 font-medium transition-colors duration-200 inline-flex items-center justify-center gap-2"
            >
              <FaEnvelope /> Email Us
            </Link>
          </div>
        </div>
      </section>

      {/* Product Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-amber-500">
              {selectedItem?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-800">
                <Image
                  src={selectedItem.imageUrls[currentImageIndex]}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                />
                
                {selectedItem.imageUrls.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      &lt;
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      &gt;
                    </button>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                      {selectedItem.imageUrls.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-amber-500' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    {selectedItem?.price && (
                      <span className="text-3xl font-bold text-amber-500">
                        {formatPrice(selectedItem.price)}
                      </span>
                    )}
                    
                    {selectedItem.rating && (
                      <div className="flex items-center text-yellow-400 bg-gray-800 px-3 py-1 rounded">
                        <FaStar className="mr-1 text-xl" />
                        <span className="text-xl">{selectedItem.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  {selectedItem.productNumber && (
                    <p className="text-amber-500 mb-4">
                      <span className="font-medium">Product Number:</span> {selectedItem.productNumber}
                    </p>
                  )}
                  
                  <div className="flex items-center text-gray-400 text-sm mb-6">
                    <FaCalendarAlt className="mr-2 text-amber-500" />
                    <span>Added on {formatDate(selectedItem.createdAt)}</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-xl font-semibold mb-4 text-amber-500">Contact Us About This Product</h4>
                  <div className="space-y-3">
                    <Link 
                      href="tel:+1234567890"
                      className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 p-3 rounded transition-colors"
                    >
                      <FaPhone className="text-amber-500" />
                      <span>+1 (234) 567-890</span>
                    </Link>
                    <Link 
                      href="mailto:shop@example.com"
                      className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 p-3 rounded transition-colors"
                    >
                      <FaEnvelope className="text-amber-500" />
                      <span>shop@example.com</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedItem.content }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}