// src/components/landing/Hero/HeroImage.jsx
import { motion } from 'framer-motion';
import { FaBriefcase } from 'react-icons/fa';

const HeroImage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative"
    >
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-violet-600/20 to-blue-600/20 p-8">
        <div className="aspect-square flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <FaBriefcase className="w-16 h-16 text-white" />
            </div>
            <p className="mt-4 text-zinc-300">Premium Freelance Platform</p>
          </div>
        </div>
        
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-4 right-4 bg-green-500/20 backdrop-blur-sm rounded-xl p-3 border border-green-500/20"
        >
          <div className="text-green-400 text-sm font-semibold">Online</div>
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-4 left-4 bg-yellow-500/20 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/20"
        >
          <div className="text-yellow-400 text-sm font-semibold">4.9 ★</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroImage;