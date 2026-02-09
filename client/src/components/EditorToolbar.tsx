import React, { useState, useRef } from "react";
import { Editor } from "@tiptap/react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaImage,
  FaPalette,
  FaFont,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaListUl,
  FaListOl,
  FaListCheck,
  FaHighlighter,
  FaTextHeight,
  FaGripLines,
  FaTable,
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

const TEXT_COLORS = [
  { color: "#000000", lightMode: true, darkMode: false },
  { color: "#374151", lightMode: true, darkMode: true },
  { color: "#6B7280", lightMode: true, darkMode: true },
  { color: "#9CA3AF", lightMode: true, darkMode: true },
  { color: "#EF4444", lightMode: true, darkMode: true },
  { color: "#F97316", lightMode: true, darkMode: true },
  { color: "#F59E0B", lightMode: true, darkMode: true },
  { color: "#EAB308", lightMode: true, darkMode: true },
  { color: "#22C55E", lightMode: true, darkMode: true },
  { color: "#10B981", lightMode: true, darkMode: true },
  { color: "#14B8A6", lightMode: true, darkMode: true },
  { color: "#06B6D4", lightMode: true, darkMode: true },
  { color: "#3B82F6", lightMode: true, darkMode: true },
  { color: "#6366F1", lightMode: true, darkMode: true },
  { color: "#8B5CF6", lightMode: true, darkMode: true },
  { color: "#A855F7", lightMode: true, darkMode: true },
  { color: "#EC4899", lightMode: true, darkMode: true },
  { color: "#F43F5E", lightMode: true, darkMode: true },
  { color: "#FFFFFF", lightMode: false, darkMode: true },
  { color: "#2563EB", lightMode: true, darkMode: true },
];

const HIGHLIGHT_COLORS = [
  { name: "Yellow", color: "#fef08a" },
  { name: "Green", color: "#bbf7d0" },
  { name: "Cyan", color: "#a5f3fc" },
  { name: "Pink", color: "#fbcfe8" },
  { name: "Orange", color: "#fed7aa" },
  { name: "Purple", color: "#ddd6fe" },
  { name: "Blue", color: "#bfdbfe" },
  { name: "Red", color: "#fecaca" },
];

const TEXT_SIZES = [8, 10, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96];

const LINE_SPACINGS = [
  { name: "Single", value: "1" },
  { name: "1.15", value: "1.15" },
  { name: "1.5", value: "1.5" },
  { name: "Double", value: "2" },
];

const ALIGNMENTS = [
  { name: "Left", value: "left", icon: FaAlignLeft },
  { name: "Center", value: "center", icon: FaAlignCenter },
  { name: "Right", value: "right", icon: FaAlignRight },
  { name: "Justify", value: "justify", icon: FaAlignJustify },
];

