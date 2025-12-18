import React, { useState, useRef } from "react";
import { Editor } from "@tiptap/react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaImage,
  FaPalette,
  FaFont,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

interface EditorToolbarProps {
  editor: Editor;
  disabled?: boolean;
}

const FONTS = [
  { name: "Arial", value: "Arial" },
  { name: "Comic Sans", value: "Comic Sans MS" },
  { name: "Roboto", value: "Roboto" },
  { name: "Times New Roman", value: "Times New Roman" },
  { name: "Georgia", value: "Georgia" },
  { name: "Verdana", value: "Verdana" },
  { name: "Courier New", value: "Courier New" },
  { name: "Trebuchet MS", value: "Trebuchet MS" },
  { name: "Palatino", value: "Palatino Linotype" },
];

const COLORS = [
  "#000000",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#22C55E",
  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#A855F7",
  "#EC4899",
  "#F43F5E",
  "#FFFFFF",
  "#2563EB",
];

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  disabled = false,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setUpdate] = useState(0);

  // Force update when editor selection or content changes
  React.useEffect(() => {
    if (!editor) return;
    const update = () => setUpdate((s) => s + 1);
    editor.on("transaction", update);
    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  if (disabled) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const btnClass = (active: boolean) =>
    `w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer ${
      active
        ? "bg-z-blue text-white shadow-lg"
        : "text-gray-500 hover:bg-gray-100 hover:text-z-blue"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-xl border border-gray-100 self-start"
    >
      {/* Bold */}
      <button
        type="button"
        className={btnClass(editor.isActive("bold"))}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <FaBold size={16} />
      </button>

      {/* Italic */}
      <button
        type="button"
        className={btnClass(editor.isActive("italic"))}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <FaItalic size={16} />
      </button>

      {/* Underline */}
      <button
        type="button"
        className={btnClass(editor.isActive("underline"))}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        <FaUnderline size={16} />
      </button>

      {/* Divider */}
      <div className="w-6 h-px bg-gray-600 my-1" />

      {/* Image */}
      <button
        type="button"
        className={btnClass(false)}
        onClick={() => fileInputRef.current?.click()}
        title="Insert Image"
      >
        <FaImage size={16} />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Divider */}
      <div className="w-6 h-px bg-gray-600 my-1" />

      {/* Color Picker */}
      <div className="relative">
        <button
          type="button"
          className={btnClass(showColorPicker)}
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setShowFontPicker(false);
          }}
          title="Text Color"
        >
          <FaPalette size={16} />
        </button>
        <AnimatePresence>
          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              className="absolute left-14 top-0 bg-z-dark rounded-xl p-3 shadow-2xl border border-gray-700 z-50"
            >
              <div className="grid grid-cols-5 gap-2 w-40">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 border border-gray-600"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Font Picker */}
      <div className="relative">
        <button
          type="button"
          className={btnClass(showFontPicker)}
          onClick={() => {
            setShowFontPicker(!showFontPicker);
            setShowColorPicker(false);
          }}
          title="Font Family"
        >
          <FaFont size={16} />
        </button>
        <AnimatePresence>
          {showFontPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              className="absolute left-14 top-0 bg-z-dark rounded-xl p-2 shadow-2xl border border-gray-700 z-50 w-48"
            >
              {FONTS.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg cursor-pointer transition-colors"
                  style={{ fontFamily: font.value }}
                  onClick={() => {
                    editor.chain().focus().setFontFamily(font.value).run();
                    setShowFontPicker(false);
                  }}
                >
                  {font.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
