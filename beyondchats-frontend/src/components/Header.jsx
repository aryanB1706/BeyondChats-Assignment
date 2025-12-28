import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            BeyondChats <span className="text-indigo-600">Editor</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium">AI-Powered Content Enhancement</p>
        </div>
      </div>
      <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
         Assignment Submission
      </div>
    </header>
  );
};

export default Header;