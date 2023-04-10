const db = require('../connection');

// get all options for a specified question ID
const getOptions = function(id) {
  const params = [id];
  const query = `
    SELECT * FROM options 
    WHERE question_id = $1
    ORDER BY number;
  `;

  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// create a new option
const createOption = function(quizId, number, description) {
  const params = [quizId, number, description];
  const query = `
    INSERT INTO options (quiz_id, number, description)
    VALUES ($1, $2, $3);
  `;
  
  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

module.exports = { 
  getOptions, 
  createOption
};
