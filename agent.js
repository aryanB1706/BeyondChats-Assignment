// agent.js
require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

puppeteer.use(StealthPlugin());

// Config
const API_URL = 'http://localhost:5000/api/articles';
const GEN_AI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Google Search & Get Top 2 Links
async function getRelatedLinks(query) {
    console.log(`🔍 Searching Google for: "${query}"...`);
    
    const browser = await puppeteer.launch({ headless: true }); // Headless
    const page = await browser.newPage();
    
    try {
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)} blog`, { waitUntil: 'domcontentloaded' });
        
        // Extract Links (Filtering out ads and non-article links)
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.g a'))
                .map(a => a.href)
                .filter(href => href && !href.includes('google') && !href.includes('youtube'))
                .slice(0, 2); // Top 2 links
        });

        await browser.close();
        console.log(`🔗 Found Reference Links:`, links);
        return links;
    } catch (error) {
        console.error("❌ Google Search Failed:", error.message);
        await browser.close();
        return [];
    }
}

// 2. Scrape Content from Reference Links
async function scrapeReferenceContent(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        // Extract paragraphs to get main text
        return $('p').text().slice(0, 2000); // Limit context to avoid token limits
    } catch (error) {
        console.error(`⚠️ Failed to scrape ref: ${url}`);
        return "";
    }
}

// 3. AI Rewrite using Gemini
async function rewriteContent(originalContent, references) {
    console.log("🤖 Asking Gemini to rewrite...");
    const model = GEN_AI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
    You are an expert tech editor. Rewrite the following article to be more professional, engaging, and comprehensive.
    
    Original Article:
    ${originalContent.slice(0, 1000)}...

    Reference Information (Incorporate insights from here):
    ${references}

    Output Format:
    Return ONLY the rewritten article content in Markdown format. 
    At the end, add a "References" section listing the sources used.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("❌ Gemini API Error:", error.message);
        return originalContent; // Fallback
    }
}

// Main Function
async function startAgent() {
    try {
        // Step 1: Fetch Pending Articles from our Backend
        console.log("📥 Fetching pending articles...");
        const { data } = await axios.get(API_URL);
        
        // Filter articles that haven't been processed (status === 'pending')
        // (Assuming your API returns all, logic might need adjustment based on API response structure)
        const pendingArticles = data.data.filter(art => art.status === 'pending');

        if (pendingArticles.length === 0) {
            console.log("✅ No pending articles found.");
            return;
        }

        console.log(`📋 Found ${pendingArticles.length} articles to process.`);

        // Step 2: Process Each Article
        for (const article of pendingArticles) {
            console.log(`\n⚙️ Processing: ${article.title}`);

            // A. Search Google
            const referenceLinks = await getRelatedLinks(article.title);

            // B. Scrape References
            let referenceContext = "";
            for (const link of referenceLinks) {
                const content = await scrapeReferenceContent(link);
                referenceContext += `\nSource (${link}): ${content}\n`;
            }

            // C. AI Rewrite
            const updatedContent = await rewriteContent(article.originalContent, referenceContext);

            // D. Update Backend
            console.log("💾 Updating database...");
            await axios.put(`${API_URL}/${article._id}`, {
                updatedContent: updatedContent,
                referenceLinks: referenceLinks,
                status: 'processed'
            });

            console.log(`✅ Successfully updated: ${article.title}`);
        }

    } catch (error) {
        console.error("❌ Agent Error:", error.message);
    }
}

// Run the script
startAgent();