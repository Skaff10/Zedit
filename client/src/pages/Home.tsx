import React from "react";
import { Sidebar } from "../components/Sidebar";
import { Board } from "../components/Board";

export const Home: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-z-gray">
      <Sidebar />
      <div className="flex-1 flex ml-16">
        <Board />
    
      </div>
    </div>
  );
};
