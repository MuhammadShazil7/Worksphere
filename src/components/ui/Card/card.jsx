// src/components/ui/Card/index.jsx or Card.jsx
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, transition: { duration: 0.3 } } : {}}
      className={`
        rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 
        transition-all duration-300
        ${hover ? 'hover:border-white/20' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;