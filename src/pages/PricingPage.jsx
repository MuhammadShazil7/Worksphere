// src/pages/PricingPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCheck, 
  FaStar, 
  FaRocket, 
  FaCrown,
  FaArrowRight,
  FaUsers,
  FaBriefcase,
  FaClock,
  FaShieldAlt,
  FaChartLine,
  FaHeadset,
  FaGlobe,
  FaFileInvoice,
  FaUserTie,
  FaHandshake,
  FaCreditCard,
  FaWallet,
  FaGift,
  FaInfinity,
 // FaSparkles
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import SubscriptionBadge from '../components/common/SubscriptionBadge';

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [currentPlan, setCurrentPlan] = useState('free');
  const [subscriptionStatus, setSubscriptionStatus] = useState('inactive');

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const response = await api.get('/subscription/current');
      setCurrentPlan(response.data.subscription?.plan || 'free');
      setSubscriptionStatus(response.data.subscription?.status || 'inactive');
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      icon: FaUserTie,
      color: 'from-zinc-500 to-zinc-400',
      features: [
        '5 project bids per month',
        'Basic profile',
        'Standard support (24hr response)',
        'Payment protection',
        'Job alerts (weekly)',
        'Basic analytics'
      ],
      buttonText: 'Current Plan',
      recommended: false,
      badge: 'Free'
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      description: 'For freelancers starting to grow',
      icon: FaStar,
      color: 'from-blue-500 to-cyan-500',
      features: [
        '5 project bids per month',
        'Basic profile customization',
        'Standard support (24hr response)',
        'Payment protection',
        'Job alerts (daily)',
        'Basic analytics',
        'Featured in search results',
        'Proposal templates'
      ],
      buttonText: 'Upgrade Now',
      recommended: false,
      badge: 'Popular'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 79,
      description: 'For serious freelancers and small teams',
      icon: FaRocket,
      color: 'from-violet-500 to-purple-500',
      features: [
        'Unlimited project bids',
        'Featured profile (top placement)',
        'Priority support (4hr response)',
        'Advanced analytics dashboard',
        'Team collaboration tools',
        'Custom portfolio builder',
        'Proposal templates',
        'Client management tools',
        'Detailed project insights',
        'Contract templates'
      ],
      buttonText: 'Start Free Trial',
      recommended: true,
      badge: 'Most Popular'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      description: 'For agencies and large teams',
      icon: FaCrown,
      color: 'from-yellow-500 to-orange-500',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom integrations & API access',
        'White-label solutions',
        '24/7 priority support',
        'Multiple team members (10+)',
        'Advanced security features',
        'Custom contract templates',
        'Bulk hiring tools',
        'Monthly business review',
        'Custom training sessions',
        'Priority feature requests'
      ],
      buttonText: 'Contact Sales',
      recommended: false,
      badge: 'Premium'
    }
  ];

  const allFeatures = [
    { name: 'Project Bids', free: '5/month', starter: '5/month', professional: '♾️ Unlimited', enterprise: '♾️ Unlimited' },
    { name: 'Profile Visibility', free: 'Basic', starter: 'Basic', professional: '⭐ Featured', enterprise: '⭐ Featured' },
    { name: 'Support', free: '24hr Response', starter: '24hr Response', professional: '4hr Response', enterprise: '24/7 Priority' },
    { name: 'Analytics', free: 'Basic', starter: 'Basic', professional: 'Advanced', enterprise: 'Advanced' },
    { name: 'Team Members', free: '1', starter: '1', professional: 'Up to 5', enterprise: '10+' },
    { name: 'Custom Integrations', free: '❌', starter: '❌', professional: '❌', enterprise: '✅' },
    { name: 'White-label', free: '❌', starter: '❌', professional: '❌', enterprise: '✅' },
    { name: 'API Access', free: '❌', starter: '❌', professional: '✅', enterprise: '✅' }
  ];

  const handlePlanSelect = async (planId) => {
    if (!user) {
      toast.error('Please login to subscribe');
      navigate('/login');
      return;
    }

    if (planId === 'free') {
      toast.info('You are already on the Free plan');
      return;
    }

    if (planId === 'enterprise') {
      window.location.href = '/contact';
      return;
    }

    navigate('/subscription');
  };

  const isCurrentPlan = (planId) => {
    return currentPlan === planId && subscriptionStatus === 'active';
  };

  return (
    <section className="py-8 sm:py-16">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Choose Your <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
              Scale your freelancing business with the right tools and features
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-white/10 rounded-full transition hover:bg-white/20"
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-violet-500 rounded-full transition-transform duration-300 ${
                  billingCycle === 'yearly' ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-zinc-400'}`}>
              Yearly
              <span className="ml-2 text-xs text-green-400 font-medium bg-green-400/10 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${plan.recommended ? 'lg:-mt-4' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-xs font-semibold text-white">
                    {plan.badge}
                  </span>
                </div>
              )}
              
              <Card
                className={`p-6 h-full flex flex-col transition-all duration-300 ${
                  isCurrentPlan(plan.id)
                    ? 'border-green-500 shadow-lg shadow-green-500/20'
                    : plan.recommended
                      ? 'border-violet-500 shadow-2xl shadow-violet-500/10 hover:shadow-violet-500/20'
                      : 'hover:border-white/20'
                }`}
              >
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-zinc-400 mt-1">{plan.description}</p>
                  
                  {/* Current Plan Badge */}
                  {isCurrentPlan(plan.id) && (
                    <div className="mt-2 inline-block px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-400">
                      ✓ Current Plan
                    </div>
                  )}

                  <div className="mt-4">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-bold">Free</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">
                          ${billingCycle === 'monthly' ? plan.price : plan.price * 10}
                        </span>
                        <span className="text-sm text-zinc-400 ml-1">
                          /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <ul className="flex-1 space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <FaCheck className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {isCurrentPlan(plan.id) ? (
                  <Button
                    className="w-full justify-center bg-green-600 hover:bg-green-700"
                    onClick={() => navigate('/subscription')}
                  >
                    Manage Subscription
                  </Button>
                ) : (
                  <Button
                    className={`w-full justify-center ${
                      plan.id === 'free' ? 'variant-secondary' : ''
                    }`}
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={plan.id === 'free'}
                  >
                    {plan.buttonText}
                    {plan.id !== 'free' && plan.id !== 'enterprise' && (
                      <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    )}
                  </Button>
                )}

                {plan.id === 'professional' && (
                  <p className="text-xs text-zinc-500 text-center mt-3">
                    *14-day free trial, no credit card required
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">
              Compare <span className="gradient-text">Features</span>
            </h2>
            <p className="text-zinc-400">
              See what each plan offers and choose the right one for you
            </p>
          </div>

          <Card className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">Feature</th>
                  <th className="text-center py-3 px-4 text-zinc-400 font-medium">Free</th>
                  <th className="text-center py-3 px-4 text-zinc-400 font-medium">Starter</th>
                  <th className="text-center py-3 px-4 text-violet-400 font-medium">Professional</th>
                  <th className="text-center py-3 px-4 text-yellow-400 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-white font-medium">{feature.name}</td>
                    <td className="py-3 px-4 text-center text-zinc-400">{feature.free}</td>
                    <td className="py-3 px-4 text-center text-zinc-400">{feature.starter}</td>
                    <td className="py-3 px-4 text-center text-violet-400">{feature.professional}</td>
                    <td className="py-3 px-4 text-center text-yellow-400">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-zinc-400">
              Find answers to common questions about our pricing and plans
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-20"
        >
          <Card className="p-8 sm:p-12 text-center bg-gradient-to-r from-violet-600/20 to-blue-600/20 border-violet-500/20">
            <h2 className="text-3xl font-bold mb-3">
              Ready to Get Started?
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto mb-6">
              Join thousands of freelancers and companies already using WorkSphere
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button className="px-8 py-3 text-lg">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button className="px-8 py-3 text-lg">
                      <FaUserTie className="w-5 h-5 mr-2" />
                      Create Free Account
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary" className="px-8 py-3 text-lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-4">
              No credit card required. Free to get started.
            </p>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
};

// FAQ Component
const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      className="p-4 cursor-pointer hover:border-violet-500/30 transition"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{faq.question}</h4>
        <span className="text-xl text-violet-400">
          {isOpen ? '−' : '+'}
        </span>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 pt-3 border-t border-white/10"
        >
          <p className="text-sm text-zinc-400">{faq.answer}</p>
        </motion.div>
      )}
    </Card>
  );
};

// FAQ Data
const faqs = [
  {
    question: 'Can I switch plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, JazzCash, EasyPaisa, and bank transfers for Pakistani users.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, the Professional plan includes a 14-day free trial. No credit card required.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, we\'ll refund your full payment.'
  },
  {
    question: 'Can I use the platform as both a freelancer and client?',
    answer: 'Absolutely! You can create separate profiles and switch between roles easily.'
  },
  {
    question: 'What happens to my proposals if I downgrade?',
    answer: 'Your existing proposals remain active. However, you\'ll be limited to the new plan\'s proposal limits moving forward.'
  }
];

export default PricingPage;