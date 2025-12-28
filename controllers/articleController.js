const Article = require('../models/Article');
const { scrapeArticles } = require('../services/scraperService');

// Trigger Scraper Manually
exports.triggerScraper = async (req, res) => {
    try {
        const result = await scrapeArticles();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET All Articles (with pagination for UI)
exports.getArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: articles.length, data: articles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET Single Article
exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ success: false, error: 'Not Found' });
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// UPDATE Article (Needed for Phase 2)
exports.updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};