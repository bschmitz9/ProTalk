module.exports = function (passport, FacebookStrategy, config, mongoose){

    //create our schema and ask for these items back from FB
    var userModel = new mongoose.Schema({
        profileID: String,
        fullName: String,
        profilePic: String
    });

    var User = mongoose.model('User', userModel);

    //once FB authorizes user the data is stored in the session, specificially the user.id (this is the unique id from
    //mongo DB). Stores the user reference in the session.
    passport.serializeUser(function (user, done){
        done(null, user.id);
    });

    //passport runs this whenever data from the user is required. requires the id from the user as we defined above
    //uses this to find the user via the findById method. Finds the user's record in the DB and returns it back.
    passport.deserializeUser(function(id, done){
        User.findById(id, function(error, user){
            done(error, user);
        });
    });
   
    passport.use(new FacebookStrategy({
        clientID: config.fb.appID,
        clientSecret: config.fb.appSecret,
        callbackURL: config.fb.callbackURL,
        profileFields: ['id', 'displayName', 'photos']
    }, function (accessToken, refreshToken, profile, done){
        //we check if the user exists in the database
        User.findOne({'profileID': profile.id}, function (error, result){
            if(error){
                //return error
                return done(error);
            } else if (result){
                //returns the profile via the done method, we pass in the result from FB
                done(null, result);
            } else {
                //create a new user in database via the response from FB if this is a new user
                var newUser = new User({
                    profileID: profile.id,
                    fullName: profile.displayName,
                    profilePic: profile.photos[0].value || ''
                });

                //save the new user into the database
                newUser.save(function(error){
                    done(null, newUser);
                });
            }
        });
    }));

};