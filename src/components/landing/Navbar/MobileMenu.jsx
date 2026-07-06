import { Menu } from "lucide-react";

const MobileMenu = () => {
  return (
    <button className="lg:hidden text-white">
      <Menu size={28} />
    </button>
  );
};

export default MobileMenu;