const express = require('express');
const router  = express.Router();
const quizQueries = require('../db/queries/quizzes');
const questionQueries = require('../db/queries/questions');

router.get('/:url', (req, res) => {
  const username = req.session.username;
  const url = req.params.url;

  if (!username) {
    return res.status(401).send('Action unauthorized. Must be logged in to continue.\n');
  }

  quizQueries.getQuiz(url)
    .then(quiz => {
      questionQueries.getQuestions(quiz[0].id)
      .then(questions => {
        const templateVars = {
          username: username,
          quiz: {
            creator: quiz[0].creator_id,
            title: quiz[0].title,
            description: quiz[0].description
          },
          questions: questions
        };
      
        res.render("../views/quiz", templateVars);
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
