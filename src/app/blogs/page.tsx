'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaYoutube, FaPlay, FaCalendarAlt, FaEye } from 'react-icons/fa';
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
            src="/images/video-bg.jpg" 
            alt="Blog Background"
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
              Our Blog Section
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              Discover our latest articles about premium car detailing, wrapping, and customization services.
            </p>
            
            <Link 
              href="/blog/all" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 font-medium transition-colors duration-200 inline-flex items-center uppercase italic"
            >
              View All Articles
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Blog Grid Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center font-heading text-amber-500 uppercase italic">
          Featured Articles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.article 
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-gray-800"
            >
              <div className="relative group cursor-pointer" onClick={() => openBlogDialog(blog)}>
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  width={640}
                  height={360}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaEye className="text-3xl text-white" />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2 font-heading text-white italic">
                  {blog.title}
                </h3>
                <div className="flex items-center text-gray-400 text-sm mb-4">
                  <FaCalendarAlt className="mr-2 text-amber-500" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div 
                  className="text-gray-300 line-clamp-3 mb-4" 
                  dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 150) + '...' }} 
                />
                
                <button
                  onClick={() => openBlogDialog(blog)}
                  className="text-amber-500 hover:text-white font-medium flex items-center transition-colors duration-200 italic cursor-pointer"
                >
                  <FaEye className="mr-2" />
                  Read More
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black py-16 mt-16 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading text-amber-500 uppercase italic">
            Want to See Our Work in Person?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Book a consultation with our team to discuss your vehicle's needs.
          </p>
          
          <Link 
            href="/contact" 
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 font-medium transition-colors duration-200 inline-flex items-center uppercase italic"
          >
            Contact Us Today
          </Link>
        </div>
      </section>

      {/* Blog Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-amber-500">
              {selectedBlog?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedBlog && (
            <div className="space-y-6">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                <Image
                  src={selectedBlog.imageUrl}
                  alt={selectedBlog.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex items-center text-gray-400 text-sm">
                <FaCalendarAlt className="mr-2 text-amber-500" />
                <span>{formatDate(selectedBlog.createdAt)}</span>
              </div>
              
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}