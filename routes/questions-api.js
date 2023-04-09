const express = require('express');
const router  = express.Router();
const questionQueries = require('../db/queries/questions');

// get all questions for a specific quiz
router.get('/', (req, res) => {
  const quizId = req.body.quizId;

  questionQueries.getQuestions(quizId)
    .then(questions => {
      res.json({ questions });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// create a new question
router.get('/create', (req, res) => {
  const creatorId = req.session.username;
  const title = req.body.title;
  const description = req.body.description;
  const isPublic = req.body.isPublic;
  let url = generateRandomString(10);

  while (questionQueries.urlExists(url)) {
    url = generateRandomString(10);
  }

  questionQueries.createQuestion(creatorId, title, description, url, isPublic)
    .then(questions => {
      res.json({ questions });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
