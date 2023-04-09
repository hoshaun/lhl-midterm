/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const app = express();
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const userQueries = require('../db/queries/users');
const { isAlphanumeric } = require('../helpers/helpers');

app.use(cookieSession({
  name: 'session',
  keys: ['LHL-midterm'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// get all users
router.get('/', (req, res) => {
  userQueries.getUsers()
    .then(users => {
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// get specific user with specified username
router.get('/:username', (req, res) => {
  userQueries.getUser(req.params.username)
    .then(user => {
      res.json({ user });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// create a new user
router.get('/create', (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = bcrypt.hashSync(req.body.password, 10);

  if (!(username && password && isAlphanumeric(username))) {
    return res.status(400).send('Status: Bad Request\n');
  }

  userQueries.userExists(username)
    .then(userExists => {
      if (!userExists) {
        userQueries.createUser(username, password)
          .then(users => {
            req.session.username = username;
            return res.json({ users });
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
