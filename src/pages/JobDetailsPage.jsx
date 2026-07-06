// src/pages/JobDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaClock, 
  FaUser, 
  FaArrowLeft,
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  
  const [proposalData, setProposalData] = useState({
    coverLetter: '',
    proposedBudget: '',
    estimatedDuration: '1-4 weeks'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data.job);
      
      // Check if user has already applied
      if (user) {
        const proposalsResponse = await api.get(`/proposals/my-proposals`);
        const applied = proposalsResponse.data.proposals.some(
          p => p.job._id === id && p.status !== 'withdrawn'
        );
        setHasApplied(applied);
      }
    } catch (error) {
      console.error('Failed to fetch job:', error);
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/proposals', {
        jobId: id,
        coverLetter: proposalData.coverLetter,
        proposedBudget: parseFloat(proposalData.proposedBudget),
        estimatedDuration: proposalData.estimatedDuration
      });

      toast.success('Proposal submitted successfully! 🎉');
      setShowApplyForm(false);
      setHasApplied(true);
      await fetchJob();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading job details...</p>
        </div>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-zinc-400">Job not found</p>
          <Link to="/jobs" className="text-violet-400 hover:underline mt-2 inline-block">
            Back to Jobs
          </Link>
        </div>
      </Container>
    );
  }

  const isClient = user?.role === 'client' && job.client?._id === user?.id;
  const isFreelancer = user?.role === 'freelancer';

  return (
    <section className="py-12">
      <Container>
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-6"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Job Header */}
          <div className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-2xl p-8 border border-white/10 mb-8">
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-zinc-400">
              <span className="flex items-center gap-2">
                <FaUser className="w-4 h-4" />
                {job.client?.name || 'Anonymous'}
              </span>
              <span className="flex items-center gap-2">
                <FaDollarSign className="w-4 h-4" />
                ${job.budget}
              </span>
              <span className="flex items-center gap-2">
                <FaClock className="w-4 h-4" />
                {job.duration}
              </span>
              <span className="flex items-center gap-2">
                <FaBriefcase className="w-4 h-4" />
                {job.category}
              </span>
            </div>
            <div className="mt-4">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                job.status === 'open' ? 'bg-green-500/10 text-green-400' :
                job.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {job.status || 'Open'}
              </span>
            </div>
          </div>

          {/* Job Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-zinc-300 whitespace-pre-wrap">{job.description}</p>
              </Card>

              {/* Skills */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-white/5 rounded-full text-sm text-zinc-300 border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Client Info */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">About the Client</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {job.client?.name?.[0] || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{job.client?.name || 'Unknown'}</p>
                    <p className="text-sm text-zinc-400">
                      Member since {job.client?.createdAt ? new Date(job.client.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar - Apply Section */}
            <div>
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Job Overview</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Budget</span>
                    <span className="text-white font-semibold">${job.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Duration</span>
                    <span className="text-white">{job.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Experience Level</span>
                    <span className="text-white">{job.experienceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Project Type</span>
                    <span className="text-white">{job.projectType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Status</span>
                    <span className={`capitalize ${
                      job.status === 'open' ? 'text-green-400' :
                      job.status === 'in-progress' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>

                <hr className="border-white/10 my-4" />

                {/* Apply Button */}
                {!user && (
                  <Link to="/login" className="block">
                    <Button className="w-full justify-center">
                      Login to Apply
                    </Button>
                  </Link>
                )}

                {user && isClient && (
                  <div className="text-center text-zinc-400 text-sm">
                    <FaUser className="w-8 h-8 mx-auto mb-2 text-violet-400" />
                    <p>You posted this job</p>
                  </div>
                )}

                {user && isFreelancer && hasApplied && (
                  <div className="text-center">
                    <FaCheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <p className="text-green-400 font-medium">You've applied to this job!</p>
                    <p className="text-sm text-zinc-400 mt-1">Waiting for client's response</p>
                  </div>
                )}

                {user && isFreelancer && !hasApplied && job.status === 'open' && (
                  <Button 
                    className="w-full justify-center"
                    onClick={() => setShowApplyForm(!showApplyForm)}
                  >
                    <FaPaperPlane className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                )}

                {user && isFreelancer && job.status !== 'open' && (
                  <div className="text-center text-zinc-400 text-sm">
                    <FaTimesCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                    <p>This job is no longer accepting applications</p>
                  </div>
                )}
              </Card>

              {/* Apply Form */}
              {showApplyForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Submit Proposal</h3>
                    <form onSubmit={handleProposalSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Cover Letter
                        </label>
                        <textarea
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 min-h-[120px]"
                          placeholder="Explain why you're the perfect fit for this job..."
                          value={proposalData.coverLetter}
                          onChange={(e) => setProposalData({ ...proposalData, coverLetter: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Proposed Budget ($)
                        </label>
                        <Input
                          type="number"
                          placeholder="Enter your proposed budget"
                          value={proposalData.proposedBudget}
                          onChange={(e) => setProposalData({ ...proposalData, proposedBudget: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Estimated Duration
                        </label>
                        <select
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                          value={proposalData.estimatedDuration}
                          onChange={(e) => setProposalData({ ...proposalData, estimatedDuration: e.target.value })}
                          required
                        >
                          <option value="Less than 1 week">Less than 1 week</option>
                          <option value="1-4 weeks">1-4 weeks</option>
                          <option value="1-3 months">1-3 months</option>
                          <option value="3+ months">3+ months</option>
                        </select>
                      </div>

                      <div className="flex gap-3">
                        <Button type="submit" loading={submitting} className="flex-1 justify-center">
                          Submit Proposal
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setShowApplyForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default JobDetailsPage;