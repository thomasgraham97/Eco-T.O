/** View
* Defines static methods for interfacing with backend.
* Singleton.
*/

class View {
	constructor(questionInterface, matchesInterface) {
		View.questionCounter = questionInterface.querySelector("#question-counter");
		View.questionText = questionInterface.querySelector("#question-text");
		View.questionContainer = questionInterface.querySelector("#question-container");
		View.questionSkip = questionInterface.querySelector("#question-form-skip");
		View.questionSubmit = questionInterface.querySelector("#question-form-submit");
		
		View.yesAnswer = questionInterface.querySelector("#boolean-1");
		View.noAnswer = questionInterface.querySelector("#boolean-0");		
		
		View.matchesCounter = matchesInterface.querySelector("#matches-counter");
		View.matchesContainer = matchesInterface.querySelector("#matches-container");
		
		View.questionSkip.addEventListener("click", function(e) {
			e.preventDefault();
			Controller.answerQuestion();
			Controller.getNextQuestion();
		});
		View.questionSubmit.addEventListener("click", function(e) {
			e.preventDefault();
			Controller.answerQuestion(View.yesAnswer.checked);
			Controller.getNextQuestion();			
		});
		View.yesAnswer.addEventListener("click", function(e) {
			View.questionSubmit.disabled = false;
		});
		View.noAnswer.addEventListener("click", function(e) {
			View.questionSubmit.disabled = false;
		});
	}
	
	static listQuestion(question) {
		View.questionText.innerText = question.text;
		View.yesAnswer.checked = false;
		View.noAnswer.checked = false;
		View.questionSubmit.disabled = true;
	}
	
	static listGrant(grant) {
		View.matchesContainer.innerText = grant.grantName;
	}
}

setTimeout(function() {
	let view = new View(
		document.querySelector("#question-interface"),
		document.querySelector("#matches-interface")
	);
	Controller.getNextQuestion();
}, 250);