/* ============================================================
   GRADIENT DEFS for SVG Donut Chart (inline SVG workaround)
   ============================================================ */
(function injectSvgDefs() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = `
    <defs>
      <linearGradient id="grad-donut" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#8b5cf6"/>
        <stop offset="100%" stop-color="#06b6d4"/>
      </linearGradient>
    </defs>`;
  document.body.prepend(svg);
})();

/* ============================================================
   THEME TOGGLE
   ============================================================ */
const themeToggle   = document.getElementById('theme-toggle');
const body          = document.body;

// Persist theme across reloads
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark-theme';
body.className = savedTheme;

themeToggle.addEventListener('click', () => {
  const isDark = body.classList.contains('dark-theme');
  body.className = isDark ? 'light-theme' : 'dark-theme';
  localStorage.setItem('portfolio-theme', body.className);
});

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu          = document.getElementById('nav-menu');

mobileMenuToggle.addEventListener('click', () => {
  const isOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
  mobileMenuToggle.setAttribute('aria-expanded', String(!isOpen));
  navMenu.classList.toggle('open');
});

// Close menu on nav item click
navMenu.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
  });
});

/* ============================================================
   SCROLL REVEAL (IntersectionObserver fallback for Firefox)
   ============================================================ */
if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
  const revealEls = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* ============================================================
   HEADER SCROLL SHRINK
   ============================================================ */
const mainHeader = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  mainHeader.style.boxShadow = window.scrollY > 40
    ? '0 4px 24px rgba(0,0,0,0.4)'
    : 'none';
}, { passive: true });

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
const typewriterEl = document.getElementById('typewriter');
const phrases = [
  'Full Stack Developer',
  'AI/ML Enthusiast',
  'Problem Solver',
  'Vibe Coder',
  'Kannada Poet',
  'Cricket Strategist'
];

let phraseIdx = 0, charIdx = 0, deleting = false;

function type() {
  const currentPhrase = phrases[phraseIdx];

  if (!deleting) {
    typewriterEl.textContent = currentPhrase.slice(0, ++charIdx);
    if (charIdx === currentPhrase.length) {
      setTimeout(() => { deleting = true; type(); }, 2000);
      return;
    }
  } else {
    typewriterEl.textContent = currentPhrase.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 50 : 90);
}

type();

/* ============================================================
   TAB SWITCHER (Projects)
   ============================================================ */
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('aria-controls');

    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });

    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.getElementById(targetId).classList.add('active');
  });
});

/* ============================================================
   PROJECT 1: VOICE GRAMMAR CORRECTOR
   ============================================================ */

const micBtn           = document.getElementById('btn-mic-start');
const micStatusText    = document.getElementById('mic-status-text');
const grammarInput     = document.getElementById('grammar-input-text');
const correctBtn       = document.getElementById('btn-grammar-correct');
const clearBtn         = document.getElementById('btn-grammar-clear');
const resultsContainer = document.getElementById('grammar-results-container');
const originalOutput   = document.getElementById('grammar-original-output');
const correctedOutput  = document.getElementById('grammar-corrected-output');
const explanationList  = document.getElementById('grammar-explanation-list');

