$(document).ready(function() {
  const $login = $('.login-form');
  const $register = $('#register-button');

  $login.on('submit', function(event) {
    event.preventDefault();
    const username = $("#username").val();
    const password = $("#password").val();
    const data = { username, password };

    $.ajax('/login', { method: 'POST', data: data })
      .then(function() {
        return document.location.href = '/';
      }).catch(function(error) {
        if (error.responseText) {
          $(".error-message").text(error.responseText);
        }
      });
  });

  $register.on('click', function() {
    $.ajax('/register', { method: 'GET' })
      .then(function() {
        return document.location.href = '/register';
      });
  });
});