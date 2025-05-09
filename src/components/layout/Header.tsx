'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll event for header background change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu when window is resized to desktop size
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

  // Close mobile menu when a link is clicked
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/85 backdrop-blur-sm shadow-lg' 
          : 'bg-transparent'
      } text-white`}

    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative flex items-center">
              <Image 
                src="/images/logos/website_logo.png" 
                alt="Car Edition Pro Logo" 
                width={140} 
                height={40} 
                className="transition-transform group-hover:scale-105 brightness-0 invert"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/sales" className="relative font-medium hover:text-orange transition-colors group py-1">
              Sales
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/services" className="relative font-medium hover:text-orange transition-colors group py-1">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/shop" className="relative font-medium hover:text-orange transition-colors group py-1">
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="relative font-medium hover:text-orange transition-colors group py-1">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/blog" className="relative font-medium hover:text-orange transition-colors group py-1">
              Blog
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="relative font-medium hover:text-orange transition-colors group py-1">
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a 
              href="https://wa.me/1234567890" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 hidden lg:flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-orange/30 rounded-md z-50 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="relative w-6 h-6">
              <span 
                className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'
                }`}
              />
              <span 
                className={`absolute h-0.5 bg-white transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'w-0 opacity-0 left-3' : 'w-6 opacity-100 left-0'
                } top-3`}
              />
              <span 
                className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-sm z-40 transition-all duration-300 mobile-menu-container ${
            isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          style={{ top: '80px' }}
        >
          <nav className="py-8 px-6">
            <div className="flex flex-col space-y-6">
              <Link 
                href="/sales" 
                className="px-4 py-3 font-medium text-xl border-b border-gray-800 hover:text-orange hover:border-orange transition-colors"
                onClick={closeMobileMenu}
              >
                Sales
              </Link>
              <Link 
                href="/services" 
                className="px-4 py-3 font-medium text-xl border-b border-gray-800 hover:text-orange hover:border-orange transition-colors"
                onClick={closeMobileMenu}
              >
                Services
              </Link>
              <Link 
                href="/shop" 
                className="px-4 py-3 font-medium text-xl border-b border-gray-800 hover:text-orange hover:border-orange transition-colors"
                onClick={closeMobileMenu}
              >
                Shop
              </Link>
              <Link 
                href="/about" 
                className="px-4 py-3 font-medium text-xl border-b border-gray-800 hover:text-orange hover:border-orange transition-colors"
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
              <Link 
                href="/blog" 
                className="px-4 py-3 font-medium text-xl border-b border-gray-800 hover:text-orange hover:border-orange transition-colors"
                onClick={closeMobileMenu}
              >
                Blog
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-3 font-medium text-xl border-b border-gray-800 hover:text-orange hover:border-orange transition-colors"
                onClick={closeMobileMenu}
              >
                Contact Us
              </Link>
              <div className="pt-6">
                <a 
                  href="https://wa.me/1234567890" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block w-full bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-3 rounded-md font-medium text-center transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={closeMobileMenu}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </nav>
          <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-6 text-gray-400">
            <a href="#" className="hover:text-orange transition-colors" aria-label="Facebook">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="hover:text-orange transition-colors" aria-label="Instagram">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="hover:text-orange transition-colors" aria-label="Twitter">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
