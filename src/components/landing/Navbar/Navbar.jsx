// src/components/landing/Navbar/Navbar.jsx
import { useEffect, useState, useRef } from "react";
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
  FaCog,
  FaChevronDown,
  FaChevronRight,
  FaUserCog,
  FaClipboardList,
  FaFileAlt,
  FaHandshake,
  FaRocket,
  FaStar,
  FaBell,
  FaSearch,
  FaCreditCard,
  FaDollarSign
} from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';

import { useAuth } from "../../../context/AuthContext";
import Container from "../../ui/Container/Container";
import Logo from "../../common/Logo";
import SubscriptionBadge from "../../common/SubscriptionBadge";
import { navLinks } from "../../../constants/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.navbar-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

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

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleNavClick = () => {
    setIsOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };
  if (user?.role === 'admin') {
  links.push(
    { 
      id: 'admin', 
      label: 'Admin Panel', 
      path: '/admin', 
      icon: FaChartBar,
      description: 'Manage platform'
    }
  );
}
  

  const freelancerDropdownItems = [
    
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: FaChartBar,
      description: 'Overview of your activities'
    },
    { 
      id: 'earnings', 
      label: 'Earnings', 
      path: '/earnings', 
      icon: FaDollarSign,
      description: 'Track your payments'
    },
    { 
      id: 'my-proposals', 
      label: 'My Proposals', 
      path: '/my-proposals', 
      icon: FaPaperPlane,
      description: 'Track your applications'
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      path: '/messages', 
      icon: FaCommentDots,
      description: 'Chat with clients'
    },
    { 
      id: 'subscription', 
      label: 'Subscription', 
      path: '/subscription', 
      icon: FaCreditCard,
      description: 'Manage your plan'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      path: '/profile', 
      icon: FaUserCog,
      description: 'Manage your profile'
    },
  ];

  const clientDropdownItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: FaChartBar,
      description: 'Overview of your projects'
    },
    { 
      id: 'create-job', 
      label: 'Post a Job', 
      path: '/create-job', 
      icon: FaPlusCircle,
      description: 'Find the right talent'
    },
    { 
      id: 'my-jobs', 
      label: 'My Jobs', 
      path: '/my-jobs', 
      icon: FaList,
      description: 'Manage your listings'
    },
    { 
      id: 'client-proposals', 
      label: 'Proposals Received', 
      path: '/client-proposals', 
      icon: FaClipboardList,
      description: 'Review applications'
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      path: '/messages', 
      icon: FaCommentDots,
      description: 'Chat with freelancers'
    },
    { 
      id: 'subscription', 
      label: 'Subscription', 
      path: '/subscription', 
      icon: FaCreditCard,
      description: 'Manage your plan'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      path: '/profile', 
      icon: FaUserCog,
      description: 'Manage your profile'
    },
  ];

  const dropdownItems = user?.role === 'freelancer' ? freelancerDropdownItems : clientDropdownItems;

  return (
    <header className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? "py-2" : "py-4"
    }`}>
      <Container>
        <div className="navbar-container">
          <div
            className={`flex items-center justify-between rounded-2xl border transition-all duration-300
            ${
              isScrolled
                ? "border-white/10 bg-black/80 shadow-2xl shadow-violet-500/10 backdrop-blur-2xl"
                : "border-white/5 bg-white/5 backdrop-blur-xl"
            }
            px-3 sm:px-5 py-2 sm:py-3`}
          >
            <Logo />

            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-300 ${
                      isActive 
                        ? "text-white bg-white/10" 
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                      isProfileDropdownOpen
                        ? "bg-white/10 text-white"
                        : "hover:bg-white/5 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `<span class="text-xs font-bold text-white">${getInitials(user?.name)}</span>`;
                            }}
                          />
                        ) : (
                          <span className="text-xs font-bold text-white">
                            {getInitials(user?.name)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                        {user?.subscription?.plan && (
                          <SubscriptionBadge plan={user.subscription.plan} size="sm" />
                        )}
                      </div>
                    </div>
                    <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-violet-500/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {user?.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `<span class="text-sm font-bold text-white">${getInitials(user?.name)}</span>`;
                                }}
                              />
                            ) : (
                              <span className="text-sm font-bold text-white">
                                {getInitials(user?.name)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white truncate">{user.name}</p>
                              {user?.subscription?.plan && (
                                <SubscriptionBadge plan={user.subscription.plan} size="sm" />
                              )}
                            </div>
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
                      </div>

                      <div className="p-2">
                        {dropdownItems.map((item) => (
                          <NavLink
                            key={item.id}
                            to={item.path}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                                isActive
                                  ? "bg-violet-500/20 text-violet-400"
                                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
                              }`
                            }
                          >
                            <item.icon className="w-4 h-4 text-zinc-400" />
                            <div>
                              <p className="text-sm font-medium">{item.label}</p>
                              <p className="text-xs text-zinc-500">{item.description}</p>
                            </div>
                            <FaChevronRight className="w-3 h-3 ml-auto text-zinc-600" />
                          </NavLink>
                        ))}
                      </div>

                      <div className="border-t border-white/5 p-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition"
                        >
                          <FaSignOutAlt className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10 hover:border-white/20"
                  >
                    <FaSignInAlt className="inline w-4 h-4 mr-2" />
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25"
                  >
                    <FaUserPlus className="inline w-4 h-4 mr-2" />
                    Register
                  </button>
                </>
              )}
            </div>

            <button
              className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

          {isOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}

          <div
            className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-[#09090B] border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full p-5">
              <button
                onClick={() => setIsOpen(false)}
                className="self-end p-2 text-white hover:bg-white/5 rounded-lg transition"
                aria-label="Close menu"
              >
                <FaTimes size={22} />
              </button>

              {user && (
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<span class="text-lg font-bold text-white">${getInitials(user?.name)}</span>`;
                        }}
                      />
                    ) : (
                      <span className="text-lg font-bold text-white">
                        {getInitials(user?.name)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      {user?.subscription?.plan && (
                        <SubscriptionBadge plan={user.subscription.plan} size="sm" />
                      )}
                    </div>
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

              <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.id}
                    to={link.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-base font-medium transition-colors duration-300 ${
                        isActive
                          ? "bg-violet-500/10 text-violet-400"
                          : "text-zinc-300 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                
                {user && (
                  <>
                    <hr className="border-white/10 my-2" />
                    
                    <div className="text-xs text-zinc-500 px-4 py-2 font-medium uppercase tracking-wider">
                      {user.role === 'freelancer' ? 'Freelancer Menu' : 'Client Menu'}
                    </div>
                    
                    {dropdownItems.map((item) => (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          `px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-300 flex items-center gap-3 ${
                            isActive
                              ? "bg-violet-500/10 text-violet-400"
                              : "text-zinc-300 hover:bg-white/5 hover:text-white"
                          }`
                        }
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </NavLink>
                    ))}
                  </>
                )}
              </nav>

              <hr className="border-white/10 my-3" />

              <div className="space-y-2">
                {user ? (
                  <>
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