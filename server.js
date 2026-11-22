const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const CHOICES = ['stone', 'paper', 'scissors'];

const RULES = {
  stone: 'scissors',
  paper: 'stone',
  scissors: 'paper'
};

const COUNTERS = {
  stone: 'paper',      // Paper beats Stone
  paper: 'scissors',   // Scissors beats Paper
  scissors: 'stone'    // Stone beats Scissors
};

const EXPLANATIONS = {
  'scissors-paper': 'Scissors cuts Paper',
  'paper-stone': 'Paper covers Stone',
  'stone-scissors': 'Stone breaks Scissors'
};

// ==============================================================
// 🧠 Adaptive Markov Chain AI Predictor
// ==============================================================
let userHistory = [];

// 1st-Order Markov Chain: P(NextMove | LastMove)
let markov1 = {
  stone: { stone: 0, paper: 0, scissors: 0 },
  paper: { stone: 0, paper: 0, scissors: 0 },
  scissors: { stone: 0, paper: 0, scissors: 0 }
};

// 2nd-Order Markov Chain: P(NextMove | PrevMove, LastMove)
let markov2 = {};

function resetAI() {
  userHistory = [];
  markov1 = {
    stone: { stone: 0, paper: 0, scissors: 0 },
    paper: { stone: 0, paper: 0, scissors: 0 },
    scissors: { stone: 0, paper: 0, scissors: 0 }
  };
  markov2 = {};
}

function getRandomChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

// Predict user's next move using sequential pattern probabilities
function predictUserMove() {
  if (userHistory.length === 0) {
    return { predicted: getRandomChoice(), confidence: 33, strategy: 'Random Exploration' };
  }

  const lastMove = userHistory[userHistory.length - 1];

  // 1. Try 2nd-Order Markov Pattern (checks 2-move sequence e.g. "stone->paper")
  if (userHistory.length >= 2) {
    const prevMove = userHistory[userHistory.length - 2];
    const key = `${prevMove}->${lastMove}`;
    const transitions = markov2[key];

    if (transitions) {
      const total = transitions.stone + transitions.paper + transitions.scissors;
      if (total >= 2) {
        let best = 'stone';
        let maxCount = -1;
        for (const c of CHOICES) {
          if (transitions[c] > maxCount) {
            maxCount = transitions[c];
            best = c;
          }
        }
        if (maxCount > 0) {
          const confidence = Math.min(95, Math.round((maxCount / total) * 100));
          return { predicted: best, confidence, strategy: '2nd-Order Pattern Match' };
        }
      }
    }
  }

  // 2. Fallback to 1st-Order Markov Pattern (checks last move e.g. "stone->?")
  const transitions1 = markov1[lastMove];
  const total1 = transitions1.stone + transitions1.paper + transitions1.scissors;
  if (total1 >= 2) {
    let best = 'stone';
    let maxCount = -1;
    for (const c of CHOICES) {
      if (transitions1[c] > maxCount) {
        maxCount = transitions1[c];
        best = c;
      }
    }
    if (maxCount > 0) {
      const confidence = Math.min(85, Math.round((maxCount / total1) * 100));
      return { predicted: best, confidence, strategy: '1st-Order Markov Model' };
    }
  }

  // 3. Early game / Insufficient pattern samples
  return { predicted: getRandomChoice(), confidence: 33, strategy: 'Pattern Learning' };
}

// Update the AI's transition frequency matrices
function recordUserMove(userChoice) {
  if (userHistory.length >= 1) {
    const lastMove = userHistory[userHistory.length - 1];
    markov1[lastMove][userChoice]++;
  }

  if (userHistory.length >= 2) {
    const prevMove = userHistory[userHistory.length - 2];
    const lastMove = userHistory[userHistory.length - 1];
    const key = `${prevMove}->${lastMove}`;
    if (!markov2[key]) {
      markov2[key] = { stone: 0, paper: 0, scissors: 0 };
    }
    markov2[key][userChoice]++;
  }

  userHistory.push(userChoice);
}

// ==============================================================
// Session Stats & Rules
// ==============================================================
let serverStats = {
  rounds: 0,
  playerWins: 0,
  botWins: 0,
  draws: 0,
  streak: 0,
  bestStreak: 0
};

function evaluateRound(userChoice, botChoice) {
  if (userChoice === botChoice) {
    return { outcome: 'draw', message: "It's an even draw!" };
  }

  if (RULES[userChoice] === botChoice) {
    const key = `${userChoice}-${botChoice}`;
    const detail = EXPLANATIONS[key] || `${userChoice} beats ${botChoice}`;
    return { outcome: 'win', message: `You win! ${detail}.` };
  } else {
    const key = `${botChoice}-${userChoice}`;
    const detail = EXPLANATIONS[key] || `${botChoice} beats ${userChoice}`;
    return { outcome: 'lose', message: `Bot wins! ${detail}.` };
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// Play round with AI Prediction
app.post('/api/play', (req, res) => {
  const { choice } = req.body;

  if (!choice || !CHOICES.includes(choice.toLowerCase())) {
    return res.status(400).json({
      error: `Invalid choice. Valid options are: ${CHOICES.join(', ')}`
    });
  }

  const userChoice = choice.toLowerCase();

  // 1. AI predicts the user's next move BEFORE recording current move
  const prediction = predictUserMove();

  // 2. Bot selects the counter move
  const botChoice = COUNTERS[prediction.predicted];

  // 3. Evaluate outcome
  const evaluation = evaluateRound(userChoice, botChoice);

  // 4. Feed the new move into the Markov learning engine
  recordUserMove(userChoice);

  // 5. Update stats
  serverStats.rounds++;
  if (evaluation.outcome === 'win') {
    serverStats.playerWins++;
    serverStats.streak++;
    if (serverStats.streak > serverStats.bestStreak) {
      serverStats.bestStreak = serverStats.streak;
    }
  } else if (evaluation.outcome === 'lose') {
    serverStats.botWins++;
    serverStats.streak = 0;
  } else {
    serverStats.draws++;
  }

  res.json({
    success: true,
    userChoice,
    botChoice,
    outcome: evaluation.outcome,
    message: evaluation.message,
    ai: {
      predictedUserMove: prediction.predicted,
      confidence: prediction.confidence,
      strategy: prediction.strategy,
      learnedSamples: userHistory.length
    },
    stats: serverStats
  });
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    stats: serverStats,
    ai: {
      learnedSamples: userHistory.length,
      status: userHistory.length < 3 ? 'Learning' : 'Adaptive Active'
    }
  });
});

// Reset endpoint
app.post('/api/reset', (req, res) => {
  serverStats = {
    rounds: 0,
    playerWins: 0,
    botWins: 0,
    draws: 0,
    streak: 0,
    bestStreak: 0
  };
  resetAI();
  res.json({ success: true, message: 'Stats and AI memory reset successfully', stats: serverStats });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Stone Paper Scissors server running on port ${PORT}`);
});
