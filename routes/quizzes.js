const express = require('express');
const router  = express.Router();
const quizQueries = require('../db/queries/quizzes');
const questionQueries = require('../db/queries/questions');
const optionQueries = require('../db/queries/options');

/*
  Should make a templateVars that looks like:
  {
    username: username,
    quiz: {
      creator: username,
      title: title,
      description: description
    },
    questions: [
      {
        number: number,
        description: description,
        options: [
          {
            number: number,
            description: description
          }
        ]
      }
    ]
  }
*/
router.get('/:url', (req, res) => {
  const username = 'user1';//req.session.username;
  const url = req.params.url;

  if (!username) {
    return res.status(401).send('Action unauthorized. Must be logged in to continue.\n');
  }

  const templateVars = {username: username};

  quizQueries.getQuiz(url)
    .then(quiz => {
      templateVars['quiz'] = {
        creator: quiz[0].username,
        title: quiz[0].title,
        description: quiz[0].description
      };

      return questionQueries.getQuestions(quiz[0].id);
    })
    .then(questions => {
      templateVars['questions'] = questions;
      
      for (const i in questions) {
        optionQueries.getOptions(questions[i].id)
          .then(options => {
            templateVars['questions'][i]['options'] = options;
          })
          .then(() => {
            res.json({ templateVars });
            //res.render('../views/quiz', templateVars);
          })
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
}); 

module.exports = router;
