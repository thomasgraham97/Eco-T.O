/** Controller
* Defines static methods for interfacing with backend.
* Singleton.
*/

class Controller {
	static currentQuestion;
	static pendingQuestionQueue;
	
	static answerQuestion(response) {
		if (response) {
			//Answered
			let children = Controller.currentQuestion.getChildren();
			if (children.length > 0) {
				Controller.pendingQuestionQueue.unshift(
					...children.map( function(e) {
						return Model.getQuestion(e);
					})
				);
			}
			Controller.updateQuestionCounter(Model.questionsAnswered + 1);
			Controller.currentQuestion.answer = response;
			Controller.currentQuestion.runTriggers();
			Controller.currentQuestion.answered = true;

			for (let result of Controller.getTopResults(5) ) {
				View.listGrant(result);
			}
		} else {
			//Skipped
			Controller.currentQuestion.skipped = true;
		}
	}

	static getTopResults(domain) {
		return Model.grants.filter( function(grant) {
			return !grant.disqualified;
		}).sort( function(a, b) {
			return b.score - a.score;
		}).slice(0, domain);
	}
	
	static updateQuestionCounter(amount) {
		Model.questionsAnswered = amount;
		View.questionCounter.innerHTML = 
			amount + (amount === 1 ? " question" : " questions" ) + " answered"; 
	}	
	
	static buildQuestionQueue() {
		Controller.pendingQuestionQueue = Model.questions.filter(
			function(e) { return e.parents.length === 0; }
		);
	}
	
	static getNextQuestion() {
		if (!Controller.pendingQuestionQueue) {
			Controller.buildQuestionQueue();
		} 
		if (Controller.pendingQuestionQueue.length > 0) {
			Controller.currentQuestion  = Controller.pendingQuestionQueue[0];
			Controller.removePendingQuestion();
			
			if (Controller.currentQuestion.skipped || Controller.currentQuestion.answered) {
				Controller.getNextQuestion();
				return;
			}
			View.listQuestion(Controller.currentQuestion);
		} else {
			View.questionSubmit.disabled = true;
			View.questionSkip.disabled = true;
		}
	}
	
	static removePendingQuestion() {
		if (Controller.pendingQuestionQueue.length > 1) {
			Controller.pendingQuestionQueue.shift();
		} else {
			Controller.pendingQuestionQueue = [];
		}
				
	}
}