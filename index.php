<!DOCTYPE html>

<html>
	<head>
		<title>Eco T.O (MVS)</title>
		<!-- Meta tags -->
		<meta charset = "utf-8">
		<meta name = "viewport" content = "width=device-width, initial-scale=1">
		
		<!-- Scripts -->
		<script defer src = "model.js"></script>
		<script defer src = "view.js"></script>	
		<script defer src = "controller.js"></script>		
	</head>
	<body>
		<nav>
			<h1>Eco T.O</h1>
			<h2>Minimum viable solution</h2>
		</nav>
		<section id = "question-interface">
			<h3 id = "question-counter">Question</h3>
			<p id = "question-text">Question</p>
			<form id = "question-form">
				<div id = "question-container">
					<label for  = "boolean-1">Yes</label>
					<input type = "radio" id = "boolean-1" name = "boolean">
					<label for  = "boolean-0">No</label>
					<input type = "radio" id = "boolean-0" name = "boolean">
				</div>
				<input type = "submit" id = "question-form-skip" value = "Skip">
				<input type = "submit" id = "question-form-submit" value = "Submit">
			</form>
		</section>
		<section id = "matches-interface">
			<h3 id = "matches-counter">Matches</h3>
			<div id = "matches-container"></div>
		</section>	
	</body>
</html>