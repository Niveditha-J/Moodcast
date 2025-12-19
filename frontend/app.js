const getBtn = document.getElementById('getBtn');
const cityInput = document.getElementById('city');
const moodInput = document.getElementById('mood');
const resultDiv = document.getElementById('result');
const historyDiv = document.getElementById('history');

const apiBase = ''; // empty -> same origin when backend serves frontend. If backend on another port, use 'http://localhost:3000'

function tipFor(mood, weatherMain) {
  // simple mapping - expand as you like
  const moodTips = {
    happy: {
      default: "Nice! Keep enjoying 🥳",
      Clear: "Perfect day to go out and celebrate!",
      Clouds: "Mild clouds — great for photos!",
      Rain: "Carry a light jacket — dancing in rain is allowed 😄"
    },
    sad: {
      default: "It's okay to feel down. Try listening to soothing music.",
      Rain: "Rain can be cozy — brew some tea and relax."
    },
    stressed: {
      default: "Take 5 deep breaths. Short walk helps!",
      Clear: "Sunlight helps reduce stress — step outside for 10 mins."
    },
    bored: {
      default: "Try a quick brain teaser or learn a 5-min skill online.",
      Clear: "Nice weather — go for a short walk to refresh."
    },
    excited: {
      default: "Channel that energy into something creative!",
      Clouds: "Bring someone along for an outdoor plan!"
    }
  };

  const bucket = moodTips[mood] || {};
  return bucket[weatherMain] || bucket.default || "Take care of yourself!";
}

async function fetchWeather(city) {
  const url = `${apiBase}/api/weather?city=${encodeURIComponent(city)}`;
  const r = await fetch(url);
  if (!r.ok) {
    const err = await r.json().catch(()=>({ error: 'unknown' }));
    throw new Error(err.error || 'Weather API error');
  }
  return r.json();
}

async function postMood(entry) {
  const r = await fetch(`${apiBase}/api/mood`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });
  return r.json();
}

async function loadHistory() {
  try {
    const r = await fetch(`${apiBase}/api/moods`);
    if (!r.ok) return;
    const arr = await r.json();
    historyDiv.innerHTML = '';
    if (!arr.length) { historyDiv.innerHTML = '<p class="small">No history yet.</p>'; return; }
    arr.forEach(item => {
      const el = document.createElement('div');
      el.className = 'history-item';
      el.innerHTML = `<div><strong>${item.city}</strong> — ${item.mood} <span class="small">(${new Date(item.timestamp).toLocaleString()})</span></div>
                      <div class="small">Weather: ${item.weather.weather_main} (${item.weather.weather_desc}), Temp: ${item.weather.temp}°C</div>`;
      historyDiv.appendChild(el);
    });
  } catch (e) {
    console.log('history load failed', e);
  }
}

getBtn.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  const mood = moodInput.value;
  if (!city) return alert('Please enter a city');

  resultDiv.classList.remove('hidden');
  resultDiv.innerHTML = '<p class="small">Fetching weather…</p>';

  try {
    const w = await fetchWeather(city);
    const tip = tipFor(mood, w.weather_main);
    resultDiv.innerHTML = `
      <h3>${w.city}, ${w.country}</h3>
      <p><strong>${w.temp}°C</strong> (feels like ${w.feels_like}°C) — ${w.weather_desc}</p>
      <p><em>Tip:</em> ${tip}</p>
      <button id="saveBtn">Save this mood</button>
    `;

    document.getElementById('saveBtn').addEventListener('click', async () => {
      const entry = { city: w.city, mood, weather: w };
      await postMood(entry);
      alert('Saved!');
      loadHistory();
    });

  } catch (err) {
    resultDiv.innerHTML = `<p class="small">Error: ${err.message}</p>`;
  }
});

// initial load
loadHistory();
