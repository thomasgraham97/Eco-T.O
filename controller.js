/** Controller
* Defines static methods for interfacing with backend.
* Singleton.
*/

class Controller {
	static currentQuestion;
	static pendingQuestions;
	
	static answerQuestion(response) {
		if (response) {
			//Answered
			let children = Controller.currentQuestion.getChildren();
			if (children.length > 0) {
				Controller.pendingQuestions.unshift(
					...children.map( function(e) {
						return Model.getQuestion(e)
					})
				);
			}
			Controller.currentQuestion.answered = true;
		} else {
			//Skipped
			Controller.currentQuestion.skipped = true;
		}
	}
	
	static buildQuestionQueue() {
		Controller.pendingQuestions = Model.questions.filter(
			function(e) { return e.parents.length === 0; }
		);
	}
	
	static getNextQuestion() {
		if (!Controller.pendingQuestions) {
			Controller.buildQuestionQueue();
		} 
		if (Controller.pendingQuestions.length > 0) {
			Controller.currentQuestion  = Controller.pendingQuestions[0];
			Controller.removePendingQuestion();
			View.listQuestion(Controller.currentQuestion);
		}
	}
	
	static removePendingQuestion() {
		if (Controller.pendingQuestions.length > 1) {
			Controller.pendingQuestions.shift();
		} else {
			Controller.pendingQuestions = [];
		}
				
	}
}