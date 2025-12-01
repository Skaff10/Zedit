import React from "react";

export const Board: React.FC = () => {
  return (
    <div className="flex-1 p-8 overflow-x-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-z-text">Z-Board</h1>
        <button className="bg-z-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
          <span>+</span> New Board
        </button>
      </div>

      <div className="flex gap-6 h-[calc(100vh-12rem)] min-w-[800px]">
        <Column title="Drafts" >
          <NewZeditCard />
          
        </Column>

        {/* <Column title="In Review" >
          
            
        </Column>

        <Column title="Published/Stable" >
          
        </Column> */}
      </div>
    </div>
  );
};

const Column: React.FC<{
  title: string;
  count?: number;
  children: React.ReactNode;
}> = ({ title, count, children }) => {
  return (
    <div className="flex-1 flex flex-col min-w-[280px]">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-semibold text-z-text">{title}</h3>
        <button className="text-gray-400 hover:text-gray-600 cursor-pointer">•••</button>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
        {children}
      </div>
    </div>
  );
};

const NewZeditCard = () => (
  <button className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-z-blue hover:text-z-blue hover:bg-blue-50 transition-all group cursor-pointer">
    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
      +
    </span>
    <span className="font-medium">Create New Zedit</span>
  </button>
);

const ProjectCard: React.FC<{
  title: string;
  authors?: string[];
  updated: string;
  status?: "draft" | "review" | "published";
}> = ({ title, authors, updated, status = "draft" }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <h4 className="font-semibold text-z-text mb-3">{title}</h4>

      {status === "published" ? (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            ✓
          </div>
        </div>
      ) : (
        <div className="flex -space-x-2 mb-3">
          {authors?.map((src, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        Updated intro paragraph • {updated} 
      </p>
    </div>
  );
};
