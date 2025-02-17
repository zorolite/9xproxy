// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint for token
app.post('/api/token', async (req, res) => {
  try {
    const response = await axios.post('https://ab.9xbud.com/token', {}, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Content-Type': 'application/json; charset=UTF-8',
        'Origin': 'https://9xbuddy.in',
        'Referer': 'https://9xbuddy.in/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'x-requested-with': 'xmlhttprequest',
        'x-requested-domain': '9xbuddy.in',
        'x-access-token': 'false',
        'x-auth-token': req.headers['x-auth-token'] || ''
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Token request failed:', error.message);
    res.status(500).json({
      status: '0',
      message: error.message
    });
  }
});

// Proxy endpoint for extract
app.post('/api/extract', async (req, res) => {
  try {
    const response = await axios.post('https://ab1.9xbud.com/extract', req.body, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Content-Type': 'application/json; charset=UTF-8',
        'Origin': 'https://9xbuddy.in',
        'Referer': 'https://9xbuddy.in/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'x-requested-with': 'xmlhttprequest',
        'x-requested-domain': '9xbuddy.in',
        'x-access-token': req.headers['x-access-token'] || 'false',
        'x-auth-token': req.headers['x-auth-token'] || ''
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Extract request failed:', error.message);
    res.status(500).json({
      status: '0',
      message: error.message
    });
  }
});

// Proxy for downloading videos
app.get('/api/download', async (req, res) => {
  try {
    const url = req.query.url;
    
    if (!url) {
      return res.status(400).json({
        status: '0',
        message: 'URL parameter is required'
      });
    }
    
    const response = await axios.get(decodeURIComponent(url), {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        'Referer': 'https://9xbuddy.in/'
      }
    });
    
    // Forward the headers from the original response
    Object.keys(response.headers).forEach(key => {
      res.setHeader(key, response.headers[key]);
    });
    
    response.data.pipe(res);
  } catch (error) {
    console.error('Download failed:', error.message);
    res.status(500).json({
      status: '0',
      message: error.message
    });
  }
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
