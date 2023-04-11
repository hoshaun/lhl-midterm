/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const router  = express.Router();
const userQueries = require('../db/queries/users');
const { isAlphanumeric } = require('../helpers/helpers');

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
router.get('/profile/:username', (req, res) => {
  userQueries.getUserId(req.params.username)
    .then(id => {
      return userQueries.getUser(id)
    })
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
router.post('/create', (req, res) => {
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
