const express = require('express');
const router  = express.Router();
const quizQueries = require('../db/queries/quizzes');

router.get('/:url', (req, res) => {
  const username = req.session.username;
  const url = req.params.url;

  if (!username) {
    return res.status(401).send('Action unauthorized. Must be logged in to continue.\n');
  }

  quizQueries.getQuiz(url)
    .then(quiz => {
      const templateVars = {
        username: username,
        creatorName: quiz[0].creator_id,
        quizTitle: quiz[0].title,
        quizDescription: quiz[0].description
      };
    
      res.render("../views/quiz", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
}); 

module.exports = router;
