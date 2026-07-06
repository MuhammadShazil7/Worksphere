// src/pages/FreelancerProfilePage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaStar, 
  FaBriefcase, 
  FaEnvelope,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaCode,
  FaGlobe,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaGraduationCap
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';

const FreelancerProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching profile for ID:', id); // Debug log
      const response = await api.get(`/users/${id}`);
      console.log('Profile response:', response.data); // Debug log
      setProfile(response.data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
      navigate('/freelancers');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/messages?userId=${id}`);
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`w-5 h-5 ${
              i < fullStars ? 'text-yellow-400 fill-yellow-400' :
              i === fullStars && hasHalfStar ? 'text-yellow-400 fill-yellow-400 opacity-50' :
              'text-zinc-600'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-semibold text-white">{rating || 0}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-12">
        <Container>
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
            <p className="mt-4 text-zinc-400">Loading profile...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="py-12">
        <Container>
          <div className="text-center py-20">
            <p className="text-zinc-400">Freelancer not found</p>
            <Link to="/freelancers" className="text-violet-400 hover:underline mt-2 inline-block">
              Back to Freelancers
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-12">
      <Container>
        <button
          onClick={() => navigate('/freelancers')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-6"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Freelancers
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-2xl p-6 sm:p-8 border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                {profile.avatar && profile.avatar !== 'default-avatar.png' ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl sm:text-5xl font-bold text-white">
                    {getInitials(profile.name)}
                  </span>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">{profile.name}</h1>
                    <p className="text-lg text-zinc-400">{profile.headline || 'Freelancer'}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-zinc-400">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        {profile.location || 'Remote'}
                      </span>
                      {profile.isVerified && (
                        <span className="flex items-center gap-1 text-green-400">
                          <FaCheckCircle className="w-4 h-4" />
                          Verified
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-blue-400">
                        <FaGraduationCap className="w-4 h-4" />
                        {profile.experienceLevel || 'Intermediate'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {profile.hourlyRate > 0 && (
                      <div className="px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20 text-center">
                        <p className="text-sm text-zinc-400">Hourly Rate</p>
                        <p className="text-xl font-bold text-green-400">${profile.hourlyRate}/hr</p>
                      </div>
                    )}
                    <Button onClick={handleContact} className="whitespace-nowrap">
                      <FaEnvelope className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>

                {/* Rating & Stats */}
                <div className="flex flex-wrap items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    {renderStars(profile.rating || 0)}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <FaBriefcase className="w-4 h-4" />
                    <span>{profile.totalProjects || 0} Projects</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <FaClock className="w-4 h-4" />
                    <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['about', 'skills', 'portfolio'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'text-zinc-400 hover:text-white border border-transparent hover:border-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* About Tab */}
              {activeTab === 'about' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-zinc-300 whitespace-pre-wrap">
                    {profile.bio || 'No bio provided yet.'}
                  </p>
                  {profile.availability && (
                    <div className="mt-4 p-3 bg-white/5 rounded-xl">
                      <p className="text-sm text-zinc-400">
                        Availability: <span className="text-white font-medium">{profile.availability}</span>
                      </p>
                    </div>
                  )}
                </Card>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Skills</h2>
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-white/5 rounded-full text-sm text-zinc-300 border border-white/5"
                        >
                          <FaCode className="inline w-3 h-3 mr-1 text-violet-400" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-400">No skills listed</p>
                  )}
                  
                  {profile.languages && profile.languages.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((language) => (
                          <span
                            key={language}
                            className="px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-400 border border-blue-500/20"
                          >
                            <FaGlobe className="inline w-3 h-3 mr-1" />
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Portfolio Tab */}
              {activeTab === 'portfolio' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
                  {profile.portfolio && profile.portfolio.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.portfolio.map((item, index) => (
                        <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/5">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-zinc-400 mt-1">{item.description}</p>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-violet-400 text-sm hover:underline mt-2 inline-block">
                              View Project
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-400">No portfolio items</p>
                  )}
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <FaEnvelope className="w-4 h-4 text-violet-400" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.location && (
                    <div className="flex items-center gap-3 text-zinc-400">
                      <FaMapMarkerAlt className="w-4 h-4 text-violet-400" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.hourlyRate > 0 && (
                    <div className="flex items-center gap-3 text-zinc-400">
                      <FaDollarSign className="w-4 h-4 text-violet-400" />
                      <span>${profile.hourlyRate}/hour</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Social Links */}
              {(profile.github || profile.linkedin || profile.twitter || profile.website) && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                  <div className="flex gap-3 flex-wrap">
                    {profile.github && (
                      <a href={profile.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                        <FaGithub className="w-5 h-5 text-zinc-400 hover:text-white" />
                      </a>
                    )}
                    {profile.linkedin && (
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                        <FaLinkedin className="w-5 h-5 text-zinc-400 hover:text-white" />
                      </a>
                    )}
                    {profile.twitter && (
                      <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                        <FaTwitter className="w-5 h-5 text-zinc-400 hover:text-white" />
                      </a>
                    )}
                    {profile.website && (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                        <FaGlobe className="w-5 h-5 text-zinc-400 hover:text-white" />
                      </a>
                    )}
                  </div>
                </Card>
              )}

              {/* Hire Button */}
              {user?.role === 'client' && user?.id !== profile._id && (
                <Button className="w-full justify-center py-4" onClick={handleContact}>
                  <FaEnvelope className="w-4 h-4 mr-2" />
                  Hire {profile.name.split(' ')[0]}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default FreelancerProfilePage;