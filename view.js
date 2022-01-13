/** View
* Defines static methods for interfacing with backend.
* Singleton.
*/

class View {
	constructor(questionInterface, matchesInterface) {
		View.questionCounter = questionInterface.querySelector("#query-counter");
		View.questionText = questionInterface.querySelector("#question-text");
		View.questionContainer = questionInterface.querySelector("#question-container");
		View.questionSkip = questionInterface.querySelector("#question-form-skip");
		View.questionSubmit = questionInterface.querySelector("#question-form-submit");
		
		View.matchesCounter = matchesInterface.querySelector("#matches-counter");
		View.matchesContainer = matchesInterface.querySelector("#matches-container");
		
		View.questionSkip.addEventListener("click", function(e) {
			e.preventDefault();
			Controller.answerQuestion();
			Controller.getNextQuestion();
		});
		View.questionSubmit.addEventListener("click", function(e) {
			e.preventDefault();
			Controller.answerQuestion("Yes");
			Controller.getNextQuestion();			
		});
	}
	
	static listQuestion(question) {
		View.questionText.innerText = question.text;
	}
	
	static listTopGrants(quantity) {
		for (let i = 0; i < quantity; i++) {
				View.listGrant(i);
		}
	}
	
	static listGrant(index) {
		let grant = Model.getGrant(index);
		if (grant) {
			View.matchesContainer.innerText = grant.grantName;
		} else {
			console.warn("Attempted to access invalid grant!");
		}
	}
}

setTimeout(function() {
	let view = new View(
		document.querySelector("#question-interface"),
		document.querySelector("#matches-interface")
	);
	Controller.getNextQuestion();
}, 250);