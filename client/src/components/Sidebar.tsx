import { LuLayoutDashboard as HomeIcon } from "react-icons/lu";
import { HiUsers as UsersIcon } from "react-icons/hi";
import { FaFolder as FolderIcon } from "react-icons/fa";
import { LuSettings as SettingsIcon } from "react-icons/lu";
import logo from "/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-16 bg-z-dark dark:bg-[#7f1d1d] h-screen flex flex-col items-center py-6 border-r border-gray-800 dark:border-red-900 fixed left-0 top-0 z-50 transition-colors duration-300">
      <div className="mb-8 cursor-pointer" onClick={() => navigate("/")}>
        <img src={logo} alt="" />
      </div>

      <nav className="flex flex-col gap-6 w-full items-center ">
        <NavItem
          active={isActive("/")}
          onClick={() => navigate("/")}
          icon={<HomeIcon />}
        />
        <NavItem
          active={isActive("/users")}
          onClick={() => navigate("/users")}
          icon={<UsersIcon />}
        />
        <NavItem
          active={isActive("/folders")}
          onClick={() => navigate("/folders")}
          icon={<FolderIcon />}
        />
        <NavItem
          active={isActive("/settings")}
          onClick={() => navigate("/settings")}
          icon={<SettingsIcon />}
        />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}> = ({ icon, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors cursor-pointer ${
        active
          ? "bg-gray-800 text-white shadow-md border border-gray-700"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      {icon}
    </button>
  );
};
