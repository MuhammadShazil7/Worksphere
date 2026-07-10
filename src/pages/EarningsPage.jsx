// src/pages/EarningsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaDollarSign, 
  FaWallet, 
  FaChartLine, 
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaDownload,
  FaFileInvoice,
  FaEye,
  FaCreditCard
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';

const EarningsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalSpent: 0,
    pending: 0,
    completed: 0,
    platformFees: 0
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payments/history');
      setPayments(response.data.payments || []);
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast.error('Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'processing': return 'text-yellow-400 bg-yellow-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      case 'refunded': return 'text-red-400 bg-red-400/10';
      default: return 'text-zinc-400 bg-zinc-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="w-4 h-4" />;
      case 'processing': return <FaClock className="w-4 h-4" />;
      case 'pending': return <FaClock className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const isFreelancer = user?.role === 'freelancer';

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading earnings...</p>
        </div>
      </Container>
    );
  }

  return (
    <section className="py-6 sm:py-12">
      <Container>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={isFreelancer ? '/dashboard' : '/dashboard'} className="text-zinc-400 hover:text-white transition">
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {isFreelancer ? 'My Earnings' : 'Payment History'}
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              {isFreelancer 
                ? 'Track your earnings and payments' 
                : 'Track your payment history'}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-violet-400 mb-1">
              <FaWallet className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">
              {formatCurrency(isFreelancer ? stats.totalEarned : stats.totalSpent)}
            </p>
            <p className="text-xs sm:text-sm text-zinc-400">
              {isFreelancer ? 'Total Earned' : 'Total Spent'}
            </p>
          </Card>
          
          <Card className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-yellow-400 mb-1">
              <FaClock className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.pending}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Pending</p>
          </Card>
          
          <Card className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
              <FaCheckCircle className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.completed}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Completed</p>
          </Card>
          
          <Card className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
              <FaChartLine className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{payments.length}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Total Transactions</p>
          </Card>
        </div>

        {/* Platform Fee Card */}
        {isFreelancer && stats.platformFees > 0 && (
          <Card className="p-4 mb-6 bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm text-zinc-400">Platform Fees</p>
                <p className="text-xl font-bold text-yellow-400">
                  {formatCurrency(stats.platformFees)}
                </p>
              </div>
              <div className="text-xs text-zinc-500">
                <span className="bg-yellow-500/20 px-2 py-1 rounded-full">10% of total earnings</span>
              </div>
            </div>
          </Card>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'processing', 'completed', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                filter === status
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'text-zinc-400 hover:text-white border border-transparent hover:border-white/10'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 text-xs bg-white/5 rounded-full">
                  {payments.filter(p => p.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <div className="text-center py-16">
            <FaWallet className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No transactions found</p>
            <p className="text-sm text-zinc-500 mt-1">
              {isFreelancer 
                ? 'Start working on projects to earn money' 
                : 'Your payment history will appear here'}
            </p>
            {isFreelancer && (
              <Link to="/jobs" className="text-violet-400 hover:text-violet-300 transition mt-4 inline-block">
                Browse Jobs →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPayments.map((payment) => (
              <motion.div
                key={payment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 sm:p-6 hover:border-white/20 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white/5 rounded-xl">
                          {isFreelancer ? (
                            <FaDollarSign className="w-5 h-5 text-green-400" />
                          ) : (
                            <FaCreditCard className="w-5 h-5 text-violet-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-sm sm:text-base">
                              {payment.project?.title || 'Unknown Project'}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${getStatusColor(payment.status)}`}>
                              {getStatusIcon(payment.status)}
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-zinc-400">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="w-3 h-3" />
                              {formatDate(payment.createdAt)}
                            </span>
                            {payment.invoiceNumber && (
                              <span className="flex items-center gap-1">
                                <FaFileInvoice className="w-3 h-3" />
                                {payment.invoiceNumber}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <FaWallet className="w-3 h-3" />
                              {payment.paymentMethod || 'Manual'}
                            </span>
                          </div>
                          {payment.referenceNumber && (
                            <p className="text-xs text-zinc-500 mt-1">
                              Ref: {payment.referenceNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className={`text-lg font-bold ${
                        isFreelancer ? 'text-green-400' : 'text-white'
                      }`}>
                        {isFreelancer ? '+' : '-'}{formatCurrency(payment.amount)}
                      </p>
                      {isFreelancer && (
                        <p className="text-xs text-zinc-500">
                          Fee: {formatCurrency(payment.platformFee || 0)}
                        </p>
                      )}
                      <Link to={`/payments/${payment._id}`}>
                        <Button size="sm" variant="secondary" className="mt-1">
                          <FaEye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default EarningsPage;