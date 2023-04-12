const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');
const quizQueries = require('../db/queries/quizzes');
const questionQueries = require('../db/queries/questions');
const optionQueries = require('../db/queries/options');
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
  // quiz properties
  const title = req.body.title;
  const description = req.body.description;
  const isPublic = req.body.isPublic;
  let url = generateRandomString(10);
  const questions = req.body.questions;

  userQueries.getUserId(req.session.username)
    .then(creatorId => {
      return quizQueries.createQuiz(creatorId, title, description, url, isPublic);
    })
    .then(newQuiz => {
      for (const question of questions) {
        questionQueries.createQuestion(newQuiz.id, question.number, question.description)
          .then(newQuestion => {
            for (const option of question.options) {
              optionQueries.createOption(newQuestion.id, option.number, option.description, option.isSolution)
                .then(() => {
                  res.redirect('/quizzes/my-quizzes');
                })
                .catch(err => {
                  console.log(err);
                  res
                    .status(500)
                    .json({ error: err.message });
                });
            }
          })
          .catch(err => {
            console.log(err);
            res
              .status(500)
              .json({ error: err.message });
          });
      };
    })
    .catch(err => {
      console.log(err);
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
