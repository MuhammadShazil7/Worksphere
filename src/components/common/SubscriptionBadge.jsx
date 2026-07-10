// src/components/common/SubscriptionBadge.jsx
import { FaCrown, FaStar, FaRocket, FaGem } from 'react-icons/fa';

const SubscriptionBadge = ({ plan, size = 'sm', showLabel = true }) => {
  const plans = {
    free: {
      label: 'Free',
      icon: null,
      color: 'text-zinc-400 bg-zinc-500/10',
      border: 'border-zinc-500/20'
    },
    starter: {
      label: 'Starter',
      icon: FaStar,
      color: 'text-blue-400 bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    professional: {
      label: 'Professional',
      icon: FaRocket,
      color: 'text-violet-400 bg-violet-500/10',
      border: 'border-violet-500/20'
    },
    enterprise: {
      label: 'Enterprise',
      icon: FaCrown,
      color: 'text-yellow-400 bg-yellow-500/10',
      border: 'border-yellow-500/20'
    }
  };

  const planInfo = plans[plan] || plans.free;
  const Icon = planInfo.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  // ✅ Only show if plan is NOT free
  if (plan === 'free') return null;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${planInfo.color} ${planInfo.border} ${sizeClasses[size]}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {showLabel && planInfo.label}
    </span>
  );
};

export default SubscriptionBadge;