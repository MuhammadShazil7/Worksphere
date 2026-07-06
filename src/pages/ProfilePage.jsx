// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaBriefcase,
  FaCode,
  FaGlobe,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaBuilding,
  FaUsers,
  FaIndustry
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    bio: '',
    location: '',
    hourlyRate: '',
    skills: [],
    experienceLevel: '',
    availability: '',
    languages: [],
    companyName: '',
    companyWebsite: '',
    industry: '',
    companySize: '',
    companyDescription: '',
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      const userData = response.data.user;
      setProfile(userData);
      setFormData({
        name: userData.name || '',
        headline: userData.headline || '',
        bio: userData.bio || '',
        location: userData.location || '',
        hourlyRate: userData.hourlyRate || '',
        skills: userData.skills || [],
        experienceLevel: userData.experienceLevel || 'Intermediate',
        availability: userData.availability || 'Available',
        languages: userData.languages || [],
        companyName: userData.companyName || '',
        companyWebsite: userData.companyWebsite || '',
        industry: userData.industry || '',
        companySize: userData.companySize || '',
        companyDescription: userData.companyDescription || '',
        github: userData.github || '',
        linkedin: userData.linkedin || '',
        twitter: userData.twitter || '',
        website: userData.website || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        ...formData,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : 0,
      };
      
      const response = await api.put('/auth/updateprofile', updateData);
      updateUser(response.data.user);
      setProfile(response.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully! 🎉');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
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

  const handleAddLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, languageInput.trim()]
      });
      setLanguageInput('');
    }
  };

  const handleRemoveLanguage = (language) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(l => l !== language)
    });
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const experienceLevels = ['Entry', 'Intermediate', 'Expert', 'Senior'];
  const availabilityOptions = ['Available', 'Not Available', 'Part-time'];
  const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Media', 'Other'];
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading profile...</p>
        </div>
      </Container>
    );
  }

  return (
    <section className="py-6 sm:py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
              <p className="text-zinc-400 text-sm sm:text-base">
                Manage your personal information
              </p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <FaEdit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }}
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} loading={saving}>
                  <FaSave className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Avatar & Basic Info */}
            <div className="lg:col-span-1">
              <Card className="p-6 text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mx-auto">
                  <span className="text-3xl sm:text-5xl font-bold text-white">
                    {getInitials(profile?.name)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mt-4">{profile?.name}</h2>
                <p className="text-zinc-400 text-sm">{profile?.headline || 'No headline'}</p>
                <div className="mt-4 space-y-2 text-sm text-zinc-400">
                  <div className="flex items-center justify-center gap-2">
                    <FaEnvelope className="w-4 h-4 text-violet-400" />
                    <span>{profile?.email}</span>
                  </div>
                  {profile?.location && (
                    <div className="flex items-center justify-center gap-2">
                      <FaMapMarkerAlt className="w-4 h-4 text-violet-400" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      profile?.role === 'freelancer' 
                        ? 'bg-violet-500/20 text-violet-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {profile?.role}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Stats */}
              <Card className="p-6 mt-6">
                <h3 className="font-semibold mb-3">Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Rating</span>
                    <span className="text-yellow-400">⭐ {profile?.rating || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Projects</span>
                    <span className="text-white">{profile?.totalProjects || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Completed</span>
                    <span className="text-green-400">{profile?.completedProjects || 0}</span>
                  </div>
                  {profile?.hourlyRate > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Hourly Rate</span>
                      <span className="text-green-400">${profile.hourlyRate}/hr</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column - Edit Form */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <Input
                      label="Headline / Title"
                      placeholder="e.g., Senior React Developer"
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    />

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Bio</label>
                      <textarea
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 min-h-[100px]"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Location"
                        placeholder="New York, NY or Remote"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                      <Input
                        label="Hourly Rate ($)"
                        type="number"
                        placeholder="75"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      />
                    </div>

                    {profile?.role === 'freelancer' && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                              Experience Level
                            </label>
                            <select
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              value={formData.experienceLevel}
                              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
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
                              value={formData.availability}
                              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                            >
                              {availabilityOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Skills */}
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">Skills</label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add skill..."
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                              className="flex-1"
                            />
                            <Button type="button" onClick={handleAddSkill}>
                              <FaPlus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.skills.map((skill) => (
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

                        {/* Languages */}
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">Languages</label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add language..."
                              value={languageInput}
                              onChange={(e) => setLanguageInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                              className="flex-1"
                            />
                            <Button type="button" onClick={handleAddLanguage}>
                              <FaPlus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.languages.map((language) => (
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
                      </>
                    )}

                    {profile?.role === 'client' && (
                      <>
                        <Input
                          label="Company Name"
                          placeholder="Your company name"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                        <Input
                          label="Company Website"
                          placeholder="https://yourcompany.com"
                          value={formData.companyWebsite}
                          onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Industry</label>
                            <select
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              value={formData.industry}
                              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            >
                              <option value="">Select industry</option>
                              {industries.map((industry) => (
                                <option key={industry} value={industry}>{industry}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Company Size</label>
                            <select
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              value={formData.companySize}
                              onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                            >
                              <option value="">Select size</option>
                              {companySizes.map((size) => (
                                <option key={size} value={size}>{size} employees</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">Company Description</label>
                          <textarea
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 min-h-[100px]"
                            value={formData.companyDescription}
                            onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                            placeholder="Describe your company..."
                          />
                        </div>
                      </>
                    )}

                    {/* Social Links */}
                    <h4 className="font-semibold mt-4">Social Links</h4>
                    <div className="space-y-3">
                      <Input
                        label="GitHub"
                        placeholder="https://github.com/username"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      />
                      <Input
                        label="LinkedIn"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      />
                      <Input
                        label="Twitter"
                        placeholder="https://twitter.com/username"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      />
                      <Input
                        label="Website"
                        placeholder="https://yourwebsite.com"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-6">
                    {profile?.headline && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400">Headline</h4>
                        <p className="text-white">{profile.headline}</p>
                      </div>
                    )}
                    
                    {profile?.bio && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400">Bio</h4>
                        <p className="text-white whitespace-pre-wrap">{profile.bio}</p>
                      </div>
                    )}

                    {profile?.role === 'freelancer' && (
                      <>
                        {profile.skills?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-zinc-400 mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {profile.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {profile.languages?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-zinc-400 mb-2">Languages</h4>
                            <div className="flex flex-wrap gap-2">
                              {profile.languages.map((language) => (
                                <span
                                  key={language}
                                  className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                                >
                                  {language}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {profile?.role === 'client' && profile?.companyName && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400">Company</h4>
                        <p className="text-white font-medium">{profile.companyName}</p>
                        {profile.industry && (
                          <p className="text-sm text-zinc-400">{profile.industry}</p>
                        )}
                      </div>
                    )}

                    {(profile?.github || profile?.linkedin || profile?.twitter || profile?.website) && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-2">Social Links</h4>
                        <div className="flex gap-3">
                          {profile.github && (
                            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition">
                              <FaGithub className="w-5 h-5" />
                            </a>
                          )}
                          {profile.linkedin && (
                            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition">
                              <FaLinkedin className="w-5 h-5" />
                            </a>
                          )}
                          {profile.twitter && (
                            <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition">
                              <FaTwitter className="w-5 h-5" />
                            </a>
                          )}
                          {profile.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition">
                              <FaGlobe className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default ProfilePage;