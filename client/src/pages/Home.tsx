import React from "react";
import { Sidebar } from "../components/Sidebar";
import { Workplace } from "../components/Workplace";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isError, message, reset } = useAuthStore();

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (!user) {
      navigate("/login");
    }

    reset();
  }, [user, isError, message, navigate, reset]);

  return (
    <div className="flex min-h-screen bg-z-gray dark:bg-[#0a0a0a] transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex ml-16">
        <Workplace />
      </div>
    </div>
  );
};
