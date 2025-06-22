'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { HiMenu } from 'react-icons/hi';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll event for header background change and visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Check if scrolled more than 10px for background change
      if (currentScrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide header
        setIsHeaderVisible(false);
      } else {
        // Scrolling up or at top - show header
        setIsHeaderVisible(true);
      }
      
      // Update last scroll position
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  // Handle body scroll lock when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    
    return () => {
      // Cleanup - ensure scroll is restored when component unmounts
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen]);
  
  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobileMenuOpen) return;
      
      const target = event.target as HTMLElement;
      const isMenuButton = menuButtonRef.current?.contains(target);
      const isInsideMenu = mobileMenuRef.current?.contains(target);
      
      if (!isMenuButton && !isInsideMenu) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);
  
  // Close menu on window resize (if desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);
  
  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);
  
  // Close mobile menu
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);
const pathname = usePathname()
if(!pathname.includes("/dashboard") && !pathname.includes("/signin") && !pathname.includes("/signup")){
  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/50 backdrop-blur-sm shadow-lg' 
          : 'bg-transparent'
      } ${
        isHeaderVisible || isMobileMenuOpen
          ? 'translate-y-0' 
          : '-translate-y-full'
      } text-white`}
    >
      <div className=" mx-auto lg:px-28 px-5">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative flex items-center">
              <Image 
                src="/images/logos/website_logo.png" 
                alt="Car Edition Pro Logo" 
                width={140} 
                height={40} 
                
                className="transition-transform group-hover:scale-105 brightness-0 invert w-28 h-20"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 lg:space-x-8">
            <Link href="/shop"  rel="noopener noreferrer" className="relative font-medium hover:text-[#f56e13] transition-colors group py-1 uppercase">
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f56e13] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/services" className="relative font-medium hover:text-[#f56e13] transition-colors group py-1 uppercase">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f56e13] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/service-estimator" className="relative font-medium hover:text-[#f56e13] transition-colors group py-1 uppercase">
              Service Estimator
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f56e13] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/videos" className="relative font-medium hover:text-[#f56e13] transition-colors group py-1 uppercase">
              Videos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f56e13] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/blogs" className="relative font-medium hover:text-[#f56e13] transition-colors group py-1 uppercase">
              Blogs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f56e13] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link href="/about-us" className="relative font-medium hover:text-[#f56e13] transition-colors group py-1 uppercase">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f56e13] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/contact-us" className="relative font-medium hover:text-[#f56e13] transition-colors group py-1 uppercase">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f56e13] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a 
              href="https://wa.me/1234567890" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 hidden lg:flex items-center gap-2"
            >
              <FaWhatsapp className="w-5 h-5" />
              WhatsApp
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            className="lg:hidden p-2 focus:outline-none rounded-md z-[101] transition-colors relative"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <IoMdClose className="w-7 h-7 text-white" />
            ) : (
              <HiMenu className="w-7 h-7 text-white hover:text-[#f56e13] transition-colors" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation - Full Screen Overlay with Slide Animation */}
      <div 
        className={`fixed inset-0 bg-black z-[100] transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        aria-hidden={!isMobileMenuOpen}
        style={{ backgroundColor: 'rgb(0, 0, 0)' }}
      >
        <div 
          ref={mobileMenuRef}
          className={`h-screen overflow-y-auto transition-transform duration-500 ease-in-out bg-black ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="sticky top-0 bg-black z-10 flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <Link href="/" onClick={closeMobileMenu} className="flex items-center group">
              <Image 
                src="/images/logos/website_logo.png" 
                alt="Car Edition Pro Logo" 
                width={120} 
                height={30} 
                className="brightness-0 invert transition-transform group-hover:scale-105"
                priority
              />
            </Link>
          </div>
          
          {/* Mobile Menu Content */}
          <div className="px-6 py-8">
            <nav className="flex flex-col space-y-5">
              <Link 
                href="/shop" 
                rel="noopener noreferrer"
                className="px-4 py-3 font-medium text-xl border-b border-gray-800 hover:text-[#f56e13] hover:border-[#f56e13] transition-colors flex items-center justify-between"
                onClick={closeMobileMenu}
              >
                <span>Shop</span>
                <span className="text-[#f56e13]">→</span>
              </Link>
              <Link 
                href="/services" 
                className="px-4 py-3 font-medium text-xl border-b border-gray-800 hover:text-[#f56e13] hover:border-[#f56e13] transition-colors flex items-center justify-between"
                onClick={closeMobileMenu}
              >
                <span>Services</span>
                <span className="text-[#f56e13]">→</span>
              </Link>
              <Link 
                href="/service-estimator" 
                className="px-4 py-3 font-medium text-xl border-b border-gray-800 hover:text-[#f56e13] hover:border-[#f56e13] transition-colors flex items-center justify-between"
                onClick={closeMobileMenu}
              >
                <span>Service Estimator</span>
                <span className="text-[#f56e13]">→</span>
              </Link>
              <Link 
                href="/videos" 
                className="px-4 py-3 font-medium text-xl border-b border-gray-800 hover:text-[#f56e13] hover:border-[#f56e13] transition-colors flex items-center justify-between"
                onClick={closeMobileMenu}
              >
                <span>Videos</span>
                <span className="text-[#f56e13]">→</span>
              </Link>
              <Link 
                href="/blogs" 
                className="px-4 py-3 font-medium text-xl border-b border-gray-800 hover:text-[#f56e13] hover:border-[#f56e13] transition-colors flex items-center justify-between"
                onClick={closeMobileMenu}
              >
                <span>Blogs</span>
                <span className="text-[#f56e13]">→</span>
              </Link>
              <Link 
                href="/about-us" 
                className="px-4 py-3 font-medium text-xl border-b border-gray-800 hover:text-[#f56e13] hover:border-[#f56e13] transition-colors flex items-center justify-between"
                onClick={closeMobileMenu}
              >
                <span>About Us</span>
                <span className="text-[#f56e13]">→</span>
              </Link>
              <Link 
                href="/contact-us" 
                className="px-4 py-3 font-medium text-xl border-b border-gray-800 hover:text-[#f56e13] hover:border-[#f56e13] transition-colors flex items-center justify-between"
                onClick={closeMobileMenu}
              >
                <span>Contact</span>
                <span className="text-[#f56e13]">→</span>
              </Link>
            </nav>
            
            {/* WhatsApp Button */}
            <div className="mt-10">
              <a 
                href="https://wa.me/1234567890" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-3 rounded-md font-medium transition-colors duration-200 flex items-center gap-2 justify-center w-full"
                onClick={closeMobileMenu}
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>Contact via WhatsApp</span>
              </a>
            </div>
            
            {/* Social Media Links */}
            <div className="mt-12 flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#f56e13] transition-colors p-2" aria-label="Facebook">
                <FaFacebookF className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#f56e13] transition-colors p-2" aria-label="Instagram">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#f56e13] transition-colors p-2" aria-label="Twitter">
                <FaTwitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
  
}
