import { LuLayoutDashboard as HomeIcon } from "react-icons/lu";
import { HiUsers as UsersIcon } from "react-icons/hi";
import { FaFolder as FolderIcon } from "react-icons/fa";
import { LuSettings as SettingsIcon } from "react-icons/lu";
import logo from "/logo.png";
import { useNavigate } from "react-router-dom";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-16 bg-z-dark h-screen flex flex-col items-center py-6 border-r border-gray-800 fixed left-0 top-0 z-50">
      <div className="mb-8">
        <img src={logo} alt="" />
      </div>

      <nav className="flex flex-col gap-6 w-full items-center ">
        <NavItem active icon={<HomeIcon onClick={() => navigate("/")} />} />
        <NavItem icon={<UsersIcon onClick={() => navigate("/users")} />} />
        <NavItem icon={<FolderIcon onClick={() => navigate("/folders")} />} />
        <NavItem
          icon={<SettingsIcon onClick={() => navigate("/settings")} />}
        />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; active?: boolean }> = ({
  icon,
  active,
}) => {
  return (
    <button
      className={`p-2 rounded-lg transition-colors cursor-pointer ${
        active
          ? "bg-gray-800 text-white"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      {icon}
    </button>
  );
};
