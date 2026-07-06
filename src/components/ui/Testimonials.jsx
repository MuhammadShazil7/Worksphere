// src/components/ui/Testimonials.jsx
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

import Container from './Container/Container';
import Card from './Card/card';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      content: 'WorkSphere transformed how we hire talent. Found our lead developer in just 48 hours!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Freelance Designer',
      content: 'Best platform for freelancers. The payment protection and project management tools are outstanding.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Manager, CloudNine',
      content: 'We\'ve hired 50+ freelancers through WorkSphere. The quality of talent is consistently excellent.',
      rating: 5,
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
              What Our <span className="gradient-text">Community</span> Says
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Join thousands of satisfied freelancers and companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <FaQuoteLeft className="w-8 h-8 text-violet-400/30 mb-4" />
                <p className="text-zinc-300 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-zinc-400">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Testimonials;