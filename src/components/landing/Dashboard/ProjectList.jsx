import { projects } from "./dashboardData";

const statusColor = {
  Completed: "bg-emerald-500/20 text-emerald-400",
  "In Progress": "bg-blue-500/20 text-blue-400",
  Pending: "bg-yellow-500/20 text-yellow-400",
};

const ProjectList = () => {
  return (
    <div className="mt-10 space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div>
            <h4 className="font-semibold text-white">
              {project.title}
            </h4>

            <p className="text-sm text-zinc-400">
              {project.client}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[project.status]}`}
          >
            {project.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;