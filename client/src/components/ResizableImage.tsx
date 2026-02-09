import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import React from "react";

export const ResizableImage: React.FC<NodeViewProps> = (props) => {
  const { node, selected } = props;

  // Default to 100% if no width is set
  const width = node.attrs.width || "100%";
  const alignment = node.attrs.alignment || "center"; // center (default/inline), left, right

  // Determine wrapper class based on alignment
  let wrapperClass =
    "resizable-image-wrapper my-6 relative transition-all duration-300 w-full flex justify-center";
  if (alignment === "left")
    wrapperClass =
      "resizable-image-wrapper my-6 relative transition-all duration-300 w-full flex justify-start";
  else if (alignment === "right")
    wrapperClass =
      "resizable-image-wrapper my-6 relative transition-all duration-300 w-full flex justify-end";

  // Add margin bottom and clear-both
  wrapperClass += " clear-both mb-8";

  return (
    <NodeViewWrapper className={wrapperClass}>
      <div
        className={`relative group ${selected ? "ring-2 ring-blue-500" : ""}`}
        style={{ width: width }}
      >
        <img
          src={node.attrs.src}
          alt={node.attrs.alt}
          className="block max-w-full h-auto rounded-lg shadow-sm"
          style={{ width: "100%" }}
        />
      </div>
    </NodeViewWrapper>
  );
};
