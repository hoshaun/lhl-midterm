const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');
const quizQueries = require('../db/queries/quizzes');
const questionQueries = require('../db/queries/questions');
const optionQueries = require('../db/queries/options');
const attemptQueries = require('../db/queries/attempts');

// render all user attempts
router.get('/', (req, res) => {
  const username = req.session.username;

  if (!username) {
    return res.redirect('/login');
  }

  const templateVars = {username: username};
  
  attemptQueries.getAttempts(username)
    .then(async attempts => {
      templateVars['attempts'] = attempts;
      for (const i in attempts) {
        await quizQueries.getQuiz(attempts[i].quiz_id)
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

  const templateVars = {};

  attemptQueries.getAttempt(url)
    .then(attempt => {
      templateVars['attempt'] = {
        userId: attempt.user_id,
        quizId: attempt.quiz_id,
        attemptUrl: attempt.url,
        score: attempt.score,
        maxScore: attempt.max_score
      };

      return userQueries.getUser(attempt.user_id);
    })
    .then(user => {
      templateVars['attempt']['username'] = user.username;
      return quizQueries.getQuiz(templateVars.attempt.quizId);
    })
    .then(quiz => {
      templateVars['attempt']['quizTitle'] = quiz.title;
      templateVars['attempt']['quizDescription'] = quiz.description;
      templateVars['attempt']['quizUrl'] = quiz.url;
    })
    .then(() => {
      res.render('score', templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
}); 

module.exports = router;