// Grammar correction rules
const grammarRules = [
  {
    pattern: /\bhe don'?t\b|\bshe don'?t\b|\bit don'?t\b/gi,
    corrected: (m) => m.replace(/don'?t/i, "doesn't"),
    explanation: '"don\'t" → "doesn\'t" for third-person singular (he/she/it)'
  },
  {
    pattern: /\bhe do not\b|\bshe do not\b|\bit do not\b/gi,
    corrected: (m) => m.replace(/do not/i, 'does not'),
    explanation: '"do not" → "does not" for third-person singular (he/she/it)'
  },
  {
    pattern: /\bthey was\b/gi,
    corrected: () => 'they were',
    explanation: '"they was" → "they were" (plural subject needs plural verb)'
  },
  {
    pattern: /\bwe was\b/gi,
    corrected: () => 'we were',
    explanation: '"we was" → "we were" (plural subject needs plural verb)'
  },
  {
    pattern: /\byou was\b/gi,
    corrected: () => 'you were',
    explanation: '"you was" → "you were"'
  },
  {
    pattern: /\bhe have\b|\bshe have\b|\bit have\b/gi,
    corrected: (m) => m.replace(/have/i, 'has'),
    explanation: '"have" → "has" for third-person singular'
  },
  {
    pattern: /\bdo not has\b/gi,
    corrected: () => 'does not have',
    explanation: '"do not has" → "does not have"'
  },
  {
    pattern: /\bdoes not have\b/gi,
    corrected: () => 'does not have',
    explanation: 'Correct usage of "does not have" ✓'
  },
  {
    pattern: /\bi are\b/gi,
    corrected: () => 'I am',
    explanation: '"I are" → "I am"'
  },
  {
    pattern: /\bmore better\b/gi,
    corrected: () => 'better',
    explanation: '"more better" → "better" (avoid double comparatives)'
  },
  {
    pattern: /\bmore faster\b/gi,
    corrected: () => 'faster',
    explanation: '"more faster" → "faster" (avoid double comparatives)'
  },
  {
    pattern: /\bgo to school yesterday\b/gi,
    corrected: () => 'went to school yesterday',
    explanation: '"go" → "went" (past tense required)'
  },
  {
    pattern: /\bhe go\b|\bshe go\b|\bit go\b/gi,
    corrected: (m) => m.replace(/go/i, 'goes'),
    explanation: '"go" → "goes" for third-person singular'
  },
  {
    pattern: /\ba apple\b/gi,
    corrected: () => 'an apple',
    explanation: '"a" → "an" before a vowel sound'
  },
  {
    pattern: /\ba egg\b/gi,
    corrected: () => 'an egg',
    explanation: '"a" → "an" before a vowel sound'
  },
];

function applyGrammarCorrections(text) {
  let corrected = text;
  const foundRules = [];

  grammarRules.forEach(rule => {
    const hasMistake = rule.pattern.test(corrected);
    rule.pattern.lastIndex = 0;

    if (hasMistake) {
      corrected = corrected.replace(rule.pattern, rule.corrected);
      foundRules.push(rule.explanation);
    }
  });

  return { corrected, foundRules };
}

function highlightDifferences(original, corrected) {
  const origWords = original.split(/\s+/);
  const corrWords = corrected.split(/\s+/);
  const maxLen = Math.max(origWords.length, corrWords.length);

  let origHtml = '', corrHtml = '';

  for (let i = 0; i < maxLen; i++) {
    const ow = origWords[i] ?? '';
    const cw = corrWords[i] ?? '';
    const diff = ow.toLowerCase() !== cw.toLowerCase();

    origHtml += diff
      ? `<span class="error-word">${ow}</span> `
      : `${ow} `;
    corrHtml += diff
      ? `<span class="correct-word">${cw}</span> `
      : `${cw} `;
  }

  return { origHtml: origHtml.trim(), corrHtml: corrHtml.trim() };
}

function analyzeAndCorrect() {
  const text = grammarInput.value.trim();
  if (!text) return;

  const { corrected, foundRules } = applyGrammarCorrections(text);
  const { origHtml, corrHtml } = highlightDifferences(text, corrected);

  originalOutput.innerHTML = origHtml || text;
  correctedOutput.innerHTML = corrHtml || corrected;

  explanationList.innerHTML = '';
  if (foundRules.length === 0) {
    explanationList.innerHTML = '<li>✅ No grammar errors found! Great writing!</li>';
  } else {
    foundRules.forEach(rule => {
      const li = document.createElement('li');
      li.textContent = rule;
      explanationList.appendChild(li);
    });
  }

  resultsContainer.classList.remove('hidden');
}

correctBtn.addEventListener('click', analyzeAndCorrect);

clearBtn.addEventListener('click', () => {
  grammarInput.value = '';
  resultsContainer.classList.add('hidden');
});

// Speech recognition
let recognition = null;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    grammarInput.value = transcript;
    micStatusText.textContent = 'Click to Speak';
    micBtn.classList.remove('recording');
    analyzeAndCorrect();
  };

  recognition.onerror = () => {
    micStatusText.textContent = 'Click to Speak';
    micBtn.classList.remove('recording');
  };

  recognition.onend = () => {
    micStatusText.textContent = 'Click to Speak';
    micBtn.classList.remove('recording');
  };

  let isRecording = false;

  micBtn.addEventListener('click', () => {
    if (!isRecording) {
      recognition.start();
      micStatusText.textContent = 'Listening…';
      micBtn.classList.add('recording');
      isRecording = true;
    } else {
      recognition.stop();
      micStatusText.textContent = 'Click to Speak';
      micBtn.classList.remove('recording');
      isRecording = false;
    }
  });
} else {
  micBtn.disabled = true;
  micBtn.title = 'Speech recognition not supported in this browser';
  micStatusText.textContent = 'Not Supported';
}

/* ============================================================
   PROJECT 2: TUITION MANAGEMENT DASHBOARD
   ============================================================ */

