import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  rightAction?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, rightAction }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 flex justify-between items-center bg-[#e5ddaa70] border-b border-b-[#e5ddaa] relative">
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="btn-ripple bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg px-3 py-2 font-semibold text-gray-500 hover:bg-gray-300 w-12 h-12 flex items-center justify-center text-2xl relative"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <h1 className="btn-ripple text-3xl font-bold text-center font-fredoka bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg px-3 py-2 text-white text-shadow-md flex items-center justify-center relative">
        {title}
      </h1>
      
      {rightAction ? rightAction : <div className="w-12 h-12" />}
    </div>
  );
};
