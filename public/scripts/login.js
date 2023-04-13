$(document).ready(function() {
  const $login = $('#login-button');
  const $register = $('#register-button');

  $login.on('click', function(event) {
    event.preventDefault();
    const username = $("#username").val();
    const password = $("#password").val();
    const data = { username, password };

    $.ajax('/login', { method: 'POST', data: data })
      .then(function() {
        return document.location.href = '/';
      }).catch(function(error) {
        if (error.responseText) {
          alert(error.responseText);
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