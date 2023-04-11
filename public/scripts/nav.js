$(document).ready(function() {
  const $composeButton = $('#compose-button');
  
  // scroll to top and focus text area on click
  $composeButton.on('click', function() {
    $('html, body').animate({
      scrollTop: $(".container").offset().top - 50
    }, 'slow');
    $composeTextArea.focus();
  });
});