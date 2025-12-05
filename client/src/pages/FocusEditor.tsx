import React from "react";
import { FaCheck, FaShare } from "react-icons/fa6";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "framer-motion";
import { Sidebar } from "../components/Sidebar";

const FocusEditor: React.FC = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start typing or press '/' for AI…</p>",
    autofocus: "end",
  });

  if (!editor) return null;

  const buttonClasses = (active: boolean) =>
    `px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
      active
        ? "bg-z-blue text-white"
        : "text-gray-200 hover:bg-gray-700/80 hover:text-white"
    }`;

  return (
    <div className="bg-z-gray w-full h-screen flex justify-center py-5">
      <Sidebar />
      <motion.div
        layoutId="focus-editor-card"
        className="w-full max-w-5xl bg-white rounded-2xl flex flex-col pt-1 overflow-hidden shadow-xl"
        transition={{ type: "spring", stiffness: 150, damping: 25 }}
      >
        {/* Top white heading bar (empty for now) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="h-16 bg-gray-50 self-center border rounded-full w-[90%] border-gray-200 flex items-center justify-between px-2 shadow-sm mt-4"
        >
          {/* Left: Document Title */}
          <div className="flex-1 flex justify-start">
            <input
              type="text"
              placeholder="Document Title"
              className="bg-transparent border-none outline-none font-bold text-gray-800 text-lg px-4 w-full max-w-xs"
            />
          </div>

          {/* Center: Authors */}
          {/* <div className="flex-1 flex justify-center items-center -space-x-3">
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full border-2 border-white overflow-hidden relative z-[${
                  10 - i
                }] ring-2 ${
                  [
                    "ring-blue-500",
                    "ring-green-500",
                    "ring-purple-500",
                    "ring-orange-500",
                  ][i]
                }`}
              >
                <img
                  src={`https://i.pravatar.cc/150?img=${10 + i}`}
                  alt="Author"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div> */}

          {/* Right: Actions */}
          <div className="flex-1 flex justify-end items-center gap-3 pr-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer bg-blue-600 hover:bg-blue-700 text-white ">
              <FaCheck className="text-white" />
              <span>Commit</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700">
              <FaShare className="text-gray-600" />
              <span>Share</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative p-8 flex-1 overflow-y-auto"
        >
          <BubbleMenu editor={editor}>
            <div className="bg-z-dark text-white rounded-full px-3 py-1 shadow-lg flex items-center gap-1">
              <button
                type="button"
                className={buttonClasses(editor.isActive("bold"))}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                B
              </button>
              <button
                type="button"
                className={buttonClasses(editor.isActive("italic"))}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                I
              </button>
              <button
                type="button"
                className={buttonClasses(editor.isActive("bulletList"))}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                ●●●
              </button>
            </div>
          </BubbleMenu>

          <div className="tiptap-editor h-full">
            <EditorContent editor={editor} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FocusEditor;
