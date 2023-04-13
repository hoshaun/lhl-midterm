$(document).ready(function() {
  const $submitButton = $('#create-attempt');
  const $quizForm = $('#quiz-form');
  const $questions = $('.question');
  const quizUrl = document.location.pathname.split('/')[2];
  const numOfQuestions = $questions.length;

  // submit quiz creation form
  $submitButton.on('click', function(e) {
    e.preventDefault();

    // setup attempt submission data for POST request
    const attemptData = {
      quizUrl: quizUrl,
      score: 0,
      maxScore: numOfQuestions
    };

    const $answers = $quizForm.find(`.answer`);
    const answers = [];

    // get the user selected answers for each question
    $answers.each(function() {
      let isSelected = $(this).prop('checked');
      let optionNumber = $(this).parent().text().trim().charAt(0);
      if (isSelected) {
        answers.push(Number(optionNumber));
      }
    });

    if (answers.length !== numOfQuestions) {
      return alert('Some questions have not been answered.');
    }

    // calculate score
    $.ajax(`/api/quizzes/solutions/${quizUrl}`, { method: 'GET' })
      .then(function(solutions) {
        for (const i in answers) {
          if (answers[i] === solutions[i].option_number) {
            attemptData.score++;
          }
        }
        return attemptData;
      })
      .then(attemptData => {
        // send POST request to create new attempt or update existing attempt
        $.ajax('/api/attempts/create', { method: 'POST', data: attemptData })
          .then(function(attempt) {
            return document.location.href = `/attempts/${attempt.url}`;
          })
          .catch(function() {
            alert('Failed to submit quiz.');
          });
      })
      .catch(function() {
        alert('Failed to calculate score.');
      });
  });
});