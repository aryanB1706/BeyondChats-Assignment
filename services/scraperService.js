// services/scraperService.js
const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('../models/Article');

// Constants
const BASE_URL = 'https://beyondchats.com/blogs/';

// Helper function to load HTML
const fetchHTML = async (url) => {
    try {
        const { data } = await axios.get(url);
        return cheerio.load(data);
    } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
        throw error;
    }
};

const scrapeArticles = async () => {
    console.log('🚀 Scraping started...');
    
    try {
        // Step 1: Get Main Page to find Last Page Number
        const $ = await fetchHTML(BASE_URL);
        
        // "Last" page button usually has a specific class. 
        // Based on typical WordPress/Blog structures, we look for page numbers.
        // Let's grab all page number links and find the max value.
        let maxPage = 1;
        $('.page-numbers').each((_, element) => {
            const num = parseInt($(element).text());
            if (!isNaN(num) && num > maxPage) {
                maxPage = num;
            }
        });
        
        console.log(`📄 Last Page Identified: ${maxPage}`);

        // Step 2: Fetch the Last Page
        const lastPageUrl = `${BASE_URL}page/${maxPage}/`;
        const $lastPage = await fetchHTML(lastPageUrl);
        
        // Step 3: Get Article Links from that page (Bottom 5 logic)
        // Usually blogs have articles in <article> tags or divs with class 'post'
        const articleLinks = [];
        $lastPage('.post-card, article').each((_, element) => {
            const link = $lastPage(element).find('a').attr('href');
            if (link) articleLinks.push(link);
        });

        
        const linksToProcess = articleLinks.slice(-5);
        console.log(`🔗 Found ${linksToProcess.length} articles to process.`);

        // Step 4: Visit each article and extract content
        const savedArticles = [];

        for (const link of linksToProcess) {
            try {
                const $post = await fetchHTML(link);
                
                // Extracting Title and Content
                // Note: Class names might need adjustment if BeyondChats changes theme
                const title = $post('h1').first().text().trim();
                const content = $post('.entry-content, .post-content').text().trim(); 
                const date = $post('.published').first().text().trim() || new Date().toISOString();

                if (title && content) {
                    // Database save  (Upsert: Create if new, Update if exists)
                    const article = await Article.findOneAndUpdate(
                        { articleUrl: link },
                        { 
                            title, 
                            originalContent: content, 
                            articleUrl: link,
                            publishedDate: date,
                            status: 'pending' // Ready for Phase 2
                        },
                        { upsert: true, new: true }
                    );
                    savedArticles.push(article);
                    console.log(`✅ Saved: ${title.substring(0, 30)}...`);
                }
            } catch (err) {
                console.error(`❌ Failed to scrape ${link}`, err.message);
            }
        }

        return savedArticles;

    } catch (error) {
        console.error('Critical Scraper Error:', error);
        throw new Error('Scraping workflow failed');
    }
};

module.exports = { scrapeArticles };