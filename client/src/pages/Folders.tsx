import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useBoardStore } from "../store/boardStore";
import { useAuthStore } from "../store/authStore";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import { HiOutlineViewBoards } from "react-icons/hi";
import { IoLockClosed, IoGlobe } from "react-icons/io5";

export const Folders: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { boards, getUserBoards, isLoading } = useBoardStore();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      getUserBoards();
    }
  }, [user, navigate, getUserBoards]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-z-gray dark:bg-[#0a0a0a] transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 ml-16 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-z-text dark:text-white">
              My Z-Boards
            </h1>
            <p className="text-z-text-secondary dark:text-neutral-400 text-sm mt-1">
              All your Z-Boards in one place
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-z-text-secondary">
              {boards.length} {boards.length === 1 ? "board" : "boards"}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-z-blue/20"></div>
              <span className="text-z-text-secondary">
                Loading your boards...
              </span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && boards.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#171717] rounded-2xl border-2 border-dashed border-gray-200 dark:border-neutral-700"
          >
            <FaFolder className="text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-z-text dark:text-white mb-2">
              No boards yet
            </h3>
            <p className="text-z-text-secondary dark:text-neutral-400 text-sm mb-4">
              Create your first board to get started
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-z-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}

        {/* Boards Grid */}
        {!isLoading && boards.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
          >
            {boards.map((board) => (
              <motion.div
                key={board._id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/board/${board._id}`)}
                className="group bg-white dark:bg-[#171717] rounded-xl p-5 border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Decorative gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-z-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Folder Icon */}
                <div className="relative mb-4 flex items-center justify-between">
                  <FaFolderOpen className="text-4xl text-z-blue group-hover:scale-110 transition-transform" />
                  {board.isPrivate ? (
                    <IoLockClosed className="text-gray-400" title="Private" />
                  ) : (
                    <IoGlobe className="text-green-500" title="Team Visible" />
                  )}
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="font-semibold text-z-text dark:text-white mb-2 truncate group-hover:text-z-blue transition-colors">
                    {board.name || "Untitled Board"}
                  </h3>

                  {/* Board Icon Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <HiOutlineViewBoards className="text-z-blue/60" />
                    <span className="text-xs text-gray-500">Zboard</span>
                  </div>

                  {/* Created Date */}
                  <p className="text-xs text-gray-400">
                    Created{" "}
                    {new Date(board.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Hover indicator line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-z-blue to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
