// HOME PAGE BUTTON. WORKING

$(document).ready(function() {
  const $homePageButton = $('#home-page');
  const $logoutButton = $('#logout');

  $homePageButton.on('click', function() {
    document.location.href = '/';
  });

  // MY QUIZZES BUTTON

  const $myquizzesButton = $('#my-quizzes');
  // const $logoutButton = $('#logout');
  $myquizzesButton.on('click', function() {
    console.log("test")
    document.location.href = '/quizzes/my-quizzes';
  });

// keep code above

// MY QUIZZES BETTON

// $(document).ready(function() {
//   // const $loginButton = $('#Login');
//   const $myquizzesButton = $('#my-quizzes');
//   // const $logoutButton = $('#logout');
//   $myquizzesButton.on('click', function() {
//     console.log("test")
//     document.location.href = '/quizzes/my-quizzes';
//   });
// });

// MY ATTEMPTS BUTTON

$(document).ready(function() {
  const $myAttemptsButton = $('#my-attempts');
  const $logoutButton = $('#logout');
  $myAttemptsButton.on('click', function() {
    document.location.href = '/quizzes/my-attempts';
  });
});

// CREATE A QUIZZ BUTTON

$(document).ready(function() {
  const $createQuizButton = $('#create-quiz');
  const $logoutButton = $('#logout');
  $createQuizButton.on('click', function() {
    document.location.href = '/quizzes/create';
  });
});


  //POST BElOW - KEEP - LOGOUT BUTTON WORKING

  $logoutButton.on('click', function() {
    $.ajax('/logout', { method: 'POST' })
      .then(function() {
        document.location.href = '/login';
      })
      .catch(function() {
        alert('Failed to logout.');
      });
  });
});
