import { motion } from "framer-motion";

const FloatingBadge = ({ title, value, icon, className }) => {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        repeat: Infinity,
        duration: 4,
      }}
      className={`absolute rounded-2xl border border-white/10 bg-zinc-900/70 p-5 backdrop-blur-xl ${className}`}
    >
      <div className="text-2xl">{icon}</div>

      <h3 className="mt-2 text-2xl font-bold text-white">
        {value}
      </h3>

      <p className="text-sm text-zinc-400">
        {title}
      </p>
    </motion.div>
  );
};

export default FloatingBadge;