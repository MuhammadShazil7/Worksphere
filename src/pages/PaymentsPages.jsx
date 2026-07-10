// src/pages/PaymentsPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaSpinner, 
  FaCheckCircle, 
  FaClock,
  FaDollarSign,
  FaFileInvoice,
  FaCalendarAlt,
  FaUser,
  FaBriefcase,
  FaEye,
  FaWallet,
  FaChartLine,
  FaCreditCard,
  FaFilter,
  FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';

const PaymentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalEarned: 0,
    totalSpent: 0,
    pending: 0,
    completed: 0,
    platformFees: 0
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'processing': return 'Processing';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      case 'refunded': return 'Refunded';
      default: return status;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.freelancer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || payment.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
    setShowFilters(false);
  };

  const isFreelancer = user?.role === 'freelancer';

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading payments...</p>
        </div>
      </Container>
    );
  }

  return (
    <section className="py-6 sm:py-12">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Payments</h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              {isFreelancer ? 'Track your earnings and payments' : 'Manage your payments'}
            </p>
          </div>
          {isFreelancer && (
            <Button onClick={() => navigate('/withdraw')} className="w-full sm:w-auto">
              <FaWallet className="w-4 h-4 mr-2" />
              Withdraw Funds
            </Button>
          )}
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
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.pending || 0}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Pending</p>
          </Card>
          
          <Card className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
              <FaCheckCircle className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.completed || 0}</p>
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
                <p className="text-sm text-zinc-400">Platform Fees (10%)</p>
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

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by project, invoice, or user..."
              icon={<FaFilter className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            {(searchTerm || filter !== 'all') && (
              <Button variant="ghost" onClick={clearFilters}>
                <FaTimes className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <div className="text-center py-16">
            <FaWallet className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No payments found</p>
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
                <Card className="p-4 sm:p-6 hover:border-white/20 transition cursor-pointer">
                  <Link to={`/payments/${payment._id}`}>
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
                              <h4 className="font-semibold text-sm sm:text-base truncate">
                                {payment.project?.title || 'Unknown Project'}
                              </h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${getStatusColor(payment.status)}`}>
                                {getStatusIcon(payment.status)}
                                {getStatusLabel(payment.status)}
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
                                <FaUser className="w-3 h-3" />
                                {isFreelancer ? payment.client?.name : payment.freelancer?.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className={`text-lg font-bold ${
                          isFreelancer ? 'text-green-400' : 'text-white'
                        }`}>
                          {isFreelancer ? '+' : '-'}{formatCurrency(payment.amount)}
                        </p>
                        <FaEye className="w-4 h-4 text-zinc-400 hover:text-white transition" />
                      </div>
                    </div>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default PaymentsPage;