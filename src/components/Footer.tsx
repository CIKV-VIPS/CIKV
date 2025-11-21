import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    // Main footer container with amber-800 background to match header
    <footer className="bg-amber-800 text-amber-100 font-sans">
      <div className="container mx-auto px-6 py-10">
        
        {/* Top Row: Affiliation and Join Button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Affiliation Info */}
          <div className="text-center md:text-left">
            <p className="text-lg font-medium">A Central Society of</p>
            <p className="mt-1 text-xl font-semibold">Vivekananda Institute of Professional Studies - Technical Campus (VIPS-TC)</p>
          </div>
          {/* Join Society Button */}
          <div className="flex-shrink-0">
            <Link 
              href="/forms" 
              className="inline-block bg-amber-800 text-white px-8 py-3 rounded-md shadow-lg hover:bg-amber-800 text-lg font-semibold transition duration-300 ease-in-out"
            >
              Join The Society
            </Link>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-amber-500 my-8" />

        {/* Bottom Row: Links, Copyright, and Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Quick Links */}
          <div className="flex space-x-6">
            <Link href="/" className="hover:text-white transition duration-200">Home</Link>
            <Link href="/about" className="hover:text-white transition duration-200">About Us</Link>
            <Link href="/contact" className="hover:text-white transition duration-200">Contact Us</Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-amber-300">
            © {new Date().getFullYear()} CIKV. All Rights Reserved.
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center items-center space-x-4">
            <a href="https://www.instagram.com/cikvvips/" target="_blank" rel="noopener noreferrer" 
               className="p-2 rounded-full hover:bg-amber-800 transition duration-200" aria-label="Instagram">
              <FaInstagram size={22} />
            </a>
            <a href="https://www.linkedin.com/company/centre-for-indian-knowledge-and-values/" target="_blank" rel="noopener noreferrer"
               className="p-2 rounded-full hover:bg-amber-800 transition duration-200" aria-label="LinkedIn">
              <FaLinkedin size={22} />
            </a>
            <a href="mailto:indianknowledgeandvaluesvips@gmail.com"
               className="p-2 rounded-full hover:bg-amber-800 transition duration-200" aria-label="Email">
              <FaEnvelope size={22} />
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
