const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
const parser = new Parser();

// ============================================
// CONFIGURATION - Edit these URLs
// ============================================
const SOURCES = {
    rss_app_1: 'https://rss.app/feeds/GoSZ0DgbbyUtgMcE.xml',
    for_harriet: 'https://www.forharriet.com/feed',
    rss_app_2: 'https://rss.app/feed/krkoHnHt8tJ15p5j',
    rss_app_3: 'https://rss.app/feed/F2L7PheEOG3WfmPI',
    making_things: 'https://makingthingsisreallyhard.com/feed',
    rss_app_4: 'https://rss.app/feed/EduGcpWgIZuZDC7l',
    youtube_main: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCKiEmEHuuBtNPHhQR9cKvTA',
    youtube_channel_2: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCxbRHP66thn1Ka3JC8O3dqA',
    youtube_channel_3: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCilNETwoyWx5lJTmzE4p7HQ',
    personal_site: 'https://kimberlynicolefoster.co/feed',
};

const SITE_URL = 'https://knfoster13.github.io/knf90/';

// ============================================
// MAIN FUNCTION
// ============================================
async function generateFeed() {
    console.log('🚀 Starting feed generation...\n');

    const feed = {
        "version": "https://jsonfeed.org/version/1",
        "title": "Kimberly's Creative Sprint",
        "home_page_url": SITE_URL,
        "feed_url": `${SITE_URL}feed.json`,
        "description": "A 90-day sprint through ideas, images, and inquiry",
        "items": []
    };

    // Pull from each source
    for (const [sourceName, sourceUrl] of Object.entries(SOURCES)) {
        try {
            console.log(`📥 Fetching from ${sourceName}...`);
            const items = await fetchFromSource(sourceName, sourceUrl);
            feed.items.push(...items);
            console.log(`✅ Added ${items.length} items from ${sourceName}\n`);
        } catch (error) {
            console.error(`❌ Error fetching from ${sourceName}:`, error.message);
        }
    }

    // Remove duplicates based on URL
    feed.items = removeDuplicates(feed.items);

    // Sort by date (newest first)
    feed.items.sort((a, b) => new Date(b.date_published) - new Date(a.date_published));

    // Limit to most recent 50 items
    feed.items = feed.items.slice(0, 50);

    // Write the feed
    const feedPath = path.join(__dirname, '..', 'feed.json');
    fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2));
    
    console.log('✨ Feed updated successfully!');
    console.log(`📊 Total items: ${feed.items.length}`);
    console.log(`💾 Saved to: ${feedPath}`);
}

// ============================================
// FETCH FROM RSS/ATOM SOURCES
// ============================================
async function fetchFromSource(sourceName, sourceUrl) {
    const items = [];
    
    try {
        const feedData = await parser.parseURL(sourceUrl);
        
        feedData.items.forEach((item, index) => {
            const feedItem = {
                id: generateId(item, sourceName, index),
                title: item.title || 'Untitled',
                url: item.link || item.guid,
                content_html: item.content || item['content:encoded'] || '',
                content_text: stripHtml(item.contentSnippet || item.content || ''),
                date_published: item.isoDate || item.pubDate || new Date().toISOString(),
                external_url: item.link,
                author: {
                    name: item.creator || item.author || 'Kimberly Nicole Foster'
                }
            };

            // Add type based on source
            feedItem._source = sourceName;
            
            // YouTube-specific handling
            if (sourceName === 'youtube') {
                feedItem.image = item.media?.thumbnail?.url || extractYouTubeThumbnail(item.link);
                feedItem.content_text = item.content || item.contentSnippet || '';
                feedItem._type = 'video';
            }
            
            // Substack-specific handling
            if (sourceName === 'substack') {
                feedItem.image = extractImageFromContent(item.content);
                feedItem._type = 'article';
            }

            // Add thumbnail if available
            if (item.enclosure?.url) {
                feedItem.image = item.enclosure.url;
            }

            items.push(feedItem);
        });
    } catch (error) {
        console.error(`Error parsing ${sourceName}:`, error.message);
    }

    return items;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateId(item, source, index) {
    // Try to create a stable ID
    if (item.guid) return `${source}-${item.guid}`;
    if (item.link) return `${source}-${item.link.split('/').pop()}`;
    return `${source}-${Date.now()}-${index}`;
}

function stripHtml(html) {
    if (!html) return '';
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim()
        .substring(0, 300); // Limit to 300 characters
}

function extractImageFromContent(content) {
    if (!content) return null;
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
}

function extractYouTubeThumbnail(url) {
    if (!url) return null;
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (videoIdMatch) {
        return `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
    }
    return null;
}

function removeDuplicates(items) {
    const seen = new Set();
    return items.filter(item => {
        const key = item.url || item.id;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

// ============================================
// RUN THE SCRIPT
// ============================================
generateFeed().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});