const db = require('../connection');

// get all public quizzes
const getQuizzes = function() {
  const query = `SELECT * FROM quizzes WHERE is_public IS TRUE;`;

  return db.query(query)
    .then(data => {
      return data.rows;
    });
};

// get all current user quizzes
const getUserQuizzes = function(userId) {
  const params = [userId];
  const query = `SELECT * FROM quizzes WHERE creator_id = $1;`;

  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// get specific quiz
const getQuiz = function(id) {
  const params = [id];
  const query = `
    SELECT username, quizzes.* FROM quizzes 
    JOIN users ON users.id = creator_id
    WHERE quizzes.id = $1;
  `;

  return db.query(query, params)
    .then(data => {
      return data.rows[0];
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

// get the solutions for a quiz
const getSolutions = function(id) {
  const params = [id];
  const query = `
    SELECT questions.number AS question_number, options.number AS option_number FROM quizzes
    JOIN questions ON quizzes.id = quiz_id
    JOIN options ON questions.id = question_id
    WHERE quizzes.id = $1 AND is_solution IS TRUE
    ORDER BY questions.number;
  `;

  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// create a new quiz
const createQuiz = function(creatorId, title, description, url, isPublic) {
  const params = [creatorId, title, description, url, isPublic];
  const query = `
    INSERT INTO quizzes (creator_id, title, description, url, is_public)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  
  return db.query(query, params)
    .then(data => {
      return data.rows[0];
    });
};

// delete specific quiz
const deleteQuiz = function(id) {
  const params = [id];
  const query = `DELETE FROM quizzes WHERE id = $1;`;
  
  return db.query(query, params)
    .then(() => {
      return;
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
  getUserQuizzes,
  getQuiz, 
  getQuizId, 
  getSolutions,
  createQuiz, 
  deleteQuiz,
  urlExists
};
