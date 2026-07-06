// src/components/Hero/HeroContent.jsx
import { motion } from 'framer-motion';

const HeroContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
        Hire Smarter.
        <br />
        <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Work Faster.
        </span>
      </h1>
      <p className="mt-6 text-lg text-zinc-400 max-w-lg">
        WorkSphere connects talented freelancers with ambitious companies through a
        modern, secure, and premium hiring platform.
      </p>
    </motion.div>
  );
};

export default HeroContent;