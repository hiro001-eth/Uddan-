import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white backdrop-blur-md border-b border-brandSky/30 text-black sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="bg-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm text-black">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-brandIndigo" />
              <span>+977-1-4444444</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-brandIndigo" />
              <span>info@uddaanconsultancy.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-brandIndigo" />
              <span>Birtamod, Jhapa, Nepal</span>
            </div>
          </div>
          
          <div className="flex items-center"></div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div style={{ width: 65, height: 65 }} className="rounded-2xl bg-white shadow-lg flex items-center justify-center border border-brandSky/20 overflow-hidden">
              <img src={'/app_logo-removebg-preview.png'} alt="Udaan Agencies" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">
                Udaan Agencies
              </h1>
              <p className="text-xs text-brandGray">Your Gateway to Global Opportunities</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link text-black hover:text-brandIndigo">Home</Link>
            <Link to="/jobs" className="nav-link text-black hover:text-brandIndigo">Jobs</Link>
            <Link to="/about" className="nav-link text-black hover:text-brandIndigo">About</Link>
            <Link to="/events" className="nav-link text-black hover:text-brandIndigo">Events</Link>
            <Link to="/consultation" className="nav-link text-black hover:text-brandIndigo">Consultation</Link>
            <Link to="/contact" className="nav-link text-black hover:text-brandIndigo">Contact</Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-brandIndigo/10 hover:bg-brandIndigo/20 transition-colors duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-brandSky/20">
            <nav className="flex flex-col space-y-4 pt-3">
              <Link to="/" className="mobile-nav-link text-black" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/jobs" className="mobile-nav-link text-black" onClick={() => setIsMenuOpen(false)}>Jobs</Link>
              <Link to="/about" className="mobile-nav-link text-black" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/events" className="mobile-nav-link text-black" onClick={() => setIsMenuOpen(false)}>Events</Link>
              <Link to="/consultation" className="mobile-nav-link text-black" onClick={() => setIsMenuOpen(false)}>Consultation</Link>
              <Link to="/contact" className="mobile-nav-link text-black" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 