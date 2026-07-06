import { motion } from "framer-motion";

const RevenueChart = () => {
  return (
    <div className="mt-8">
      <svg
        viewBox="0 0 400 120"
        className="w-full"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 2 }}
          d="M0 90
             C40 70 70 30 100 45
             S180 95 220 55
             S300 20 350 45
             S390 85 400 35"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient
            id="gradient"
            x1="0%"
            y1="0%"
            x2="100%"
          >
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default RevenueChart;