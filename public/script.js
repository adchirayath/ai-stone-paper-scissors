let soundEnabled = true;
let isPlaying = false;
let historyLog = [];

const CHOICES = ['stone', 'paper', 'scissors'];

// Crisp, standalone Vector SVGs for Stone, Paper, Scissors
const ASSETS = {
    stone: {
        name: 'Stone',
        svg: `<svg viewBox="0 0 64 64" fill="none" class="w-12 h-12 sm:w-16 sm:h-16" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 36L22 16L44 12L54 28L50 48L32 54L18 48L14 36Z" fill="#78716C" stroke="#A8A29E" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M22 16L34 32L18 48M34 32L54 28M34 32L32 54M44 12L34 32" stroke="#57534E" stroke-width="2" stroke-linejoin="round"/>
            <path d="M22 16L34 32L44 12Z" fill="#A8A29E" fill-opacity="0.4"/>
            <path d="M14 36L22 16L34 32L18 48Z" fill="#57534E" fill-opacity="0.3"/>
            <path d="M34 32L54 28L50 48L32 54Z" fill="#44403C" fill-opacity="0.5"/>
        </svg>`,
        miniSvg: `<svg viewBox="0 0 64 64" fill="none" class="w-5 h-5 inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 36L22 16L44 12L54 28L50 48L32 54L18 48L14 36Z" fill="#78716C" stroke="#A8A29E" stroke-width="3" stroke-linejoin="round"/>
            <path d="M22 16L34 32L18 48M34 32L54 28" stroke="#57534E" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M22 16L34 32L44 12Z" fill="#A8A29E" fill-opacity="0.4"/>
        </svg>`
    },
    paper: {
        name: 'Paper',
        svg: `<svg viewBox="0 0 64 64" fill="none" class="w-12 h-12 sm:w-16 sm:h-16" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 10C16.8954 10 16 10.8954 16 12V52C16 53.1046 16.8954 54 18 54H46C47.1046 54 48 53.1046 48 52V22L36 10H18Z" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M36 10V22H48" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2.5" stroke-linejoin="round"/>
            <line x1="24" y1="28" x2="40" y2="28" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="24" y1="36" x2="40" y2="36" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="24" y1="44" x2="34" y2="44" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`,
        miniSvg: `<svg viewBox="0 0 64 64" fill="none" class="w-5 h-5 inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 10C16.8954 10 16 10.8954 16 12V52C16 53.1046 16.8954 54 18 54H46C47.1046 54 48 53.1046 48 52V22L36 10H18Z" fill="#F8FAFC" stroke="#94A3B8" stroke-width="3" stroke-linejoin="round"/>
            <path d="M36 10V22H48" fill="#CBD5E1" stroke="#94A3B8" stroke-width="3" stroke-linejoin="round"/>
            <line x1="24" y1="32" x2="40" y2="32" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
            <line x1="24" y1="40" x2="36" y2="40" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
        </svg>`
    },
    scissors: {
        name: 'Scissors',
        svg: `<svg viewBox="0 0 64 64" fill="none" class="w-12 h-12 sm:w-16 sm:h-16" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 32L48 14C49 13 51 14 50 16L36 34" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round"/>
            <path d="M32 32L48 50C49 51 51 50 50 48L36 30" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
            <circle cx="34" cy="32" r="2.5" fill="#F43F5E"/>
            <circle cx="20" cy="22" r="8" stroke="#F43F5E" stroke-width="3.5" fill="none"/>
            <circle cx="20" cy="42" r="8" stroke="#F43F5E" stroke-width="3.5" fill="none"/>
            <path d="M26 26L34 32M26 38L34 32" stroke="#F43F5E" stroke-width="3.5" stroke-linecap="round"/>
        </svg>`,
        miniSvg: `<svg viewBox="0 0 64 64" fill="none" class="w-5 h-5 inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 32L48 14C49 13 51 14 50 16L36 34" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round"/>
            <path d="M32 32L48 50C49 51 51 50 50 48L36 30" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
            <circle cx="34" cy="32" r="3" fill="#F43F5E"/>
            <circle cx="20" cy="22" r="7" stroke="#F43F5E" stroke-width="3.5" fill="none"/>
            <circle cx="20" cy="42" r="7" stroke="#F43F5E" stroke-width="3.5" fill="none"/>
        </svg>`
    }
};

