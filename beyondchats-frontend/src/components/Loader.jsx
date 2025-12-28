import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ text = "Loading data...", size = "medium" }) => {
  // Simple logic to handle size
  const iconSize = size === "small" ? "w-5 h-5" : "w-8 h-8";
  const textSize = size === "small" ? "text-xs" : "text-sm";

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 text-gray-400">
      <Loader2 className={`${iconSize} animate-spin text-indigo-500 mb-2`} />
      <p className={`${textSize} font-medium animate-pulse`}>{text}</p>
    </div>
  );
};

export default Loader;