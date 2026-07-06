// src/pages/PricingPage.jsx
import { motion } from 'framer-motion';
import { FaCheck, FaStar, FaRocket, FaCrown } from 'react-icons/fa';

import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';

const PricingPage = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      description: 'Perfect for freelancers starting out',
      icon: FaStar,
      features: [
        '5 project bids per month',
        'Basic profile',
        'Standard support',
        'Payment protection',
      ],
    },
    {
      name: 'Professional',
      price: '$79',
      description: 'For serious freelancers and small teams',
      icon: FaRocket,
      features: [
        'Unlimited project bids',
        'Featured profile',
        'Priority support',
        'Advanced analytics',
        'Team collaboration',
        'Custom portfolio',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$199',
      description: 'For agencies and large teams',
      icon: FaCrown,
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom integrations',
        'API access',
        'White-label solutions',
        '24/7 phone support',
      ],
    },
  ];

  return (
    <section className="py-12">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-zinc-400">Scale your freelancing business with the right tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-8 relative ${plan.popular ? 'border border-violet-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <plan.icon className="w-12 h-12 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-zinc-400">/month</span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <FaCheck className="w-5 h-5 text-violet-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full justify-center ${plan.popular ? '' : 'variant-secondary'}`}>
                  <FaRocket className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PricingPage;