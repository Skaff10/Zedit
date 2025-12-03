import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (boardName: string) => void;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [boardName, setBoardName] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(boardName);
    // Reset form
    setBoardName("");
    setCollaborators("");
    setIsPrivate(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 pointer-events-auto mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Create Workspace
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder="e.g., Q4 Marketing"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invite Collaborators
                  </label>
                  <input
                    type="text"
                    value={collaborators}
                    onChange={(e) => setCollaborators(e.target.value)}
                    placeholder="Enter emails..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">
                    {isPrivate ? "Private" : "Team Visible"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      isPrivate ? "bg-gray-300" : "bg-blue-500"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        isPrivate ? "translate-x-0" : "translate-x-6"
                      }`}
                    />
                  </button>
                </div>

                <button
                  type="submit"
                  className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
                >
                  Create Board
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
