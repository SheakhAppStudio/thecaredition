'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaEye, FaArrowRight, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BlogPost {
  _id: string;
  title: string;
  createdAt: string;
  content: string;
  imageUrl: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get<BlogPost[]>("/api/blogs");
        setBlogs(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const openBlogDialog = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-16 flex flex-col justify-center items-center">
        <p className="text-xl text-gray-400 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2"
        >
          Try Again
          <FaArrowRight className="text-sm" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/video-bg.jpg" 
            alt="Blog Background"
            fill
            className="object-cover opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]/95" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center px-8 py-3 mb-6 rounded-full bg-white/5 border border-white/10">
              <span className="text-white text-2xl font-bold tracking-wider">THE CAR EDITION BLOG</span>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Blog Grid Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">
            Featured Articles
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Stay updated with our latest automotive insights and expert advice
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.article 
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-[#1A1A1A] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 border border-white/5 transition-all duration-500 hover:-translate-y-1"
            >
              <div 
                className="relative aspect-[16/10] cursor-pointer overflow-hidden"
                onClick={() => openBlogDialog(blog)}
              >
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Red accent line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-xs text-red-500 mb-3 font-medium">
                  <FaCalendarAlt className="mr-2" />
                  <span>{formatDate(blog.createdAt)}</span>
                  <span className="mx-2">•</span>
                  <FaClock className="mr-2" />
                  <span>5 min read</span>
                </div>
                
                <h3 className="text-lg font-bold mb-3 line-clamp-2 text-white group-hover:text-red-500 transition-colors duration-300">
                  {blog.title}
                </h3>
                
                <div 
                  className="text-gray-400 text-sm line-clamp-2 mb-4" 
                  dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 120) + '...' }} 
                />
                
                <button
                  onClick={() => openBlogDialog(blog)}
                  className="inline-flex items-center gap-2 text-white hover:text-red-500 text-sm font-medium transition-colors duration-300"
                >
                  Read Article
                  <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
          <div className="relative p-12 md:p-16 bg-[#1A1A1A] border border-white/10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <h4 className="text-white font-medium mb-4 uppercase tracking-wider">Get Started Today</h4>
              <h2 className="text-4xl font-bold mb-6 text-white">
                Transform Your Vehicle
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                Book a consultation with our expert team to discuss your vehicle's needs and discover our premium automotive services.
              </p>
              <Link 
                href="/contact-us" 
                className="group inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full text-white font-medium hover:shadow-lg hover:shadow-red-600/20 transition-all duration-300"
              >
                Contact Us Today
                <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl bg-[#1A1A1A] border border-white/10 text-white max-h-[90vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white mb-2">
              {selectedBlog?.title}
            </DialogTitle>
            {selectedBlog && (
              <div className="flex items-center text-sm text-gray-400">
                <FaCalendarAlt className="mr-2 text-red-500" />
                <span>{formatDate(selectedBlog.createdAt)}</span>
                <span className="mx-2">•</span>
                <FaClock className="mr-2 text-red-500" />
                <span>5 min read</span>
              </div>
            )}
          </DialogHeader>
          
          {selectedBlog && (
            <div className="space-y-6 mt-6">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden">
                <Image
                  src={selectedBlog.imageUrl}
                  alt={selectedBlog.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div 
                className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-red-500 hover:prose-a:text-red-400"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}