// -------------------------------------------------------------
// Dark / Light Theme System (Default is LIGHT mode)
// -------------------------------------------------------------
function initTheme() {
    const saved = localStorage.getItem('sps-theme') || 'light';
    if (saved === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeUI('dark');
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeUI('light');
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    const mode = isDark ? 'dark' : 'light';
    localStorage.setItem('sps-theme', mode);
    updateThemeUI(mode);
}

function updateThemeUI(mode) {
    const icon = document.getElementById('theme-icon');
    const label = document.getElementById('theme-label');
    if (icon) icon.textContent = mode === 'dark' ? '☀️' : '🌙';
    if (label) label.textContent = mode === 'dark' ? 'Light' : 'Dark';
}

// -------------------------------------------------------------
// Web Audio API Synthesizer (Zero external dependencies)
// -------------------------------------------------------------
let audioCtx = null;
function playTone(freq, type, duration, delay = 0) {
    if (!soundEnabled) return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        setTimeout(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        }, delay);
    } catch (e) {
        console.warn('Audio unavailable', e);
    }
}

function playWinSound() {
    playTone(523.25, 'sine', 0.12, 0);   // C5
    playTone(659.25, 'sine', 0.12, 100); // E5
    playTone(783.99, 'sine', 0.25, 200); // G5
}

function playLoseSound() {
    playTone(392.00, 'sawtooth', 0.15, 0);   // G4
    playTone(349.23, 'sawtooth', 0.15, 120); // F4
    playTone(293.66, 'sawtooth', 0.3, 240);  // D4
}

function playDrawSound() {
    playTone(440, 'triangle', 0.15, 0);
    playTone(440, 'triangle', 0.2, 150);
}

function playClickSound() {
    playTone(800, 'sine', 0.05, 0);
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('sound-icon');
    if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
}

// -------------------------------------------------------------
// Buttons & Gameplay
// -------------------------------------------------------------
function renderButtons() {
    const container = document.getElementById('buttons-container');

    container.innerHTML = CHOICES.map(choice => {
        const item = ASSETS[choice];
        return `
            <button onclick="playTurn('${choice}')" class="choice-btn px-6 py-3.5 rounded-xl bg-white hover:bg-indigo-50/80 dark:bg-slate-800/90 dark:hover:bg-indigo-600/80 border border-slate-300 hover:border-indigo-400 dark:border-slate-700 dark:hover:border-indigo-500 shadow-sm text-sm font-semibold flex items-center gap-3 text-slate-800 dark:text-slate-100 transition duration-150">
                <span class="flex items-center justify-center">${item.miniSvg}</span>
                <span>${item.name}</span>
            </button>
        `;
    }).join('');
}

async function playTurn(userChoice) {
    if (isPlaying) return;
    isPlaying = true;
    playClickSound();

    const arena = document.getElementById('arena-card');
    const userDisplay = document.getElementById('user-display');
    const botDisplay = document.getElementById('bot-display');
    const userChoiceName = document.getElementById('user-choice-name');
    const botChoiceName = document.getElementById('bot-choice-name');
    const resultBadge = document.getElementById('round-result-badge');
    const narrative = document.getElementById('round-narrative');

    arena.classList.remove('glow-win', 'glow-lose', 'glow-draw');

    userDisplay.innerHTML = `<span class="animate-spin text-2xl">⚡</span>`;
    botDisplay.innerHTML = `<span class="animate-spin text-2xl">⚡</span>`;
    userChoiceName.textContent = 'Deciding...';
    botChoiceName.textContent = 'Deciding...';
    resultBadge.textContent = 'Clashing...';
    resultBadge.className = 'mt-3 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 animate-pulse';
    narrative.textContent = 'Clashing moves...';

    try {
        const response = await fetch('/api/play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ choice: userChoice })
        });

        const data = await response.json();

        setTimeout(() => {
            userDisplay.innerHTML = ASSETS[data.userChoice] ? ASSETS[data.userChoice].svg : '❔';
            botDisplay.innerHTML = ASSETS[data.botChoice] ? ASSETS[data.botChoice].svg : '🤖';

            userChoiceName.textContent = ASSETS[data.userChoice].name.toUpperCase();
            botChoiceName.textContent = ASSETS[data.botChoice].name.toUpperCase();
            narrative.textContent = data.message;

            if (data.outcome === 'win') {
                resultBadge.textContent = 'YOU WIN';
                resultBadge.className = 'mt-3 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30';
                arena.classList.add('glow-win');
                playWinSound();
            } else if (data.outcome === 'lose') {
                resultBadge.textContent = 'BOT WINS';
                resultBadge.className = 'mt-3 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30';
                arena.classList.add('glow-lose');
                playLoseSound();
            } else {
                resultBadge.textContent = 'DRAW';
                resultBadge.className = 'mt-3 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30';
                arena.classList.add('glow-draw');
                playDrawSound();
            }

            document.getElementById('stat-player-wins').textContent = data.stats.playerWins;
            document.getElementById('stat-bot-wins').textContent = data.stats.botWins;
            document.getElementById('stat-draws').textContent = data.stats.draws;
            document.getElementById('stat-streak').textContent = `🔥 ${data.stats.streak}`;

            if (data.ai) {
                const aiStatus = document.getElementById('ai-status');
                const aiConf = document.getElementById('ai-confidence');
                if (aiStatus) aiStatus.textContent = `${data.ai.strategy} (${data.ai.learnedSamples} moves trained)`;
                if (aiConf) aiConf.textContent = `${data.ai.confidence}%`;
            }

            addHistoryRecord(data);
            isPlaying = false;
        }, 300);

    } catch (err) {
        console.error('Turn error', err);
        narrative.textContent = 'Connection error with game server.';
        isPlaying = false;
    }
}

