const fs = require('fs');
const library = require("./strings/library.json");
const strings = require("./strings/strings.js");

exports.emote = function(user, action, target){
	let text = "";
	if (action == undefined){
		text = user + " tried to do nothing. Absolutely nothing.";
	} else if (target == undefined){
		text = user + ": " + strings.emoteList[action];
	} else if (!strings.emoteList[action]){
		text = user + " tried to do " + action + ", whatever that is.";
	} else {
		text = user + " to " + target + " : " + strings.emoteList[action];
	}
	return text;
}

exports.emoteList = function(){
	let text = "";
	for (let emote in strings.emoteList){
		text = text + emote + ", ";
	}
	return text.slice(0,text.length - 2);
}

exports.say = function(action){
	if (library[action]){
		return library[action];
	}
	return "I don't know that!";
}

exports.teach = function(action, result){
	if (action === undefined || result.length == 0){
		return "Stop teaching me silly things!";
	} else if (library[action] == undefined){
		library[action] = result;
		fs.writeFile('./library.json', JSON.stringify(library));
		return ("Successfully learned " + action);
	}
	return "I already know this!";
}

exports.unlearn = function(action){
	if (action in library){
		delete library[action];
		fs.writeFile('.strings/library.json', JSON.stringify(library));
		return "Successfully forgot about... something!";
	}
	return "I do not know this.";
}

exports.eightBall = function(){
	let randomNum = Math.floor((Math.random() * (strings.eightList.length - 1)));
	return strings.eightList[randomNum];
}

exports.rollDice = function(dice){
	if (dice == undefined){
		return "Not a valid roll";
	} else 	if (dice.search(/\d*[d]\d+/) != -1){
		let sum = 0;
		let values = dice.split(/[dD]/);
		let diceAmount = parseInt(values[0]) || 1;
		let diceSize = Math.floor(parseInt(values[1]));
		for (i = 0; i < diceAmount; i++){
			sum += Math.floor((Math.random() * (diceSize) + 1));
		}
		return sum;
	}
	return "Not a valid roll";
}

exports.playRPS = function(action){
	if (action == undefined){
		return "Play properly!";
	} else if (strings.rps.indexOf(action) != -1){
		action = action.toLowerCase();
		var compAction = Math.floor((Math.random() * (strings.rps.length)));
		var result = ((compAction + 3 - strings.rps.indexOf(action)) % 3);
		switch (result){
			case 0:
				return "I played " + strings.rps[compAction] + "\nIt's a tie!";
			case 1:
				return "I played " + strings.rps[compAction] + "\nI win!";
			case 2:
				return "I played " + strings.rps[compAction] + "\nYou win!";
		}
	}
	return "Play properly!";
}