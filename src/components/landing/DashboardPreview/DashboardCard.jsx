const DashboardCard = () => {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-8
        backdrop-blur-xl
      "
    >
      <div className="flex justify-between">
        <div>
          <p className="text-zinc-400">
            Total Earnings
          </p>

          <h2 className="mt-2 text-5xl font-bold text-white">
            $24,580
          </h2>
        </div>

        <div className="rounded-xl bg-green-500/20 px-4 py-2 text-green-400">
          +18%
        </div>
      </div>

      <div className="mt-10 h-48 rounded-2xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20" />
    </div>
  );
};

export default DashboardCard;