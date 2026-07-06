// src/components/landing/Navbar/Navbar.jsx
import { useEffect, useState } from "react";
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaBriefcase, 
  FaPaperPlane, 
  FaCommentDots,
  FaHome,
  FaUsers,
  FaTags,
  FaEnvelope,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaChartBar,
  FaPlusCircle,
  FaList,
  FaCog
} from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';

import { useAuth } from "../../../context/AuthContext";
import Container from "../../ui/Container/Container";
import Logo from "../../common/Logo";
import { navLinks } from "../../../constants/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.navbar-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsOpen(false);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  // Role-based navigation links
  const getRoleLinks = () => {
    if (!user) return [];
    
    const links = [];
    
    if (user.role === 'freelancer') {
      links.push(
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: FaChartBar },
        { id: 'my-proposals', label: 'My Proposals', path: '/my-proposals', icon: FaPaperPlane },
        { id: 'messages', label: 'Messages', path: '/messages', icon: FaCommentDots },
        { id: 'profile', label: 'Profile', path: '/profile', icon: FaUser }
      );
    } else if (user.role === 'client') {
      links.push(
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: FaChartBar },
        { id: 'create-job', label: 'Post Job', path: '/create-job', icon: FaPlusCircle },
        { id: 'my-jobs', label: 'My Jobs', path: '/my-jobs', icon: FaList },
        { id: 'messages', label: 'Messages', path: '/messages', icon: FaCommentDots },
        { id: 'profile', label: 'Profile', path: '/profile', icon: FaUser }
      );
    }
    
    return links;
  };

  const roleLinks = getRoleLinks();
  const isActiveLink = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? "py-3" : "py-5"
    }`}>
      <Container>
        <div className="navbar-container">
          <div
            className={`flex items-center justify-between rounded-2xl border transition-all duration-300
            ${
              isScrolled
                ? "border-white/10 bg-black/60 shadow-2xl shadow-violet-500/10 backdrop-blur-2xl"
                : "border-white/5 bg-white/5 backdrop-blur-xl"
            }
            px-4 sm:px-6 py-3 sm:py-4`}
          >
            <Logo />

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative text-sm font-medium transition-colors duration-300 ${
                      isActive ? "text-white" : "text-zinc-400 hover:text-white"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              
              {/* Role-based links */}
              {roleLinks.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative text-sm font-medium transition-colors duration-300 ${
                      isActive ? "text-white" : "text-zinc-400 hover:text-white"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Role Badge */}
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    user.role === 'freelancer' 
                      ? 'bg-violet-500/20 text-violet-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                  
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm text-white max-w-[100px] truncate">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10 hover:border-white/20"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="rounded-xl border border-white/10 px-4 sm:px-5 py-2 text-sm text-white transition hover:bg-white/10 hover:border-white/20"
                  >
                    <FaSignInAlt className="inline w-4 h-4 mr-2" />
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 sm:px-5 py-2 text-sm font-semibold text-white transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25"
                  >
                    <FaUserPlus className="inline w-4 h-4 mr-2" />
                    Register
                  </button>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Mobile Menu */}
          <div
            className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-[#09090B] border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full p-6">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="self-end p-2 text-white hover:bg-white/5 rounded-lg transition"
                aria-label="Close menu"
              >
                <FaTimes size={24} />
              </button>

              {/* User info at top of mobile menu */}
              {user && (
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-white">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.role === 'freelancer' 
                        ? 'bg-violet-500/20 text-violet-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
                {/* Main nav links */}
                {navLinks.map((link) => (
                  <NavLink
                    key={link.id}
                    to={link.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-base font-medium transition-colors duration-300 flex items-center gap-3 ${
                        isActive
                          ? "bg-violet-500/10 text-violet-400"
                          : "text-zinc-300 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                
                <hr className="border-white/10 my-2" />
                
                {/* Role-based links in mobile */}
                {roleLinks.map((link) => (
                  <NavLink
                    key={link.id}
                    to={link.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-base font-medium transition-colors duration-300 flex items-center gap-3 ${
                        isActive
                          ? "bg-violet-500/10 text-violet-400"
                          : "text-zinc-300 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <hr className="border-white/10 my-4" />

              {/* Mobile Action Buttons */}
              <div className="space-y-3">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsOpen(false);
                      }}
                      className="w-full rounded-xl border border-white/10 py-3 text-white transition hover:bg-white/10 hover:border-white/20 flex items-center justify-center gap-2"
                    >
                      <FaCog className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-xl border border-white/10 py-3 text-white transition hover:bg-white/10 hover:border-white/20 flex items-center justify-center gap-2"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsOpen(false);
                      }}
                      className="w-full rounded-xl border border-white/10 py-3 text-white transition hover:bg-white/10 hover:border-white/20 flex items-center justify-center gap-2"
                    >
                      <FaSignInAlt className="w-4 h-4" />
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setIsOpen(false);
                      }}
                      className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 font-semibold text-white transition hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <FaUserPlus className="w-4 h-4" />
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;