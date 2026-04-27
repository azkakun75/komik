import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  insertPageView,
  updatePopularPage,
  updateDailyStats,
  getPageViewsByDate,
  getPageViewsByHour,
  getPopularPages,
  getTotalStats,
  getRecentViews,
  getViewsByDevice,
  getViewsByCountry,
  detectDeviceType
} from './db.js';

const app = express();

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'https://afzn-studio-toon.vercel.app',
  ...(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Parse JSON bodies (cap body size to keep abusive payloads out of SQLite)
app.use(express.json({ limit: '8kb' }));

// Per-IP rate limiting for /api/track (in-memory, no extra deps)
const TRACK_WINDOW_MS = 60 * 1000;
const TRACK_MAX_PER_WINDOW = 60;
const trackHits = new Map();
const trimToString = (value, max) => {
  if (typeof value !== 'string') return '';
  return value.length > max ? value.slice(0, max) : value;
};

// Track page view
app.post('/api/track', async (req, res) => {
  try {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = trackHits.get(ip);
    if (entry && now - entry.start < TRACK_WINDOW_MS) {
      if (entry.count >= TRACK_MAX_PER_WINDOW) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
      }
      entry.count += 1;
    } else {
      trackHits.set(ip, { start: now, count: 1 });
    }

    const pagePath = trimToString(req.body?.pagePath, 500);
    const pageTitle = trimToString(req.body?.pageTitle, 200);
    const referrer = trimToString(req.body?.referrer, 1000);
    if (!pagePath) {
      return res.status(400).json({ success: false, error: 'pagePath is required' });
    }
    const userAgent = trimToString(req.get('user-agent') || '', 500);

    // Detect device type from user agent
    const deviceType = detectDeviceType(userAgent);

    // Get country from Cloudflare header or default to Unknown
    const country = trimToString(req.get('cf-ipcountry') || 'Unknown', 10);

    // Insert page view with device and country info
    insertPageView.run(pagePath, pageTitle, userAgent, referrer, deviceType, country);

    // Update popular pages
    updatePopularPage.run(pagePath, pageTitle);

    // Update daily stats
    updateDailyStats.run();

    res.json({ success: true, message: 'Page view tracked' });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get statistics overview
app.get('/api/stats/overview', (req, res) => {
  try {
    const stats = getTotalStats.get();
    res.json(stats);
  } catch (error) {
    console.error('Error getting overview stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get daily views for last 30 days
app.get('/api/stats/daily', (req, res) => {
  try {
    const dailyViews = getPageViewsByDate.all();
    res.json(dailyViews);
  } catch (error) {
    console.error('Error getting daily stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get hourly views for today
app.get('/api/stats/hourly', (req, res) => {
  try {
    const hourlyViews = getPageViewsByHour.all();
    res.json(hourlyViews);
  } catch (error) {
    console.error('Error getting hourly stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get popular pages
app.get('/api/stats/popular', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const popularPages = getPopularPages.all(limit);
    res.json(popularPages);
  } catch (error) {
    console.error('Error getting popular pages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get recent views
app.get('/api/stats/recent', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const recentViews = getRecentViews.all(limit);
    res.json(recentViews);
  } catch (error) {
    console.error('Error getting recent views:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get views by device
app.get('/api/stats/device', (req, res) => {
  try {
    const deviceStats = getViewsByDevice.all();
    res.json(deviceStats);
  } catch (error) {
    console.error('Error getting device stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get views by country
app.get('/api/stats/country', (req, res) => {
  try {
    const countryStats = getViewsByCountry.all();
    res.json(countryStats);
  } catch (error) {
    console.error('Error getting country stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 8062;

app.listen(port, () => {
  console.log(`🚀 Statistics API server running on http://localhost:${port}`);
});
