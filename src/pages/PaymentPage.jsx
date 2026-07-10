// src/pages/PaymentPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaCheckCircle, 
  FaSpinner,
  FaMobileAlt,
  FaUniversity,
  FaLock,
  FaClock
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';

const PaymentPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('jazzcash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setProject(response.data.job);
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!referenceNumber) {
      toast.error('Please enter a reference number');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/payments/create', {
        projectId: id,
        paymentMethod: selectedMethod,
        referenceNumber: referenceNumber
      });

      toast.success('Payment recorded! Freelancer will confirm receipt.');
      setPaymentComplete(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </Container>
    );
  }

  if (paymentComplete) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <FaCheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Recorded! 🎉</h2>
          <p className="text-zinc-400 mb-6">
            Your payment has been recorded. The freelancer will confirm receipt and start the project.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/my-jobs')}>
              View My Jobs
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/jobs/${id}`)}>
              View Project
            </Button>
          </div>
        </motion.div>
      </Container>
    );
  }

  return (
    <section className="py-12">
      <Container>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-6"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
              <p className="text-zinc-400 mb-6">
                Project: {project?.title} - Amount: ${project?.budget}
              </p>

              {/* Payment Methods */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Select Payment Method</h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'jazzcash', label: 'JazzCash', icon: FaMobileAlt, color: 'text-yellow-400', desc: 'Mobile account transfer' },
                      { id: 'easypaisa', label: 'EasyPaisa', icon: FaMobileAlt, color: 'text-green-400', desc: 'Mobile account transfer' },
                      { id: 'bank_transfer', label: 'Bank Transfer', icon: FaUniversity, color: 'text-blue-400', desc: 'Direct bank transfer' }
                    ].map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                          selectedMethod === method.id 
                            ? 'border-violet-500 bg-violet-500/10' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <method.icon className={`w-6 h-6 ${method.color}`} />
                            <div>
                              <p className="font-medium">{method.label}</p>
                              <p className="text-xs text-zinc-400">{method.desc}</p>
                            </div>
                          </div>
                          {selectedMethod === method.id && (
                            <FaCheckCircle className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reference Number */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Reference / Transaction ID
                  </label>
                  <Input
                    placeholder="Enter the transaction reference number..."
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                  />
                </div>

                {/* Instructions */}
                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <h4 className="font-medium text-sm text-blue-400 mb-2">📋 Instructions</h4>
                  <ol className="text-xs text-zinc-400 space-y-2 list-decimal list-inside">
                    <li>Make payment using your selected method</li>
                    <li>Note down the transaction reference number</li>
                    <li>Enter the reference number above</li>
                    <li>Click "Confirm Payment"</li>
                    <li>Freelancer will confirm receipt</li>
                  </ol>
                </div>

                <Button
                  className="w-full justify-center"
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={submitting}
                >
                  <FaLock className="w-4 h-4 mr-2" />
                  Confirm Payment
                </Button>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Payment Summary</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-zinc-400">Project</p>
                  <p className="text-white font-medium">{project?.title}</p>
                </div>
                <div>
                  <p className="text-zinc-400">Freelancer</p>
                  <p className="text-white">{project?.freelancer?.name || 'Not assigned'}</p>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount</span>
                    <span className="text-white font-bold">${project?.budget}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 mt-1">
                    <span>Platform Fee (10%)</span>
                    <span>-${(project?.budget * 0.10).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t border-white/10">
                    <span className="text-zinc-400">Freelancer Gets</span>
                    <span className="text-green-400">${(project?.budget * 0.90).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-4 bg-yellow-500/5 border-yellow-500/20">
              <div className="flex items-start gap-2">
                <FaClock className="w-4 h-4 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Processing Time</h4>
                  <p className="text-xs text-zinc-400">
                    Payments are confirmed within 24-48 hours after freelancer confirms receipt.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PaymentPage;