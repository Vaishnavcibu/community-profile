const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
var useragent = require('express-useragent');
var mongoose =require('mongoose');
var path = require('path');
require('dotenv').config()

let app = express();

//Route file requiring (importing)
// var userRoute=require("./Routes/userRoute");

//BODYPARSER
app.use(bodyParser.urlencoded({
    extended: true, limit: '150mb'
}));
app.use(bodyParser.json({ limit: '150mb' }));

//DATABASE URL
mongoose.connect(process.env.MONGODB_URL).then(() => { 
    console.log("Data Base connected")
}).catch((ex) => {
    console.log("Db connection error")
    console.log(ex)
});

//database connection
var db = mongoose.connection;

// serve the public
app.use(express.static('public'));

//Port Declaration
var port = process.env.PORT || 4242;

//Cors and helmet use
app.use(cors());
app.use(helmet({crossOriginResourcePolicy:false}));
app.use(express.json());

//Consoles the user information and API calls into the server Environment
app.use(useragent.express());
app.use((req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl)
    next();
})

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src *; script-src 'self';");
    next();
});


//function usage
// app.use(userRoute);

//Serving html files




//Route for checking the server health
app.get('/health', async(req, res) => {
    res.status(200).json({
        status: true
    });
    return
});

app.get('/server/time',async(req,res)=>{
    console.log("Function /server/time Called.");
    console.log(new Date())
})

//Server Environment set up
const server = app.listen(port, function () {
    console.log("Running Server on port "+port);
});
