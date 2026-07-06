import { cn } from "../../../utils/cn";

const Section = ({ children, className }) => {
  return (
    <section
      className={cn(
        "py-20 lg:py-28",
        className
      )}
    >
      {children}
    </section>
  );
};

export default Section;