import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FloatingAirplane = () => {
  const { scrollY } = useScroll();
  // Horizontal glide from right (90%) to left (10%) as user scrolls first 800px
  const x = useTransform(scrollY, [0, 800], ['90%', '10%']);
  // Vertical subtle move down
  const y = useTransform(scrollY, [0, 800], ['12%', '24%']);
  // Slight tilt oscillation
  const rotate = useTransform(scrollY, [0, 200, 400, 600, 800], [0, 4, -3, 2, 0]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-40"
      style={{ x, y, rotate, top: 0, left: 0, filter: 'drop-shadow(0 0 10px rgba(236,64,122,0.35))' }}
    >
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradPlane" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4FC3F7"/> {/* brandSky (Light Blue) */}
            <stop offset="100%" stopColor="#3A7BD5"/> {/* brandIndigo (Royal Blue) */}
          </linearGradient>
        </defs>
        <path d="M2 16l20-8-8 20-2-9-8-3z" fill="url(#gradPlane)"/>
      </svg>
    </motion.div>
  );
};

export default FloatingAirplane; 