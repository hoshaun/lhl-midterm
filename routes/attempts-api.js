const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');
const quizQueries = require('../db/queries/quizzes');
const attemptQueries = require('../db/queries/attempts');
const { generateRandomString } = require('../helpers/helpers');
const e = require('express');

// get all attempts
router.get('/', (req, res) => {
  attemptQueries.getAttempts(req.session.username)
    .then(attempts => {
      res.json({ attempts });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// get specific attempt with specified URL
router.get('/:url', (req, res) => {
  attemptQueries.getAttempt(req.params.url)
    .then(attempt => {
      res.json(attempt);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// create a new attempt
router.post('/create', (req, res) => {
  const username = req.session.username;
  const quizUrl = req.body.quizUrl;
  const score = req.body.score;
  const maxScore = req.body.maxScore;
  let url = generateRandomString(10);
  let userId, quizId;
  
  // create new attempt
  userQueries.getUserId(username)
    .then(id => {
      userId = id;
      return quizQueries.getQuizId(quizUrl);
    })
    .then(id => {
      quizId = id;
      return attemptQueries.findExistingAttempt(userId, quizId);
    })
    .then(attempt => {
      // if a previous attempt was made, update existing attempt
      if (attempt) {
        attemptQueries.updateAttempt(userId, quizId, score)
          .then(attempt => {
            res.json(attempt);
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: err.message });
          });
      // no previous attempt made, create a new record
      } else {
        attemptQueries.createAttempt(userId, quizId, url, score, maxScore)
          .then(attempt => {
            res.json(attempt);
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: err.message });
          });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// update an existing attempt
router.post('/update', (req, res) => {
  const username = req.session.username;
  const quizUrl = req.body.quizUrl;
  const score = req.body.score;
  let userId, quizId;
  
  userQueries.getUserId(username)
    .then(id => {
      userId = id;
      return quizQueries.getQuizId(quizUrl);
    })
    .then(id => {
      quizId = id;
      attemptQueries.updateAttempt(userId, quizId, score)
        .then(attempt => {
          res.json(attempt);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
