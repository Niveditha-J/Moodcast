# 🌙 MoodCast – Mood-Based Weather Web App

MoodCast is a beginner-friendly **full-stack web application** that combines a user’s mood with **real-time weather data** to generate personalized tips.  
The project is designed to learn and demonstrate **HTML, CSS, JavaScript, backend APIs, and external API integration** in a practical way.

---

## 🚀 Features

- 🌦 Live weather data using OpenWeatherMap API  
- 😊 User mood selection (happy, sad, stressed, etc.)
- 💡 Personalized tips based on mood + weather
- 💾 Mood history saved on backend (JSON storage)
- 🌙 Modern dark-themed UI
- 🔗 Frontend ↔ Backend API communication
- ⚙️ Beginner-friendly architecture

---

## 🛠 Tech Stack

### Frontend
- HTML5  
- CSS3 (Dark theme, modern UI)
- Vanilla JavaScript (Fetch API)

### Backend
- Node.js  
- Express.js  
- Axios  
- dotenv  
- CORS  

### External API
- OpenWeatherMap API

---

## 📁 Project Structure

moodcast/
├── backend/
│ ├── server.js
│ ├── package.json
│ ├── .env
│ └── moods.json
│
└── frontend/
├── index.html
├── style.css
└── app.js

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Niveditha-J/Moodcast.git
cd Moodcast

### 2️⃣Backend Setup
cd backend
npm install
### 3️⃣ Run the backend
node server.js


Backend will run at:

http://localhost:3000

---

##  How It Works

User enters city name

User selects current mood

Frontend sends request to backend

Backend fetches weather data from API

Weather + mood are processed

A personalized tip is shown

Mood entry is saved and displayed in history
