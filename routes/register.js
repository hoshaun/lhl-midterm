const express = require('express');
const bcrypt = require('bcryptjs');
const router  = express.Router();
const userQueries = require('../db/queries/users');

router.get('/', (req, res) => {
  const username = req.session.username;

  if (username) {
    return res.redirect('/');
  }

  res.render('register');
});

router.post('/', (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = bcrypt.hashSync(req.body.password, 10);

  if (!(username && password && isAlphanumeric(username))) {
    return res.status(400).send('Status: Bad Request\n');
  }

  userQueries.userExists(username)
    .then(userExists => {
      if (!userExists) {
        userQueries.createUser(username, password)
          .then(user => {
            req.session.username = username;
            return res.json({ user });
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
