import { Button } from "../../ui";

const NavActions = () => {
  return (
    <div className="hidden items-center gap-3 lg:flex">
      <Button variant="ghost">
        Login
      </Button>

      <Button>
        Register
      </Button>
    </div>
  );
};

export default NavActions;