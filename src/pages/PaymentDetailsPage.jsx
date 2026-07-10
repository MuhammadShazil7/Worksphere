// src/pages/PaymentDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  FaDownload,
  FaPrint,
  FaShare
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';

const PaymentDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/payments/${id}`);
      setPayment(response.data.payment);
    } catch (error) {
      console.error('Failed to fetch payment:', error);
      toast.error('Failed to load payment details');
      navigate('/earnings');
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      case 'completed': return <FaCheckCircle className="w-5 h-5" />;
      case 'processing': return <FaClock className="w-5 h-5" />;
      case 'pending': return <FaClock className="w-5 h-5" />;
      default: return <FaClock className="w-5 h-5" />;
    }
  };

  const handleDownloadInvoice = () => {
    // TODO: Implement PDF download
    toast.success('Invoice download coming soon!');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    toast.success('Share coming soon!');
  };

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading payment details...</p>
        </div>
      </Container>
    );
  }

  if (!payment) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-zinc-400">Payment not found</p>
          <Link to="/earnings" className="text-violet-400 hover:text-violet-300 mt-2 inline-block">
            Back to Earnings
          </Link>
        </div>
      </Container>
    );
  }

  const isFreelancer = user?.role === 'freelancer';

  return (
    <section className="py-6 sm:py-12">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/earnings')}
              className="text-zinc-400 hover:text-white transition"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Payment Details</h1>
              <p className="text-zinc-400 text-sm">
                Transaction {payment.invoiceNumber}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={handleDownloadInvoice}>
              <FaDownload className="w-4 h-4 mr-2" />
              Invoice
            </Button>
            <Button size="sm" variant="secondary" onClick={handleShare}>
              <FaShare className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Status Card */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-violet-600/10 to-blue-600/10 border-violet-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${getStatusColor(payment.status)}`}>
                {getStatusIcon(payment.status)}
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </p>
                <p className="text-sm text-zinc-400">
                  {payment.status === 'completed' ? 'Payment successful' :
                   payment.status === 'processing' ? 'Waiting for confirmation' :
                   payment.status === 'pending' ? 'Awaiting payment' :
                   'Payment failed'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {formatCurrency(payment.amount)}
              </p>
              <p className="text-sm text-zinc-400">{payment.currency}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Transaction Details</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-zinc-400">Invoice Number</p>
                    <p className="font-medium">{payment.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Date</p>
                    <p className="font-medium">{formatDate(payment.createdAt)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-zinc-400">Payment Method</p>
                    <p className="font-medium capitalize">{payment.paymentMethod || 'Manual'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Currency</p>
                    <p className="font-medium">{payment.currency}</p>
                  </div>
                </div>

                {payment.referenceNumber && (
                  <div>
                    <p className="text-sm text-zinc-400">Reference Number</p>
                    <p className="font-medium">{payment.referenceNumber}</p>
                  </div>
                )}

                {payment.description && (
                  <div>
                    <p className="text-sm text-zinc-400">Description</p>
                    <p className="font-medium">{payment.description}</p>
                  </div>
                )}

                {payment.paidAt && (
                  <div>
                    <p className="text-sm text-zinc-400">Paid At</p>
                    <p className="font-medium">{formatDate(payment.paidAt)}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Project Details */}
            <Card className="p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Project Details</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaBriefcase className="w-5 h-5 text-violet-400" />
                  <Link to={`/jobs/${payment.project?._id}`} className="hover:text-violet-400 transition">
                    <p className="font-medium">{payment.project?.title || 'Unknown Project'}</p>
                  </Link>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaUser className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-sm text-zinc-400">
                      {isFreelancer ? 'Client' : 'Freelancer'}
                    </p>
                    <p className="font-medium">
                      {isFreelancer ? payment.client?.name : payment.freelancer?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaDollarSign className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-sm text-zinc-400">Amount</p>
                    <p className="font-medium">{formatCurrency(payment.amount)}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Amount Breakdown */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Amount Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white">{formatCurrency(payment.amount)}</span>
                </div>
                {payment.platformFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Platform Fee (10%)</span>
                    <span className="text-yellow-400">-{formatCurrency(payment.platformFee)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                  <span className="font-medium text-zinc-400">
                    {isFreelancer ? 'You Receive' : 'Freelancer Receives'}
                  </span>
                  <span className={`font-bold ${isFreelancer ? 'text-green-400' : 'text-white'}`}>
                    {formatCurrency(payment.freelancerAmount || payment.amount)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 mt-4">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to={`/jobs/${payment.project?._id}`}>
                  <Button variant="secondary" className="w-full justify-center">
                    <FaBriefcase className="w-4 h-4 mr-2" />
                    View Project
                  </Button>
                </Link>
                <Button variant="secondary" className="w-full justify-center" onClick={handleDownloadInvoice}>
                  <FaFileInvoice className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="secondary" className="w-full justify-center" onClick={handlePrint}>
                  <FaPrint className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
              </div>
            </Card>

            {/* Support */}
            <Card className="p-6 mt-4 bg-yellow-500/5 border border-yellow-500/20">
              <h4 className="font-medium text-sm mb-2">Need Help?</h4>
              <p className="text-xs text-zinc-400">
                If you have any questions about this transaction, please contact our support team.
              </p>
              <Link to="/contact">
                <Button size="sm" variant="secondary" className="w-full mt-3">
                  Contact Support
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PaymentDetailsPage;