import React from 'react';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Sparkles, ArrowRight, Loader2, FileText } from 'lucide-react';

const ComparisonView = ({ article }) => {
  if (!article) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
           <FileText className="w-10 h-10 text-gray-300" />
        </div>
        <p className="text-lg font-medium text-gray-500">Select an article to view</p>
      </div>
    );
  }

  return (
    <section className="flex-1 flex flex-col bg-gray-50/50 relative h-full overflow-hidden">
      {/* Content Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shadow-sm shrink-0">
        <h2 className="text-lg font-bold text-gray-800 truncate max-w-2xl">
          {article.title}
        </h2>
        <a 
          href={article.articleUrl} 
          target="_blank" 
          rel="noreferrer"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline"
        >
          View Source <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Split View Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Original */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase flex items-center gap-2 shrink-0">
            <BookOpen className="w-4 h-4" /> Original Content
          </div>
          <div className="flex-1 overflow-y-auto p-6 text-gray-600 leading-relaxed text-sm whitespace-pre-wrap font-serif">
             {article.originalContent}
          </div>
        </div>

        {/* Right: AI Enhanced */}
        <div className="w-1/2 flex flex-col bg-white">
          <div className="px-4 py-2 bg-indigo-50/50 border-b border-indigo-100 text-xs font-bold text-indigo-600 uppercase flex items-center gap-2 shrink-0">
            <Sparkles className="w-4 h-4" /> AI Enhanced Version
          </div>
          <div className="flex-1 overflow-y-auto p-6 prose prose-sm prose-indigo max-w-none text-gray-700">
            {article.status === 'processed' ? (
              <ReactMarkdown 
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-medium text-indigo-700 mt-4 mb-2" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 my-3 text-gray-600" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-400 pl-4 italic text-gray-600 my-4 bg-gray-50 py-2 pr-2 rounded-r" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                }}
              >
                {article.updatedContent}
              </ReactMarkdown>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3 opacity-70">
                <div className="p-4 bg-gray-100 rounded-full">
                   <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
                <p className="font-medium">AI Agent is processing this article...</p>
                <p className="text-xs max-w-xs text-center">Run the agent script in backend to see magic here.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ComparisonView;