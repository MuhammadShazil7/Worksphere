// src/pages/DeliveryPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUpload, 
  FaFile, 
  FaTimes, 
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaArrowLeft
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';

const DeliveryPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    files: []
  });
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projectRes, deliveriesRes] = await Promise.all([
        api.get(`/jobs/${id}`),
        api.get(`/deliveries/project/${id}`)
      ]);
      
      setProject(projectRes.data.job);
      setDeliveries(deliveriesRes.data.deliveries || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/deliveries', {
        projectId: id,
        title: formData.title,
        message: formData.message,
        files: formData.files
      });

      toast.success('Delivery submitted successfully! 🎉');
      setFormData({ title: '', message: '', files: [] });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit delivery');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async (action) => {
    if (!selectedDelivery) return;

    try {
      await api.put(`/deliveries/${selectedDelivery._id}/review`, {
        action,
        feedback: reviewComment
      });

      toast.success(`Delivery ${action}ed successfully!`);
      setSelectedDelivery(null);
      setReviewComment('');
      fetchData();
    } catch (error) {
      toast.error('Failed to review delivery');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
      case 'in-review': return 'text-yellow-400 bg-yellow-400/10';
      case 'approved': return 'text-green-400 bg-green-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      case 'revision-requested': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-zinc-400 bg-zinc-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
      case 'in-review': return <FaClock className="w-4 h-4" />;
      case 'approved': return <FaCheckCircle className="w-4 h-4" />;
      case 'rejected': return <FaTimesCircle className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  const isFreelancer = user?.role === 'freelancer';
  const isClient = user?.role === 'client';

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading...</p>
        </div>
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Project Delivery</h1>
          <p className="text-zinc-400">
            {project?.title} - {isFreelancer ? 'Submit your work' : 'Review submissions'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Delivery Form (Freelancer only) */}
            {isFreelancer && (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Submit Delivery</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Delivery Title"
                    placeholder="e.g., Version 1.0 - Complete Project"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Message
                    </label>
                    <textarea
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 min-h-[120px]"
                      placeholder="Describe what you've delivered..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Files (Coming Soon)
                    </label>
                    <div className="p-8 border-2 border-dashed border-white/10 rounded-xl text-center text-zinc-400">
                      <FaUpload className="w-8 h-8 mx-auto mb-2" />
                      <p>File upload coming soon</p>
                    </div>
                  </div>

                  <Button type="submit" loading={submitting}>
                    Submit Delivery
                  </Button>
                </form>
              </Card>
            )}

            {/* Delivery History */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Delivery History</h2>
              {deliveries.length === 0 ? (
                <Card className="p-8 text-center text-zinc-400">
                  <p>No deliveries yet</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {deliveries.map((delivery) => (
                    <Card key={delivery._id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{delivery.title}</h4>
                          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                            {delivery.message}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(delivery.status)}`}>
                              {getStatusIcon(delivery.status)}
                              {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                            </span>
                            <span className="text-zinc-500">
                              Version {delivery.version}
                            </span>
                            <span className="text-zinc-500">
                              {new Date(delivery.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {delivery.feedback && (
                            <p className="text-sm text-zinc-400 mt-2 p-2 bg-white/5 rounded-lg">
                              Feedback: {delivery.feedback}
                            </p>
                          )}
                        </div>
                        {isClient && delivery.status === 'submitted' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedDelivery(delivery)}
                          >
                            <FaEye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Project Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status</span>
                  <span className={`px-2 py-0.5 rounded-full ${getStatusColor(project?.status)}`}>
                    {project?.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Budget</span>
                  <span className="text-white font-medium">${project?.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Deliveries</span>
                  <span className="text-white">{deliveries.length}</span>
                </div>
                {project?.status === 'completed' && (
                  <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20 text-center">
                    <p className="text-green-400 font-medium">✅ Project Completed</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Review Modal */}
        {selectedDelivery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#09090B] rounded-2xl border border-white/10 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Review Delivery</h3>
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="p-1 hover:bg-white/5 rounded-lg transition"
                >
                  <FaTimes className="w-5 h-5 text-zinc-400 hover:text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-zinc-400">Title</p>
                  <p className="font-medium">{selectedDelivery.title}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Message</p>
                  <p className="text-zinc-300 whitespace-pre-wrap">{selectedDelivery.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Feedback
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 min-h-[100px]"
                    placeholder="Provide feedback..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleReview('approve')}
                  >
                    <FaCheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                    onClick={() => handleReview('request-revision')}
                  >
                    <FaClock className="w-4 h-4 mr-2" />
                    Request Revision
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => handleReview('reject')}
                  >
                    <FaTimesCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default DeliveryPage;