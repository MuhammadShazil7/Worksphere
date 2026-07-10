// src/pages/SubscriptionPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaCheck, 
  FaClock,
  FaCreditCard,
  FaWallet,
  FaMobileAlt,
  FaUniversity,
  FaSpinner
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';

const SubscriptionPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [paymentMethod, setPaymentMethod] = useState('jazzcash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [billingInfo, setBillingInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Pakistan',
      zipCode: ''
    }
  });

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Basic features to get started',
      features: ['Basic profile', '5 proposals/month', 'Standard support']
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      description: 'Perfect for beginners',
      features: ['Basic analytics', '5 proposals/month', 'Job alerts', 'Standard support']
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 79,
      description: 'For serious freelancers',
      features: ['Featured profile', 'Unlimited proposals', 'Priority support', 'Advanced analytics', 'Team tools']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      description: 'For agencies and teams',
      features: ['Dedicated manager', 'Custom integrations', '24/7 support', 'White-label']
    }
  ];

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subscription/current');
      setSubscription(response.data.subscription);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!referenceNumber && paymentMethod !== 'card') {
      toast.error('Please enter a reference number');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/subscription/subscribe', {
        plan: selectedPlan,
        billingInfo: billingInfo,
        paymentMethod: paymentMethod,
        referenceNumber: referenceNumber
      });

      toast.success('Subscription request submitted! Waiting for confirmation.');
      navigate('/subscription/confirm/' + response.data.payment._id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;

    try {
      await api.post('/subscription/cancel');
      toast.success('Subscription cancelled');
      fetchSubscription();
      // Update user context
      if (updateUser) {
        const updatedUser = { ...user };
        updatedUser.subscription = { ...user.subscription, status: 'cancelled' };
        updateUser(updatedUser);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading subscription...</p>
        </div>
      </Container>
    );
  }

  const isSubscribed = subscription?.status === 'active';

  return (
    <section className="py-6 sm:py-12">
      <Container>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-white transition"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Subscription</h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              Manage your plan and billing
            </p>
          </div>
        </div>

        {/* Current Subscription Status */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-violet-600/10 to-blue-600/10 border-violet-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-400">Current Plan</p>
              <h2 className="text-2xl font-bold">
                {subscription?.plan?.charAt(0).toUpperCase() + subscription?.plan?.slice(1) || 'Free'}
              </h2>
              <p className="text-sm text-zinc-400">
                Status: <span className={`font-medium ${
                  subscription?.status === 'active' ? 'text-green-400' :
                  subscription?.status === 'pending' ? 'text-yellow-400' :
                  subscription?.status === 'cancelled' ? 'text-red-400' :
                  'text-zinc-400'
                }`}>
                  {subscription?.status || 'Inactive'}
                </span>
              </p>
              {subscription?.endDate && (
                <p className="text-sm text-zinc-400">
                  Renews on: {new Date(subscription.endDate).toLocaleDateString()}
                </p>
              )}
            </div>
            {isSubscribed && (
              <Button variant="danger" onClick={handleCancel}>
                Cancel Subscription
              </Button>
            )}
          </div>
        </Card>

        {!isSubscribed ? (
          <>
            {/* Plan Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`p-4 cursor-pointer transition ${
                    selectedPlan === plan.id
                      ? 'border-violet-500 shadow-lg shadow-violet-500/20'
                      : 'hover:border-white/20'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{plan.name}</h3>
                    {selectedPlan === plan.id && (
                      <FaCheck className="w-5 h-5 text-violet-400" />
                    )}
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    ${plan.price}
                    <span className="text-sm text-zinc-400 font-normal">/mo</span>
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">{plan.description}</p>
                  <ul className="mt-3 space-y-1 text-xs text-zinc-400">
                    {plan.features.slice(0, 2).map((feature, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <FaCheck className="w-3 h-3 text-violet-400" />
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 2 && (
                      <li className="text-zinc-500">+{plan.features.length - 2} more</li>
                    )}
                  </ul>
                </Card>
              ))}
            </div>

            {/* Payment Form */}
            {selectedPlan !== 'free' && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                
                {/* Payment Method */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'jazzcash', label: 'JazzCash', icon: FaMobileAlt },
                      { id: 'easypaisa', label: 'EasyPaisa', icon: FaMobileAlt },
                      { id: 'bank_transfer', label: 'Bank Transfer', icon: FaUniversity }
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 rounded-xl border transition text-center ${
                          paymentMethod === method.id
                            ? 'border-violet-500 bg-violet-500/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <method.icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reference Number */}
                <div className="mb-4">
                  <Input
                    label="Reference / Transaction ID"
                    placeholder="Enter payment reference number"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                  />
                </div>

                {/* Billing Info */}
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-3">Billing Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={billingInfo.name}
                      onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                      required
                    />
                    <Input
                      label="Phone"
                      value={billingInfo.phone}
                      onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                    />
                    <Input
                      label="City"
                      value={billingInfo.address.city}
                      onChange={(e) => setBillingInfo({
                        ...billingInfo,
                        address: { ...billingInfo.address, city: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <Button
                  className="w-full justify-center"
                  onClick={handleSubscribe}
                  loading={submitting}
                  disabled={submitting}
                >
                  <FaWallet className="w-4 h-4 mr-2" />
                  Subscribe Now - ${plans.find(p => p.id === selectedPlan)?.price}/mo
                </Button>
              </Card>
            )}

            {selectedPlan === 'free' && (
              <Card className="p-6 text-center">
                <p className="text-zinc-400">You are on the Free plan.</p>
                <p className="text-sm text-zinc-500 mt-1">Upgrade to access more features.</p>
              </Card>
            )}
          </>
        ) : (
          // Active Subscription View
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Your Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subscription?.features?.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <FaCheck className="w-4 h-4 text-green-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            {subscription?.plan !== 'enterprise' && (
              <div className="mt-4 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <p className="text-sm text-yellow-400">
                  💡 Want more features? <Link to="/pricing" className="underline">Upgrade your plan</Link>
                </p>
              </div>
            )}
          </Card>
        )}
      </Container>
    </section>
  );
};

export default SubscriptionPage;