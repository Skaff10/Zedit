import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "framer-motion";

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
      <motion.div
        layoutId="focus-editor-card"
        className="w-full max-w-5xl bg-white rounded-2xl flex flex-col pt-1 overflow-hidden shadow-xl"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Top white heading bar (empty for now) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="h-16 bg-gray-200 self-center border rounded-r-3xl rounded-l-3xl w-3/4 border-z-gray flex items-center justify-center"
        >
          {/* Placeholder for Title Input */}
          <input
            type="text"
            placeholder="Document Title"
            className="bg-transparent border-none outline-none text-center font-medium text-gray-700 w-full px-4"
            autoFocus
          />
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