function addHistoryRecord(data) {
    const list = document.getElementById('history-list');

    const placeholder = document.getElementById('history-placeholder');
    if (placeholder) {
        placeholder.remove();
    }

    const badgeColor = 
        data.outcome === 'win' ? 'text-emerald-700 bg-emerald-100 border-emerald-300 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
        data.outcome === 'lose' ? 'text-rose-700 bg-rose-100 border-rose-300 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20' :
        'text-amber-700 bg-amber-100 border-amber-300 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20';

    const userItem = ASSETS[data.userChoice];
    const botItem = ASSETS[data.botChoice];

    const row = document.createElement('div');
    row.className = 'flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition-all duration-200 ease-out opacity-0 -translate-y-1';
    row.innerHTML = `
        <span class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 font-medium">You: ${userItem.miniSvg} ${userItem.name}</span>
            <span class="text-slate-400 dark:text-slate-500">vs</span>
            <span class="inline-flex items-center gap-1.5 font-medium">Bot: ${botItem.miniSvg} ${botItem.name}</span>
        </span>
        <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badgeColor}">
            ${data.outcome}
        </span>
    `;

    list.prepend(row);

    requestAnimationFrame(() => {
        row.classList.remove('opacity-0', '-translate-y-1');
        row.classList.add('opacity-100', 'translate-y-0');
    });

    while (list.children.length > 20) {
        list.removeChild(list.lastElementChild);
    }
}

// -------------------------------------------------------------
// Reset Confirmation Modal
// -------------------------------------------------------------
function openResetModal() {
    const modal = document.getElementById('reset-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeResetModal() {
    const modal = document.getElementById('reset-modal');
    if (modal) modal.classList.add('hidden');
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('reset-modal');
    if (modal && e.target === modal) {
        closeResetModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeResetModal();
    }
});

async function confirmResetStats() {
    closeResetModal();
    try {
        const res = await fetch('/api/reset', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            document.getElementById('stat-player-wins').textContent = '0';
            document.getElementById('stat-bot-wins').textContent = '0';
            document.getElementById('stat-draws').textContent = '0';
            document.getElementById('stat-streak').textContent = '🔥 0';
            
            const aiStatus = document.getElementById('ai-status');
            const aiConf = document.getElementById('ai-confidence');
            if (aiStatus) aiStatus.textContent = 'Learning player habits (0 samples)';
            if (aiConf) aiConf.textContent = '33%';

            historyLog = [];
            document.getElementById('history-list').innerHTML = `
                <div id="history-placeholder" class="h-full flex items-center justify-center text-slate-400 dark:text-slate-600 py-12">
                    <p>No rounds played yet.</p>
                </div>
            `;
            document.getElementById('round-narrative').textContent = 'Stats reset. Pick a move to start!';
            document.getElementById('arena-card').classList.remove('glow-win', 'glow-lose', 'glow-draw');

            // Reset Duel Arena cards & result badge
            const userDisplay = document.getElementById('user-display');
            const botDisplay = document.getElementById('bot-display');
            const userChoiceName = document.getElementById('user-choice-name');
            const botChoiceName = document.getElementById('bot-choice-name');
            const resultBadge = document.getElementById('round-result-badge');

            if (userDisplay) userDisplay.innerHTML = '<span class="text-3xl sm:text-4xl text-slate-400 dark:text-slate-500">❔</span>';
            if (botDisplay) botDisplay.innerHTML = '<span class="text-3xl sm:text-4xl text-slate-400 dark:text-slate-500">🤖</span>';
            if (userChoiceName) userChoiceName.textContent = 'Make your move';
            if (botChoiceName) botChoiceName.textContent = 'Waiting...';
            if (resultBadge) {
                resultBadge.textContent = 'Ready';
                resultBadge.className = 'mt-3 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
            }
        }
    } catch (err) {
        console.error('Reset error', err);
    }
}

function resetStats() {
    openResetModal();
}

// Initialize on page load
initTheme();
renderButtons();
