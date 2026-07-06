// src/components/Hero/TrustedCompanies.jsx
import { motion } from 'framer-motion';

const TrustedCompanies = () => {
  const companies = [
    'Google',
    'Microsoft',
    'Amazon',
    'Meta',
    'Apple',
    'Netflix'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-8"
    >
      <p className="text-sm text-zinc-500 mb-4">Trusted by leading companies</p>
      <div className="flex flex-wrap gap-6 items-center">
        {companies.map((company, index) => (
          <span
            key={index}
            className="text-zinc-400 text-sm font-medium opacity-60 hover:opacity-100 transition"
          >
            {company}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default TrustedCompanies;