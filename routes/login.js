const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');

router.get('/', (req, res) => {
  const username = req.session.username;

  if (username) {
    return res.redirect('/');
  }

  res.render('login');
});

router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  userQueries.getUserId(username)
    .then(id => {
      return userQueries.getUser(id);
    })
    .then(user => {
      if (!(user && bcrypt.compareSync(password, user.password))) {
        return res.status(403).send('Status: Incorrect Email or Password\n');
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

module.exports = router;
