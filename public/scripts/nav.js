$(document).ready(function() {
  const $homePageButton = $('#home-page');
  const $logoutButton = $('#logout');
  const $myQuizzesButton = $('#my-quizzes');
  const $myAttemptsButton = $('#my-attempts');
  const $createQuizButton = $('#create-quiz');

  // home page button
  $homePageButton.on('click', function() {
    return document.location.href = '/';
  });

  // my quizzes button
  $myQuizzesButton.on('click', function() {
    return document.location.href = '/quizzes/my-quizzes';
  });

  // my attempts button
  $myAttemptsButton.on('click', function() {
    return document.location.href = '/attempts';
  });

  // create quiz button
  $createQuizButton.on('click', function() {
    return document.location.href = '/quizzes/create';
  });

  // logout button
  $logoutButton.on('click', function() {
    $.ajax('/logout', { method: 'POST' })
      .then(function() {
        return document.location.href = '/login';
      })
      .catch(function() {
        alert('Failed to logout.');
      });
  });
});
