$(document).ready(function() {
  const $addQuestionButton = $('#add-question');
  const $submitButton = $('#create-quiz');
  const $quizForm = $('#quiz-form');
  const $titleInput = $('#title-input');
  const $descriptionInput = $('#description-input');
  const $makePrivateInput = $('#make-private-input');
  const $questionNumbers = $('.question-number');
  let numOfQuestions = $questionNumbers.length;

  // submit quiz creation form
  $submitButton.on('click', function(e) {
    e.preventDefault();

    const $questionNumbers = $('.question-number');

    // setup quiz submission data for POST request
    const quizData = {
      title: $titleInput.val(),
      description: $descriptionInput.val(),
      isPublic: $makePrivateInput.prop('checked') ? false : true,
      questions: []
    };

    // loop through each question
    $questionNumbers.each(function(questionIndex) {
      let questionNumber = questionIndex + 1;
      let $questionDescription = $(`#question-description-${questionNumber}`);
      let $options = $quizForm.find($(`#question-${questionNumber} .option`));
      let $isSolution = $quizForm.find($(`#question-${questionNumber} .is-solution`));
      let questionDescription = $quizForm.find($questionDescription).val();
      let options = [];

      // loop through options for each question
      $options.each(function(optionIndex, option) {
        options.push({ 
          number: optionIndex + 1,
          description: option.value
        });
      });

      // add the data to decide which option is the correct solution for the question
      $isSolution.each(function(isSolutionIndex, isSolution) {
        options[isSolutionIndex]['isSolution'] = isSolution.checked;
      });

      // push each question/options data to quizData
      quizData['questions'].push({
        number: questionNumber,
        description: questionDescription,
        options: options
      });
    });

    // send POST request to create quiz API
    $.ajax('/api/quizzes/create', { method: 'POST', data: quizData })
      .then(function() {
        return document.location.href = '/login';
      })
      .catch(function() {
        alert('Failed to create quiz.');
      });
  });

  $addQuestionButton.on('click', function(e) {
    e.preventDefault();
    addQuestion();
  });

  // create new question HTML element
  const createQuestionElement = function(questionNumber) {
    let $question = $(`
      <div id="question-${questionNumber}">
        <label for="question${questionNumber}">
          <div class="question-number">
            ${questionNumber}. Question:
          </div>
          <input id="question-description-${questionNumber}"></input>
        </label>
        <br>
        <label for="option1">
          <input class="is-solution" type="radio" name="is-solution-${questionNumber}"></input>
          Option 1:
        </label>
        <input class="option" name="option"></input>
        <br>
        <label for="option2">
          <input class="is-solution" type="radio" name="is-solution-${questionNumber}"></input>
          Option 2:
        </label>
        <input class="option" name="option"></input>
        <br>
        <label for="option3">
          <input class="is-solution" type="radio" name="is-solution-${questionNumber}"></input>
          Option 3:
        </label>
        <input class="option" name="option"></input>
        <br>
        <label for="option4">
          <input class="is-solution" type="radio" name="is-solution-${questionNumber}"></input>
          Option 4:
        </label>
        <input class="option" name="option"></input>
      </div>
    `);
    
    return $question;
  };

  // add all submitted tweets to HTML
  const addQuestion = function() {
    numOfQuestions++;
    const question = createQuestionElement(numOfQuestions);
    $quizForm.append(question);
  };
});