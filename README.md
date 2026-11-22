# ✊ AI Stone Paper Scissors (Dockerized)

A responsive, interactive Stone-Paper-Scissors web game and microservice featuring an **Adaptive Markov Chain Machine Learning AI** that learns and predicts human move patterns in real time, dynamic Web Audio sound effects, Dark/Light modes, and complete **Docker** containerization.

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20_Alpine-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- **🧠 Adaptive Markov Chain AI:** Employs 1st-order and 2nd-order transition probability matrices to analyze your past move patterns, predict your next move in real time, and counter it.
- **📊 Live AI Confidence Metrics:** Displays the AI model's strategy (`Exploration`, `1st-Order Markov`, `2nd-Order Pattern Match`), trained sample count, and prediction confidence percentage.
- **🌓 Dark & Light Modes:** Clean light theme by default with seamless toggle to cyberpunk dark theme, persisted via `localStorage`.
- **Classic Gameplay:** Stone ✊, Paper ✋, Scissors ✌️ with custom SVG artwork.
- **Synthesized Web Audio FX:** 8-bit win, lose, and draw sounds generated on-the-fly using the Web Audio API without external audio files.
- **Live Match History & Streaks:** Tracks Player Wins, Bot Wins, Draws, and active win streaks.
- **RESTful API:** Run automated tests or connect external clients via `/api/play` and `/api/stats`.
- **Security-Hardened Docker:** Uses `node:20-alpine` with an unprivileged `USER node` and active healthchecks.

---

## 🚀 Quick Start with Docker

### 1. Clone repository
```bash
git clone https://github.com/adchirayath/ai-stone-paper-scissors.git
cd ai-stone-paper-scissors
```

### 2. Build and launch container
```bash
docker compose up -d --build
```

### 3. Open in your browser
Visit: **[http://localhost:4000](http://localhost:4000)**

### Stop the service
```bash
docker compose down
```

---

## 🛠️ Local Development (Without Docker)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open:** `http://localhost:4000`

---

## 📡 REST API Documentation

### Play a Move
- **Endpoint:** `POST /api/play`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "choice": "stone"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "userChoice": "stone",
    "botChoice": "scissors",
    "outcome": "win",
    "message": "You win! Stone breaks Scissors.",
    "ai": {
      "predictedUserMove": "stone",
      "confidence": 75,
      "strategy": "2nd-Order Pattern Match",
      "learnedSamples": 8
    },
    "stats": {
      "rounds": 1,
      "playerWins": 1,
      "botWins": 0,
      "draws": 0,
      "streak": 1,
      "bestStreak": 1
    }
  }
  ```

### View Live Stats
- **Endpoint:** `GET /api/stats`

### Reset Scores
- **Endpoint:** `POST /api/reset`

---

## 📂 Project Structure

```
ai-stone-paper-scissors/
├── server.js              # Express API & Markov Chain AI engine
├── package.json           # Dependencies and scripts
├── Dockerfile             # Alpine-based lean container image
├── docker-compose.yml     # Multi-container orchestration config
├── .dockerignore          # Fast build exclusion list
├── .gitignore             # Standard git excludes
└── public/
    ├── index.html         # Tailwind CSS UI
    └── script.js          # Web Audio synthesizer & duel state
```

---

## 📤 Uploading to GitHub

```bash
git init
git add .
git commit -m "feat: initial commit for Dockerized Stone-Paper-Scissors"
git branch -M main
git remote add origin https://github.com/adchirayath/ai-stone-paper-scissors.git
git push -u origin main
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
