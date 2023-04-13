const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');
const bcrypt = require('bcryptjs');

// render login page
router.get('/login', (req, res) => {
  const username = req.session.username;

  if (username) {
    return res.redirect('/');
  }

  res.render('login');
});

// login as existing user
router.post('/login', (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;

  userQueries.getUserByUsername(username)
    .then(user => {
      if (!user) {
        return res
          .status(400)
          .send("User does not exist please register");
      }
     
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(403).send('Incorrect Username or Password\n');
      }

      req.session.username = username;
      res.redirect('/');
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// REMEMBER TO CHANGE THIS BACK TO POST REQUEST
// POST logout
router.get("/logout", (req, res) => {
  req.session = null;
  res.redirect('/login');
});

module.exports = router;
