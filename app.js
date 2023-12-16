// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Database setup
const db = mysql.createConnection({
  host: 'your-mysql-host',
  user: 'your-mysql-user',
  password: 'your-mysql-password',
  database: 'your-mysql-database',
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Create Person table if it doesn't exist
db.query(`
  CREATE TABLE IF NOT EXISTS Person (
    PARTY_ID VARCHAR(40) PRIMARY KEY,
    SALUTATION VARCHAR(255),
    FIRST_NAME VARCHAR(255),
    MIDDLE_NAME VARCHAR(255),
    LAST_NAME VARCHAR(255),
    GENDER CHAR(1),
    BIRTH_DATE DATE,
    MARITAL_STATUS_ENUM_ID VARCHAR(40),
    EMPLOYMENT_STATUS_ENUM_ID VARCHAR(40),
    OCCUPATION VARCHAR(255)
  );
`, err => {
  if (err) {
    console.error('Error creating Person table:', err);
  }
});

// Create a new person
app.post('/persons', (req, res) => {
  const person = req.body;

  db.query(
    'INSERT INTO Person SET ?',
    person,
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json(person);
    }
  );
});

// Update a person
app.put('/persons/:partyId', (req, res) => {
  const partyId = req.params.partyId;
  const updatedPerson = req.body;

  db.query(
    'UPDATE Person SET ? WHERE PARTY_ID = ?',
    [updatedPerson, partyId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(updatedPerson);
    }
  );
});

// Get all persons
app.get('/persons', (req, res) => {
  db.query('SELECT * FROM Person', (err, persons) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(persons);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
