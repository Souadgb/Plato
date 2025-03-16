const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Default XAMPP MySQL username
  password: '', // Default XAMPP MySQL password
  database: 'plato'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Unauthorized');

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    req.userId = decoded.id;
    next();
  });
}

// User sign-up
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, hashedPassword], (err, result) => {
    if (err) return res.status(500).send('Error signing up');
    res.status(201).send('User created');
  });
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, result) => {
    if (err || result.length === 0) return res.status(400).send('Invalid credentials');

    const user = result[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user.id }, 'secret_key');
    res.send({ token, userId: user.id });
  });
});

// Save a review
app.post('/reviews', authenticateToken, (req, res) => {
  const { bookTitle, rating, reviewText } = req.body;
  const userId = req.userId;

  const query = 'INSERT INTO reviews (book_title, rating, review_text, user_id) VALUES (?, ?, ?, ?)';
  db.query(query, [bookTitle, rating, reviewText, userId], (err, result) => {
    if (err) return res.status(500).send('Error saving review');
    res.status(201).send('Review saved');
  });
});

// Get user's reviews
app.get('/reviews', authenticateToken, (req, res) => {
  const userId = req.userId;

  const query = 'SELECT * FROM reviews WHERE user_id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).send('Error fetching reviews');
    res.send(result);
  });
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));