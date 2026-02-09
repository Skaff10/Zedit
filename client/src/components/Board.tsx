import React, { useEffect } from "react";
import { CreateBoardModal } from "./CreateBoardModal";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDocStore } from "../store/docStore";

export const Board: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [boardKey, setBoardKey] = React.useState(0);
  const { documents, getUserDocuments, updateDocument } = useDocStore();

  useEffect(() => {
    getUserDocuments();
  }, [getUserDocuments]);

  const handleCreateBoard = (boardName: string) => {
    console.log("Creating board:", boardName);
    setIsModalOpen(false);
    setTimeout(() => setBoardKey((prev) => prev + 1), 3000);
  };

  const handleDragEnd = async (docId: string, info: any) => {
    const x = info.point.x;
    // Simple improved heuristic for column detection based on screen width shares
    // This assumes 3 generic columns. A more robust solution uses DOM refs.
    const screenWidth = window.innerWidth;
    const colWidth = screenWidth / 3;

    let newStatus = "";
    if (x < colWidth) newStatus = "draft";
    else if (x < colWidth * 2) newStatus = "review";
    else newStatus = "published"; // or stable

    if (newStatus) {
      await updateDocument(docId, { status: newStatus });
      getUserDocuments(); // Refresh to ensure UI sync
    }
  };

  const drafts = documents.filter((d) => d.status === "draft");
  const inReview = documents.filter((d) => d.status === "review");
  const published = documents.filter(
    (d) => d.status === "published" || d.status === "stable",
  );

  return (
    <div className="flex-1 p-8 overflow-x-hidden relative h-[calc(100vh-4rem)]">
      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateBoard}
      />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-z-text dark:text-white">
          Z-Board
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-z-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>+</span> New Board
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={boardKey}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 25 }}
          className="flex gap-6 h-full min-w-[800px] overflow-x-auto"
        >
          <Column title="Drafts" status="draft" onDrop={handleDragEnd}>
            <NewZeditCard />
            {drafts.map((doc) => (
              <ProjectCard key={doc._id} doc={doc} onDragEnd={handleDragEnd} />
            ))}
          </Column>

          <Column title="In Review" status="review" onDrop={handleDragEnd}>
            {inReview.map((doc) => (
              <ProjectCard key={doc._id} doc={doc} onDragEnd={handleDragEnd} />
            ))}
          </Column>

          <Column title="Published" status="published" onDrop={handleDragEnd}>
            {published.map((doc) => (
              <ProjectCard key={doc._id} doc={doc} onDragEnd={handleDragEnd} />
            ))}
          </Column>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Column: React.FC<{
  title: string;
  status: string;
  children: React.ReactNode;
  onDrop: (id: string, info: any) => void;
}> = ({ title, children }) => {
  return (
    <div className="flex-1 flex flex-col min-w-[300px] bg-gray-50/50 dark:bg-[#171717] rounded-xl p-4 border border-gray-100 dark:border-neutral-800">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-semibold text-z-text dark:text-neutral-100">
          {title}
        </h3>
        <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
          •••
        </button>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4 flex-1">
        {children}
      </div>
    </div>
  );
};

const NewZeditCard = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      layoutId="focus-editor-new"
      onClick={() => navigate("/focus")}
      className="h-32 w-full border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-xl flex flex-col items-center justify-center text-gray-400 dark:text-neutral-500 hover:border-z-blue hover:text-z-blue hover:bg-blue-50 dark:hover:bg-red-900/20 transition-colors group cursor-pointer bg-white dark:bg-[#171717] shrink-0"
    >
      <motion.span
        layoutId="focus-editor-plus"
        className="text-2xl mb-1 group-hover:scale-110 transition-transform"
      >
        +
      </motion.span>
      <motion.span layoutId="focus-editor-text" className="font-medium">
        Create New Zedit
      </motion.span>
    </motion.button>
  );
};

const ProjectCard: React.FC<{
  doc: any;
  onDragEnd: (id: string, info: any) => void;
}> = ({ doc, onDragEnd }) => {
  const controls = useDragControls();
  const navigate = useNavigate();
  const isPublished = doc.status === "published" || doc.status === "stable";

  return (
    <motion.div
      layoutId={`focus-editor-${doc._id}`}
      drag={!isPublished}
      dragControls={controls}
      dragListener={!isPublished}
      dragConstraints={{ top: 0, bottom: 0, left: -500, right: 500 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.05, zIndex: 100, rotate: 2 }}
      onDragEnd={(_e, info) => onDragEnd(doc._id, info)}
      onTap={() => {
        console.log("Card tapped, navigating to:", doc._id);
        navigate("/focus/" + doc._id);
      }}
      className={`bg-white dark:bg-[#171717] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-shadow cursor-pointer shrink-0 ${
        isPublished ? "opacity-90" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-z-text dark:text-neutral-100 mb-3 truncate max-w-[80%]">
          {doc.title}
        </h4>
      </div>

      {isPublished ? (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            ✓
          </div>
          <span className="text-xs text-green-600 font-medium">Published</span>
        </div>
      ) : (
        <div className="flex -space-x-2 mb-3">
          {/* Mock authors for now as API might not return full populated paths yet */}
          <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 text-[10px] flex items-center justify-center font-bold text-blue-600">
            {doc.owner?.name?.[0] || "U"}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400">
        Updated • {new Date(doc.lastModified).toLocaleDateString()}
      </p>
    </motion.div>
  );
};
