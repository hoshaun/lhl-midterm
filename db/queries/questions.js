const db = require('../connection');

// get all questions for a specified quiz ID
const getQuestions = function(id) {
  const params = [id];
  const query = `
    SELECT * FROM questions 
    WHERE quiz_id = $1
    ORDER BY number;
  `;

  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// create a new question
const createQuestion = function(quizId, number, description) {
  const params = [quizId, number, description];
  const query = `
    INSERT INTO questions (quiz_id, number, description)
    VALUES ($1, $2, $3);
  `;
  
  return db.query(query, params)
    .then(data => {
      return data.rows[0];
    });
};

module.exports = { 
  getQuestions, 
  createQuestion
};
