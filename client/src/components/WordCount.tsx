import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import { FaChartBar } from "react-icons/fa";

interface WordCountProps {
  editor: Editor;
}

export const WordCount: React.FC<WordCountProps> = ({ editor }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!editor) return null;

  const words = editor.storage.characterCount.words();
  const characters = editor.storage.characterCount.characters();

  // Estimate pages based on words (avg 500 words/page single spaced)
  const pages = Math.ceil(words / 500) || 1;

  return (
    <div className="fixed bottom-4 right-20 z-50">
      {showDetails && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 mb-2 w-64 animate-in fade-in slide-in-from-bottom-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b pb-2 dark:border-gray-700">
            Document Statistics
          </h3>
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Words</span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {words}
            </span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Characters</span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {characters}
            </span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Est. Pages</span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {pages}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-xs font-medium"
      >
        <FaChartBar
          className={showDetails ? "text-blue-500" : "text-gray-400"}
        />
        <span>{words} words</span>
      </button>
    </div>
  );
};
