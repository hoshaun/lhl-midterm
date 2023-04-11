$(document).ready(function() {
  const $submitButton = $('#create-quiz');
  const questions = $('#questions');
  const data = {
    questions: []
  };

  for (const question of questions) {
    data['questions'].push(question);
  }

  $submitButton.on('click', function() {
    $.ajax('/api/quizzes/create', { method: 'POST', data: data })
      .then(function() {
        console.log(data);
        return;
      })
      .catch(function() {
        alert('Failed to logout.');
      });
  });
});