const Discord = require("discord.js");
const bot = new Discord.Client();
const tokens = require("./strings/tokens.json");
const commands = require("./commands.js");

var commandList = ["!8ball <question>", "!emote <emote> <name>", "!emoteList", "!help", "!r or !roll", "!say <command>", "!teach <command> <result>", "!voiceLine"]

var replyList = {
	"ayy" : "lmao",
	"sorry" : "not sorry",
	"sup" : "sup"
}

var voiceLine = ["Is this ez mode?", "LOL", "Time to raise my APM!", "Nerf this!", "Bunny Hop", "I play to win!", 
"I still love you", "Winkyface", "AFK", "Aw, yeah!", "D.Va: 1, Bad guys: 0", "GG!", "Here comes a new challenger!", "Love, D.Va",
"No hacks required"]

// Variables for Hangman game
var setter = "";
var players = [];
var word = [];
var wordDisplay = [];
var guesses = [];
var ultimate = 0;
var guesser = 0;
var correct = false;
var gameSession = false;
var win = false;

function hangman(msg){
	var msgWords = msg.content.toLowerCase().split(" ");
	if (msgWords[1] == "set" && word.length == 0){
		setter = msg.author.id;
		word = msgWords[2].split("");
		for (i = 0; i < word.length; i++){
			wordDisplay.push("");
		}
		wordDisplay.fill("_");
		msg.delete();
		msg.channel.sendMessage(msg.member.nickname + " set the word! Join the game with \"!hangman join\".")
	} else if (msgWords[1] == "reset"){
		if (msg.author.id == dva || msg.author.id == setter){
			hangmanReset(msg);
		}
	} else if (msgWords[1] == "start"){
		if ((msg.author.id == dva || msg.author.id == setter) && players.length != 0 && !gameSession){
			msg.channel.sendMessage("The game has started!");
			hangmanDisplay(msg);
			gameSession = true;
		}
	} else if (msgWords[1] == "join"){
		if (msg.member.nickname != undefined){
			var playerName = msg.member.nickname;
		} else {
			var playerName = msg.author.username;
		}
		if (setter == ""){
			msg.channel.sendMessage("Someone needs to set the word first.");
		} else if (players.indexOf(msg.author.id) != -1){
			msg.channel.sendMessage(playerName + " already joined the game.");
		} else if (gameSession){
			msg.channel.sendMessage("There is currently a game in progress.");
		} else {
			players.push(msg.author.id);
			msg.channel.sendMessage(playerName + " has joined the game.");
		}
	} else if (msgWords[1] == "guess"){
		if (msg.author.id == players[guesser] && gameSession){
			var guess = msgWords[2][0];
			if (guesses.indexOf(guess) == -1){
				for (i = 0; i < word.length; i++){
					if (word[i] == guess){
						wordDisplay[i] = guess;
						correct = true;
					}
				}
				if (guesser == players.length-1){
					guesser = 0;
				} else {
					guesser++;
				}
				hangmanHelper(msg);
				guesses.push(guess);
			} else {
				msg.channel.sendMessage("This letter has already been guessed. Try again.");
			}
		}
	}
}

function hangmanHelper(msg){
	if (gameSession){
		if (wordDisplay.indexOf("_") == -1){
			msg.channel.sendMessage("You win!");
			hangmanReset();
		} else if (!correct){
			var randomNum = Math.floor((Math.random() * 6) + 14);
			ultimate = ultimate + randomNum;
		}

		if (ultimate > 100){
			ultimate = 100;
			hangmanLose(msg);
		} else if (ultimate == 100){
			hangmanLose(msg);
		} else if (!win){
			hangmanDisplay(msg);
		}
	}
}

function hangmanDisplay(msg){
	var currentScore = wordDisplay.toString();
	var currentGuesses = guesses.toString();
	var currentUltimate = "";
	for (i = 0; i < ultimate; i+=10){
		currentUltimate = currentUltimate + "[]";
	}
	msg.channel.sendMessage("Progress " + currentScore);
	msg.channel.sendMessage("Letters guessed: " + currentGuesses);
	msg.channel.sendMessage("The current guesser is " + msg.guild.members.get(players[guesser]));
	msg.channel.sendMessage("My ultimate is charging! " + currentUltimate);
}

