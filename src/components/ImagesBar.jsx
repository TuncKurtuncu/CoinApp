import React from 'react';
import { motion } from 'framer-motion';




function ImagesBar() {
  return (
    <div className="hidden md:flex justify-center items-center h-48 relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-950 via-gray-700 to-blue-950">
      {/* Hareketli daireler */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-40 mix-blend-overlay"
          style={{
            width: `${80 + Math.random() * 40}px`,
            height: `${80 + Math.random() * 40}px`,
            top: `${Math.random() * 60}%`,
            left: `${Math.random() * 100}%`,
            background: 'white'
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <h2 className="text-white font-bold text-3xl z-10">
        Welcome to the Coin Track
      </h2>
    </div>
  );
}



export default ImagesBar;
