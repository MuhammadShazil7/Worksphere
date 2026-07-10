// src/components/common/PremiumBadge.jsx
import { FaCheckCircle } from 'react-icons/fa';

const PremiumBadge = ({ type = 'pro', size = 'sm' }) => {
  const types = {
    pro: {
      label: 'PRO',
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20'
    },
    enterprise: {
      label: 'ENTERPRISE',
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    }
  };

  const info = types[type] || types.pro;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${info.color} ${sizeClasses[size]}`}>
      <FaCheckCircle className="w-3 h-3" />
      {info.label}
    </span>
  );
};

export default PremiumBadge;