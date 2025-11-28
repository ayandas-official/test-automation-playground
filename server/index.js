
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// In-memory stores
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'tester' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'admin' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'viewer' },
];
let nextUserId = 4;

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Delay endpoint
app.get('/api/delay', async (req, res) => {
  const ms = Math.min(parseInt(req.query.ms || '1000', 10), 10000);
  await new Promise(r => setTimeout(r, ms));
  res.json({ delayedMs: ms, at: Date.now() });
});

// Random error endpoint
app.get('/api/random-error', (req, res) => {
  const chance = Math.random();
  if (chance < 0.3) {
    return res.status(500).json({ error: 'Random failure occurred' });
  }
  res.json({ ok: true, chance });
});

// Rate limit (5 requests per minute)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.set('Retry-After', '60');
    res.status(429).json({ error: 'Too many requests', retryAfterSeconds: 60 });
  }
});
app.get('/api/rate-limit', limiter, (req, res) => {
  res.json({ ok: true, message: 'You are within rate limits' });
});

// Users CRUD
app.get('/api/users', (req, res) => {
  res.json(users);
});
app.post('/api/users', (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Validation failed', details: { name: !!name, email: !!email } });
  }
  const newUser = { id: nextUserId++, name, email, role: role || 'tester' };
  users.push(newUser);
  res.status(201).json(newUser);
});
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  users = users.filter(u => u.id !== id);
  res.status(204).end();
});

// File upload
const upload = multer({ dest: path.join(__dirname, 'uploads') });
app.post('/api/upload', upload.array('files', 5), (req, res) => {
  const filesInfo = (req.files || []).map(f => ({
    field: f.fieldname,
    filename: f.originalname,
    size: f.size,
    mimetype: f.mimetype,
    savedAs: f.filename,
  }));
  res.json({ uploaded: filesInfo });
});


// Popup window content for window-handling tests
app.get('/api/popup-content', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!doctype html>
  <html><head><title>Popup</title>
    <style>body{font-family:system-ui;margin:10px}button{background:#0ea5e9;color:#fff;border:none;padding:6px 10px;border-radius:4px}</style>
  </head>
  <body>
    <h3 id="popup-title">Popup Window</h3>
    <p>This window can communicate with opener via postMessage.</p>
    <button id="btn">Send message to opener</button>
    <script>
      document.getElementById('btn').addEventListener('click', () => {
        window.opener && window.opener.postMessage('Message from popup!', 'http://localhost:3001');
      });
      window.addEventListener('message', (e) => {
        const p = document.createElement('p');
        p.textContent = 'Received in popup: ' + e.data;
        document.body.appendChild(p);
      });
    </script>
  </body></html>`);
});


// SSE (Server-Sent Events)
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders && res.flushHeaders();

  let count = 0;
  const interval = setInterval(() => {
    count += 1;
    res.write(`event: tick
`);
    res.write(`data: ${JSON.stringify({ count, time: new Date().toISOString() })}

`);
    if (count >= 10) {
      clearInterval(interval);
      res.write('event: end');
      res.write('data: stream closed');
      res.end();
    }
  }, Math.floor(Math.random() * 1000) + 500);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// Auth endpoints
function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password123') {
    const token = jwt.sign({ sub: '1', username, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    return res.json({ ok: true });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

app.get('/api/auth/profile', authMiddleware, (req, res) => {
  res.json({ user: { id: req.user.sub, username: req.user.username, role: req.user.role } });
});

// Iframe content
app.get('/api/iframe-content', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!doctype html>
  <html><head><title>Iframe Inner</title></head>
  <body>
    <h3 id="inner-title">Iframe Content</h3>
    <button id="iframe-btn" onclick="document.getElementById('msg').textContent='Clicked!'">Click me</button>
    <p id="msg"></p>
  </body></html>`);
});

// Serve built client (production)
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