const LIST_TYPES = [
  { name: "Bullet List", value: "bulletList", icon: FaListUl },
  { name: "Numbered List", value: "orderedList", icon: FaListOl },
  { name: "Checklist", value: "taskList", icon: FaListCheck },
];

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  disabled = false,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLineSpacing, setShowLineSpacing] = useState(false);
  const [showAlignmentPicker, setShowAlignmentPicker] = useState(false);
  const [showListPicker, setShowListPicker] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setUpdate] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check dark mode
  React.useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

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

  const closeAllPickers = () => {
    setShowColorPicker(false);
    setShowFontPicker(false);
    setShowSizePicker(false);
    setShowHighlightPicker(false);
    setShowLineSpacing(false);
    setShowAlignmentPicker(false);
    setShowListPicker(false);
    setShowTablePicker(false);
  };

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
        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-z-blue dark:hover:text-white"
    }`;

  const dropdownClass =
    "absolute left-14 top-0 bg-white dark:bg-[#1e1e1e] rounded-xl p-3 shadow-2xl border border-gray-200 dark:border-gray-700 z-50";

  // Get current alignment icon
  const getCurrentAlignmentIcon = () => {
    for (const align of ALIGNMENTS) {
      if (editor.isActive({ textAlign: align.value })) {
        return align.icon;
      }
    }
    return FaAlignLeft;
  };

  // Get current list icon
  const getCurrentListIcon = () => {
    for (const list of LIST_TYPES) {
      if (editor.isActive(list.value)) {
        return list.icon;
      }
    }
    return FaListUl;
  };

  const CurrentAlignIcon = getCurrentAlignmentIcon();
  const CurrentListIcon = getCurrentListIcon();
  const isAnyListActive = LIST_TYPES.some((list) =>
    editor.isActive(list.value),
  );

  // Filter text colors based on mode
  const visibleColors = TEXT_COLORS.filter((c) =>
    isDarkMode ? c.darkMode : c.lightMode,
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="editor-toolbar flex flex-col items-center gap-2 p-3 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 self-start"
    >
      {/* Text Size */}
      <div className="relative">
        <button
          type="button"
          className={btnClass(showSizePicker)}
          onClick={() => {
            closeAllPickers();
            setShowSizePicker(!showSizePicker);
          }}
          title="Text Size"
        >
          <FaTextHeight size={16} />
        </button>
        <AnimatePresence>
          {showSizePicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              className={`${dropdownClass} w-32 max-h-64 overflow-y-auto`}
            >
              {TEXT_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                  onClick={() => {
                    editor.chain().focus().setFontSize(`${size}px`).run();
                    setShowSizePicker(false);
                  }}
                >
                  {size}px
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-gray-200 dark:bg-gray-700 my-1" />

      {/* Text Alignment - Combined */}
      <div className="relative">
        <button
          type="button"
          className={btnClass(showAlignmentPicker)}
          onClick={() => {
            closeAllPickers();
            setShowAlignmentPicker(!showAlignmentPicker);
          }}
          title="Text Alignment"
        >
          <CurrentAlignIcon size={14} />
        </button>
        <AnimatePresence>
          {showAlignmentPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              className={`${dropdownClass} flex gap-2`}
            >
              {ALIGNMENTS.map((align) => {
                const Icon = align.icon;
                return (
                  <button
                    key={align.value}
                    type="button"
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                      editor.isActive({ textAlign: align.value })
                        ? "bg-z-blue text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    title={align.name}
                    onClick={() => {
                      editor.chain().focus().setTextAlign(align.value).run();
                      setShowAlignmentPicker(false);
                    }}
                  >
                    <Icon size={14} />
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-gray-200 dark:bg-gray-700 my-1" />

      {/* Line Spacing */}
      <div className="relative">
        <button
          type="button"
          className={btnClass(showLineSpacing)}
          onClick={() => {
            closeAllPickers();
            setShowLineSpacing(!showLineSpacing);
          }}
          title="Line Spacing"
        >
          <FaGripLines size={16} />
        </button>
        <AnimatePresence>
          {showLineSpacing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              className={`${dropdownClass} w-32`}
            >
              {LINE_SPACINGS.map((spacing) => (
                <button
                  key={spacing.value}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                  onClick={() => {
                    editor.chain().focus().setLineHeight(spacing.value).run();
                    setShowLineSpacing(false);
                  }}
                >
                  {spacing.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-gray-200 dark:bg-gray-700 my-1" />

      {/* List Options - Combined */}
      <div className="relative">
        <button
          type="button"
          className={btnClass(showListPicker || isAnyListActive)}
          onClick={() => {
            closeAllPickers();
            setShowListPicker(!showListPicker);
          }}
          title="Lists"
        >
          <CurrentListIcon size={14} />
        </button>
        <AnimatePresence>
          {showListPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              className={`${dropdownClass} flex gap-2`}
            >
              {LIST_TYPES.map((list) => {
                const Icon = list.icon;
                return (
                  <button
                    key={list.value}
                    type="button"
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                      editor.isActive(list.value)
                        ? "bg-z-blue text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    title={list.name}
                    onClick={() => {
                      if (list.value === "bulletList") {
                        editor.chain().focus().toggleBulletList().run();
                      } else if (list.value === "orderedList") {
                        editor.chain().focus().toggleOrderedList().run();
                      } else if (list.value === "taskList") {
                        editor.chain().focus().toggleTaskList().run();
                      }
                      setShowListPicker(false);
                    }}
                  >
                    <Icon size={14} />
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-gray-200 dark:bg-gray-700 my-1" />

      {/* Highlight */}
      <div className="relative">
        <button
          type="button"
          className={btnClass(
            showHighlightPicker || editor.isActive("highlight"),
          )}
          onClick={() => {
            closeAllPickers();
            setShowHighlightPicker(!showHighlightPicker);
          }}
          title="Highlight"
        >
          <FaHighlighter size={16} />
        </button>
        <AnimatePresence>
          {showHighlightPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              className={dropdownClass}
            >
              <div className="grid grid-cols-4 gap-2 w-32">
                {HIGHLIGHT_COLORS.map((highlight) => (
                  <button
                    key={highlight.color}
                    type="button"
                    className="w-7 h-7 rounded-md cursor-pointer transition-transform hover:scale-110 border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: highlight.color }}
                    title={highlight.name}
                    onClick={() => {
                      editor
                        .chain()
                        .focus()
                        .toggleHighlight({ color: highlight.color })
                        .run();
                      setShowHighlightPicker(false);
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                className="w-full mt-2 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setShowHighlightPicker(false);
                }}
              >
                Remove Highlight
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-gray-200 dark:bg-gray-700 my-1" />

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
      <div className="w-6 h-px bg-gray-200 dark:bg-gray-700 my-1" />

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

      {/* Table - with Rows x Cols selection */}
      <div className="relative">
        <button
          type="button"
          className={btnClass(showTablePicker || editor.isActive("table"))}
          onClick={() => {
            closeAllPickers();
            setShowTablePicker(!showTablePicker);
          }}
          title="Insert Table"
        >
          <FaTable size={16} />
        </button>
        <AnimatePresence>
          {showTablePicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              className={`${dropdownClass} w-48 p-4`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs text-gray-600 dark:text-gray-400">
                    Rows
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={tableRows}
                    onChange={(e) =>
                      setTableRows(parseInt(e.target.value) || 1)
                    }
                    className="w-16 px-2 py-1 text-sm border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs text-gray-600 dark:text-gray-400">
                    Cols
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={tableCols}
                    onChange={(e) =>
                      setTableCols(parseInt(e.target.value) || 1)
                    }
                    className="w-16 px-2 py-1 text-sm border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <button
                  type="button"
                  className="w-full mt-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .insertTable({
                        rows: tableRows,
                        cols: tableCols,
                        withHeaderRow: true,
                      })
                      .run();
                    setShowTablePicker(false);
                  }}
                >
                  Insert Table
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-gray-200 dark:bg-gray-700 my-1" />

      {/* Color Picker */}
      <div className="relative">
        <button
          type="button"
          className={btnClass(showColorPicker)}
          onClick={() => {
            closeAllPickers();
            setShowColorPicker(!showColorPicker);
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
              className={dropdownClass}
            >
              <div className="grid grid-cols-5 gap-2 w-40">
                {visibleColors.map((item) => (
                  <button
                    key={item.color}
                    type="button"
                    className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: item.color }}
                    onClick={() => {
                      editor.chain().focus().setColor(item.color).run();
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
            closeAllPickers();
            setShowFontPicker(!showFontPicker);
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
              className={`${dropdownClass} w-48`}
            >
              {FONTS.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
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
