// src/components/ui/Features.jsx
import { motion } from 'framer-motion';
import { 
  FaShieldAlt, 
  FaBolt, 
  FaUsers, 
  FaChartBar, 
  FaCommentDots, 
  FaAward 
} from 'react-icons/fa';

import Container from './Container/Container';
import Card from './Card/card';

const Features = () => {
  const features = [
    {
      icon: FaShieldAlt,
      title: 'Secure Payments',
      description: 'Protected transactions with industry-standard encryption and escrow services.',
    },
    {
      icon: FaBolt,
      title: 'Fast Matching',
      description: 'AI-powered algorithm connects you with the perfect talent in seconds.',
    },
    {
      icon: FaUsers,
      title: 'Global Talent Pool',
      description: 'Access to vetted freelancers from over 100 countries worldwide.',
    },
    {
      icon: FaChartBar,
      title: 'Analytics Dashboard',
      description: 'Real-time insights into your hiring metrics and project performance.',
    },
    {
      icon: FaCommentDots,
      title: 'Real-time Chat',
      description: 'Built-in communication tools for seamless collaboration.',
    },
    {
      icon: FaAward,
      title: 'Quality Assurance',
      description: 'Every freelancer is verified and rated by past clients.',
    },
  ];

  return (
    <section className="py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">WorkSphere</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Everything you need to build your freelancing career or grow your team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 mb-4">
                  <feature.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Features;