const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from React build (for production)
app.use(express.static(path.join(__dirname, 'dist')));

// Screenshot API endpoint
app.post('/screenshot', async (req, res) => {
  const { url } = req.body;

  // Validate URL
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  let browser;
  
  try {
    console.log(`Capturing screenshot for: ${url}`);
    
    // Launch Puppeteer with required args for containerized environments
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport for consistent screenshots
    await page.setViewport({
      width: 1280,
      height: 720,
      deviceScaleFactor: 1
    });

    // Set user agent to avoid bot detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to the URL with timeout
    await page.goto(url, {
      waitUntil: 'load',
      timeout: 30000
    });

    // Wait a bit more for dynamic content to load
    await page.waitForTimeout(2000);

    // Capture full-page screenshot
    const screenshot = await page.screenshot({
      fullPage: true,
      type: 'png'
    });

    // Set proper headers and return the screenshot
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': screenshot.length,
      'Cache-Control': 'no-cache'
    });

    res.send(screenshot);
    console.log(`Screenshot captured successfully for: ${url}`);

  } catch (error) {
    console.error('Screenshot capture error:', error.message);
    
    // Handle specific error types
    if (error.name === 'TimeoutError') {
      return res.status(408).json({ 
        error: 'Screenshot capture timed out. The website may be slow or unresponsive.' 
      });
    }
    
    if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
      return res.status(404).json({ 
        error: 'Website not found. Please check the URL and try again.' 
      });
    }
    
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      return res.status(503).json({ 
        error: 'Connection refused. The website may be down or blocking requests.' 
      });
    }

    // Generic error response
    res.status(500).json({ 
      error: 'Failed to capture screenshot. Please try again later.' 
    });
    
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'SiteCheckr Screenshot Service' });
});

// Catch-all handler for React app (for production)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SiteCheckr backend server running on port ${PORT}`);
  console.log(`Screenshot API available at: http://localhost:${PORT}/screenshot`);
});

module.exports = app;