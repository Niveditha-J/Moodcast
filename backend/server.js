// server.js
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;
const PORT = process.env.PORT || 3000;
const moodsFile = path.join(__dirname, 'moods.json');

// helper: read/write moods
function readMoods() {
  try {
    const txt = fs.readFileSync(moodsFile, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (e) {
    return [];
  }
}
function writeMoods(arr) {
  fs.writeFileSync(moodsFile, JSON.stringify(arr, null, 2));
}

// Serve frontend static files if you want to host from backend
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

// API: fetch weather by city
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'city required' });

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    const resp = await axios.get(url, {
      params: {
        q: city,
        appid: OPENWEATHER_KEY,
        units: 'metric'
      }
    });
    // pick useful fields
    const data = resp.data;
    const result = {
      city: data.name,
      country: data.sys?.country,
      temp: data.main?.temp,
      feels_like: data.main?.feels_like,
      weather_main: data.weather?.[0]?.main,
      weather_desc: data.weather?.[0]?.description
    };
    return res.json(result);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res.status(500).json({ error: 'weather fetch failed', details: err?.response?.data || err.message });
  }
});

// API: save mood entry
app.post('/api/mood', (req, res) => {
  const { city, mood, weather } = req.body;
  if (!city || !mood || !weather) return res.status(400).json({ error: 'city, mood, weather required' });

  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    city,
    mood,
    weather
  };

  const arr = readMoods();
  arr.unshift(entry); // newest first
  // keep only last 100
  writeMoods(arr.slice(0, 100));
  res.json({ success: true, entry });
});

// API: get all moods (history)
app.get('/api/moods', (req, res) => {
  const arr = readMoods();
  res.json(arr);
});

app.listen(PORT, () => console.log(`MoodCast backend on http://localhost:${PORT}`));
