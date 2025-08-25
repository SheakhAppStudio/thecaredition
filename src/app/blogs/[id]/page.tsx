import moment from 'moment'
import Image from 'next/image'
import React from 'react'
import { FaCalendarAlt, FaClock } from 'react-icons/fa'
import { Metadata } from 'next'
import axios from 'axios'

// Type definitions
export type Blog = {
  _id?: string;
  title: string;
  createdAt: string;
  imageUrl: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  metaImageUrl?: string;
  description?: string;
  author?: string;
  tags?: string[];
  slug?: string;
}

interface BlogDetailsProps {
  params: { id: string }
}

// Utility functions
const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};

const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
};

const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = stripHtml(content).split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Data fetching function
async function getBlogData(id: string): Promise<Blog | null> {
  try {
    console.log(`Fetching blog data for ID: ${id}`);
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/blogs/${id}`);
    console.log(`Response status: ${response.status}`, response.data);
    if (response.data && response.status === 200) {
      console.log('Successfully fetched blog data:', response.data);
      return response.data;
    }
    
    console.warn('Blog not found or invalid response');
    return null;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return null;
  }
}

// Metadata generation
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  try {
    const blog = await getBlogData(params.id);
    console.log(`Generating metadata for blog ID: ${params.id}`, blog);
    if (!blog) {
      return {
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found. Please check the URL and try again.',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // Generate description from content if not provided
    const description = blog.description || 
      truncateText(stripHtml(blog.content), 160) ||
      'Read this interesting blog post on our website.';
    
    // Format the published date
    const publishedTime = moment(blog.createdAt).toISOString();
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Blog';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

    return {
      title: `${blog.metaTitle || blog.title} | ${siteName}`,
      description: blog.metaDescription || description,

      // Open Graph metadata for social media sharing
      openGraph: {
        title: blog.title,
        description: description,
        type: 'article',
        publishedTime: publishedTime,
        authors: blog.author ? [blog.author] : undefined,
        images: [
          {
            url: blog.metaImageUrl || blog.imageUrl,
            width: 1200,
            height: 630,
            alt: blog.title,
          }
        ],
        siteName: siteName,
        url: `${siteUrl}/blog/${params.id}`,
      },

      // Twitter Card metadata
      twitter: {
        card: 'summary_large_image',
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || description,
        images: [blog.metaImageUrl || blog.imageUrl],
        creator: blog.author ? `@${blog.author.replace('@', '')}` : undefined,
        site: process.env.NEXT_PUBLIC_TWITTER_HANDLE || undefined,
      },

      // Additional metadata
      keywords: blog.tags?.length ? blog.tags.join(', ') : undefined,
      authors: blog.author ? [{ name: blog.author }] : undefined,
      
      // Structured data for search engines
      other: {
        'article:published_time': publishedTime,
        'article:author': blog.author || 'Anonymous',
        'article:section': 'Blog',
        'article:tag': blog.tags?.join(',') || '',
        'og:locale': 'en_US',
      },

      // Canonical URL
      alternates: {
        canonical: `${siteUrl}/blog/${params.id}`,
      },

      // Robots directive
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // Additional SEO enhancements
      category: 'Blog',
      classification: 'Blog Post',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error Loading Blog Post',
      description: 'An error occurred while loading the blog post.',
    };
  }
}

// Main component
const BlogDetails = async ({ params }: BlogDetailsProps) => {
  const blog = await getBlogData(params.id);
  
  // Early return if no blog data
  if (!blog) {
    return (
      <div className="bg-[#1A1A1A] border border-white/10 text-white p-6 pt-40 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Blog Post Not Found</h1>
          <p className="text-gray-400">The requested blog post could not be loaded.</p>
        </div>
      </div>
    );
  }

  const readTime = calculateReadTime(blog.content);
  const formattedDate = moment(blog.createdAt).format('MMMM D, YYYY');

  return (
    <article className="bg-[#1A1A1A] border border-white/10 text-white min-h-screen">
      <div className="max-w-6xl mx-auto p-6 pt-40 pb-16">
        <p className='text-white my-5 font-semibold'>Homepage - Blog - <span className='text-red-500'>{blog.title}</span></p>
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {blog.title}
          </h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-red-500" />
              <time dateTime={blog.createdAt}>
                {formattedDate}
              </time>
            </div>
            
            <span className="text-gray-600">•</span>
            
            <div className="flex items-center">
              <FaClock className="mr-2 text-red-500" />
              <span>{readTime} min read</span>
            </div>

            {blog.author && (
              <>
                <span className="text-gray-600">•</span>
                <div className="flex items-center">
                  <span>By {blog.author}</span>
                </div>
              </>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-8 shadow-2xl">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>

        {/* Blog Description */}
        {blog.description && (
          <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-lg text-gray-300 italic leading-relaxed">
              {blog.description}
            </p>
          </div>
        )}

        {/* Blog Content */}
        <div 
          className="prose prose-invert prose-lg max-w-none 
                     prose-headings:text-white prose-headings:font-bold
                     prose-p:text-gray-300 prose-p:leading-relaxed
                     prose-strong:text-white prose-strong:font-semibold
                     prose-a:text-red-500 prose-a:no-underline hover:prose-a:text-red-400 hover:prose-a:underline
                     prose-blockquote:border-l-red-500 prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:rounded
                     prose-code:text-red-400 prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded
                     prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10
                     prose-ul:text-gray-300 prose-ol:text-gray-300
                     prose-li:text-gray-300 prose-li:marker:text-red-500
                     prose-img:rounded-lg prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-400">
              Published on {formattedDate}
              {blog.author && ` by ${blog.author}`}
            </div>
            
            {/* Social Share Buttons - You can add them here */}
            <div className="flex gap-2">
              {/* Add your social share buttons here */}
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default BlogDetails;