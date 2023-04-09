const db = require('../connection');

// get all users
const getUsers = function() {
  const query = `SELECT * FROM users;`;

  return db.query(query)
    .then(data => {
      return data.rows;
    });
};

// get specific user
const getUser = function(id) {
  const params = [id];
  const query = `SELECT * FROM users WHERE id = $1;`;

  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// create a new user
const createUser = function(username, password) {
  const params = [username, password];
  const query = `
    INSERT INTO users (username, password)
    VALUES ($1, $2);
  `;
  
  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// update an existing user
const updateUsername = function(id, username) {
  const params = [id, username];
  const query = `
    UPDATE users
    SET username = $2,
    WHERE id = $1;
  `;
  
  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// update an existing user
const updatePassword = function(id, password) {
  const params = [id, password];
  const query = `
    UPDATE users
    SET password = $2,
    WHERE id = $1;
  `;
  
  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// delete specific user
const deleteUser = function(id) {
  const params = [id];
  const query = `DELETE FROM users WHERE id = $1;`;
  
  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

module.exports = { 
  getUsers, 
  getUser, 
  createUser, 
  updateUsername,
  updatePassword,
  deleteUser
};
