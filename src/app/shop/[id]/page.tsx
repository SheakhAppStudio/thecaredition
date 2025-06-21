'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaPhone, FaEnvelope, FaArrowLeft, FaChevronLeft, FaChevronRight, FaShoppingCart, FaCalendarAlt, FaShieldAlt, FaTruck, FaTools } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

interface ProductDetails {
  _id: string;
  title: string;
  createdAt: string;
  content: string;
  imageUrls: string[];
  price?: number;
  rating?: number;
  productNumber?: string;
}

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<ProductDetails>(`/api/shops/${params.id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

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
    if (product) {
      setCurrentImageIndex(prev => 
        prev === product.imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex(prev => 
        prev === 0 ? product.imageUrls.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f56e13]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-16 flex flex-col justify-center items-center">
        <p className="text-xl text-gray-400 mb-6">{error || 'Product not found'}</p>
        <Link 
          href="/shop"
          className="bg-[#f56e13] hover:bg-[#d45711] text-white px-8 py-3 rounded-md font-medium transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1"
        >
          <FaArrowLeft className="text-sm" /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-center gap-3 text-sm">
          <Link 
            href="/"
            className="text-gray-400 hover:text-[#f56e13] transition-colors duration-300"
          >
            Home
          </Link>
          <span className="text-gray-600">/</span>
          <Link 
            href="/shop"
            className="text-gray-400 hover:text-[#f56e13] transition-colors duration-300"
          >
            Shop
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-[#f56e13]">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-900 shadow-2xl">
              <Image
                src={product.imageUrls[currentImageIndex]}
                alt={product.title}
                fill
                className="object-cover"
              />
              
              {product.imageUrls.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  >
                    <FaChevronLeft className="text-xl" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  >
                    <FaChevronRight className="text-xl" />
                  </button>
                </>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Thumbnail Navigation */}
            {product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                      currentImageIndex === index 
                        ? 'ring-2 ring-[#f56e13] ring-offset-2 ring-offset-black' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${product.title} - View ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h4 className="text-[#f56e13] font-medium mb-2">THE CAR EDITION</h4>
                  <h1 className="text-4xl font-bold">{product.title}</h1>
                </div>
                {product.rating && (
                  <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full">
                    <FaStar className="text-yellow-400 mr-2 text-xl" />
                    <span className="text-xl font-medium">{product.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {product.price && (
                <div className="mb-6">
                  <span className="text-5xl font-bold text-[#f56e13]">
                    {formatPrice(product.price)}
                  </span>
                </div>
              )}

              {product.productNumber && (
                <p className="text-gray-400 mb-4">
                  Product Number: <span className="text-[#f56e13] font-medium">#{product.productNumber}</span>
                </p>
              )}

              <div className="flex items-center text-gray-400 text-sm mb-8">
                <FaCalendarAlt className="mr-2 text-[#f56e13]" />
                <span>Added on {formatDate(product.createdAt)}</span>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-[#f56e13]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaShieldAlt className="text-[#f56e13] text-xl" />
                  </div>
                  <h3 className="text-sm font-medium">Quality Assured</h3>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-[#f56e13]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaTruck className="text-[#f56e13] text-xl" />
                  </div>
                  <h3 className="text-sm font-medium">Fast Shipping</h3>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-[#f56e13]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaTools className="text-[#f56e13] text-xl" />
                  </div>
                  <h3 className="text-sm font-medium">Free Service</h3>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-900 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <Link 
                  href="tel:+1234567890"
                  className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-[#f56e13]/10 rounded-full flex items-center justify-center">
                    <FaPhone className="text-[#f56e13] text-xl group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone Number</p>
                    <p className="text-lg">+1 (234) 567-890</p>
                  </div>
                </Link>
                <Link 
                  href="mailto:shop@example.com"
                  className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-[#f56e13]/10 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-[#f56e13] text-xl group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email Address</p>
                    <p className="text-lg">shop@example.com</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-gray-900 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Product Description</h2>
              <div 
                className="prose prose-invert max-w-none prose-headings:text-[#f56e13] prose-a:text-[#f56e13] prose-strong:text-white prose-p:text-gray-300 prose-li:text-gray-300"
                dangerouslySetInnerHTML={{ __html: product.content }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 