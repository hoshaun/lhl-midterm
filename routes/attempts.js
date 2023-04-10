const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');
const quizQueries = require('../db/queries/quizzes');
const attemptQueries = require('../db/queries/attempts');

// render all user attempts
router.get('/', (req, res) => {
  const username = req.session.username;

  if (!username) {
    return res.redirect('/login');
  }

  const templateVars = {username: username};
  
  attemptQueries.getAttempts(username)
    .then(attempts => {
      templateVars['attempts'] = attempts;
      for (const i in attempts) {
        quizQueries.getQuiz(attempts[i].quiz_id)
          .then(quiz => {
            templateVars['attempts'][i]['quiz'] = quiz;
            return userQueries.getUser(quiz.creator_id);
          })
          .then(creator => {
            templateVars['attempts'][i]['quiz']['creator_name'] = creator.username;
          })
          .then(() => {
            res.render('my_attempts', templateVars);
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


// render a specific attempt
router.get('/:url', (req, res) => {
  const username = req.session.username;
  const url = req.params.url;

  if (!username) {
    return res.redirect('/login');
  }

  const templateVars = {username: username};

  attemptQueries.getAttempt(url)
    .then(attempt => {
      templateVars['attempt'] = {
        creator: attempt[0].score,
        title: attempt[0].title,
        description: attempt[0].description
      };

      return questionQueries.getQuestions(attempt[0].id);
    })
    .then(questions => {
      templateVars['questions'] = questions;

      for (const i in questions) {
        optionQueries.getOptions(questions[i].id)
          .then(options => {
            templateVars['questions'][i]['options'] = options;
          })
          .then(() => {
            res.render('attempt', templateVars);
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
