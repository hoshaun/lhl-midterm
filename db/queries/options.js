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
const createOption = function(questionId, number, description, isSolution) {
  const params = [questionId, number, description, isSolution];
  const query = `
    INSERT INTO options (question_id, number, description, is_solution)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  
  return db.query(query, params)
    .then(data => {
      return data.rows[0];
    });
};

module.exports = { 
  getOptions, 
  createOption
};
