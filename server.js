const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'root', // replace with your MySQL password
    database: 'quiz_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route to get quiz questions
app.get('/questions', (req, res) => {
    connection.query('SELECT * FROM questions', (err, results) => {
        if (err) {
            console.error('Error fetching questions:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Route to add a new question
app.post('/add-question', (req, res) => {
    const { question, option1, option2, option3, option4, correct_option } = req.body;
    const query = 'INSERT INTO questions (question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [question, option1, option2, option3, option4, correct_option], (err, results) => {
        if (err) {
            console.error('Error adding question:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true });
        }
    });
});

// Route to delete a question
app.delete('/delete-question/:id', (req, res) => {
    const questionId = req.params.id;
    const query = 'DELETE FROM questions WHERE id = ?';
    connection.query(query, [questionId], (err, results) => {
        if (err) {
            console.error('Error deleting question:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