const TUITION_KEY = 'tuition_students_v1';

let students = JSON.parse(localStorage.getItem(TUITION_KEY) || '[]');

const tuitionForm    = document.getElementById('tuition-form');
const studentNameEl  = document.getElementById('t-student-name');
const studentClassEl = document.getElementById('t-student-class');
const studentSubjEl  = document.getElementById('t-student-subject');
const studentFeeEl   = document.getElementById('t-student-fee');
const studentStatEl  = document.getElementById('t-student-status');
const studentsList   = document.getElementById('t-students-list');
const searchInput    = document.getElementById('t-student-search');

const statRevenue   = document.getElementById('t-stat-revenue');
const statStudents  = document.getElementById('t-stat-students');
const statCollected = document.getElementById('t-stat-collected');
const statPending   = document.getElementById('t-stat-pending');
const chartCircle   = document.getElementById('t-chart-circle');
const chartPct      = document.getElementById('t-chart-percentage');

const DONUT_CIRCUMFERENCE = 471; // 2 * π * 75

function saveStudents() {
  localStorage.setItem(TUITION_KEY, JSON.stringify(students));
}

function updateStats() {
  const total     = students.length;
  const totalFee  = students.reduce((sum, s) => sum + Number(s.fee), 0);
  const collected = students.filter(s => s.status === 'Paid').reduce((sum, s) => sum + Number(s.fee), 0);
  const pending   = totalFee - collected;
  const pct       = totalFee > 0 ? Math.round((collected / totalFee) * 100) : 0;

  statRevenue.textContent   = `₹${totalFee.toLocaleString()}`;
  statStudents.textContent  = total;
  statCollected.textContent = `₹${collected.toLocaleString()}`;
  statPending.textContent   = `₹${pending.toLocaleString()}`;
  chartPct.textContent      = `${pct}%`;

  const offset = DONUT_CIRCUMFERENCE - (pct / 100) * DONUT_CIRCUMFERENCE;
  chartCircle.style.strokeDashoffset = offset;
}

