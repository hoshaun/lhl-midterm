const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');
const quizQueries = require('../db/queries/quizzes');
const attemptQueries = require('../db/queries/attempts');
const { generateRandomString } = require('../helpers/helpers');

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
  
  userQueries.getUserId(username)
    .then(id => {
      return { 
        userId: id, 
        quizId: quizQueries.getQuizId(quizUrl) 
      };
    })
    .then(data => {
      const userId = data.userId;
      const quizId = data.quizId;
    
      attemptQueries.createAttempt(userId, quizId, url, score, maxScore)
        .then(attempts => {
          res.json({ attempts });
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

// update an existing attempt
router.post('/update', (req, res) => {
  const username = req.session.username;
  const quizUrl = req.body.quizUrl;
  const score = req.body.score;
  
  userQueries.getUserId(username)
    .then(id => {
      return { 
        userId: id, 
        quizId: quizQueries.getQuizId(quizUrl) 
      };
    })
    .then(data => {
      const userId = data.userId;
      const quizId = data.quizId;
    
      attemptQueries.updateAttempt(userId, quizId, score)
        .then(attempts => {
          res.json({ attempts });
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
