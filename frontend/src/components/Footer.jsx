import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brandIndigo text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={'/app_logo-removebg-preview.png'} alt="Udaan Agencies" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold">Udaan Agencies</span>
            </div>
            <p className="text-brandWhite/80 mb-6 max-w-md">
              Your Gateway to Global Opportunities. We help students and professionals 
              find their dream opportunities worldwide through expert guidance and support.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-brandWhite/70 hover:text-brandGold transition-colors duration-200" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-brandWhite/70 hover:text-brandGold transition-colors duration-200" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-brandWhite/70 hover:text-brandGold transition-colors duration-200" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-brandWhite/80 hover:text-brandGold transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-brandWhite/80 hover:text-brandGold transition-colors duration-200">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/consultation" className="text-brandWhite/80 hover:text-brandGold transition-colors duration-200">
                  Schedule Consultation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-brandWhite/80 hover:text-brandGold transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-brandSky" />
                <span className="text-brandWhite/80">Birtamod, Jhapa, Nepal</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brandSky" />
                <span className="text-brandWhite/80">+977-1-4444444</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brandSky" />
                <span className="text-brandWhite/80">info@uddaanconsultancy.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-brandWhite/70 text-sm">
              © 2024 Udaan Agencies. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-brandWhite/80 hover:text-brandGold text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-brandWhite/80 hover:text-brandGold text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-brandWhite/80 hover:text-brandGold text-sm transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 