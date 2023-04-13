$(document).ready(function() {
  const $loginHereButton = $('#login-here-button');
  const $register = $('.register-form');
  
  $register.on('submit', function(event) {
    event.preventDefault();
    const username = $("#username").val();
    const password = $("#password").val();
    const data = { username, password };
  
    $.ajax('/register', { method: 'POST', data: data })
      .then(function() {
        return document.location.href = '/';
      }).catch((error) => {
        $(".error-message").text(error.responseText)
      }) 
  });

  $loginHereButton.on('click', function() {
    $.ajax('/login', { method: 'GET' })
      .then(function() {
        return document.location.href = '/login';
      })
  });
});