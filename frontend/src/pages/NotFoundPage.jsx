
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Plane } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
            404
          </h1>
          
          {/* Flying airplane around 404 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin" style={{ animationDuration: '8s' }}>
              <Plane 
                className="text-blue-500 transform rotate-45" 
                size={48}
                style={{
                  transform: 'translateX(120px) translateY(-20px) rotate(45deg)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Oops! Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            It looks like the page you're looking for has taken flight to another destination. 
            Don't worry, we'll help you get back on track!
          </p>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              What you can do:
            </h3>
            <ul className="text-left space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Check the URL for typos</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Browse our available jobs</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Visit our homepage</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Contact our support team</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Go Back</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </button>
            
            <button
              onClick={() => navigate('/jobs')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <Plane size={20} />
              <span>Browse Jobs</span>
            </button>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s'
              }}
            >
              <div className="w-4 h-4 bg-blue-200 rounded-full opacity-60"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
