// src/pages/LandingPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBriefcase, 
  FaUsers, 
  FaRocket, 
  FaShieldAlt,
  FaArrowRight,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaUserPlus,
  FaSearch,
  FaComments,
  FaHandshake,
  FaAward,
  FaGlobe,
  FaCode,
  FaMobileAlt,
  FaPaintBrush,
  FaPenFancy,
  FaBullhorn,
  FaVideo,
  FaGraduationCap,
  FaTrophy,
  FaMedal,
  FaSmile,
  FaThumbsUp,
  FaHeart,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaQuoteLeft,
  FaQuoteRight,
  FaPlay,
  FaCrown,
  FaLightbulb,
  FaGem,
  FaDollarSign
} from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Stats from '../components/ui/Stats';
import Features from '../components/ui/Features'; // ✅ ADD THIS IMPORT
import Testimonials from '../components/ui/Testimonials';

// ============== Sub-Components ==============

const HeroSection = ({ user, loading }) => {
  if (loading) {
    return (
      <section className="relative pt-20 pb-12 min-h-[400px] flex items-center">
        <Container>
          <div className="flex justify-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
          </div>
        </Container>
      </section>
    );
  }

  if (user) {
    // Logged in hero
    return (
      <section className="relative pt-20 pb-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm text-green-400">You're logged in as {user.role}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Welcome back,{' '}
              <span className="gradient-text">{user.name}</span>
              <span className="inline-block ml-2">👋</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto mb-6">
              {user.role === 'freelancer' 
                ? 'Continue building your freelancing career. Find new opportunities, connect with clients, and grow your business.'
                : 'Manage your projects, find top talent, and build your dream team.'}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard">
                <Button className="px-8 py-3 text-lg group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    <FaChartLine className="w-5 h-5 mr-2" />
                    Dashboard
                    <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link to={user.role === 'freelancer' ? '/jobs' : '/create-job'}>
                <Button variant="secondary" className="px-8 py-3 text-lg">
                  {user.role === 'freelancer' ? (
                    <>
                      <FaSearch className="w-5 h-5 mr-2" />
                      Find Jobs
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="w-5 h-5 mr-2" />
                      Post a Job
                    </>
                  )}
                </Button>
              </Link>
            </div>

            {/* Quick stats for logged in users */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-2xl font-bold text-violet-400">{user.role === 'freelancer' ? '50+' : '12+'}</p>
                <p className="text-xs text-zinc-400">{user.role === 'freelancer' ? 'Jobs Applied' : 'Jobs Posted'}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-2xl font-bold text-green-400">4.9</p>
                <p className="text-xs text-zinc-400">Rating</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-2xl font-bold text-yellow-400">${user.role === 'freelancer' ? '24K' : '45K'}</p>
                <p className="text-xs text-zinc-400">{user.role === 'freelancer' ? 'Earned' : 'Spent'}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-2xl font-bold text-blue-400">32</p>
                <p className="text-xs text-zinc-400">Projects</p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    );
  }

  // Not logged in hero
  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-float-delayed"></div>
      </div>
      
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-sm text-zinc-300">
              🔥 Join 50,000+ freelancers and 12,000+ companies
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Hire Smarter.
            <br />
            <span className="gradient-text">Work Faster.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            WorkSphere connects talented freelancers with ambitious companies through a modern, secure, and premium hiring platform.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button className="px-8 py-3 text-lg group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Get Started
                  <FaRocket className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="secondary" className="px-8 py-3 text-lg">
                <FaSearch className="w-5 h-5 mr-2" />
                Explore Jobs
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-8 text-zinc-400 text-sm">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="w-4 h-4 text-green-400" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="w-4 h-4 text-violet-400" />
              <span>Verified Freelancers</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="w-4 h-4 text-blue-400" />
              <span>Fast Matching</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

// ============== Quick Actions Section ==============

const QuickActions = ({ user }) => {
  const actions = user.role === 'freelancer' ? [
    { icon: FaSearch, label: 'Browse Jobs', desc: 'Find new opportunities', path: '/jobs', color: 'text-violet-400' },
    { icon: FaClock, label: 'My Proposals', desc: 'Track your applications', path: '/my-proposals', color: 'text-yellow-400' },
    { icon: FaComments, label: 'Messages', desc: 'Chat with clients', path: '/messages', color: 'text-blue-400' },
    { icon: FaUserPlus, label: 'My Profile', desc: 'Update your info', path: '/profile', color: 'text-green-400' },
  ] : [
    { icon: FaBriefcase, label: 'Post a Job', desc: 'Find the right talent', path: '/create-job', color: 'text-violet-400' },
    { icon: FaClock, label: 'My Jobs', desc: 'Manage your listings', path: '/my-jobs', color: 'text-yellow-400' },
    { icon: FaUsers, label: 'Find Freelancers', desc: 'Browse top talent', path: '/freelancers', color: 'text-blue-400' },
    { icon: FaComments, label: 'Messages', desc: 'Chat with freelancers', path: '/messages', color: 'text-green-400' },
  ];

  return (
    <section className="py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Quick Actions</h2>
            <span className="text-xs text-zinc-500">Your personalized shortcuts</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {actions.map((action, index) => (
              <Link to={action.path} key={index}>
                <Card className="p-6 text-center hover:border-violet-500/30 transition cursor-pointer group">
                  <div className={`${action.color} transition-transform group-hover:scale-110 duration-300`}>
                    <action.icon className="w-8 h-8 mx-auto mb-3" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">{action.label}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{action.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

// ============== Role Features Section ==============

const RoleFeatures = ({ user }) => {
  const freelancerFeatures = [
    { icon: FaRocket, title: 'Find the Perfect Job', desc: 'Browse thousands of opportunities matching your skills', color: 'from-violet-500 to-purple-500' },
    { icon: FaHandshake, title: 'Build Relationships', desc: 'Connect with clients and grow your network', color: 'from-green-500 to-emerald-500' },
    { icon: FaChartLine, title: 'Track Your Growth', desc: 'Monitor your earnings, projects, and ratings', color: 'from-blue-500 to-cyan-500' },
    { icon: FaTrophy, title: 'Build Your Portfolio', desc: 'Showcase your best work and attract more clients', color: 'from-yellow-500 to-orange-500' },
    { icon: FaGraduationCap, title: 'Learn & Grow', desc: 'Access courses and resources to improve your skills', color: 'from-pink-500 to-rose-500' },
    { icon: FaGlobe, title: 'Work Anywhere', desc: 'Remote opportunities from companies worldwide', color: 'from-indigo-500 to-purple-500' },
  ];

  const clientFeatures = [
    { icon: FaUsers, title: 'Access Top Talent', desc: 'Find vetted freelancers with proven skills', color: 'from-violet-500 to-purple-500' },
    { icon: FaShieldAlt, title: 'Secure Payments', desc: 'Protected transactions and milestone payments', color: 'from-green-500 to-emerald-500' },
    { icon: FaClock, title: 'Fast Hiring', desc: 'Post a job and get applications in hours', color: 'from-blue-500 to-cyan-500' },
    { icon: FaStar, title: 'Quality Assurance', desc: 'Every freelancer is verified and rated', color: 'from-yellow-500 to-orange-500' },
    { icon: FaComments, title: 'Real-time Communication', desc: 'Chat with freelancers instantly', color: 'from-pink-500 to-rose-500' },
    { icon: FaChartLine, title: 'Track Progress', desc: 'Monitor project milestones and deliverables', color: 'from-indigo-500 to-purple-500' },
  ];

  const features = user.role === 'freelancer' ? freelancerFeatures : clientFeatures;

  return (
    <section className="py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">
              {user.role === 'freelancer' 
                ? '🚀 Everything You Need to Succeed' 
                : '💼 Build Your Dream Team'}
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              {user.role === 'freelancer'
                ? 'Tools and features designed to help you grow your freelancing career'
                : 'Tools and features designed to help you find and manage top talent'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="p-6 hover:border-violet-500/30 transition group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-400">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

// ============== Platform Stats Section ==============

const PlatformStats = () => {
  const stats = [
    { icon: FaUsers, value: '50K+', label: 'Freelancers', color: 'text-violet-400' },
    { icon: FaBriefcase, value: '12K+', label: 'Companies', color: 'text-blue-400' },
    { icon: FaDollarSign, value: '$20M+', label: 'Paid Out', color: 'text-green-400' },
    { icon: FaStar, value: '4.9', label: 'Average Rating', color: 'text-yellow-400' },
  ];

  return (
    <section className="py-12 border-y border-white/5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

// ============== Categories Section ==============

const Categories = () => {
  const categories = [
    { icon: FaCode, name: 'Web Development', count: '12K+', color: 'from-blue-500 to-cyan-500' },
    { icon: FaMobileAlt, name: 'Mobile Apps', count: '8K+', color: 'from-green-500 to-emerald-500' },
    { icon: FaPaintBrush, name: 'Design', count: '6K+', color: 'from-pink-500 to-rose-500' },
    { icon: FaPenFancy, name: 'Writing', count: '4K+', color: 'from-yellow-500 to-orange-500' },
    { icon: FaBullhorn, name: 'Marketing', count: '5K+', color: 'from-red-500 to-pink-500' },
    { icon: FaVideo, name: 'Video & Animation', count: '3K+', color: 'from-purple-500 to-violet-500' },
  ];

  return (
    <section className="py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Popular Categories</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Find the perfect freelancer or job in your field
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <Link to={`/jobs?category=${cat.name}`} key={index}>
                <Card className="p-4 text-center hover:border-violet-500/30 transition group">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">{cat.name}</h4>
                  <p className="text-xs text-zinc-500">{cat.count} jobs</p>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

// ============== How It Works Section ==============

const HowItWorks = () => {
  const steps = [
    { number: '01', title: 'Create Your Account', desc: 'Sign up as a freelancer or client in minutes', icon: FaUserPlus },
    { number: '02', title: 'Find Your Match', desc: 'Browse jobs or freelancers that fit your needs', icon: FaSearch },
    { number: '03', title: 'Work Together', desc: 'Collaborate and get paid securely', icon: FaHandshake },
  ];

  return (
    <section className="py-16 bg-white/5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative"
              >
                <Card className="p-6 text-center h-full">
                  <div className="text-5xl font-bold text-violet-500/20 mb-4">{step.number}</div>
                  <div className="w-14 h-14 mx-auto rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
                    <step.icon className="w-7 h-7 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-400">{step.desc}</p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <FaArrowRight className="w-6 h-6 text-zinc-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

// ============== Call to Action ==============

const CallToAction = () => {
  const { user } = useAuth();

  if (user) return null;

  return (
    <section className="py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 sm:p-12 text-center bg-gradient-to-r from-violet-600/20 to-blue-600/20 border-violet-500/20">
            <h2 className="text-3xl font-bold mb-3">Ready to Get Started?</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto mb-6">
              Join thousands of freelancers and companies already using WorkSphere
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button className="px-8 py-3 text-lg">
                  <FaUserPlus className="w-5 h-5 mr-2" />
                  Create Free Account
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="secondary" className="px-8 py-3 text-lg">
                  Browse Jobs
                </Button>
              </Link>
            </div>
            <p className="text-xs text-zinc-500 mt-4">
              No credit card required. Free to get started.
            </p>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
};

// ============== Main LandingPage ==============

const LandingPage = () => {
  const { user, loading } = useAuth();

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection user={user} loading={loading} />

      {/* Stats Section - Shows to everyone */}
      <PlatformStats />

      {/* If logged in, show personalized content */}
      {user && (
        <>
          <QuickActions user={user} />
          <RoleFeatures user={user} />
        </>
      )}

      {/* Categories Section - Shows to everyone */}
      <Categories />

      {/* How It Works - Shows to everyone */}
      <HowItWorks />

      {/* Features Section - Shows to everyone */}
      <Features />

      {/* Testimonials - Shows to everyone */}
      <Testimonials />

      {/* Call to Action - Only for non-logged in users */}
      <CallToAction />
    </div>
  );
};

export default LandingPage;