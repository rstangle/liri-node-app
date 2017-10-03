// Code to grab the data from keys.js
// Store keys in a variable

// npm init - Done
// npm install - Done
// npm install request - Done
// npm install request --save - Done
// npm install twitter - Done
// npm install twitter --save - Done
// npm install spotify-api - Done
// npm install spotify-api --save - Done

//****************************************************************************************************************************
//*** VARIABLES **************************************************************************************************************
//****************************************************************************************************************************

var keys = require("./keys.js");
var Twitter = require('twitter');
var twitConKey = keys.twitterKeys.consumer_key;
var twitConSecret = keys.twitterKeys.consumer_secret;
var twitAccessTokKey = keys.twitterKeys.access_token_key;
var twitAccessTokSec = keys.twitterKeys.access_token_secret;
//------------------------------------------------------------------
var Spotify = require('node-spotify-api');
var spotId = keys.spotifyKeys.client_ID;
var spotSec	= keys.spotifyKeys.client_secret;

var fs = require('fs');
var request = require('request');
var inquirer = require('inquirer');



// FROM IN-CLASS ASSIGNMENT 18-OMDB REQUEST 
// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
// var request = require("request");

// Store all of the arguments in an array
var nodeArgs = process.argv;
var userInput = process.argv[2]

// Create an empty variable for holding the movie name
var movieName = "";
var songName = "";


// No idea what this does, but looked important from the twitter npm site.  Commenting out until I understand this more. 
// var params = {screen_name: 'nodejs'};
// client.get('statuses/user_timeline', params, function(error, tweets, response) {
//   if (!error) {
//     console.log(tweets);
//   }
// });

//**************************************************************************************************************************
//*** BASIC LOGIC **********************************************************************************************************
//**************************************************************************************************************************

if (userInput === "movie-this") {
	omdb();

} else if (userInput === "my-tweets") {
		// do twitter function
		twitter();
		// testing...
		// console.log("These are my tweets");

} else if ( userInput === "spotify-this-song") {
		// do spotify function
		spotify();
		// testing...
		// console.log("This is the best song!");

} else if (userInput === "do-what-it-says") {
		// do simonSays function
		// testing...
		console.log("Simon Says do this...");

} else {
	inquirer.prompt([
	  {
       type: "list",
       message: "Not a valid option. Please choose:",
       choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
       name: "confirm"
      }
	])
	.then(function(inquirerResponse) {
		if (inquirerResponse.confirm) {
			console.log("Please enter you choice into the command line.");
		} else{
			console.log("Try again.");
		}
	});

	// console.log("Not a valid option. Please choose from ...")
};


//******************************************************************************************************************************
//***** OMDB *******************************************************************************************************************
//******************************************************************************************************************************

// FROM IN-CLASS ASSIGNMENT 18-OMDB REQUEST 
// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
// var request = require("request");

// // Store all of the arguments in an array
// var nodeArgs = process.argv;
// var userInput = process.argv[2]

// // Create an empty variable for holding the movie name
// var movieName = "";

// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s

// if (userInput === "movie-this") {
// 	omdb();

function omdb() {

	// Mark helped with this solution.  I didn't realize == null was a thing.
	if(nodeArgs[3] == null){
        movieName = "mr+nobody";
	
	} else {
		for (var i = 3; i < nodeArgs.length; i++) {
	 		if (i > 3 && i < nodeArgs.length) {
	    		movieName = movieName + "+" + nodeArgs[i];
	 		}
	  		else {
	    		movieName += nodeArgs[i];
	  		}
		}
	}

	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

	// This line is just to help us debug against the actual URL.
	console.log(queryUrl);

	request(queryUrl, function(error, response, body) {

	  // If the request is successful
	  if (!error && response.statusCode === 200) {

	    // Parse the body of the site and recover just the imdbRating
	    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
	    console.log("Title: " + JSON.parse(body).Title);
	    console.log("Release Year: " + JSON.parse(body).Year);
	    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
	    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
	    console.log("Produced in: " + JSON.parse(body).Country);
	    console.log("Language: " + JSON.parse(body).Language);
	    console.log("Plot: " + JSON.parse(body).Plot);
	    console.log("Actors: " + JSON.parse(body).Actors);

	  }
	});
};

//******************************************************************************************************************************
//***** TWITTER ****************************************************************************************************************
//******************************************************************************************************************************

function twitter() {

var client = new Twitter({
  consumer_key: twitConKey,
  consumer_secret: twitConSecret,
  access_token_key: twitAccessTokKey,
  access_token_secret: twitAccessTokSec
});

var params = {screen_name: 'ViralPenguins', count: 20};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    for (var i = 0; i < tweets.length; i++) {
    	console.log("-----------------------------------");
    	console.log("Tweeted on: " + tweets[i].created_at);
    	console.log(tweets[i].text);
    	console.log("-----------------------------------");
	}
  }
});

};

//******************************************************************************************************************************
//***** SPOTIFY ****************************************************************************************************************
//******************************************************************************************************************************

function spotify() {
var spotify = new Spotify({
  id: spotId,
  secret: spotSec
});

if(nodeArgs[3] == null){
    songName = "The+Sign";
	
	} else {
		for (var i = 3; i < nodeArgs.length; i++) {
	 		if (i > 3 && i < nodeArgs.length) {
	    		songName = songName + "+" + nodeArgs[i];
	 		}
	  		else {
	    		songName += nodeArgs[i];
	  		}
		}
	}
 
spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 
console.log("Artist: " + data.tracks.items[0].artists[0].name);
console.log("Song Name: " + data.tracks.items[0].name);
console.log("Preview Song: " + data.tracks.items[0].preview_url);
console.log("Album: " + data.tracks.items[0].album.name);
});

};