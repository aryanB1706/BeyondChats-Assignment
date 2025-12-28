import './index.css'

// src/App.jsx
import React from 'react';
import { useArticles } from './hooks/useArticles';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ComparisonView from './components/ComparisonView';

function App() {
  // Custom hook handles all data logic
  const { articles, selectedArticle, setSelectedArticle, loading, error } = useArticles();

  return (
    <div className="h-screen flex flex-col font-sans text-gray-800 overflow-hidden bg-gray-50">
      
      {/* 1. Header Component */}
      <Header />

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full shadow-2xl my-4 rounded-xl border border-gray-200 bg-white">
        
        {/* 2. Sidebar Component */}
        <Sidebar 
          articles={articles}
          loading={loading}
          error={error}
          selectedArticle={selectedArticle}
          onSelect={setSelectedArticle}
        />

        {/* 3. Comparison View Component */}
        <ComparisonView 
          article={selectedArticle} 
        />

      </main>
    </div>
  );
}

export default App;