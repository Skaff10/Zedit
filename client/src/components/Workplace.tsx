import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useBoardStore } from "../store/boardStore";
import { useDocStore } from "../store/docStore";
import { FaFolderOpen, FaPlus, FaChevronRight } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";

interface BoardWithDocs {
  board: {
    _id: string;
    name: string;
    createdAt: string;
  };
  docs: Array<{
    _id: string;
    title: string;
    status: string;
    lastModified: string;
  }>;
}

export const Workplace: React.FC = () => {
  const navigate = useNavigate();
  const {
    boards,
    getUserBoards,
    createBoard,
    isLoading: boardsLoading,
  } = useBoardStore();
  const { documents, getUserDocuments } = useDocStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  useEffect(() => {
    getUserBoards();
    getUserDocuments();
  }, [getUserBoards, getUserDocuments]);

  // Group documents by board
  const boardsWithDocs: BoardWithDocs[] = boards.map((board) => ({
    board: {
      _id: board._id,
      name: board.name,
      createdAt: board.createdAt,
    },
    docs: documents.filter(
      (doc: any) => doc.boardId === board._id || doc.board === board._id
    ),
  }));

  // Docs without a board (orphaned)
  const orphanedDocs = documents.filter(
    (doc: any) => !doc.boardId && !doc.board
  );

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleSelectBoard = async () => {
    if (selectedBoardId) {
      // Navigate to focus editor with selected board
      navigate(`/focus?boardId=${selectedBoardId}`);
      setShowCreateModal(false);
    } else if (newBoardName.trim()) {
      // Create new board first
      const existingBoard = boards.find(
        (b) => b.name.toLowerCase() === newBoardName.toLowerCase()
      );
      if (existingBoard) {
        // Board exists, use it
        navigate(`/focus?boardId=${existingBoard._id}`);
      } else {
        // Create new board
        const newBoard = await createBoard({ name: newBoardName });
        if (newBoard) {
          navigate(`/focus?boardId=${newBoard._id}`);
        }
      }
      setShowCreateModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "review":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "published":
      case "stable":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-z-text dark:text-white">
            Workplace
          </h1>
          <p className="text-z-text-secondary dark:text-neutral-400 text-sm mt-1">
            All your Zedits in one place
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-z-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FaPlus size={14} />
          New Zedit
        </button>
      </div>

      {/* Boards Grid */}
      {boardsLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {boardsWithDocs.map(({ board, docs }) => (
            <motion.div
              key={board._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#171717] rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden"
            >
              {/* Board Header */}
              <div
                onClick={() => navigate(`/board/${board._id}`)}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-z-blue/5 to-transparent dark:from-red-900/10 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaFolderOpen className="text-z-blue dark:text-red-400 text-xl" />
                  <div>
                    <h2 className="font-semibold text-z-text dark:text-white">
                      {board.name}
                    </h2>
                    <span className="text-xs text-gray-400">
                      {docs.length} document{docs.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <FaChevronRight className="text-gray-400" />
              </div>

              {/* Documents in Board */}
              {docs.length > 0 && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3">
                    {docs.slice(0, 4).map((doc) => (
                      <motion.div
                        key={doc._id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(`/focus/${doc._id}`)}
                        className="p-3 bg-gray-50 dark:bg-neutral-900 rounded-xl cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-z-blue/30"
                      >
                        <div className="flex items-start gap-2">
                          <HiOutlineDocumentText className="text-gray-400 mt-1 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-z-text dark:text-white truncate">
                              {doc.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(
                                  doc.status
                                )}`}
                              >
                                {doc.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {docs.length > 4 && (
                      <div
                        onClick={() => navigate(`/board/${board._id}`)}
                        className="p-3 bg-gray-50 dark:bg-neutral-900 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center text-gray-500 text-sm"
                      >
                        +{docs.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Orphaned Documents (no board) */}
          {orphanedDocs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#171717] rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-800/50">
                <HiOutlineDocumentText className="text-gray-400 text-xl" />
                <div>
                  <h2 className="font-semibold text-z-text dark:text-white">
                    Unsorted Documents
                  </h2>
                  <span className="text-xs text-gray-400">
                    {orphanedDocs.length} document
                    {orphanedDocs.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div className="p-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3">
                  {orphanedDocs.map((doc: any) => (
                    <motion.div
                      key={doc._id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate(`/focus/${doc._id}`)}
                      className="p-3 bg-gray-50 dark:bg-neutral-900 rounded-xl cursor-pointer hover:shadow-md transition-all"
                    >
                      <h4 className="font-medium text-sm text-z-text dark:text-white truncate">
                        {doc.title}
                      </h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${getStatusColor(
                          doc.status
                        )}`}
                      >
                        {doc.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {boards.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#171717] rounded-2xl border-2 border-dashed border-gray-200 dark:border-neutral-700">
              <FaFolderOpen className="text-5xl text-gray-300 dark:text-neutral-600 mb-4" />
              <h3 className="text-lg font-medium text-z-text dark:text-white mb-2">
                No boards yet
              </h3>
              <p className="text-z-text-secondary dark:text-neutral-400 text-sm mb-4">
                Create your first document to get started
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-z-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Create Document
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Document Modal - Select Board */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#171717] rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-xl font-bold text-z-text dark:text-white mb-4">
                Create New Document
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400 mb-4">
                Select an existing board or create a new one
              </p>

              {/* Board Selection */}
              {boards.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Board
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {boards.map((board) => (
                      <button
                        key={board._id}
                        onClick={() => {
                          setSelectedBoardId(board._id);
                          setNewBoardName("");
                        }}
                        className={`p-3 rounded-lg text-left text-sm transition-all ${
                          selectedBoardId === board._id
                            ? "bg-z-blue text-white"
                            : "bg-gray-100 dark:bg-neutral-800 text-z-text dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700"
                        }`}
                      >
                        <FaFolderOpen className="inline mr-2" />
                        {board.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Or Create New */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or create a new board
                </label>
                <input
                  type="text"
                  placeholder="Enter board name..."
                  value={newBoardName}
                  onChange={(e) => {
                    setNewBoardName(e.target.value);
                    setSelectedBoardId(null);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-z-blue text-z-text dark:text-white"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSelectBoard}
                  disabled={!selectedBoardId && !newBoardName.trim()}
                  className="flex-1 py-2 rounded-lg bg-z-blue text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Workplace;
