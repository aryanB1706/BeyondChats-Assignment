import React from 'react';
import { FileText, CheckCircle2, Clock } from 'lucide-react';
import Loader from './Loader'; 

const Sidebar = ({ articles, loading, error, selectedArticle, onSelect }) => {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4" /> Available Articles
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {loading ? (
          
          <Loader text="Fetching articles..." size="medium" />
        ) : error ? (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        ) : (
          articles.map((article) => (
           
             <div
               key={article._id}
               className={`p-3 rounded-lg cursor-pointer border ${selectedArticle && selectedArticle._id === article._id ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
               onClick={() => onSelect(article)}
             >
               <div className="font-medium text-gray-800">{article.title}</div>
               <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                 {article.status === 'completed' ? (
                   <CheckCircle2 className="w-4 h-4 text-green-500" />
                 ) : (
                   <Clock className="w-4 h-4 text-yellow-500" />
                 )}
                 {article.status}
               </div>
             </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;