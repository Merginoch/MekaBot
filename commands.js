const fs = require('fs');
const library = require("./library.json");

const rps = ["rock", "paper", "scissors"];

const emoteList = {
	"acknowledge" : "Understood",
	"group" : "Group up with me!",
	"healing" : "I need healing!",
	"ultimate" : "My ultimate is ready! Let's do this!",
	"hello" : "Hello!",
	"thank" : "Thank you!"
}

const eightList = ["It is certain", "It is decidedly so",
	"Without a doubt",
	"Yes, definitely",
	"You may rely on it",
	"As I see it, yes",
	"Most likely",
	"Outlook good",
	"Yes",
	"Signs point to yes",
	"Reply hazy try again",
	"Ask again later",
	"Better not tell you now",
	"Cannot predict now",
	"Concentrate and ask again",
	"Don't count on it",
	"My reply is no",
	"My sources say no",
	"Outlook not so good",
	"Very doubtful"
]

exports.emote = function(user, action, target){
	let text = "";
	if (action == undefined){
		text = user + " tried to do nothing. Absolutely nothing.";
	} else if (target == undefined){
		text = user + ": " + emoteList[action];
	} else if (!emoteList[action]){
		text = user + " tried to do " + action + ", whatever that is.";
	} else {
		text = user + " to " + target + " : " + emoteList[action];
	}
	return text;
}

exports.say = function(action){
	if (library[action]){
		return library[action];
	}
	return "I don't know that!";
}

exports.teach = function(action, result){
	if (library[action] == undefined){
		library[action] = result;
		fs.writeFile('./library.json', JSON.stringify(library));
		return ("Successfully learned " + action);
	}
	return "I already know this!";
}

exports.unlearn = function(action){
	let index = library.indexOf(action);
	if (msg.author.id == dva && index != 1){
		library.splice(index,1);
		fs.writeFile('./library.json', JSON.stringify(library));
		return "Successfully forgot about... something!";
	} else if(index == -1){
		return "I do not know this.";
	}
	return "You do not have permission to do this!";	
}

exports.eightBall = function(){
	let randomNum = Math.floor((Math.random() * (eightList.length - 1)));
	return eightList[randomNum];
}

exports.rollDice = function(dice){
	if (dice.search(/\d*[d]\d+/) != -1){
		let sum = 0;
		let values = dice.split(/[dD]/);
		let diceAmount = parseInt(values[0]);
		let diceSize = Math.floor(parseInt(values[1]));
		for (i = 0; i < diceAmount; i++){
			sum += Math.floor((Math.random() * (diceSize) + 1));
		}
		return sum;
	}
	return "Not a valid roll";
}