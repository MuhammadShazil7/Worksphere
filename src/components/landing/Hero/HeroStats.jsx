// src/components/landing/Hero/HeroStats.jsx
import { motion } from 'framer-motion';
import { FaUsers, FaBriefcase, FaDollarSign } from 'react-icons/fa';

import Card from '../../ui/Card/card';

const HeroStats = () => {
  const stats = [
    { icon: FaUsers, label: 'Freelancers', value: '50K+' },
    { icon: FaBriefcase, label: 'Companies', value: '12K+' },
    { icon: FaDollarSign, label: 'Paid Out', value: '$20M+' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex gap-4 flex-wrap"
    >
      {stats.map((stat, index) => (
        <Card key={index} className="flex-1 min-w-[120px] text-center p-4">
          <stat.icon className="w-6 h-6 text-violet-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">{stat.value}</div>
          <div className="text-xs text-zinc-400">{stat.label}</div>
        </Card>
      ))}
    </motion.div>
  );
};

export default HeroStats;