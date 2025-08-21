
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, MapPin, Briefcase, Mail } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl animate-pulse"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto">
            The page you're looking for seems to have taken a trip to the Gulf without leaving a forwarding address!
          </p>
          
          {/* Countdown */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 shadow-lg mb-8">
            <p className="text-sm text-gray-600 mb-2">Redirecting to home in:</p>
            <div className="text-3xl font-bold text-blue-600">{countdown}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <Link
            to="/"
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transform transition-all duration-300 font-medium"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-full border border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transform hover:scale-105 transition-all duration-300 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <Link
            to="/jobs"
            className="group bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200/50 hover:shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-semibold text-gray-900 mb-2">Find Jobs</h3>
            <p className="text-sm text-gray-600">Explore opportunities in Gulf countries</p>
          </Link>

          <Link
            to="/about"
            className="group bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200/50 hover:shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            <MapPin className="h-8 w-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-semibold text-gray-900 mb-2">About Us</h3>
            <p className="text-sm text-gray-600">Learn about our services</p>
          </Link>

          <Link
            to="/contact"
            className="group bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200/50 hover:shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            <Mail className="h-8 w-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
            <p className="text-sm text-gray-600">Get in touch with us</p>
          </Link>
        </div>

        {/* Floating Elements */}
        <div className="fixed top-20 left-10 opacity-20">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-bounce-slow"></div>
        </div>
        <div className="fixed bottom-20 right-10 opacity-20">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-pulse-slow"></div>
        </div>
        <div className="fixed top-1/2 right-20 opacity-20">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
