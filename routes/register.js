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
  console.log('req.body', req.body)
  const username = req.body.username.toLowerCase();
  
  if (!(username && isAlphanumeric(username))) {
    return res.status(400).send('Username has to be alphanumeric');
  }

  userQueries.userExists(username)
  .then(userExists => {
    if (!userExists) {
        const password = bcrypt.hashSync(req.body.password, 10);
        userQueries.createUser(username, password)
          .then(() => {
            req.session.username = username;
            return res.status(200).send("user added")
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
