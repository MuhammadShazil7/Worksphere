const StatsCard = ({ title, value, icon }) => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-5
        backdrop-blur-xl
        transition
        hover:-translate-y-2
      "
    >
      <div className="text-3xl">{icon}</div>

      <h3 className="mt-4 text-3xl font-bold text-white">
        {value}
      </h3>

      <p className="mt-1 text-zinc-400">
        {title}
      </p>
    </div>
  );
};

export default StatsCard;