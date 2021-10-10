const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { type } = require("os");

// const colors = require("colors");

/*  ======== Errors
    1. When none of the type of joke is selected then it chooses both
    2. When amount is entered => gives error

    Attatch MEME API

*/
const app = express();

// Tell app(express) to use EJS
// app.set('view engine', 'ejs');

var jokeArray = [];

// Using the CSS file
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");

    // res.render("joke", {sendArray: jokeArray});      // not working
});

app.post("/", function(req, res) {
    const programming = req.body.programming;
    const mis = req.body.mis;
    const dark = req.body.dark;
    const pun = req.body.pun;
    const spooky = req.body.spooky;
    const christmas = req.body.christmas;

    var isCategorySelected = false;

    var url = 'https://v2.jokeapi.dev/joke/';

    // console.log(programming);

    // For programming
    if (programming !== undefined) {
        url = url + 'Programming';
        isCategorySelected = true;
        // console.log(url);
    }

    // For Miscellaneous
    if (mis !== undefined) {

        if (isCategorySelected) {
            url += ",";
        }

        url = url + 'Miscellaneous';
        isCategorySelected = true;
        // console.log(url);
        
    }

    // For Dark
    if (dark !== undefined) {

        if (isCategorySelected) {
            url += ",";
        }

        url = url + 'Dark';
        isCategorySelected = true;
        // console.log(url);
    }

    // For Pun
    if (pun !== undefined) {

        if (isCategorySelected) {
            url += ",";
        }

        url = url + 'Pun';
        isCategorySelected = true;
        // console.log(url);
    }

    // For Spooky
    if (spooky !== undefined) {

        if (isCategorySelected) {
            url += ",";
        }

        url = url + 'Spooky';
        isCategorySelected = true;
        // console.log(url);
    }

    // For Christmas
    if (christmas !== undefined) {

        if (isCategorySelected) {
            url += ",";
        }

        url = url + 'Christmas';
        isCategorySelected = true;
        // console.log(url);
    }

    // If nothing is selected
    if (!isCategorySelected) {
        console.log(url);
        url += "Any"
    }

    url += "?";
    console.log(url);

    /**
     * Nothing selected
     * type = single or two part
     */


    /** ====== Adding Flags ================= 
     * ===================================== */
    const nsfw = req.body.nsfw;
    const religious = req.body.religious;
    const political = req.body.political;
    const racist = req.body.racist;

    var flagSeperator = false;

    if (nsfw !== undefined) {
        flagSeperator = true;
        url += "blacklistFlags=" + "nsfw"
        // console.log(url);
    }
    if (religious !== undefined) {
        if (flagSeperator) {
            url += ",religious"
        } else {
            url += "blacklistFlags=" + "religious"
            flagSeperator = true;
        }
        // console.log(url);
    }
    if (political !== undefined) {
        if (flagSeperator) {
            url += ",political"
        } else {
            url += "blacklistFlags=" + "political"
            flagSeperator = true;
        }
        // console.log(url);
    }
    if (racist !== undefined) {
        if (flagSeperator) {
            url += ",racist"
        } else {
            url += "blacklistFlags=" + "racist"
            flagSeperator = true;
        }
        // console.log(url);
    }
    // Ommiting sexist
    if (flagSeperator) {
        url += ",sexist"
    } else {
        url += "blacklistFlags=" + "sexist&"
    }

    // Editing the URL
    if (flagSeperator) {
        url += "&";
    }
    
    /** ====== Checking for type of Joke === */
    const single = req.body.single;
    const twoPart = req.body.twoPart;

    if (single === undefined) {
        url += "type=" + "twoPart";
        // console.log(url);
    }

    if (twoPart === undefined) {
        url += "type=" + "single";
        // console.log(url);
    }

    // Editing the URL
    if (single === undefined || twoPart === undefined) {
        url += "&";
    }
    
    /** ====== Search String ================= 
     * ===================================== */
    const searchString = req.body.searchString;
    console.log(typeof (searchString));
    if (searchString.length > 0) {
        url += "contains=" + searchString;
        console.log(url);
    }

    /** ====== Number of Jokes ================= 
     * ===================================== */
    const jokesNum = req.body.jokesNum;
    if (jokesNum > 1) {
        url += "amount=" + jokesNum;
    }
    // console.log(jokesNum);
    console.log(url);

    // if (amount > 1)
    //     console.log(dataAsJSON.jokes[0].setup);

    https.get(url, function(response) {

        response.on('data', function(d) { 
            // console.log(d);
            const dataAsJSON = JSON.parse(d);
            console.log(dataAsJSON);

            // console.log(dataAsJSON.type);
            const sendType = dataAsJSON.type;
            // console.log(sendType); 
     
            // for (var i = 0; i < jokesNum; i++){  
                // console.log(dataAsJSON.jokes[i].joke);
                // console.log((i+1) + ".");
                // var joke = dataAsJSON.jokes[i].joke;
                    // console.log(joke);
                    // res.write("<p>" + joke); 
                    // console.log(url);

                res.write("<p>Category : " + dataAsJSON.category);
                // type = twoPart
                if (sendType === "single") { 
                    console.log("single send");
                    var joke = dataAsJSON.joke;
                    // console.log(joke);
                    res.write("<p>Joke : " + joke);
                    
                    // jokeArray.push(joke);
                }

                if (sendType === "twopart") {
                    console.log("twopart sedn");
                    var setup = dataAsJSON.setup;
                    var delivery = dataAsJSON.delivery;
                    // console.log(setup + "\n" + delivery);
                    res.write("<p>Setup : " + setup);
                    res.write("<p>Delivery : " + delivery);
                    
                    
                    // jokeArray.push(setup);
                    // jokeArray.push(delivery);
                }
                // console.log("\n");
            // }
            // type = single
            
        })
    }) 

    // res.redirect("/");

})


app.listen(3000, function() {
    console.log("Server is running on port 3000");
});



























