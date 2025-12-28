const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('../models/Article');

const BASE_URL = 'https://beyondchats.com/blogs/';

const fetchHTML = async (url) => {
    try {
        const { data } = await axios.get(url);
        return cheerio.load(data);
    } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
        return null;
    }
};

const scrapeArticles = async () => {
    console.log('🚀 Smart Scraping Started...');
    
    try {
        // Step 1: Find Last Page Number
        const $ = await fetchHTML(BASE_URL);
        let maxPage = 1;
        
        // Try to find pagination numbers
        $('.page-numbers').each((_, element) => {
            const num = parseInt($(element).text());
            if (!isNaN(num) && num > maxPage) maxPage = num;
        });
        
        console.log(`📄 Last Page Identified: ${maxPage}`);

        let gatheredLinks = [];
        let currentPage = maxPage;

        // Step 2: Loop backwards until we have at least 5 links
      
        while (gatheredLinks.length < 5 && currentPage > 0) {
            console.log(`Scanning Page ${currentPage}...`);
            const url = `${BASE_URL}page/${currentPage}/`;
            const $page = await fetchHTML(url);
            
            if ($page) {
                // Collect links from this page
                // Note: We reverse them to keep the order "Oldest First"
                const linksOnPage = [];
                $page('.post-card, article, .div-block-2').each((_, element) => {
                    const link = $page(element).find('a').attr('href');
                    if (link) linksOnPage.push(link);
                });

                
                linksOnPage.reverse();
                
                // Add to our main list
                gatheredLinks = [...gatheredLinks, ...linksOnPage];
            }
            
            currentPage--; // Go to previous page
        }

        // Limit to 5 articles
     
        const uniqueLinks = [...new Set(gatheredLinks)].slice(0, 5);
        console.log(`🔗 Final 5 URLs to process:`, uniqueLinks);

        // Step 3: Visit each link and scrape content
        const savedArticles = [];

        for (const link of uniqueLinks) {
            try {
                // Check if already exists to avoid re-scraping
                const existing = await Article.findOne({ articleUrl: link });
                if (existing && existing.originalContent) {
                    console.log(`⚠️ Skipped (Already exists): ${link}`);
                    savedArticles.push(existing);
                    continue;
                }

                const $post = await fetchHTML(link);
                if (!$post) continue;

                const title = $post('h1').first().text().trim();
                // Selectors updated to match BeyondChats structure better
                const content = $post('.entry-content, .post-content, .rich-text-block').text().trim(); 
                const date = $post('.published, .date').first().text().trim() || new Date().toISOString();

                if (title && content) {
                    const article = await Article.findOneAndUpdate(
                        { articleUrl: link },
                        { 
                            title, 
                            originalContent: content, 
                            articleUrl: link,
                            publishedDate: date,
                            status: 'pending' 
                        },
                        { upsert: true, new: true }
                    );
                    savedArticles.push(article);
                    console.log(`✅ Scraped: ${title.substring(0, 20)}...`);
                }
            } catch (err) {
                console.error(`❌ Failed to scrape ${link}`);
            }
        }

        return savedArticles;

    } catch (error) {
        console.error('Critical Scraper Error:', error);
        throw new Error('Scraping workflow failed');
    }
};

module.exports = { scrapeArticles };