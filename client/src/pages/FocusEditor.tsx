import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaCheck,
  FaShare,
  FaDownload,
  FaFileWord,
  FaFilePdf,
  FaWandMagicSparkles,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaTrash,
} from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import { saveAs } from "file-saver";
// import { Document, Packer, Paragraph, TextRun } from "docx"; // Legacy docx import
// import jsPDF from "jspdf";
// @ts-ignore
import html2pdf from "html2pdf.js";
// @ts-ignore
import { asBlob } from "html-docx-js-typescript";
import axios from "axios";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { CharacterCount } from "@tiptap/extension-character-count";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableImage } from "../components/ResizableImage";
import { WordCount } from "../components/WordCount";
import { FontSize } from "../extensions/FontSize";
import { LineHeight } from "../extensions/LineHeight";
import { motion } from "framer-motion";
import { Sidebar } from "../components/Sidebar";
import { EditorToolbar } from "../components/EditorToolbar";
import { useDocStore } from "../store/docStore";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const FocusEditor: React.FC = () => {
  const [title, setTitle] = useState("");
  const getDocument = useDocStore((state) => state.getDocument);
  const createDocument = useDocStore((state) => state.createDocument);
  const updateDocument = useDocStore((state) => state.updateDocument);
  const isLoading = useDocStore((state) => state.isLoading);
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("boardId");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showToneMenu, setShowToneMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const lastFetchedId = useRef<string | null>(null);

  const extensions = React.useMemo(
    () => [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: "100%",
              renderHTML: (attributes) => ({
                width: attributes.width,
              }),
            },
            alignment: {
              default: "center",
              renderHTML: (attributes) => ({
                class: `image-${attributes.alignment}`,
              }),
            },
          };
        },
        addNodeView() {
          return ReactNodeViewRenderer(ResizableImage);
        },
      }).configure({
        inline: true,
        allowBase64: true,
      }),
      FontFamily,
      FontSize,
      LineHeight,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CharacterCount,
      BubbleMenuExtension,
    ],
    [],
  );

  const editor = useEditor(
    {
      extensions,
      content: "<p>Start typing or press '/' for AI…</p>",
      autofocus: "end",
    },
    [],
  ); // Pass empty array to ensure stability

  // No forced re-renders here, toolbar handles it

  // Fetch document if ID is present
  useEffect(() => {
    if (id && id !== lastFetchedId.current) {
      console.log("FocusEditor: Fetching doc with ID:", id);
      const fetchDoc = async () => {
        try {
          const doc = await getDocument(id);
          console.log("FocusEditor: Fetched doc:", doc);
          if (doc) {
            lastFetchedId.current = id;
            setTitle(doc.title);
            if (editor) {
              editor.commands.setContent(doc.content);
              editor.setEditable(true);

              if (doc.status === "published" || doc.status === "stable") {
                setIsReadOnly(true);
                editor.setEditable(false);
                toast.info(`This document is read-only (${doc.status})`);
              } else {
                setIsReadOnly(false);
              }
            }
          } else {
            toast.error("Document not found");
            navigate("/");
          }
        } catch (err) {
          console.error("FocusEditor: Fetch error:", err);
          navigate("/");
        }
      };
      fetchDoc();
    }
  }, [id, getDocument, editor, navigate]); // editor is now stable

  // Save function with spinner
  const handleSave = useCallback(
    async (shouldNavigate: boolean = true) => {
      if (!editor || isReadOnly || isSaving) return;
      setIsSaving(true);
      const content = editor.getJSON();

      try {
        if (id) {
          await updateDocument(id, { title, content });
          toast.success("Document saved!");
        } else {
          await createDocument({
            title: title || "Untitled Document",
            content,
            status: "draft",
            boardId: boardId || undefined,
          });
          // createDocument in docStore doesn't return the doc currently,
          // but if it redirects via state that's fine.
          if (boardId && shouldNavigate) {
            navigate(`/board/${boardId}`);
          }
        }
      } catch (err) {
        console.error("Save failed:", err);
      } finally {
        setIsSaving(false);
      }
    },
    [
      editor,
      id,
      title,
      isReadOnly,
      isSaving,
      updateDocument,
      createDocument,
      boardId,
      navigate,
    ],
  );

  // AI Transformation Handler
  const handleAiTransform = async (
    operation: "summarize" | "tone",
    tone?: string,
  ) => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, " ");
    if (!text) return toast.warning("Please select some text first.");

    const toastId = toast.loading("AI is working...");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/transform",
        {
          text,
          operation,
          tone,
        },
      );

      const result = response.data.result;
      if (result) {
        editor.chain().focus().deleteSelection().insertContent(result).run();
        toast.update(toastId, {
          render: "Text transformed!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "AI Request failed.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Download as .txt
  const downloadAsTxt = () => {
    if (!editor) return;
    const text = editor.getText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${title || "document"}.txt`);
    setShowShareMenu(false);
  };

  // Download as .docx (WYSIWYG using html-docx-js-typescript)
  const downloadAsDocx = async () => {
    if (!editor) return;
    const htmlContent = editor.getHTML(); // Get full HTML including images/tables

    // Wrap in a standard HTML document structure for better conversion
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
             table { border-collapse: collapse; width: 100%; border: 1px solid black; }
             td, th { border: 1px solid black; padding: 6px; }
             img { max-width: 100%; }
          </style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `;

    try {
      const blob = await asBlob(fullHtml);
      saveAs(blob as Blob, `${title || "document"}.docx`);
      setShowShareMenu(false);
    } catch (error) {
      console.error("Docx export failed:", error);
      toast.error("Failed to export DOCX");
    }
  };

  // Download as .pdf (WYSIWYG using html2pdf.js)
  const downloadAsPdf = () => {
    if (!editor) return;
    const element = document.querySelector(".ProseMirror"); // Target the editor DOM
    if (!element) return;

    const opt = {
      margin: 1,
      filename: `${title || "document"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .set(opt as any)
      .from(element as HTMLElement)
      .save();
    setShowShareMenu(false);
  };

  // Download as .rtf (Basic implementation)
  const downloadAsRtf = () => {
    if (!editor) return;
    const text = editor.getText();
    // Basic RTF header and content wrapper
    const rtfContent = `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0 Arial;}}\n\\f0\\fs24 ${text.replace(/\n/g, "\\par\n")}\n}`;
    const blob = new Blob([rtfContent], { type: "application/rtf" });
    saveAs(blob, `${title || "document"}.rtf`);
    setShowShareMenu(false);
  };

  // Close share menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(e.target as Node)
      ) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onBeforeNavigate = useCallback(async () => {
    if (!isReadOnly) {
      console.log("FocusEditor: Manual save triggered via Sidebar click");
      await handleSave(false);
    }
  }, [isReadOnly, handleSave]);

  if (!editor) return null;

  return (
    <div className="bg-z-gray dark:bg-[#0a0a0a] w-full h-screen flex justify-center py-5 gap-4 transition-colors duration-300">
      <Sidebar onBeforeNavigate={onBeforeNavigate} />
      <WordCount editor={editor} />

      {/* Left Toolbar - Outside Document */}
      {!isReadOnly && <EditorToolbar editor={editor} disabled={isReadOnly} />}

      <motion.div
        className="w-full max-w-5xl bg-white dark:bg-[#1a1a1a] rounded-2xl flex flex-col pt-1 overflow-hidden shadow-xl"
        transition={{ type: "spring", stiffness: 150, damping: 25 }}
      >
        {/* Top white heading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="h-16 bg-gray-50 dark:bg-[#252525] self-center border rounded-full w-[90%] border-gray-200 dark:border-gray-700 flex items-center justify-between px-2 shadow-sm mt-4"
        >
          {/* Left: Document Title */}
          <div className="flex-1 flex justify-start">
            <input
              type="text"
              placeholder="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isReadOnly}
              className="bg-transparent border-none outline-none font-bold text-gray-800 dark:text-gray-100 text-lg px-4 w-full max-w-xs disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex justify-end items-center gap-3 pr-2">
            {!isReadOnly && (
              <button
                onClick={() => handleSave()}
                disabled={isLoading || isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {isSaving ? (
                  <ImSpinner8 className="text-white animate-spin" />
                ) : (
                  <FaCheck className="text-white" />
                )}
                <span>{isSaving ? "Saving..." : "Save"}</span>
              </button>
            )}
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
              >
                <FaShare className="text-gray-600 dark:text-gray-300" />
                <span>Share</span>
              </button>
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[220px] z-50">
                  {/* Option 1: Share with others */}
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => {
                        toast.info("Link copied to clipboard!");
                        setShowShareMenu(false);
                      }}
                      className="w-full text-left text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Share with others
                    </button>
                  </div>

                  {/* Option 2: Download */}
                  <div className="px-4 py-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-1">
                      Download
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={downloadAsDocx}
                        className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1.5 flex items-center gap-2"
                      >
                        <FaFileWord className="text-blue-500" />
                        Microsoft Word (.docx)
                      </button>
                      <button
                        onClick={downloadAsPdf}
                        className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1.5 flex items-center gap-2"
                      >
                        <FaFilePdf className="text-red-500" />
                        PDF Document (.pdf)
                      </button>
                      <button
                        onClick={downloadAsTxt}
                        className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1.5 flex items-center gap-2"
                      >
                        <FaDownload className="text-gray-500" />
                        Plain Text (.txt)
                      </button>
                      <button
                        onClick={downloadAsRtf}
                        className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1.5 flex items-center gap-2"
                      >
                        <FaFileWord className="text-purple-500" />
                        Rich Text File (.rtf)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative p-8 flex-1 overflow-y-auto flex flex-col"
          onClick={() => editor?.commands.focus()}
        >
          {/* Editor Content */}
          <div className="tiptap-editor flex-grow flex flex-col min-h-[calc(100vh-200px)] cursor-text">
            {editor && (
              <>
                <BubbleMenu
                  editor={editor}
                  shouldShow={({ editor, state, from, to }) => {
                    // Only show if editor is editable AND (image is active OR text is selected)
                    return (
                      editor.isEditable &&
                      (editor.isActive("image") ||
                        (!state.selection.empty && from !== to))
                    );
                  }}
                  className="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg flex divide-x divide-gray-100 dark:divide-gray-700 z-50 items-center p-1"
                >
                  {editor.isActive("image") ? (
                    // Image Menu Content
                    <>
                      <div className="flex divide-x divide-gray-100 dark:divide-gray-700 mr-1">
                        <button
                          onClick={() =>
                            editor
                              .chain()
                              .focus()
                              .updateAttributes("image", { alignment: "left" })
                              .run()
                          }
                          className={`p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.getAttributes("image").alignment === "left" ? "text-blue-500 bg-blue-50 dark:bg-blue-900/30" : "text-gray-600 dark:text-gray-300"}`}
                          title="Align Left"
                        >
                          <FaAlignLeft />
                        </button>
                        <button
                          onClick={() =>
                            editor
                              .chain()
                              .focus()
                              .updateAttributes("image", {
                                alignment: "center",
                              })
                              .run()
                          }
                          className={`p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.getAttributes("image").alignment === "center" ? "text-blue-500 bg-blue-50 dark:bg-blue-900/30" : "text-gray-600 dark:text-gray-300"}`}
                          title="Align Center"
                        >
                          <FaAlignCenter />
                        </button>
                        <button
                          onClick={() =>
                            editor
                              .chain()
                              .focus()
                              .updateAttributes("image", { alignment: "right" })
                              .run()
                          }
                          className={`p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.getAttributes("image").alignment === "right" ? "text-blue-500 bg-blue-50 dark:bg-blue-900/30" : "text-gray-600 dark:text-gray-300"}`}
                          title="Align Right"
                        >
                          <FaAlignRight />
                        </button>
                      </div>

                      <div className="flex gap-1 px-2 border-r border-gray-100 dark:border-gray-700">
                        <button
                          onClick={() =>
                            editor
                              .chain()
                              .focus()
                              .updateAttributes("image", { width: "25%" })
                              .run()
                          }
                          className={`px-2 py-1 text-[10px] font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors ${editor.getAttributes("image").width === "25%" ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}`}
                        >
                          25%
                        </button>
                        <button
                          onClick={() =>
                            editor
                              .chain()
                              .focus()
                              .updateAttributes("image", { width: "50%" })
                              .run()
                          }
                          className={`px-2 py-1 text-[10px] font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors ${editor.getAttributes("image").width === "50%" ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}`}
                        >
                          50%
                        </button>
                        <button
                          onClick={() =>
                            editor
                              .chain()
                              .focus()
                              .updateAttributes("image", { width: "75%" })
                              .run()
                          }
                          className={`px-2 py-1 text-[10px] font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors ${editor.getAttributes("image").width === "75%" ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}`}
                        >
                          75%
                        </button>
                        <button
                          onClick={() =>
                            editor
                              .chain()
                              .focus()
                              .updateAttributes("image", { width: "100%" })
                              .run()
                          }
                          className={`px-2 py-1 text-[10px] font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors ${editor.getAttributes("image").width === "100%" ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}`}
                        >
                          Full
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          editor.chain().focus().deleteSelection().run()
                        }
                        className="p-2 text-sm hover:bg-red-100 text-red-600 dark:hover:bg-red-900/30 transition-colors ml-1"
                        title="Delete Image"
                      >
                        <FaTrash />
                      </button>
                    </>
                  ) : (
                    // Text Menu Content (AI tools)
                    <>
                      <button
                        onClick={() => handleAiTransform("summarize")}
                        className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                      >
                        <FaWandMagicSparkles className="text-purple-500" />
                        Summarize
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowToneMenu(!showToneMenu);
                          }}
                          className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 font-medium"
                        >
                          Change Tone ▼
                        </button>
                        {showToneMenu && (
                          <div className="absolute top-full left-0 mt-2 w-32 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden z-50 flex flex-col">
                            {["Professional", "Casual", "Smart"].map((tone) => (
                              <button
                                key={tone}
                                onClick={() => {
                                  handleAiTransform("tone", tone);
                                  setShowToneMenu(false);
                                }}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                              >
                                {tone}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </BubbleMenu>
              </>
            )}
            <EditorContent
              editor={editor}
              className="flex-grow flex flex-col min-h-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FocusEditor;
