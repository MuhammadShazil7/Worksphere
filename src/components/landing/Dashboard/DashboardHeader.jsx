const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-zinc-400">
          Monthly Revenue
        </p>

        <h2 className="mt-2 text-4xl font-bold text-white">
          $24,580
        </h2>
      </div>

      <div className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400">
        +18.6%
      </div>
    </div>
  );
};

export default DashboardHeader;