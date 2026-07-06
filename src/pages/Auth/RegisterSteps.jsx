// src/pages/Auth/RegisterSteps.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaArrowRight, 
  FaArrowLeft,
  FaCheck,
  FaBriefcase,
  FaCode,
  FaMapMarkerAlt,
  FaDollarSign,
  FaUserTie,
  FaGraduationCap,
  FaGlobe,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaPlus,
  FaTimes,
  FaStar
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import Background from '../../components/ui/Background/Background';
import Container from '../../components/ui/Container/Container';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/input';
import Card from '../../components/ui/Card/card';
import Logo from '../../components/common/Logo';

const RegisterSteps = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'freelancer'
  });

  // Step 2: Freelancer Profile (only for freelancers)
  const [freelancerInfo, setFreelancerInfo] = useState({
    headline: '',
    bio: '',
    location: '',
    hourlyRate: '',
    skills: [],
    experienceLevel: 'Intermediate',
    availability: 'Available',
    languages: [],
  });

  // Step 3: Client Profile (only for clients)
  const [clientInfo, setClientInfo] = useState({
    companyName: '',
    companyWebsite: '',
    industry: '',
    companySize: '',
    companyDescription: '',
  });

  // Step 4: Social Links
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  const totalSteps = basicInfo.role === 'freelancer' ? 4 : 3;

  const handleBasicSubmit = (e) => {
    e.preventDefault();
    if (basicInfo.password !== basicInfo.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (basicInfo.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setCurrentStep(2);
  };

  const handleFreelancerSubmit = (e) => {
    e.preventDefault();
    if (freelancerInfo.skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }
    setCurrentStep(3);
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = {
        ...basicInfo,
        ...(basicInfo.role === 'freelancer' ? freelancerInfo : {}),
        ...(basicInfo.role === 'client' ? clientInfo : {}),
        ...socialLinks
      };

      await register(userData);
      toast.success('Account created successfully! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !freelancerInfo.skills.includes(skillInput.trim())) {
      setFreelancerInfo({
        ...freelancerInfo,
        skills: [...freelancerInfo.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFreelancerInfo({
      ...freelancerInfo,
      skills: freelancerInfo.skills.filter(s => s !== skill)
    });
  };

  const handleAddLanguage = () => {
    if (languageInput.trim() && !freelancerInfo.languages.includes(languageInput.trim())) {
      setFreelancerInfo({
        ...freelancerInfo,
        languages: [...freelancerInfo.languages, languageInput.trim()]
      });
      setLanguageInput('');
    }
  };

  const handleRemoveLanguage = (language) => {
    setFreelancerInfo({
      ...freelancerInfo,
      languages: freelancerInfo.languages.filter(l => l !== language)
    });
  };

  const experienceLevels = ['Entry', 'Intermediate', 'Expert', 'Senior'];
  const availabilityOptions = ['Available', 'Not Available', 'Part-time'];
  const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Media', 'Other'];
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {[...Array(totalSteps)].map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                index + 1 === currentStep
                  ? 'bg-violet-600 text-white'
                  : index + 1 < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-zinc-400'
              }`}
            >
              {index + 1 < currentStep ? <FaCheck className="w-4 h-4" /> : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div className={`w-12 h-0.5 ${
                index + 1 < currentStep ? 'bg-green-500' : 'bg-white/10'
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Background>
      <Container className="min-h-screen flex items-center justify-center py-10">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold">Create Your Account</h1>
            <p className="text-zinc-400 mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          {renderStepIndicator()}

          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 sm:p-8">
                  <form onSubmit={handleBasicSubmit} className="space-y-5">
                    <h2 className="text-xl font-semibold">Basic Information</h2>
                    
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      icon={<FaUser className="w-5 h-5" />}
                      value={basicInfo.name}
                      onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                      required
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      icon={<FaEnvelope className="w-5 h-5" />}
                      value={basicInfo.email}
                      onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                      required
                    />

                    <Input
                      label="Password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      icon={<FaLock className="w-5 h-5" />}
                      value={basicInfo.password}
                      onChange={(e) => setBasicInfo({ ...basicInfo, password: e.target.value })}
                      required
                    />

                    <Input
                      label="Confirm Password"
                      type="password"
                      placeholder="Confirm your password"
                      icon={<FaLock className="w-5 h-5" />}
                      value={basicInfo.confirmPassword}
                      onChange={(e) => setBasicInfo({ ...basicInfo, confirmPassword: e.target.value })}
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        I want to join as
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          className={`px-4 py-4 rounded-xl border transition ${
                            basicInfo.role === 'freelancer'
                              ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                              : 'border-white/10 text-zinc-400 hover:border-white/20'
                          }`}
                          onClick={() => setBasicInfo({ ...basicInfo, role: 'freelancer' })}
                        >
                          <FaBriefcase className="w-6 h-6 mx-auto mb-2" />
                          Freelancer
                        </button>
                        <button
                          type="button"
                          className={`px-4 py-4 rounded-xl border transition ${
                            basicInfo.role === 'client'
                              ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                              : 'border-white/10 text-zinc-400 hover:border-white/20'
                          }`}
                          onClick={() => setBasicInfo({ ...basicInfo, role: 'client' })}
                        >
                          <FaUserTie className="w-6 h-6 mx-auto mb-2" />
                          Client
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full justify-center">
                      Continue
                      <FaArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Freelancer Profile */}
            {currentStep === 2 && basicInfo.role === 'freelancer' && (
              <motion.div
                key="step2-freelancer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 sm:p-8">
                  <form onSubmit={handleFreelancerSubmit} className="space-y-5">
                    <h2 className="text-xl font-semibold">Freelancer Profile</h2>
                    <p className="text-sm text-zinc-400">Tell clients about yourself and your skills</p>

                    <Input
                      label="Headline / Title"
                      placeholder="e.g., Senior React Developer"
                      icon={<FaBriefcase className="w-5 h-5" />}
                      value={freelancerInfo.headline}
                      onChange={(e) => setFreelancerInfo({ ...freelancerInfo, headline: e.target.value })}
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Bio / About You
                      </label>
                      <textarea
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 min-h-[120px]"
                        placeholder="Tell clients about your experience, expertise, and what makes you unique..."
                        value={freelancerInfo.bio}
                        onChange={(e) => setFreelancerInfo({ ...freelancerInfo, bio: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Location"
                        placeholder="e.g., New York, NY or Remote"
                        icon={<FaMapMarkerAlt className="w-5 h-5" />}
                        value={freelancerInfo.location}
                        onChange={(e) => setFreelancerInfo({ ...freelancerInfo, location: e.target.value })}
                      />

                      <Input
                        label="Hourly Rate ($)"
                        type="number"
                        placeholder="e.g., 75"
                        icon={<FaDollarSign className="w-5 h-5" />}
                        value={freelancerInfo.hourlyRate}
                        onChange={(e) => setFreelancerInfo({ ...freelancerInfo, hourlyRate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Experience Level
                        </label>
                        <select
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                          value={freelancerInfo.experienceLevel}
                          onChange={(e) => setFreelancerInfo({ ...freelancerInfo, experienceLevel: e.target.value })}
                        >
                          {experienceLevels.map((level) => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Availability
                        </label>
                        <select
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                          value={freelancerInfo.availability}
                          onChange={(e) => setFreelancerInfo({ ...freelancerInfo, availability: e.target.value })}
                        >
                          {availabilityOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Skills
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., React, Node.js, Python"
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
                        {freelancerInfo.skills.map((skill) => (
                          <span
                            key={skill}
                            className="flex items-center gap-2 px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm"
                          >
                            <FaCode className="w-3 h-3" />
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

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Languages
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., English, Spanish"
                          value={languageInput}
                          onChange={(e) => setLanguageInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                          className="flex-1"
                        />
                        <Button type="button" onClick={handleAddLanguage}>
                          <FaPlus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {freelancerInfo.languages.map((language) => (
                          <span
                            key={language}
                            className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                          >
                            <FaGlobe className="w-3 h-3" />
                            {language}
                            <button
                              type="button"
                              onClick={() => handleRemoveLanguage(language)}
                              className="hover:text-white transition"
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1"
                      >
                        <FaArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button type="submit" className="flex-1">
                        Continue
                        <FaArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Client Profile */}
            {currentStep === 2 && basicInfo.role === 'client' && (
              <motion.div
                key="step2-client"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 sm:p-8">
                  <form onSubmit={handleClientSubmit} className="space-y-5">
                    <h2 className="text-xl font-semibold">Client Profile</h2>
                    <p className="text-sm text-zinc-400">Tell freelancers about your company</p>

                    <Input
                      label="Company Name"
                      placeholder="Your company name"
                      icon={<FaUserTie className="w-5 h-5" />}
                      value={clientInfo.companyName}
                      onChange={(e) => setClientInfo({ ...clientInfo, companyName: e.target.value })}
                      required
                    />

                    <Input
                      label="Company Website"
                      type="url"
                      placeholder="https://yourcompany.com"
                      icon={<FaGlobe className="w-5 h-5" />}
                      value={clientInfo.companyWebsite}
                      onChange={(e) => setClientInfo({ ...clientInfo, companyWebsite: e.target.value })}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Industry
                        </label>
                        <select
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                          value={clientInfo.industry}
                          onChange={(e) => setClientInfo({ ...clientInfo, industry: e.target.value })}
                          required
                        >
                          <option value="">Select industry</option>
                          {industries.map((industry) => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Company Size
                        </label>
                        <select
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                          value={clientInfo.companySize}
                          onChange={(e) => setClientInfo({ ...clientInfo, companySize: e.target.value })}
                          required
                        >
                          <option value="">Select company size</option>
                          {companySizes.map((size) => (
                            <option key={size} value={size}>{size} employees</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Company Description
                      </label>
                      <textarea
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 min-h-[100px]"
                        placeholder="Describe your company, mission, and what you're looking for..."
                        value={clientInfo.companyDescription}
                        onChange={(e) => setClientInfo({ ...clientInfo, companyDescription: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1"
                      >
                        <FaArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button type="submit" className="flex-1">
                        Continue
                        <FaArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Social Links */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 sm:p-8">
                  <form onSubmit={handleSocialSubmit} className="space-y-5">
                    <h2 className="text-xl font-semibold">Social Links</h2>
                    <p className="text-sm text-zinc-400">Connect your professional profiles (optional)</p>

                    <Input
                      label="GitHub"
                      placeholder="https://github.com/yourusername"
                      icon={<FaGithub className="w-5 h-5" />}
                      value={socialLinks.github}
                      onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                    />

                    <Input
                      label="LinkedIn"
                      placeholder="https://linkedin.com/in/yourusername"
                      icon={<FaLinkedin className="w-5 h-5" />}
                      value={socialLinks.linkedin}
                      onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    />

                    <Input
                      label="Twitter"
                      placeholder="https://twitter.com/yourusername"
                      icon={<FaTwitter className="w-5 h-5" />}
                      value={socialLinks.twitter}
                      onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    />

                    <Input
                      label="Personal Website / Portfolio"
                      placeholder="https://yourportfolio.com"
                      icon={<FaGlobe className="w-5 h-5" />}
                      value={socialLinks.website}
                      onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
                    />

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1"
                      >
                        <FaArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button type="submit" className="flex-1" loading={loading}>
                        <FaCheck className="w-4 h-4 mr-2" />
                        Complete Registration
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-zinc-400 mt-6 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-violet-400 hover:text-violet-300 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </Container>
    </Background>
  );
};

export default RegisterSteps;