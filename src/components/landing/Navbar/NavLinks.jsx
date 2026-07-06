import { NavLink } from "react-router-dom";
import { navLinks } from "../../../constants/navigation";

const NavLinks = () => {
  return (
    <div className="hidden items-center gap-8 lg:flex">
      {navLinks.map((link) => (
        <NavLink
          key={link.title}
          to={link.path}
          className={({ isActive }) =>
            `relative text-sm font-medium transition-colors ${
              isActive
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            }`
          }
        >
          {link.title}
        </NavLink>
      ))}
    </div>
  );
};

export default NavLinks;