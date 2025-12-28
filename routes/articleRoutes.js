const express = require('express');
const router = express.Router();
const { triggerScraper, getArticles, getArticleById, updateArticle } = require('../controllers/articleController');

router.post('/scrape', triggerScraper); 
router.get('/', getArticles);           
router.get('/:id', getArticleById);     
router.put('/:id', updateArticle);     

module.exports = router;