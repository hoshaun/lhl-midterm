const express = require('express');
const router  = express.Router();
const quizQueries = require('../db/queries/quizzes');
const { generateRandomString } = require('../helpers/helpers');

// get all public quizzes
router.get('/', (req, res) => {
  quizQueries.getQuizzes()
    .then(quizzes => {
      res.json({ quizzes });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// get specific quiz with specified URL
router.get('/:url', (req, res) => {
  quizQueries.getQuizId(req.params.url)
    .then(id => {
      return quizQueries.getQuiz(id);
    })
    .then(quiz => {
      res.json(quiz);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// create a new quiz
router.post('/create', (req, res) => {
  const creatorId = req.session.username;
  const title = req.body.title;
  const description = req.body.description;
  const isPublic = req.body.isPublic;
  let url = generateRandomString(10);

  while (quizQueries.urlExists(url)) {
    url = generateRandomString(10);
  }

  quizQueries.createQuiz(creatorId, title, description, url, isPublic)
    .then(() => {
      return res.redirect('/quizzes/my-quizzes');
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// delete a quiz with specified URL
router.delete('/delete/:url', (req, res) => {
  const url = req.params.url;

  quizQueries.getQuizId(url)
    .then(id => {
      return quizQueries.deleteQuiz(id);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
