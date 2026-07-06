import { cn } from "../../../utils/cn";

const Heading = ({
  badge,
  title,
  subtitle,
  align = "center",
  className,
}) => {
  return (
    <div
      className={cn(
        "space-y-6",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className
      )}
    >
      {badge && (
        <span
          className="
          inline-flex
          rounded-full
          border
          border-violet-500/20
          bg-violet-500/10
          px-4
          py-2
          text-sm
          text-violet-300"
        >
          {badge}
        </span>
      )}

      <h2
        className="
        text-5xl
        font-bold
        tracking-tight
        lg:text-7xl"
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className="
          mx-auto
          max-w-2xl
          text-lg
          leading-8
          text-zinc-400"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Heading;