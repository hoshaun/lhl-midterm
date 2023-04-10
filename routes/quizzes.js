const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');
const quizQueries = require('../db/queries/quizzes');
const questionQueries = require('../db/queries/questions');
const optionQueries = require('../db/queries/options');

// render all public quizzes
router.get('/', (req, res) => {
  const username = req.session.username;

  if (!username) {
    return res.redirect('/login');
  }

  const templateVars = {username: username};
  
  quizQueries.getQuizzes()
    .then(quizzes => {
      templateVars['quizzes'] = quizzes;
    })
    .then(() => {
      res.render('index', templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// render all current user quizzes
router.get('/my-quizzes', (req, res) => {
  const username = 'user1'//req.session.username;

  if (!username) {
    return res.redirect('/login');
  }

  const templateVars = {username: username};

  userQueries.getUserId(username)
    .then(id => {
      return quizQueries.getUserQuizzes(id);
    })
    .then(quizzes => {
      templateVars['quizzes'] = quizzes;
    })
    .then(() => {
      res.json(templateVars);
      res.render('index', templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});


// render a specific quiz
router.get('/:url', (req, res) => {
  const username = req.session.username;
  const url = req.params.url;

  if (!username) {
    return res.redirect('/login');
  }

  const templateVars = {username: username};

  quizQueries.getQuizId(url)
    .then(id => {
      return quizQueries.getQuiz(id);
    })
    .then(quiz => {
      templateVars['quiz'] = {
        creator: quiz.username,
        title: quiz.title,
        description: quiz.description
      };

      return questionQueries.getQuestions(quiz.id);
    })
    .then(questions => {
      templateVars['questions'] = questions;

      for (const i in questions) {
        optionQueries.getOptions(questions[i].id)
          .then(options => {
            templateVars['questions'][i]['options'] = options;
          })
          .then(() => {
            res.render('quiz', templateVars);
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

module.exports = router;
