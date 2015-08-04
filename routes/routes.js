module.exports = function (express, app, passport, config, mlbRooms, nhlRooms, nflRooms, nbaRooms){

//create an instance to define all of our routes
var router = express.Router();

//next will look for other routes in the application
router.get('/', function(request, response, next){
    response.render('index', {title: "Welcome to Pro Talk"});
});

//function to secure the site, ensuring user login
//if the request authentication exists, pass onto the next route and page is rendered, otherwise redirect to the login page
//isAuthenticated is available when passport successfully authenticates a user
//league selection page can't be accessed if the session does not exist
function secureSite(request, response, next){
    if(request.isAuthenticated()){
        next();
    } else {
        response.redirect('/');
    }
}

//======================================FACEBOOK ROUTES============================================

//takes the user to FB to login and be authorized
router.get('/auth/facebook', passport.authenticate('facebook'));

//FB sends access back to the app via this route
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect:'/selectLeague',
    failureRedirect:'/'
}));

//=========================================LEAGUE SELCTION=============================================


//get the selectLeague page after sign up, we pass back the user from Facebook so we can access 
//the information on the view, also pass the config so we can access the url we need based on what dev environment we are in
//secure the site by calling the secureSite function, ensuring a user has to be logged in
router.get('/selectLeague', secureSite, function(request, response, next){
    response.render('selectLeague', {title: "Choose Your League", user: request.user});
});



//=====================================MLB ROUTES==========================================================

//goes to the MLB League page
router.get('/mlb', secureSite, function(request, response, next){
    response.render('mlb', {title: 'MLB Topics', user: request.user, config: config});
});

//user selects an mlb chat, params allows us to extract the variable name which in this case is the id we are 
//attaching to the url, we are extracting the id from the request object's params field
router.get('/mlbroom/:id', secureSite, function (request, response, next){
    var room_name = getMlbTitle(request.params.id);
    response.render('mlbchat', {title: 'MLB Chat', user:request.user, room_number: request.params.id,
        room_name: room_name, config: config});
});

//gets MLB room title based on the id of the room
function getMlbTitle(mlb_id){
    for(var i = 0; i < mlbRooms.length; i++){
        if(mlbRooms[i].room_number == mlb_id){
            return mlbRooms[i].room_name;
        }
    }
}


//=====================================NHL ROUTES===========================================================
//NHL League page
router.get('/nhl', secureSite, function(request, response, next){
    response.render('nhl', {title: 'NHL Topics', user: request.user, config: config});
});

//user selects an nhl chat
router.get('/nhlroom/:id', secureSite, function (request, response, next){
    var room_name = getNhlTitle(request.params.id);
    console.log(room_name);
    response.render('nhlchat', {title: 'NHL Chat', user:request.user, room_number: request.params.id,
        room_name: room_name, config: config });
});

//gets NHL room title based on the id of the room
function getNhlTitle(nhl_id){
    for(var i = 0; i < nhlRooms.length; i++){
        if(nhlRooms[i].room_number == nhl_id){
            return nhlRooms[i].room_name;
        }
    }
}

//===========================================NBA ROUTES=====================================================

//NBA League page
router.get('/nba', secureSite, function(request, response, next){
    response.render('nba', {title: 'NBA Topics', user: request.user, config: config});
});


//user selects an nba chat
router.get('/nbaroom/:id', secureSite,  function (request, response, next){
    var room_name = getNbaTitle(request.params.id);
    response.render('nbachat', {title: 'NBA Chat', user:request.user, room_number: request.params.id,
        room_name: room_name, config: config });
});


//gets NBA room title based on the id of the room
function getNbaTitle(nba_id){
    for(var i = 0; i < nbaRooms.length; i++){
        if(nbaRooms[i].room_number == nba_id){
            return nbaRooms[i].room_name;
        }
    }
}

//=========================================NFL ROUTES============================================================

//NFL page
router.get('/nfl', secureSite, function(request, response, next){
    response.render('nfl', {title: 'NFL Topics', user: request.user, config: config});
});

//user selects an nfl chat
router.get('/nflroom/:id', secureSite, function (request, response, next){
    var room_name = getNflTitle(request.params.id);
    response.render('nflchat', {title: 'NFL Chat', user:request.user, room_number: request.params.id,
        room_name: room_name, config: config });
});


//gets NFL room title based on the id of the room
function getNflTitle(nfl_id){
    for(var i = 0; i < nflRooms.length; i++){
        if(nflRooms[i].room_number == nfl_id){
            return nflRooms[i].room_name;
        }
    }
}


//============================================LOGOUT AND DEFAULT ROUTE=======================================

//log user out, session variables destroyed
router.get('/logout', function(request, response, next){
    request.logout();
    response.redirect('/');
});

//set the default route to be handled by the router instance we just created
app.use('/', router);

};
