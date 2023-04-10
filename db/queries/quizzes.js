const db = require('../connection');

// get all public quizzes
const getQuizzes = function() {
  const query = `SELECT * FROM quizzes WHERE is_public IS TRUE;`;

  return db.query(query)
    .then(data => {
      return data.rows;
    });
};

// get specific quiz
const getQuiz = function(url) {
  const params = [url];
  const query = `
    SELECT username, quizzes.* FROM quizzes 
    JOIN users ON users.id = creator_id
    WHERE url = $1;
  `;

  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// get specific quiz ID
const getQuizId = function(url) {
  const params = [url];
  const query = `SELECT id FROM quizzes WHERE url = $1;`;

  return db.query(query, params)
    .then(data => {
      return data.rows[0].id;
    });
}

// create a new quiz
const createQuiz = function(creatorId, title, description, url, isPublic) {
  const params = [creatorId, title, description, url, isPublic];
  const query = `
    INSERT INTO quizzes (creator_id, title, description, url, is_public)
    VALUES ($1, $2, $3, $4, $5);
  `;
  
  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// delete specific quiz
const deleteQuiz = function(url) {
  const params = [url];
  const query = `DELETE FROM quizzes WHERE url = $1;`;
  
  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// check if url already exists in DB
const urlExists = function(url) {
  const params = [url];
  const query = `SELECT * FROM quizzes WHERE url = $1;`;

  return db.query(query, params)
    .then(data => {
      return data.rows.length > 0;
    });
}

module.exports = { 
  getQuizzes, 
  getQuiz, 
  getQuizId, 
  createQuiz, 
  deleteQuiz,
  urlExists
};
