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
const getUser = function(username) {
  const params = [username];
  const query = `SELECT * FROM users WHERE username = $1;`;

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
const updateUsername = function(oldUsername, newUsername) {
  const params = [oldUsername, newUsername];
  const query = `
    UPDATE users
    SET username = $2,
    WHERE username = $1;
  `;
  
  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// update an existing user
const updatePassword = function(username, password) {
  const params = [username, password];
  const query = `
    UPDATE users
    SET password = $2,
    WHERE username = $1;
  `;
  
  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// delete specific user
const deleteUser = function(username) {
  const params = [username];
  const query = `DELETE FROM users WHERE username = $1;`;
  
  return db.query(query, params)
    .then(data => {
      return data.rows;
    });
};

// check if username already exists in DB
const userExists = function(username) {
  const params = [username];
  const query = `SELECT * FROM users WHERE username = $1;`;

  return db.query(query, params)
    .then(data => {
      return data.rows.length > 0;
    });
}

module.exports = { 
  getUsers, 
  getUser, 
  createUser, 
  updateUsername,
  updatePassword,
  deleteUser,
  userExists
};
