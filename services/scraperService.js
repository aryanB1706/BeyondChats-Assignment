const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('../models/Article');

const BASE_URL = 'https://beyondchats.com/blogs/';

// Helper to fetch HTML
const fetchHTML = async (url) => {
    const { data } = await axios.get(url);
    return cheerio.load(data);
};

const scrapeArticles = async () => {
    try {
        console.log('🕵️ Started Scraping Process...');

        // Step 1: Find the Last Page Number
        const $main = await fetchHTML(BASE_URL);
        
        // Website ke pagination structure ke hisab se last page dhundna
        // Usually class '.page-numbers' hoti hai. 
        // Note: Actual scraping mein class name inspect karke verify karna padta hai.
        // Assuming standard WP structure:
        const pageNumbers = [];
        $('.page-numbers').each((i, el) => {
            const num = parseInt($(el).text());
            if (!isNaN(num)) pageNumbers.push(num);
        });
        
        const lastPage = pageNumbers.length > 0 ? Math.max(...pageNumbers) : 1;
        console.log(`📄 Last page identified: ${lastPage}`);

        // Step 2: Fetch Articles from the Last Page
        const targetUrl = `${BASE_URL}page/${lastPage}/`;
        const $lastPage = await fetchHTML(targetUrl);
        
        const articlesToScrape = [];
        
        // Article cards usually in 'div.post-card' or similar. 
        // Need to target the correct selector based on BeyondChats HTML.
        // Generic approach for generic WP blogs:
        $lastPage('article, .post, .blog-post').slice(0, 5).each((i, el) => {
            const link = $lastPage(el).find('a').attr('href');
            if (link) articlesToScrape.push(link);
        });

        console.log(`🔗 Found ${articlesToScrape.length} articles on last page.`);

        // Step 3: Visit each article and get content
        let count = 0;
        for (const link of articlesToScrape) {
            try {
                const $post = await fetchHTML(link);
                
                // Extract Data
                const title = $post('h1').first().text().trim();
                const content = $post('.entry-content, .post-content').text().trim(); // Adjust selector based on actual site
                const date = $post('.published, .date').text().trim();

                if (title && content) {
                    // DB me save karo (upsert: agar hai to update, nahi to create)
                    await Article.findOneAndUpdate(
                        { articleUrl: link },
                        { 
                            title, 
                            originalContent: content, 
                            articleUrl: link,
                            publishedDate: date
                        },
                        { upsert: true, new: true }
                    );
                    count++;
                }
            } catch (err) {
                console.error(`❌ Failed to scrape ${link}:`, err.message);
            }
        }

        return { message: `Successfully scraped and saved ${count} oldest articles.` };

    } catch (error) {
        console.error('Scraping Error:', error);
        throw new Error('Scraping Failed');
    }
};

module.exports = { scrapeArticles };