function renderStudents(filter = '') {
  const filtered = filter
    ? students.filter(s =>
        s.name.toLowerCase().includes(filter) ||
        s.subject.toLowerCase().includes(filter) ||
        s.grade.toLowerCase().includes(filter)
      )
    : students;

  studentsList.innerHTML = '';

  if (filtered.length === 0) {
    studentsList.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 2rem;">No students found.</td></tr>`;
    return;
  }

  filtered.forEach((student, idx) => {
    const realIdx = students.indexOf(student);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-weight:600; color: var(--text-primary);">${student.name}</td>
      <td>${student.grade}</td>
      <td>${student.subject}</td>
      <td style="font-family: var(--font-code);">₹${Number(student.fee).toLocaleString()}</td>
      <td><span class="status-badge ${student.status.toLowerCase()}">${student.status}</span></td>
      <td>
        <button class="btn btn-delete-student" data-idx="${realIdx}" aria-label="Remove ${student.name}">✕ Remove</button>
      </td>
    `;
    studentsList.appendChild(row);
  });

  studentsList.querySelectorAll('.btn-delete-student').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.idx);
      students.splice(i, 1);
      saveStudents();
      renderStudents(searchInput.value.toLowerCase().trim());
      updateStats();
    });
  });
}

tuitionForm.addEventListener('submit', () => {
  const name    = studentNameEl.value.trim();
  const grade   = studentClassEl.value.trim();
  const subject = studentSubjEl.value.trim();
  const fee     = studentFeeEl.value.trim();
  const status  = studentStatEl.value;

  if (!name || !grade || !subject || !fee) return;

  students.push({ name, grade, subject, fee: Number(fee), status, id: Date.now() });
  saveStudents();
  renderStudents(searchInput.value.toLowerCase().trim());
  updateStats();
  tuitionForm.reset();
});

searchInput.addEventListener('input', () => {
  renderStudents(searchInput.value.toLowerCase().trim());
});

// Seed demo data if empty
if (students.length === 0) {
  students = [
    { id: 1, name: 'Arjun Sharma',  grade: '10th Standard', subject: 'Mathematics', fee: 1500, status: 'Paid'    },
    { id: 2, name: 'Priya Gowda',   grade: '9th Standard',  subject: 'Science',     fee: 1200, status: 'Pending' },
    { id: 3, name: 'Ramesh Kumar',  grade: '8th Standard',  subject: 'English',     fee: 1000, status: 'Paid'    },
  ];
  saveStudents();
}

renderStudents();
updateStats();

/* ============================================================
   PROJECT 3: AI TIC-TAC-TOE (Minimax)
   ============================================================ */

const cells          = document.querySelectorAll('.ttt-cell');
const turnIndicator  = document.getElementById('ttt-turn-indicator');
const scorePlayerEl  = document.getElementById('score-player');
const scoreTiesEl    = document.getElementById('score-ties');
const scoreAIEl      = document.getElementById('score-opponent');
const labelPlayerX   = document.getElementById('label-player-x');
const labelPlayerO   = document.getElementById('label-player-o');
const btnModeAI      = document.getElementById('btn-ttt-mode-ai');
const btnModeLocal   = document.getElementById('btn-ttt-mode-local');
const btnReset       = document.getElementById('btn-ttt-reset');
const btnClearScores = document.getElementById('btn-ttt-clear-scores');
const strikeLine     = document.getElementById('ttt-strike-line');
const tttGrid        = document.getElementById('ttt-grid-container');

let board         = Array(9).fill('');
let currentPlayer = 'X';
let gameOver      = false;
let vsAI          = true;
let scores        = { X: 0, O: 0, ties: 0 };

const WINNING_COMBOS = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6]            // diagonals
];

function updateModeUI() {
  if (vsAI) {
    btnModeAI.classList.add('active');
    btnModeLocal.classList.remove('active');
    labelPlayerX.textContent = 'Player (X)';
    labelPlayerO.textContent = 'AI (O)';
  } else {
    btnModeLocal.classList.add('active');
    btnModeAI.classList.remove('active');
    labelPlayerX.textContent = 'Player 1 (X)';
    labelPlayerO.textContent = 'Player 2 (O)';
  }
}

btnModeAI.addEventListener('click', () => {
  vsAI = true;
  updateModeUI();
  resetBoard();
});

btnModeLocal.addEventListener('click', () => {
  vsAI = false;
  updateModeUI();
  resetBoard();
});

function checkWinner(b) {
  for (const combo of WINNING_COMBOS) {
    const [a, c, d] = combo;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) {
      return { winner: b[a], combo };
    }
  }
  if (b.every(cell => cell !== '')) return { winner: 'tie' };
  return null;
}

function renderBoard() {
  cells.forEach((cell, i) => {
    cell.textContent = board[i];
    cell.dataset.value = board[i];
    cell.classList.toggle('taken', board[i] !== '');
  });
}

function setTurnText(text, color = '') {
  turnIndicator.textContent = text;
  turnIndicator.style.color = color || '';
}

// Compute line geometry for the winning strike
function computeStrikeLine(combo) {
  const gridRect = tttGrid.getBoundingClientRect();
  const firstCell = cells[combo[0]].getBoundingClientRect();
  const lastCell  = cells[combo[2]].getBoundingClientRect();

  const x1 = firstCell.left + firstCell.width / 2  - gridRect.left;
  const y1 = firstCell.top  + firstCell.height / 2 - gridRect.top;
  const x2 = lastCell.left  + lastCell.width / 2   - gridRect.left;
  const y2 = lastCell.top   + lastCell.height / 2  - gridRect.top;

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle  = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  strikeLine.style.width     = `${length}px`;
  strikeLine.style.height    = '5px';
  strikeLine.style.left      = `${x1}px`;
  strikeLine.style.top       = `${y1 - 2.5}px`;
  strikeLine.style.transformOrigin = '0 50%';
  strikeLine.style.transform = `rotate(${angle}deg)`;
  strikeLine.classList.add('visible');
}

function handleEndGame(result) {
  gameOver = true;

  if (result.winner === 'tie') {
    scores.ties++;
    setTurnText("It's a Draw! 🤝", 'var(--color-amber-400)');
  } else {
    scores[result.winner]++;
    const isAIWin = vsAI && result.winner === 'O';
    const msg = isAIWin
      ? 'AI Rohith Wins! 🤖'
      : `${vsAI ? 'You Win' : `Player ${result.winner} Wins`}! 🎉`;
    setTurnText(msg, result.winner === 'X' ? 'var(--accent-ai)' : 'var(--accent-web)');

    result.combo.forEach(i => cells[i].classList.add('winner-cell'));
    computeStrikeLine(result.combo);
  }

  scorePlayerEl.textContent = scores.X;
  scoreTiesEl.textContent   = scores.ties;
  scoreAIEl.textContent     = scores.O;
}

function playerMove(idx) {
  if (gameOver || board[idx] !== '' || currentPlayer !== 'X') return;

  board[idx] = 'X';
  renderBoard();

  const result = checkWinner(board);
  if (result) { handleEndGame(result); return; }

  if (vsAI) {
    currentPlayer = 'O';
    setTurnText('AI is thinking…', 'var(--accent-web)');
    // Small delay for UX realism
    setTimeout(aiMove, 350);
  } else {
    currentPlayer = 'O';
    setTurnText('Player O\'s Turn (O)', 'var(--accent-web)');
  }
}

function localOpponentMove(idx) {
  if (gameOver || board[idx] !== '' || currentPlayer !== 'O') return;

  board[idx] = 'O';
  renderBoard();

  const result = checkWinner(board);
  if (result) { handleEndGame(result); return; }

  currentPlayer = 'X';
  setTurnText('Player X\'s Turn (X)', 'var(--accent-ai)');
}

// Minimax
function minimax(b, depth, isMaximizing) {
  const res = checkWinner(b);
  if (res) {
    if (res.winner === 'O')   return  10 - depth;
    if (res.winner === 'X')   return -10 + depth;
    if (res.winner === 'tie') return 0;
  }

  if (isMaximizing) {
    let best = -Infinity;
    b.forEach((cell, i) => {
      if (cell === '') {
        b[i] = 'O';
        best = Math.max(best, minimax(b, depth + 1, false));
        b[i] = '';
      }
    });
    return best;
  } else {
    let best = Infinity;
    b.forEach((cell, i) => {
      if (cell === '') {
        b[i] = 'X';
        best = Math.min(best, minimax(b, depth + 1, true));
        b[i] = '';
      }
    });
    return best;
  }
}

function aiMove() {
  if (gameOver) return;

  let bestVal = -Infinity, bestIdx = -1;

  board.forEach((cell, i) => {
    if (cell === '') {
      board[i] = 'O';
      const val = minimax(board, 0, false);
      board[i] = '';
      if (val > bestVal) { bestVal = val; bestIdx = i; }
    }
  });

  if (bestIdx !== -1) {
    board[bestIdx] = 'O';
    renderBoard();

    const result = checkWinner(board);
    if (result) { handleEndGame(result); return; }

    currentPlayer = 'X';
    setTurnText('Your Turn (X)', 'var(--accent-ai)');
  }
}

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const idx = Number(cell.dataset.index);
    if (!vsAI || currentPlayer === 'X') {
      if (vsAI) {
        playerMove(idx);
      } else {
        if (currentPlayer === 'X') playerMove(idx);
        else localOpponentMove(idx);
      }
    }
  });
});

function resetBoard() {
  board         = Array(9).fill('');
  currentPlayer = 'X';
  gameOver      = false;

  strikeLine.classList.remove('visible');

  cells.forEach(cell => {
    cell.textContent = '';
    cell.dataset.value = '';
    cell.classList.remove('taken', 'winner-cell');
  });

  const label = vsAI ? 'Your Turn (X)' : 'Player X\'s Turn (X)';
  setTurnText(label, 'var(--accent-ai)');
}

btnReset.addEventListener('click', resetBoard);

btnClearScores.addEventListener('click', () => {
  scores = { X: 0, O: 0, ties: 0 };
  scorePlayerEl.textContent = 0;
  scoreTiesEl.textContent   = 0;
  scoreAIEl.textContent     = 0;
  resetBoard();
});

updateModeUI();
resetBoard();

/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm      = document.getElementById('contact-form');
const contactSuccessMsg = document.getElementById('contact-success-msg');

contactForm.addEventListener('submit', () => {
  const name    = document.getElementById('c-name').value.trim();
  const email   = document.getElementById('c-email').value.trim();
  const message = document.getElementById('c-message').value.trim();

  if (!name || !email || !message) return;

  const subject = encodeURIComponent(`Portfolio Message from ${name}`);
  const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  const mailto  = `mailto:rohith2518r@gmail.com?subject=${subject}&body=${body}`;

  window.location.href = mailto;

  contactSuccessMsg.classList.remove('hidden');
  contactForm.reset();

  setTimeout(() => contactSuccessMsg.classList.add('hidden'), 8000);
});

/* ============================================================
   ACTIVE NAV HIGHLIGHTING (IntersectionObserver)
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => {
        link.style.color = '';
        link.style.background = '';
      });
      const activeLink = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
      if (activeLink) {
        activeLink.style.color = 'var(--accent-ai)';
        activeLink.style.background = 'rgba(139,92,246,0.1)';
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => navObserver.observe(section));
