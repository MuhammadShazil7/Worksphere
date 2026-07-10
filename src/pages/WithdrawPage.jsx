// src/pages/WithdrawPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaWallet, 
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaUniversity, // ← Changed from FaBank
  FaMobileAlt,
  FaMoneyBillWave,
  FaInfoCircle,
  FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';

const WithdrawPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [balance, setBalance] = useState({
    totalEarned: 0,
    totalWithdrawn: 0,
    available: 0,
    pending: 0
  });
  const [formData, setFormData] = useState({
    amount: '',
    method: 'bank_transfer',
    accountDetails: {
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
      phoneNumber: ''
    }
  });

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await api.get('/withdrawals/balance');
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      toast.error('Failed to load balance');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount < 10) {
      toast.error('Minimum withdrawal amount is $10');
      return;
    }

    if (amount > balance.available) {
      toast.error(`Insufficient balance. Available: $${balance.available.toFixed(2)}`);
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/withdrawals/request', {
        amount: amount,
        method: formData.method,
        accountDetails: formData.accountDetails
      });

      toast.success('Withdrawal request submitted successfully! 🎉');
      navigate('/withdrawals');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request withdrawal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccountDetailChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      accountDetails: {
        ...prev.accountDetails,
        [name]: value
      }
    }));
  };

  const handleMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      method: method
    }));
  };

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading balance...</p>
        </div>
      </Container>
    );
  }

  return (
    <section className="py-6 sm:py-12">
      <Container>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/earnings')}
            className="text-zinc-400 hover:text-white transition"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Withdraw Funds</h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              Withdraw your earnings to your preferred payment method
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Balance Display */}
                <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-400">Available Balance</p>
                      <p className="text-3xl font-bold text-white">
                        ${balance.available.toFixed(2)}
                      </p>
                    </div>
                    <FaWallet className="w-8 h-8 text-violet-400" />
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-zinc-400">
                    <span>Total Earned: ${balance.totalEarned.toFixed(2)}</span>
                    <span>Withdrawn: ${balance.totalWithdrawn.toFixed(2)}</span>
                    {balance.pending > 0 && (
                      <span className="text-yellow-400">Pending: {balance.pending}</span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Amount ($)
                  </label>
                  <Input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="10"
                    step="0.01"
                    required
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Minimum withdrawal: $10.00
                  </p>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Withdrawal Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'bank_transfer', label: 'Bank Transfer', icon: FaUniversity },
                      { id: 'jazzcash', label: 'JazzCash', icon: FaMobileAlt },
                      { id: 'easypaisa', label: 'EasyPaisa', icon: FaMobileAlt }
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => handleMethodChange(method.id)}
                        className={`p-3 rounded-xl border transition text-center ${
                          formData.method === method.id
                            ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                            : 'border-white/10 hover:border-white/20 text-zinc-400'
                        }`}
                      >
                        <method.icon className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-xs">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bank Details */}
                {formData.method === 'bank_transfer' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Bank Account Details</h4>
                    <Input
                      label="Bank Name"
                      name="bankName"
                      placeholder="Enter bank name"
                      value={formData.accountDetails.bankName}
                      onChange={handleAccountDetailChange}
                      required
                    />
                    <Input
                      label="Account Holder Name"
                      name="accountHolderName"
                      placeholder="Enter account holder name"
                      value={formData.accountDetails.accountHolderName}
                      onChange={handleAccountDetailChange}
                      required
                    />
                    <Input
                      label="Account Number"
                      name="accountNumber"
                      placeholder="Enter account number"
                      value={formData.accountDetails.accountNumber}
                      onChange={handleAccountDetailChange}
                      required
                    />
                  </div>
                )}

                {/* Mobile Wallet Details */}
                {(formData.method === 'jazzcash' || formData.method === 'easypaisa') && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Mobile Account Details</h4>
                    <Input
                      label="Phone Number"
                      name="phoneNumber"
                      placeholder="03XX-XXXXXXX"
                      value={formData.accountDetails.phoneNumber}
                      onChange={handleAccountDetailChange}
                      required
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full justify-center"
                  loading={submitting}
                  disabled={submitting}
                >
                  <FaMoneyBillWave className="w-4 h-4 mr-2" />
                  Request Withdrawal
                </Button>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Withdrawal Info</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-400">Processing Time</h4>
                      <p className="text-xs text-zinc-400">
                        Withdrawals are processed within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <div className="flex items-start gap-2">
                    <FaClock className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-400">Minimum Amount</h4>
                      <p className="text-xs text-zinc-400">
                        Minimum withdrawal is $10.00
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="flex items-start gap-2">
                    <FaCheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-400">No Fees</h4>
                      <p className="text-xs text-zinc-400">
                        No withdrawal fees charged by FreelanceHub
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-4">
              <h3 className="font-semibold mb-4">Withdrawal History</h3>
              <Link to="/withdrawals">
                <Button variant="secondary" className="w-full justify-center">
                  View Withdrawal History
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WithdrawPage;