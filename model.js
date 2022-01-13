/** Model
* Defines static methods for interfacing with backend.
* Singleton.
*/

class Model {
	constructor(expenses, grants, questions) {
		Model.expenses = expenses;
		Model.questions = questions.map ( function(e) {
			let newQuestion = new Question(e);
			newQuestion.parents = Model.#assignParentsToQuestion(newQuestion.uid, questions);
			return newQuestion;
		});
		Model.grants = grants.map ( function(e) {
			let newGrant = new Grant(e);
			newGrant.questions = Model.#assignQuestionsToGrant(newGrant.uid);
			return newGrant;
		});
	}

	static getExpense(id) { 
		return Model.#getElementById(Model.expenses, id)
	}

	static getGrant(id) {
		return Model.#getElementById(Model.grants, id)
	}

	static getQuestion(id) {
		return Model.#getElementById(Model.questions, id)
	}

	/** getElementById:
	* Equivalent to SELECT {id} from {arr};.
	* A kludge, since we're using JSON instead of a real DB.
	* Private method.
	* id: The uid to filter against.
	* arr: The Model array to perform a filter against.
	* Returns a Boolean.
	*/
	static #getElementById(arr, id) {
		return arr.find( function(e) {
			return e.uid == id;
		});	
	}

	/** assignQuestionsToGrant:
	* Sets up the 'questions' property for each Grant instance.
	* Something of a kludge since we're using JSON instead of a
	* real DB.
	* Private method.
	* grantId: The ID to search for in the Questions array.
	* questions: The Questions array.
	* Returns array of scalars.
	*/
	static #assignQuestionsToGrant(grantId) {
		let acc = [];
		for (let question of Model.questions) {
			if (testTriggers(question) ) {
				acc.push(question.uid);
			}
		}
		function testTriggers(question) {
			if (question.triggers) {
				return filterComposite( question.triggers, function(trigger) {
						return testEffects(trigger);
					}
				);
			}
			return false;
		}
		function testEffects(trigger) {
			return filterComposite( trigger.effects, function (effect) {
					return testUids(effect);
				}
			);
		}
		function testUids(effect) {
			if (effect.type == "grant") {
				return filterComposite( effect.uid, function(uid) {
						return uid === grantId;
					} 
				);
			}
		}
		
		return acc;
	}
	
	static #assignParentsToQuestion(questionId, questionArray) {
		let acc = [];
		for (let question of questionArray) {
			if (question.children) {
				if (Array.isArray(question.children) ) {
					for (let child of question.children) {
						if (child === questionId) {
							acc.push(question.uid);
						}
					}
				} else if (question.children === questionId) {
					acc.push(question.uid);
				}
			}
		}
		
		return acc;
	}
}

class Grant {
	constructor(obj) {
		this.uid = obj.uid;
		this.organizationName = obj.organizationName;
		this.grantName = obj.grantName;
		this.lastUpdated = new Date(obj.lastUpdated);	
		this.dates = obj.dates; //Do something more sophisticated with this later
		this.offer = obj.offer; //Ditto
		this.expenses = obj.expenses;
	}
	
	getExpenses() {
		let acc = {
			eligible: [],
			ineligible: []
		}
		for (let expense of this.expenses.eligible) {
			acc.eligible.push(Model.getExpense(expense) ).value;
		}
		for (let expense of this.expenses.ineligible) {
			acc.ineligible.push(Model.getExpense(expense) ).value;
		}
		return acc;
	}
	
	getQuestions() {
		let acc = [];
		for (let question of this.questions) {
			let foo = Model.getQuestion(question);
			acc.push ({
				text: foo.text,
				triggers: foo.triggers
			});
		}
		return acc;
	}
}

class Question {
	constructor(obj) {
		this.uid = obj.uid;
		this.text = obj.text;
		this.type = obj.type;
		this.children = obj.children;
		this.triggers = obj.triggers;
		this.parents = [];
		this.answered = false;
		this.skipped = false;
	}
	
	getChildren() {
		let acc = [];
		if (this.children) {
			if (Array.isArray(this.children) ) {
				for (let child of this.children) {
					acc.push(child);
				}
			} else {
				acc.push(this.children);
			}
		}
		return acc;
	}	
}

window.addEventListener("load", async function() {
	let expenses = await loadJSON('expenses.json');
	let grants = await loadJSON('grants.json');	
	let questions = await loadJSON('questions.json');
	let model = new Model (expenses.expenses, grants.grants, questions.questions);
});

/** filterComposite: Returns a single value from a
* composite (an object that can be treated the same
* if it represents a leaf node or a branch.) Here,
* we treat a leaf node as an array of objects or
* scalars -- crude, but it does the job.
*
* composite: The composite to act on. : array | scalar
* filter: The function to apply to the composite.
*
* Returns result of 'filter'.
*/
function filterComposite(composite, filter) {
	if (Array.isArray(composite) ) {
		let acc;
		for (let scalar of composite) {
			acc = filter(scalar);
		}
		return acc;
	} else {
		return filter(composite);
	}
}

async function loadJSON(url) {
	let response = await fetch(url);
	return await response.json();
}