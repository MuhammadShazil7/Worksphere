// src/components/ui/Background/Background.jsx
import { motion } from 'framer-motion';

const Background = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#09090B] text-white">
      {/* Purple Glow */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="fixed left-1/2 top-0 h-[400px] w-[400px] sm:h-[500px] sm:w-[500px] md:h-[600px] md:w-[600px] lg:h-[700px] lg:w-[700px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[100px] sm:blur-[140px] lg:blur-[180px] pointer-events-none"
      />
      
      {/* Blue Glow */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="fixed right-0 top-1/3 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px] rounded-full bg-blue-500/10 blur-[100px] sm:blur-[120px] lg:blur-[150px] pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="fixed left-0 bottom-0 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] lg:h-[400px] lg:w-[400px] rounded-full bg-purple-500/5 blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none"
      />

      {/* Grid Pattern */}
      <div
        className="fixed inset-0 opacity-[0.02] sm:opacity-[0.03] pointer-events-none
          [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
          [background-size:24px_24px] sm:[background-size:32px_32px] lg:[background-size:48px_48px]"
      />

      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

export default Background;