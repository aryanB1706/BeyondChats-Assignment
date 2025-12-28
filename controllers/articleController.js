// controllers/articleController.js
const Article = require('../models/Article');
const { scrapeArticles } = require('../services/scraperService');

// 1. Trigger Scraper
exports.triggerScraper = async (req, res) => {
    try {
        const data = await scrapeArticles();
        res.status(200).json({ 
            success: true, 
            message: 'Scraping Completed', 
            count: data.length,
            articles: data 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Get All Articles
exports.getArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: articles.length, data: articles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Get Single Article
exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ success: false, error: 'Not found' });
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Update Article (Phase 2 ke liye)
exports.updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};