import { motion } from "framer-motion";
import RevenueChart from "../Dashboard/RevenueChart";
import ProjectList from "../Dashboard/ProjectList";

const DashboardWindow = () => {
  return (
    <motion.div
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-8
        backdrop-blur-2xl
        shadow-2xl
        shadow-violet-900/20
      "
    >
      {/* Header */}
      <motion.div className="flex items-center justify-between">
        <motion.div>
          <p className="text-sm text-zinc-400">
            Total Revenue
          </p>

          <h2 className="mt-2 text-5xl font-bold text-white">
            $24,580
          </h2>
        </motion.div>

        <motion.div className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400">
          +18%
        </motion.div>
      </motion.div>

      <RevenueChart />

      <h3 className="mt-10 text-lg font-semibold text-white">
        Recent Projects
      </h3>

      <ProjectList />
    </motion.div>
  );
};

export default DashboardWindow;