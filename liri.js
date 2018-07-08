require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var arg1 = process.argv[2];
var arg2 = process.argv[3];

function myTweets(){
    console.log("1");
    var param = { screen_name: arg2 };
    client.get("statuses/user_timeline/", param, function (error, data, response) {
        if (!error) {
            for (i = 0; i < data.length; i++) {
                var twitterResults =
                    "@" + data[i].user.screen_name + ": " +
                    data[i].text + "\r\n" +
                    data[i].created_at + "\r\n" +
                    "------------------------------ " + i + " ------------------------------" + "\r\n";
                console.log(twitterResults);
            }
        } else {
            console.log(error);
        }
    })
}

function spotifyasong(){
    if (!arg2) {
        arg2 = "Big Poppa";
    }
    spotify.search({ type: "track", query: arg2 }, function (err, data) {
        if (!err) {
            var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                        "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                        "Song: " + songInfo[i].name + "\r\n" +
                        "Album:  " + songInfo[i].album.name + "\r\n" +
                        "Preview Url: " + songInfo[i].preview_url + "\r\n" +
                        "------------------------------ " + i + " ------------------------------" + "\r\n";
                    console.log(spotifyResults);
                }
            }
        } else {
            console.log(error);
        }
    });
}
function movies(){
    if (!arg2) {
        arg2 = "pulp_fiction";
        console.log("If you haven't watched Pulp Fiction, you should! \n Its on Netflix!")
    }
    request("http://www.omdbapi.com/?t=" + arg2 + "&y=&plot=short&apikey=trilogy&r=json&tomatoes=true", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movie = JSON.parse(body);
            var movieResult =
                "------------------------------ begin ------------------------------" + "\r\n" +
                "Title: " + movie.Title + "\r\n" +
                "Year: " + movie.Year + "\r\n" +
                "Imdb Rating: " + movie.imdbRating + "\r\n" +
                "Rotten Tomatoes Rating: " + movie.tomatoMeter + "\r\n" +
                "Country: " + movie.Country + "\r\n" +
                "Language: " + movie.Language + "\r\n" +
                "Plot: " + movie.Plot + "\r\n" +
                "Actors: " + movie.Actors + "\r\n"
            console.log(movieResult);
        } else {
            console.log(error);
        }
    });
}


if (arg1 == "my-tweets") {
    myTweets();
}
else if (arg1 == "spotify-this-song") {
    spotifyasong();
}
else if (arg1 == "movie-this") {
    movies()
}
else if (arg1 == "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error) {
            doWhatItSaysResults = data.split(",");
            arg2 = doWhatItSaysResults[1];
            if(doWhatItSaysResults[0] == "my-tweets")
            {
                myTweets();
            }
            else if(doWhatItSaysResults[0] == "spotify-this-song")
            {
                spotifyasong();
            }
            else if(doWhatItSaysResults[0] == "movie-this")
            {
                movies();
            }
        } else {
            console.log("Error occurred" + error);
        }
    });
}