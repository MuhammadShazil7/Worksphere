const FloatingCard = ({ title, value, icon, className }) => {
  return (
    <div
      className={`
        absolute
        rounded-2xl
        border
        border-white/10
        bg-black/40
        backdrop-blur-xl
        px-5
        py-4
        shadow-xl
        ${className}
      `}
    >
      <div className="text-2xl">
        {icon}
      </div>

      <h4 className="mt-2 text-2xl font-bold text-white">
        {value}
      </h4>

      <p className="text-sm text-zinc-400">
        {title}
      </p>
    </div>
  );
};

export default FloatingCard;