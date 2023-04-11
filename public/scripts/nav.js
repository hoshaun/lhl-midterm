$(document).ready(function() {
  const $homePageButton = $('#home-page');
  const $logoutButton = $('#logout');

  $homePageButton.on('click', function() {
    document.location.href = '/';
  });

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