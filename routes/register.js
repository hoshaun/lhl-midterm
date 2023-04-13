const express = require('express');
const bcrypt = require('bcryptjs');
const router  = express.Router();
const userQueries = require('../db/queries/users');
const { isAlphanumeric } = require('../helpers/helpers')

// render register page
router.get('/', (req, res) => {
  const username = req.session.username;

  if (username) {
    return res.redirect('/');
  }

  res.render('register');
});

// register a new user
router.post('/', (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  
  if (!(username && isAlphanumeric(username))) {
    return res.status(400).send('Username has to be alphanumeric');
  }

  if (!password) {
    return res.status(400).send('Password cannot be empty.');
  }

  userQueries.userExists(username)
  .then(userExists => {
    if (!userExists) {
        const encryptedPassword = bcrypt.hashSync(password, 10);
        userQueries.createUser(username, encryptedPassword)
          .then(() => {
            req.session.username = username;
            res.status(200).send("user added");
            res.redirect('/');
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: err.message });
          });
      } else {
        return res.status(409).send('Username is already taken.\n');
      }
    })
}); 

module.exports = router;