function hangmanLose(msg){
	msg.channel.sendMessage("My ultimate is ready!");
	msg.channel.sendMessage("Nerf this!");
	for (i = 0; i < players.length; i++){
		msg.channel.sendMessage("MekaBot has eliminated " + msg.guild.members.get(players[i]).nickname + " +100:fire:");
	}
	hangmanReset(msg);
}

function hangmanReset(msg){
	if (ultimate != 100){
		msg.channel.sendMessage(msg.member.nickname + " has reset the game!")
	} else {
		msg.channel.sendMessage("gg ez");
	}
	setter = "";
	players = [];
	word = [];
	wordDisplay = [];
	ultimateStatus = 0;
	correct = false;
	gameSession = false;
}

function hangmanReset(){
	setter = "";
	players = [];
	word = [];
	wordDisplay = [];
	ultimateStatus = 0;
	correct = false;
	gameSession = false;
}

function commandHelper(msg){
	let msgWords = msg.content.split(" ");
	if (msgWords[0] == ("!" + "getChannels")){
		if (msg.author.id == tokens.dva){
			console.log(bot.channels);
		}
	} else if (msgWords[0] == (tokens.prefix + "help")){
		msg.channel.sendMessage(commandList.join(", "));
	} else if (msg.content.startsWith(tokens.prefix + "voiceLine")){
		var randomNum = Math.floor((Math.random() * (voiceLine.length - 1)));
		msg.channel.sendMessage(voiceLine[randomNum]);
	} else if (msg.content.startsWith(tokens.prefix + "emoteList")){
		msg.channel.sendMessage(commands.emoteList());
	} else if (msgWords[0] == (tokens.prefix + "emote")){
		msg.channel.sendMessage(commands.emote(msg.author.username,msgWords[1],msgWords[2]));
	} else if (msgWords[0] == (tokens.prefix + "hangman")){
		hangman(msg);
	} else if (msgWords[0] == (tokens.prefix + "say")){
		msg.channel.sendMessage(commands.say(msgWords[1]));
	} else if (msgWords[0] == (tokens.prefix + "teach")){
		if (msg.guild){
			msg.channel.sendMessage(commands.teach(msgWords[1], msgWords.slice(2).join(" ")));
		}
	} else if (msgWords[0] == (tokens.prefix + "unlearn") && msg.author.id == tokens.dva){
		msg.channel.sendMessage(commands.unlearn(msgWords[1]));
	} else if (msgWords[0] == (tokens.prefix + "8ball")){
		msg.channel.sendMessage(commands.eightBall());
	} else if ((msgWords[0] == (tokens.prefix + "r")) || (msgWords[0] == (tokens.prefix + "roll"))){
		msg.channel.sendMessage(commands.rollDice(msgWords[1]));
	} else if (msgWords[0] == (tokens.prefix + "rps")){
		msg.channel.sendMessage(commands.playRPS(msgWords[1]));
	} else {
		msg.author.sendMessage("That is not a valid command! Type !help for a list of commands.")
		msg.delete();
	}
}

bot.on("message", msg => {
	if (msg.author.bot){
		return;
    } else if (msg.content.startsWith(tokens.prefix)) {
    	commandHelper(msg);
    } else if(replyList[msg.content] && !msg.author.bot) {
    	msg.channel.sendMessage(replyList[msg.content]);
  	} else if((msg.content.match("gg ez") || msg.content.match(":ez:")) && msg.guild){
  		// Check for bm nickname
  		let name = msg.member.nickname || msg.author.username;
		msg.channel.sendMessage(name + " is dealing with some insecurity issues right now.");
  		msg.delete();
  	} else if(msg.channel.id == "robots-in-disguise"){
  		// deletes msgs in mekabot that are not commands
  		msg.delete();
  	} else{
    }
});

bot.on('ready', () => {
  console.log('MEKA activated');
});

bot.login(tokens.botToken);