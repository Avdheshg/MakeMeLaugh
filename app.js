const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { type } = require("os");

// const colors = require("colors");

const app = express();

// Tell app(express) to use EJS
app.set('view engine', 'ejs');

// Using the CSS file
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : true}));

var jokeArray = [];
let jokeType = "";
let isPost = false;

app.get("/", function(req, res) {

    res.render('newJoke', {isPostHTML: isPost, jokeTypeHTML: jokeType, jokeArrayHTML: jokeArray});    
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
    // if (flagSeperator) {
    //     url += ",sexist"
    // } else {
    //     url += "blacklistFlags=" + "sexist&"
    // }

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

    jokeArray = []; 

    https.get(url, function(response) {

        const arr = [];      

        response.on('data', function(d) { 
            // console.log(d);
            const dataAsJSON = JSON.parse(d);
            console.log(dataAsJSON);

            // console.log(dataAsJSON.type);
            const sendType = dataAsJSON.type;
            console.log("Category " +  dataAsJSON.category);

            // Adding joketype and url to array
            arr.push(dataAsJSON.category);
            arr.push(url);

            if (sendType === "single") { 
                console.log("single send");
                var joke = dataAsJSON.joke;
                console.log(joke);
                // res.write("<p>Joke : " + joke);
                
                jokeType = 1;
                arr.push(joke);   // 2  
            }

            if (sendType === "twopart") {
                console.log("twopart sedn");
                var setup = dataAsJSON.setup;
                var delivery = dataAsJSON.delivery;
                console.log(setup + "\n" + delivery);
                
                
                arr.push(setup);
                arr.push(delivery);
                jokeType = 2;
            }
           
            jokeArray.push(arr);
            isPost = true;
            console.log("jokeType : " + jokeType);
            res.redirect("/");

        });
    }); 
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});



/**
 
 * 
 */























