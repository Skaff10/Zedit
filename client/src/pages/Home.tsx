import React from "react";
import { Sidebar } from "../components/Sidebar";
import { Board } from "../components/Board";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {


  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message, register, login, logout, reset } =
    useAuthStore();


  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (!user) {
      navigate("/login");
    }

    reset();
  }, [user, isError, isSuccess, message, navigate, reset]);

  return (
    
    <div className="flex min-h-screen bg-z-gray">
      <Sidebar />
      <div className="flex-1 flex ml-16">
        <Board />
    
      </div>
    </div>
  );
};
