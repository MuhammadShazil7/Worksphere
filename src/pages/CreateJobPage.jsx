// src/pages/CreateJobPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaSave, 
  FaTimes,
  FaPlus,
  FaTrash
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';

const CreateJobPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skills: [],
    budget: '',
    duration: '',
    experienceLevel: '',
    projectType: 'Fixed Price',
  });
  const [skillInput, setSkillInput] = useState('');

  const categories = ['Web Development', 'Mobile Development', 'Design', 'Writing', 'Marketing', 'Other'];
  const durations = ['Less than 1 week', '1-4 weeks', '1-3 months', '3+ months'];
  const experienceLevels = ['Entry', 'Intermediate', 'Expert'];
  const projectTypes = ['Fixed Price', 'Hourly'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        ...formData,
        budget: parseFloat(formData.budget),
      };
      
      const response = await api.post('/jobs', jobData);
      toast.success('Job posted successfully! 🎉');
      navigate(`/jobs/${response.data.job._id}`);
    } catch (error) {
      console.error('Failed to create job:', error);
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Post a New Job</h1>
            <p className="text-zinc-400">Find the perfect freelancer for your project</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Job Details</h2>
                  
                  <div className="space-y-4">
                    <Input
                      label="Job Title"
                      name="title"
                      placeholder="e.g., React Developer Needed"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        rows="6"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        placeholder="Describe your project in detail..."
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Skills Required
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., React, Node.js"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                          className="flex-1"
                        />
                        <Button type="button" onClick={handleAddSkill}>
                          <FaPlus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="flex items-center gap-2 px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="hover:text-white transition"
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Budget & Timeline</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Budget ($)
                      </label>
                      <Input
                        type="number"
                        name="budget"
                        placeholder="5000"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Project Type
                      </label>
                      <select
                        name="projectType"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        value={formData.projectType}
                        onChange={handleChange}
                      >
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Estimated Duration
                      </label>
                      <select
                        name="duration"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select duration</option>
                        {durations.map((dur) => (
                          <option key={dur} value={dur}>{dur}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Experience Level
                      </label>
                      <select
                        name="experienceLevel"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select experience level</option>
                        {experienceLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div>
                <Card className="p-6 sticky top-24">
                  <h3 className="text-lg font-semibold mb-4">Publish Job</h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Posted by</span>
                      <span className="text-white">{user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Status</span>
                      <span className="text-green-400">Draft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Type</span>
                      <span className="text-white">{formData.projectType}</span>
                    </div>
                  </div>

                  <hr className="border-white/10 my-4" />

                  <div className="space-y-3">
                    <Button type="submit" className="w-full justify-center" loading={loading}>
                      <FaSave className="w-4 h-4 mr-2" />
                      Post Job
                    </Button>
                    <Button type="button" variant="secondary" className="w-full justify-center" onClick={() => navigate(-1)}>
                      Cancel
                    </Button>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <p className="text-xs text-yellow-400">
                      <span className="font-semibold">Note:</span> Your job will be visible to all freelancers once posted.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </motion.div>
      </Container>
    </section>
  );
};

export default CreateJobPage;