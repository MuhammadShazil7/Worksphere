// src/components/ui/Stats.jsx
import { motion } from 'framer-motion';
import { FaUsers, FaBuilding, FaDollarSign, FaChartLine } from 'react-icons/fa';

import Container from './Container/Container';
import Card from './Card/card';

const Stats = () => {
  const stats = [
    {
      icon: FaUsers,
      label: 'Freelancers',
      value: '50,000+',
      change: '+12%',
    },
    {
      icon: FaBuilding,
      label: 'Companies',
      value: '12,000+',
      change: '+8%',
    },
    {
      icon: FaDollarSign,
      label: 'Paid Out',
      value: '$20M+',
      change: '+25%',
    },
    {
      icon: FaChartLine,
      label: 'Monthly Revenue',
      value: '$24,580',
      change: '+18.6%',
    },
  ];

  return (
    <section className="py-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-6">
                <stat.icon className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
                <div className="text-xs text-green-400 mt-1">{stat.change}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Stats;