const db = require('../connection');

// get all attempts for specific user
const getAttempts = function(username) {
  const params = [username];
  const query = `
    SELECT attempts.id, user_id, quiz_id, url, score, max_score, username
    FROM attempts 
    JOIN users ON users.id = user_id
    WHERE username = $1;
  `;

  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// get specific attempt
const getAttempt = function(url) {
  const params = [url];
  const query = `SELECT * FROM attempts WHERE url = $1;`;

  return db.query(query, params)
    .then(data => {
      return data.rows[0];
    });
};

// create a new attempt
const createAttempt = function(userId, quizId, url, score, maxScore) {
  const params = [userId, quizId, url, score, maxScore];
  const query = `
    INSERT INTO attempts (user_id, quiz_id, url, score, max_score)
    VALUES ($1, $2, $3, $4, $5);
  `;
  
  return db.query(query, params)
    .then(data => {
      return data.rows[0];
    });
};

// update an existing attempt
const updateAttempt = function(userId, quizId, score) {
  const params = [userId, quizId, score];
  const query = `
    UPDATE attempts
    SET score = $3,
    WHERE user_id = $1 AND quiz_id = $2;
  `;
  
  return db.query(query, params)
    .then(data => {
      return data.rows[0];
    });
};

// check if url already exists in DB
const urlExists = function(url) {
  const params = [url];
  const query = `SELECT * FROM attempts WHERE url = $1;`;

  return db.query(query, params)
    .then(data => {
      return data.rows.length > 0;
    });
}

module.exports = { 
  getAttempts, 
  getAttempt, 
  createAttempt, 
  updateAttempt,
  urlExists
};
