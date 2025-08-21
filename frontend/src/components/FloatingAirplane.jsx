
import React, { useEffect, useRef, useState } from 'react';

const FloatingAirplane = () => {
  const airplaneRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const opacity = Math.max(0, 1 - scrollY / 1000);
      setIsVisible(opacity > 0.1);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!airplaneRef.current) return;

    const airplane = airplaneRef.current;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Math-based smooth movement
    const targetX = (mousePosition.x / windowWidth) * 100;
    const targetY = (mousePosition.y / windowHeight) * 50 + 20;
    
    // Smooth transition with easing
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    
    airplane.style.transform = `translate(${targetX}vw, ${targetY}vh) rotate(${(targetX - 50) * 0.1}deg)`;
    airplane.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }, [mousePosition]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <div
        ref={airplaneRef}
        className="absolute transition-all duration-1000 ease-out"
        style={{
          left: '10%',
          top: '30%',
          opacity: isVisible ? 0.7 : 0,
        }}
      >
        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 120 120" 
          className="filter drop-shadow-lg"
        >
          <defs>
            <linearGradient id="airplaneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#1D4ED8', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#1E3A8A', stopOpacity: 1}} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Airplane body */}
          <path 
            d="M60 20 L95 50 L85 55 L75 50 L60 80 L45 50 L35 55 L25 50 Z" 
            fill="url(#airplaneGradient)"
            filter="url(#glow)"
            className="animate-pulse"
          />
          
          {/* Wings */}
          <ellipse cx="40" cy="45" rx="15" ry="8" fill="url(#airplaneGradient)" opacity="0.8"/>
          <ellipse cx="80" cy="45" rx="15" ry="8" fill="url(#airplaneGradient)" opacity="0.8"/>
          
          {/* Tail */}
          <path d="M60 80 L55 95 L65 95 Z" fill="url(#airplaneGradient)" opacity="0.9"/>
          
          {/* Propeller */}
          <circle cx="60" cy="20" r="3" fill="#FFB800" className="animate-spin" style={{animationDuration: '0.1s'}}/>
          <line x1="57" y1="20" x2="63" y2="20" stroke="#FFB800" strokeWidth="1" className="animate-spin" style={{animationDuration: '0.1s'}}/>
          
          {/* Trail effect */}
          <path 
            d="M60 85 Q50 100 40 115 Q60 105 80 115 Q70 100 60 85" 
            fill="none" 
            stroke="rgba(59, 130, 246, 0.3)" 
            strokeWidth="2"
            className="animate-pulse"
          />
        </svg>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
              style={{
                left: `${20 + i * 15}%`,
                top: `${60 + Math.sin(Date.now() * 0.001 + i) * 10}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingAirplane;
