$(document).ready(function() {
  const $loginHereButton = $('#login-here-button');
  const $register = $('#register-button');
  
  $register.on('click', function(event) {
    event.preventDefault();
    const username = $("#username").val();
    const password = $("#password").val();
    const data = { username, password };
  
    $.ajax('/register', { method: 'POST', data: data })
      .then(function() {
        return document.location.href = '/';
      }).catch((error) => {
        alert(error.responseText);
      }) 
  });

  $loginHereButton.on('click', function() {
    $.ajax('/login', { method: 'GET' })
      .then(function() {
        return document.location.href = '/login';
      })
  });
});