var express = require('express');
var path = require('path');
var hogan = require('hogan-express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var config = require('./config/config.js');
//invokes a function and we pass in a reference to the session, this will be used in the production environment
//allows us to use MongoDB and hook it up to store sessions in
var connectMongo = require('connect-mongo')(session);
var mongoose = require('mongoose').connect(config.dbURL);
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
//this will get populated with list of rooms the user has created
var mlbRooms = [];
var nhlRooms = [];
var nbaRooms = [];
var nflRooms = [];
//allows us to populate the page with the previous messages when a user joins the chat room
var chatMessages = {
    nba: {},
    mlb: {},
    nfl: {},
    nhl: {}
};
var app = express();

//tell the client where to find all of our static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

//check for the current development mode, if the variable does not exist then we default to development
var env = process.env.NODE_ENV || 'development';
//set mode specific settings
if(env === 'development'){
    //development specific settings
    app.use(session({secret: config.sessionSecret, saveUninitialized: true, resave: true}));

}else {
    //production specific settings
    //store session inside mongo when inside in production mode
    app.use(session({
        secret: config.sessionSecret,
        saveUninitialized: true,
        resave: true,
        //create a new instance of connectMongo and connect via the url in our config folder, turn all objects into
        //strings before sending to Mongo.
        store: new connectMongo({
            // url: config.dbURL,
            //after ensuring our connection is set up we ensure mongoose uses the same 
            //connection we have in the app and not a duplicate so we comment out the above code, we get the first 
            //connection out of the connections array
            mongoose_connection: mongoose.connections[0],
            stringify: true
        })
    }));
}


//tell the client where to find all of views that we will render via the rendering engine
app.set('views', path.join(__dirname, 'views'));

//tell the templating engine inside express to render HTML files, using Hogan module
app.engine('html', hogan);
app.set('view engine', 'html');

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//require file where FB authenticatio will be handled.
require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);
//require the routes file with the routes created, need to pass in express and app as we are using them in our routes
//pass in config so we can use the corret host based on the environment we are in
require('./routes/routes.js')(express, app, passport, config, mlbRooms, nhlRooms, nflRooms, nbaRooms);

// app.listen(8000, function (){
//     console.log('running on 8000');
//     console.log(env);
// });

//define our server for sockets, listen on port 8000 if not already defined in our production environment
app.set('port', process.env.PORT || 8000);

var server = require('http').createServer(app);

//socket comes with node.js component and a client JS library to use in chatting when installed
var io = require('socket.io').listen(server);

//pull in our sockets code and pass in a reference to io
require('./socket/socket.js')(io, mlbRooms, nhlRooms, nbaRooms, nflRooms, chatMessages);
require('./socket/socketschatroom.js')(io, mlbRooms, nhlRooms, nbaRooms, nflRooms, chatMessages);

server.listen(app.get('port'), function(){
    console.log("On " + app.get('port'));
    console.log(env);
});
















