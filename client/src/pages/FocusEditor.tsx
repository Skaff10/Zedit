import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";

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
    <div className=" bg-z-gray w-full h-screen px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Top white heading bar (empty for now) */}
        <div className="h-16 bg-white border-b border-gray-100" />

        <div className="relative p-8">
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

          <div className="tiptap-editor">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusEditor;
