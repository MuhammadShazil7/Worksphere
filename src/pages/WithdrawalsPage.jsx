// src/pages/WithdrawalsPage.jsx - Fix FaBank → FaUniversity
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaSpinner, 
  FaCheckCircle, 
  FaClock,
  FaTimesCircle,
  FaMoneyBillWave,
  FaUniversity, // ← Changed from FaBank
  FaMobileAlt,
  FaCalendarAlt,
  FaInfoCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';

const WithdrawalsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    totalAmount: 0
  });

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/withdrawals/history');
      setWithdrawals(response.data.withdrawals || []);
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
      toast.error('Failed to load withdrawal history');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this withdrawal request?')) return;

    try {
      await api.put(`/withdrawals/${id}/cancel`);
      toast.success('Withdrawal cancelled');
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel withdrawal');
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
      case 'processing': return 'text-blue-400 bg-blue-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      case 'cancelled': return 'text-zinc-400 bg-zinc-400/10';
      default: return 'text-zinc-400 bg-zinc-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="w-4 h-4" />;
      case 'processing': return <FaClock className="w-4 h-4" />;
      case 'pending': return <FaClock className="w-4 h-4" />;
      case 'cancelled': return <FaTimesCircle className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'bank_transfer': return <FaUniversity className="w-4 h-4" />;
      case 'jazzcash': return <FaMobileAlt className="w-4 h-4" />;
      case 'easypaisa': return <FaMobileAlt className="w-4 h-4" />;
      default: return <FaMoneyBillWave className="w-4 h-4" />;
    }
  };

  const getMethodLabel = (method) => {
    switch (method) {
      case 'bank_transfer': return 'Bank Transfer';
      case 'jazzcash': return 'JazzCash';
      case 'easypaisa': return 'EasyPaisa';
      default: return method;
    }
  };

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading withdrawal history...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold">Withdrawals</h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              Track your withdrawal requests
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Total Requests</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.pending}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Pending</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-400">{stats.processing}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Processing</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.completed}</p>
            <p className="text-xs sm:text-sm text-zinc-400">Completed</p>
          </Card>
        </div>

        {/* Total Withdrawn */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-violet-600/10 to-blue-600/10 border-violet-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-sm text-zinc-400">Total Withdrawn</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <Link to="/withdraw">
              <Button>
                <FaMoneyBillWave className="w-4 h-4 mr-2" />
                Request Withdrawal
              </Button>
            </Link>
          </div>
        </Card>

        {/* Withdrawals List */}
        {withdrawals.length === 0 ? (
          <div className="text-center py-16">
            <FaMoneyBillWave className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No withdrawal requests yet</p>
            <Link to="/withdraw" className="text-violet-400 hover:text-violet-300 transition mt-4 inline-block">
              Request your first withdrawal →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {withdrawals.map((withdrawal) => (
              <motion.div
                key={withdrawal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 sm:p-6 hover:border-white/20 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl ${getStatusColor(withdrawal.status)}`}>
                          {getStatusIcon(withdrawal.status)}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold">
                              {formatCurrency(withdrawal.amount)}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${getStatusColor(withdrawal.status)}`}>
                              {getStatusIcon(withdrawal.status)}
                              {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-zinc-400">
                            <span className="flex items-center gap-1">
                              {getMethodIcon(withdrawal.method)}
                              {getMethodLabel(withdrawal.method)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="w-3 h-3" />
                              {formatDate(withdrawal.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaInfoCircle className="w-3 h-3" />
                              {withdrawal.referenceNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {withdrawal.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancel(withdrawal._id)}
                      >
                        Cancel
                      </Button>
                    )}
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

export default WithdrawalsPage;