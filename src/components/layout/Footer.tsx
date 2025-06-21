"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const pathname = usePathname();
  if(!pathname.includes("/dashboard") && !pathname.includes("/signin") && !pathname.includes("/signup")){
     return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        {/* Logo and social media */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="flex items-center mb-6 md:mb-0">
            <span className="text-[#f56e13] font-bold text-3xl">CAR</span>
            <span className="text-white font-medium text-3xl">EDITION</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-white hover:text-[#f56e13] transition-colors">
              <FaFacebookF className="h-6 w-6" />
            </a>
            <a href="#" className="text-white hover:text-[#f56e13] transition-colors">
              <FaInstagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-white hover:text-[#f56e13] transition-colors">
              <FaTwitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-white hover:text-[#f56e13] transition-colors">
              <FaYoutube className="h-6 w-6" />
            </a>
          </div>
        </div>
        
        {/* Footer sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div>
            <h3 className="text-xl font-semibold mb-6">ABOUT US</h3>
            <p className="text-gray-400">
              Premium automotive care service dedicated to maintaining and enhancing your vehicle's appearance and performance.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">SERVICES</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services/detailing" className="text-gray-400 hover:text-[#f56e13] transition-colors">
                  Detailing
                </Link>
              </li>
              <li>
                <Link href="/services/ceramic-coating" className="text-gray-400 hover:text-[#f56e13] transition-colors">
                  Ceramic Coating
                </Link>
              </li>
              <li>
                <Link href="/services/paint-protection" className="text-gray-400 hover:text-[#f56e13] transition-colors">
                  Paint Protection
                </Link>
              </li>
              <li>
                <Link href="/services/maintenance" className="text-gray-400 hover:text-[#f56e13] transition-colors">
                  Maintenance
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">QUICK LINKS</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#f56e13] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#f56e13] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-[#f56e13] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#f56e13] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">CONTACT US</h3>
            <address className="text-gray-400 not-italic space-y-3">
              <p>123 Car Street</p>
              <p>Automotive City, AC 12345</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: info@caredition.com</p>
            </address>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} The Car Edition. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
  }
 
}
