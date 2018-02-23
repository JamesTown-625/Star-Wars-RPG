
// Execute this code when the DOM has fully loaded. 

$(document).ready(function() {

		var characters = {
			"Boba Fett": {
				name: "Boba Fett",
				health: 100,
				attack: 8,
				imageUrl: "assets/Images/boba-fett.jpg",
				enemyAttackBack: 5
			},

			"Kylo Ren": {
				name: "Kylo Ren",
				health: 100,
				attack: 10,
				imageUrl: "assets/Images/kylo-ren.jpg",
				enemyAttackBack: 5,
			},

			"Darth Vader": {
				name: "Darth Vader",
				health: 120,
				attack: 15,
				imageUrl: "assets/Images/darth-vader.jpg",
				enemyAttackBack: 10,
			}, 

			"Qui-Gon Jin": {
				name: "Qui-Gon Jin",
				health: 100,
				attack: 12,
				imageUrl: "assets/Images/jedi.jpg",
				enemyAttackBack: 8,
			},

			"Luke Skywalker": {
				name: "Luke Skywalker",
				health: 120,
				attack: 15,
				imageUrl: "assets/Images/luke-skywalker.jpg",
				enemyAttackBack: 10,
			},

			"Han Solo": {
				name: "Han Solo",
				health: 100,
				attack: 12,
				imageUrl: "assets/Images/han-solo.jpg",
				enemyAttackBack: 5,	
			},
		};

		console.log(characters);
// Will be populated when the player selects the character.
var currSelectedCharacter;
// Populated with all the characters the player didn't select.
var combatants = [];
// Will be populated when the player chooses an opponent.
var currDefender;
// Will keep track of turns during combat, used for calculating players wins
var turnCounter = 1;
// Tracks number of defeated opponents.
var killCount = 0;


// FUNCTIONS
// =====================================================================================================================================

// This Function will render a character card to the page.
// The character rendered and the area they are rendered to.
var renderOne = function(character, renderArea, charStatus) {
	var charDiv = $("<div class='character' data-name='" + character.name + "'>");
	var charName = $("<div class='character-name'>").text(character.name);
	var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
	var charHealth = $("<div class='character-health'>").text(character.health);
	charDiv.append(charName).append(charImage).append(charHealth);
	$(renderArea).append(charDiv);

//If the character is an enemy or defender (the active opponent)
	if (charStatus === "enemy") {
		$(charDiv).addClass("enemy");
	}
	else if (charStatus === "defender") {
		//Populate currDefender with the selected opponent's information
		currDefender = character;
		$(charDiv).addClass("target-enemy");
	}
};

//Function to handle render game messages.
var renderMessage = function(message) {

	//Builds the message and appends it to the page.
	var gameMessageSet = $("#game-message");
	var newMessage = $("div").text(message);
	gameMessageSet.append(newMessage);

	//If we get this specific message passed in, clear the message
	if (message === "clearMessage") {
		gameMessageSet.text("")
	}

}


// This Function handles the rendering of the characters base on which area they are to be rendered in
		var renderCharacters = function(charObj, areaRender) {

			//"characters-section" is the div where all of our characters
			//If true, render all characters to the starting area.
			if (areaRender === "#characters-section") {
				$(areaRender).empty();
				//Loop through the characters object and call the renderOne
				for (var key in charObj) {
					if (charObj.hasOwnProperty(key)) {
						renderOne(charObj[key], areaRender, "");
					}
				}
			}

			// selected character is the div where our selected character appears, if true render the selected player character to this area.

			if (areaRender === "#selected-character") {
				renderOne(charObj, areaRender, "");
			}

			//available-to-attack" section is the div where our "inactive" opponents will render
			//If true, render the selected character to this area.
			if (areaRender === "#available-to-attack-section") {

				//Loop through the combatants array and call renderOne
				for (var i = 0; i < charObj.length; i++) {
					renderOne(charObj[i], areaRender, "enemy");
				}
		//Creates an on click event for each enemy.
				$(document).on("click", ".enemy", function() {
					var name = ($(this).attr("data-name"));
				//If there is no defender, the clicked enemy will become the new defender
					if ($("#defender").children().length === 0) {
						renderCharacters(name, "#defender");
						console.log(this," This is what we're looking at");
						$(this).hide();
						// renderMessage("clearMessage");
					}
				});
			}
	// "defender" is the div where the active opponet appears.
	//If true, render the selected enemy in this location.
			if (areaRender === "#defender") {
				$(areaRender).empty();
				for (var i = 0; i < combatants.length; i++) {
					if(combatants[i].name === charObj) {
						renderOne(combatants[i], areaRender, "defender");
					}
				}
			}
		//Re-render defender when attacked.
			if (areaRender === "playerDamage") {
				$("#defender").empty();
				renderOne(charObj, "#defender", "defender");
			}
			//Re-render player character when attacked.
			if (areaRender === "enemyDamage") {
				$("#selected-character").empty();
				renderOne(charObj, "#selected-character", "");
			}
		//Remove defeated enemy.
			if (areaRender === "enemyDefeated") {
				$("#defender").empty();
				var gameStateMessage = ("You have defeated " + charObj.name + ", you can choose to fight another enemy.");
				renderMessage(gameStateMessage);
			}
		};

// Function which handles restarting the game after victory or defeat.

	var restartGame = function(inputEndGame) {

		//When the 'Restart' button is clicked, reload the page.
		var restart = $("<button>Restart</button>").click(function() {
			location.reload();
		});

		//Build div that will display the victory/defeat message.
		var gameState = $("<div>").text(inputEndGame);

		//Render the restart button and victory/defeat message to the page. 
		$("body").append(gameState);
		$("body").append(restart);
	}

// =====================================================================================================================================

// Render all characters to the page when the game starts.
	renderCharacters(characters, "#characters-section");

	$(document).on("click", ".character", function() {
		//saving the clicked character's name.
		var name = $(this).attr("data-name");
		console.log(name);
		
// If a player character has not yet been chosen...
		if (!currSelectedCharacter) {
			// We populate currSelectedCharacter with the selected character's information
			currSelectedCharacter = characters[name];
			// We then loop through the remaining characters and push them into the your character 
			for (var key in characters) {
				if (key !== name) {
					combatants.push(characters[key]);
				}
			}
			console.log(combatants);
			//Hide the character select div.
			$("#characters-section").hide();
		//Then render our selected character and our combatants.
			renderCharacters(currSelectedCharacter, "#selected-character");
			renderCharacters(combatants, "#available-to-attack-section");
		}

	});

	// When you click the attack button, run the following game logic...
	$("#attack-button").on("click", function() {

		//Creates message for out attack and our opponets counter attack.
		var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
		var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage.";
		// renderMessage("clearMessage");

		if ($("#defender").children().length !== 0) {
			// Reduce defender's health by your attack value.
			currDefender.health -= (currSelectedCharacter.attack * turnCounter);

		//If the enemy still has health....
			if (currDefender.health > 0) {
			//Render the enemy's updated character card.
				renderCharacters(currDefender, "playerDamage");	
console.log(currDefender.health);
console.log(counterAttackMessage);
			//Render the combats messages
				renderMessage(attackMessage);
				renderMessage(counterAttackMessage);

			//Reduce your health by the opponent's attack value.
				currSelectedCharacter.health -= currDefender.enemyAttackBack;
console.log(currSelectedCharacter.health);	
			//Render the player's updated character card.
				renderCharacters(currSelectedCharacter, "enemyDamage");		

			//If you have less than zero health the game ends.
			// We call the restartGame function to allow the user to start over. 
			if (currSelectedCharacter.health <= 0) {
				renderMessage("clearMessage");
				restartGame("You have been defeated... GAME OVER!!!!");
				$("#attack-button").unbind("click");
			}
			}

			else {
			//Remove your opponents character card.
			renderCharacters(currDefender, "enemyDefeated");
			//Increment your kill count.
			killCount++;
			//If you have killed all of your opponents you win.
			if (killCount>=3) {
				renderMessage("clearMessage");
				restartGame("You Won!!!! GAME OVER!!!");

			}
		}
	}
		turnCounter++;

	});

});