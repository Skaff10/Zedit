import React, { useState, useEffect } from "react";
import { FaCheck, FaShare } from "react-icons/fa6";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import FontFamily from "@tiptap/extension-font-family";
import { motion } from "framer-motion";
import { Sidebar } from "../components/Sidebar";
import { EditorToolbar } from "../components/EditorToolbar";
import { useDocStore } from "../store/docStore";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const FocusEditor: React.FC = () => {
  const [title, setTitle] = useState("");
  const { createDocument, getDocument, updateDocument, isLoading } =
    useDocStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("boardId");
  const [isReadOnly, setIsReadOnly] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      FontFamily,
    ],
    content: "<p>Start typing or press '/' for AI…</p>",
    autofocus: "end",
    editable: !isReadOnly,
  });

  const [, setUpdate] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const update = () => setUpdate((s) => s + 1);
    editor.on("transaction", update);
    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  // Fetch document if ID is present
  useEffect(() => {
    if (id) {
      console.log("FocusEditor: Fetching doc with ID:", id);
      const fetchDoc = async () => {
        const doc = await getDocument(id);
        console.log("FocusEditor: Fetched doc:", doc);
        if (doc) {
          setTitle(doc.title);
          if (editor) {
            editor.commands.setContent(doc.content);
            editor.setEditable(true); // Reset first
          }

          if (doc.status === "published" || doc.status === "stable") {
            setIsReadOnly(true);
            editor?.setEditable(false);
            toast.info(
              "This document is read-only because it is " + doc.status
            );
          } else {
            setIsReadOnly(false);
            // editor?.setEditable(true); // Already done above
          }
        } else {
          toast.error("Document not found");
          console.error("FocusEditor: Document not found for ID:", id);
          navigate("/");
        }
      };
      fetchDoc();
    }
  }, [id, getDocument, editor, navigate]);

  const handleCommit = async () => {
    if (!editor) return;
    const content = editor.getJSON();

    if (id) {
      // Update existing
      if (isReadOnly) return; // double check
      await updateDocument(id, {
        title,
        content,
      });
      toast.success("Document updated!");
    } else {
      // Create new
      await createDocument({
        title: title || "Untitled Document",
        content,
        status: "draft",
        boardId: boardId || undefined,
      });
      // Navigate back to board if we came from one
      if (boardId) {
        navigate(`/board/${boardId}`);
      }
    }
  };

  if (!editor) return null;

  const buttonClasses = (active: boolean) =>
    `px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
      active
        ? "bg-z-blue text-white"
        : "text-gray-200 hover:bg-gray-700/80 hover:text-white"
    }`;

  return (
    <div className="bg-z-gray dark:bg-[#0a0a0a] w-full h-screen flex justify-center py-5 gap-4 transition-colors duration-300">
      <Sidebar />

      {/* Left Toolbar - Outside Document */}
      {!isReadOnly && <EditorToolbar editor={editor} disabled={isReadOnly} />}

      <motion.div
        layoutId={`focus-editor-${id || "new"}`}
        className="w-full max-w-5xl bg-white dark:bg-gray-100 rounded-2xl flex flex-col pt-1 overflow-hidden shadow-xl"
        transition={{ type: "spring", stiffness: 150, damping: 25 }}
      >
        {/* Top white heading bar */}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isReadOnly}
              className="bg-transparent border-none outline-none font-bold text-gray-800 text-lg px-4 w-full max-w-xs disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex justify-end items-center gap-3 pr-2">
            {!isReadOnly && (
              <button
                onClick={handleCommit}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                <FaCheck className="text-white" />
                <span>{isLoading ? "Saving..." : "Commit"}</span>
              </button>
            )}
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
          {!isReadOnly && (
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
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                >
                  ●●●
                </button>
              </div>
            </BubbleMenu>
          )}

          {/* Editor Content */}
          <div className="tiptap-editor h-full">
            <EditorContent editor={editor} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FocusEditor;
