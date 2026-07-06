// src/pages/FreelancersPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaUser, 
  FaMapMarkerAlt, 
  FaStar, 
  FaBriefcase,
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import api from '../services/api';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/input';

const FreelancersPage = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    skills: [],
    minRating: '',
    maxRate: '',
    location: '',
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have a /freelancers endpoint
      // For now, we'll use the users endpoint with role filter
      const response = await api.get('/users?role=freelancer');
      setFreelancers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch freelancers:', error);
      // Fallback to mock data if API fails
      setFreelancers(mockFreelancers);
      toast.error('Failed to load freelancers');
    } finally {
      setLoading(false);
    }
  };

  // Mock data as fallback
  const mockFreelancers = [
    {
      _id: '1',
      name: 'Alice Johnson',
      headline: 'Senior React Developer',
      location: 'Remote',
      rating: 4.9,
      totalProjects: 47,
      skills: ['React', 'Node.js', 'TypeScript', 'GraphQL'],
      hourlyRate: 75,
      avatar: null,
    },
    {
      _id: '2',
      name: 'Bob Smith',
      headline: 'UI/UX Designer',
      location: 'New York, NY',
      rating: 4.8,
      totalProjects: 32,
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      hourlyRate: 65,
      avatar: null,
    },
    {
      _id: '3',
      name: 'Carol Davis',
      headline: 'Full Stack Developer',
      location: 'San Francisco, CA',
      rating: 4.9,
      totalProjects: 53,
      skills: ['Python', 'Django', 'React', 'AWS', 'Docker'],
      hourlyRate: 85,
      avatar: null,
    },
    {
      _id: '4',
      name: 'David Wilson',
      headline: 'Mobile App Developer',
      location: 'Remote',
      rating: 4.7,
      totalProjects: 28,
      skills: ['React Native', 'Flutter', 'iOS', 'Android'],
      hourlyRate: 70,
      avatar: null,
    },
    {
      _id: '5',
      name: 'Emma Brown',
      headline: 'DevOps Engineer',
      location: 'Austin, TX',
      rating: 4.9,
      totalProjects: 39,
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
      hourlyRate: 90,
      avatar: null,
    },
  ];

  const handleAddSkill = () => {
    if (skillInput.trim() && !filters.skills.includes(skillInput.trim())) {
      setFilters({
        ...filters,
        skills: [...filters.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFilters({
      ...filters,
      skills: filters.skills.filter(s => s !== skill)
    });
  };

  const clearFilters = () => {
    setFilters({
      skills: [],
      minRating: '',
      maxRate: '',
      location: '',
    });
    setSearchTerm('');
  };

  const filteredFreelancers = freelancers.filter((freelancer) => {
    // Search filter
    const matchesSearch = 
      freelancer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.skills?.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Skills filter
    const matchesSkills = filters.skills.length === 0 || 
      filters.skills.every(skill => 
        freelancer.skills?.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );

    // Rating filter
    const matchesRating = !filters.minRating || 
      (freelancer.rating || 0) >= parseFloat(filters.minRating);

    // Rate filter
    const matchesRate = !filters.maxRate || 
      (freelancer.hourlyRate || 0) <= parseFloat(filters.maxRate);

    // Location filter
    const matchesLocation = !filters.location || 
      freelancer.location?.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesSkills && matchesRating && 
           matchesRate && matchesLocation;
  });

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
            className={`w-4 h-4 ${
              i < fullStars ? 'text-yellow-400 fill-yellow-400' :
              i === fullStars && hasHalfStar ? 'text-yellow-400 fill-yellow-400 opacity-50' :
              'text-zinc-600'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-zinc-400">({rating || 0})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-12">
        <Container>
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
            <p className="mt-4 text-zinc-400">Loading freelancers...</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-12">
      <Container>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Find Freelancers</h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            Connect with top talent from around the world
          </p>
          <p className="text-sm text-zinc-500 mt-1">
            Found {filteredFreelancers.length} freelancer(s)
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name, skills, or title..."
              icon={<FaSearch className="w-5 h-5" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="secondary" 
            icon={<FaFilter className="w-4 h-4" />}
            onClick={() => setShowFilters(!showFilters)}
            className="flex-shrink-0"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {(filters.skills.length > 0 || filters.minRating || filters.maxRate || filters.location) && (
              <span className="ml-2 w-2 h-2 bg-violet-500 rounded-full inline-block" />
            )}
          </Button>
          {(searchTerm || filters.skills.length > 0 || filters.minRating || filters.maxRate || filters.location) && (
            <Button variant="ghost" onClick={clearFilters} className="flex-shrink-0">
              Clear All
            </Button>
          )}
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <Card className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Skills Filter */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Skills
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add skill..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        className="flex-1"
                      />
                      <Button type="button" onClick={handleAddSkill} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {filters.skills.map((skill) => (
                        <span
                          key={skill}
                          className="flex items-center gap-1 px-2 py-1 bg-violet-500/20 text-violet-400 rounded-full text-xs"
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

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Minimum Rating
                    </label>
                    <select
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      value={filters.minRating}
                      onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>

                  {/* Rate Filter */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Max Hourly Rate
                    </label>
                    <select
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      value={filters.maxRate}
                      onChange={(e) => setFilters({ ...filters, maxRate: e.target.value })}
                    >
                      <option value="">Any Rate</option>
                      <option value="50">$50/hr</option>
                      <option value="75">$75/hr</option>
                      <option value="100">$100/hr</option>
                      <option value="150">$150/hr</option>
                      <option value="200">$200/hr</option>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Location
                    </label>
                    <Input
                      placeholder="City or Remote"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Freelancer Listings */}
        {filteredFreelancers.length === 0 ? (
          <div className="text-center py-20">
            <FaUser className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No freelancers found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-violet-400 hover:text-violet-300 transition"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredFreelancers.map((freelancer, index) => (
              <motion.div
                key={freelancer._id || freelancer.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 sm:p-6 hover:border-white/20 transition">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                        {freelancer.avatar ? (
                          <img 
                            src={freelancer.avatar} 
                            alt={freelancer.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg sm:text-xl font-bold text-white">
                            {getInitials(freelancer.name)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold">{freelancer.name}</h3>
                          <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 rounded-full">
                            Available
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm">{freelancer.headline || 'Freelancer'}</p>
                        
                        <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 text-sm text-zinc-400">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="w-4 h-4 flex-shrink-0" />
                            {freelancer.location || 'Remote'}
                          </span>
                          <span className="flex items-center gap-1">
                            {renderStars(freelancer.rating || 0)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaBriefcase className="w-4 h-4 flex-shrink-0" />
                            {freelancer.totalProjects || 0} projects
                          </span>
                          {freelancer.hourlyRate && (
                            <span className="text-green-400 font-medium">
                              ${freelancer.hourlyRate}/hr
                            </span>
                          )}
                        </div>
                        
                        {freelancer.skills && freelancer.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                            {freelancer.skills.slice(0, 5).map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 text-xs bg-white/5 rounded-full text-zinc-300"
                              >
                                {skill}
                              </span>
                            ))}
                            {freelancer.skills.length > 5 && (
                              <span className="px-2 py-1 text-xs bg-white/5 rounded-full text-zinc-500">
                                +{freelancer.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link to={`/freelancers/${freelancer._id || freelancer.id}`}>
                        <Button size="sm" className="whitespace-nowrap">
                          View Profile
                        </Button>
                      </Link>
                    </div>
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

export default FreelancersPage;