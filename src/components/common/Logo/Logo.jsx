// src/components/common/Logo.jsx
import { Link } from 'react-router-dom';
import { FaBriefcase } from 'react-icons/fa';

const Logo = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg blur-lg opacity-70" />
        <FaBriefcase className="relative w-8 h-8 text-white" />
      </div>
      <span className="text-xl font-bold">
        Work<span className="gradient-text">Sphere</span>
      </span>
    </Link>
  );
};

export default Logo;