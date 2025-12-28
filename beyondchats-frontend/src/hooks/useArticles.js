// src/hooks/useArticles.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://beyondchats-assignment-m7m9.onrender.com/api/articles';

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_URL);
      if (data.success) {
        setArticles(data.data);
        if (data.data.length > 0) setSelectedArticle(data.data[0]);
      }
    } catch (err) {
      setError('Cannot connect to Backend. Is Server running?');
    } finally {
      setLoading(false);
    }
  };

  return { articles, selectedArticle, setSelectedArticle, loading, error };
};