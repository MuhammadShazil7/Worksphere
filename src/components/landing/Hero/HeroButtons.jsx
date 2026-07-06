// src/components/landing/Hero/HeroButtons.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

import Button from '../../ui/Button/Button';

const HeroButtons = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-wrap gap-4"
    >
      <Link to="/register">
        <Button className="px-8 py-3 text-lg group">
          Get Started
          <FaArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
      <Link to="/jobs">
        <Button variant="secondary" className="px-8 py-3 text-lg">
          Explore Jobs
        </Button>
      </Link>
    </motion.div>
  );
};

export default HeroButtons;