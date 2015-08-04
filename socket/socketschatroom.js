//this is used when the user actually joins a chatroom
module.exports = function (io, mlbRooms, nhlRooms, nbaRooms, nflRooms, chatMessages){

//=================================MLB LEAGUE CHAT  ==========================================
    
    //responds to a socket connection of a user joining an mlb room
    var MLBmessages = io.of('/mlbmessages').on('connection', function (socket){
        console.log('connected to the chat');

        socket.on('joinmlbroom', function(data){
            socket.userName = data.userName;
            socket.userPic = data.userPic;
            //gives us the unique number of each room and allow each user to join via the join method
            //allows us to segregate users into their private rooms
            socket.join(data.room_number);
            updateMLBList(data.room_number, true);

            //send to the client all the messages in the particular room that the user has joined
            socket.emit('roomMessages', JSON.stringify(chatMessages.mlb[data.room_number]));
        });

        //get the event that the user submitted a new message from the client
        socket.on('newMessage', function (data){
             if(!(chatMessages.mlb[data.room_number])){
                chatMessages.mlb[data.room_number] = [];
                chatMessages.mlb[data.room_number].push(data.message);
            } else {
                chatMessages.mlb[data.room_number].push(data.message);
            }
            //broadcast to all other users except the active user and pass it just to the users in the chat room
            //we emit back to the client and pass back the data that was sent to the client in a string
            socket.broadcast.to(data.room_number).emit('messageFeed', JSON.stringify(data));
        });

        //updateAll is asking if we want to forcefully update or not, pulls from the true in the joinnhlroom
        function updateMLBList(room_number, updateAll){
            //gets us a list of all active users and their user pics, we passed this info to the socket when the 
            //join room event was triggered
            var getMlbUsers = io.of('/mlbmessages').clients(room_number);

            var mlbUsersList = [];

            for(var i in getMlbUsers){
            //our username and pic are coming from the variables we created when the joinnflroom event triggered
                mlbUsersList.push({user: getMlbUsers[i].userName, userPic: getMlbUsers[i].userPic});
            }

            //emit the nflusersList array back to the user who requested it, the user joining the chat
            socket.to(room_number).emit('updateMLBUsersList', JSON.stringify(mlbUsersList));

            //if updateAll is true, meaning a user has just joined and we are forcefully updating the list of users
            //for all users connected to a particular room.
            if(updateAll){
                socket.broadcast.to(room_number).emit('updateMLBUsersList', JSON.stringify(mlbUsersList));
            }
        }

        //listen for the updateList event emitted from the client and run the updateNFLList function
        socket.on('updateMLBList', function (data){
            updateMLBList(data.room_number);
        });
    });


//============================================NBA LEAGUE CHAT ============================================


    //responds to a socket connection of a user joining an nba room
     var NBAmessages = io.of('/nbamessages').on('connection', function (socket){
        console.log('connected to the chat');

        socket.on('joinnbaroom', function(data){
            socket.userName = data.userName;
            socket.userPic = data.userPic;
            //gives us the unique number of each room and allow each user to join via the join method
            //allows us to segregate users into their private rooms
            socket.join(data.room_number);
            updateNBAList(data.room_number, true);

            //send to the client all the messages in the particular room that the user has joined
            socket.emit('roomMessages', JSON.stringify(chatMessages.nba[data.room_number]));
        });

        //get the event that the user submitted a new message from the client
        socket.on('newMessage', function (data){
             if(!(chatMessages.nba[data.room_number])){
                chatMessages.nba[data.room_number] = [];
                chatMessages.nba[data.room_number].push(data.message);
            } else {
                chatMessages.nba[data.room_number].push(data.message);
            }
            //broadcast to all other users except the active user and pass it just to the users in the chat room
            //we emit back to the client and pass back the data that was sent to the client in a string
            socket.broadcast.to(data.room_number).emit('messageFeed', JSON.stringify(data));
        });

         //updateAll is asking if we want to forcefully update or not, pulls from the true in the joinnhlroom
        function updateNBAList(room_number, updateAll){
            //gets us a list of all active users and their user pics, we passed this info to the socket when the 
            //join room event was triggered
            var getNbaUsers = io.of('/nbamessages').clients(room_number);

            var nbaUsersList = [];

            for(var i in getNbaUsers){
                //our username and pic are coming from the variables we created when the joinnflroom event triggered
                nbaUsersList.push({user: getNbaUsers[i].userName, userPic: getNbaUsers[i].userPic});
            }

            //emit the nflusersList array back to the user who requested it, the user joining the chat
            socket.to(room_number).emit('updateNBAUsersList', JSON.stringify(nbaUsersList));

            //if updateAll is true, meaning a user has just joined and we are forcefully updating the list of users
            //for all users connected to a particular room.
            if(updateAll){
                socket.broadcast.to(room_number).emit('updateNBAUsersList', JSON.stringify(nbaUsersList));
            }
        }

        //listen for the updateList event emitted from the client and run the updateNFLList function
        socket.on('updateNBAList', function (data){
            updateNBAList(data.room_number);
        });

    });


//======================================NFL LEAGUE CHAT ===========================================

     //responds to a socket connection of a user joining an nfl room
     var NFLmessages = io.of('/nflmessages').on('connection', function (socket){
        console.log('connected to the chat');

        socket.on('joinnflroom', function(data){
            socket.userName = data.userName;
            socket.userPic = data.userPic;
            //gives us the unique number of each room and allow each user to join via the join method
            //allows us to segregate users into their private rooms
            socket.join(data.room_number);
            //forcefully update all users screen with active users if true
            updateNFLList(data.room_number, true);

            //send to the client all the messages in the particular room that the user has joined
            socket.emit('roomMessages', JSON.stringify(chatMessages.nfl[data.room_number]));
        });

        //get the event that the user submitted a new message from the client
        socket.on('newMessage', function (data){
             if(!(chatMessages.nfl[data.room_number])){
                chatMessages.nfl[data.room_number] = [];
                chatMessages.nfl[data.room_number].push(data.message);
            } else {
                chatMessages.nfl[data.room_number].push(data.message);
            }
            //broadcast to all other users except the active user and pass it just to the users in the chat room
            //we emit back to the client and pass back the data that was sent to the client in a string
            socket.broadcast.to(data.room_number).emit('messageFeed', JSON.stringify(data));
        });

        //updateAll is asking if we want to forcefully update or not, pulls from the true in the joinnhlroom
        function updateNFLList(room_number, updateAll){
            //gets us a list of all active users and their user pics, we passed this info to the socket when the 
            //join room event was triggered
            var getNflUsers = io.of('/nflmessages').clients(room_number);

            var nflUsersList = [];

            for(var i in getNflUsers){
                //our username and pic are coming from the variables we created when the joinnflroom event triggered
                nflUsersList.push({user: getNflUsers[i].userName, userPic: getNflUsers[i].userPic});
            }

            //emit the nflusersList array back to the user who requested it, the user joining the chat
            socket.to(room_number).emit('updateNFLUsersList', JSON.stringify(nflUsersList));

            //if updateAll is true, meaning a user has just joined and we are forcefully updating the list of users
            //for all users connected to a particular room.
            if(updateAll){
                socket.broadcast.to(room_number).emit('updateNFLUsersList', JSON.stringify(nflUsersList));
            }
        }

        //listen for the updateList event emitted from the client and run the updateNFLList function
        socket.on('updateNFLList', function (data){
            updateNFLList(data.room_number);
        });
    });


//==================================NHL LEAGUE CHAT =========================================================

      //responds to a socket connection of a user joining an nhl room
     var NHLmessages = io.of('/nhlmessages').on('connection', function (socket){
        console.log('connected to the chat');

        socket.on('joinnhlroom', function(data){
            socket.userName = data.userName;
            socket.userPic = data.userPic;
            //gives us the unique number of each room and allow each user to join via the join method
            //allows us to segregate users into their private rooms
            socket.join(data.room_number);
            //we forcefully call the function if a new user joins, rather then doing it every 15 seconds.
            //true means we have to forcefully update every users list of users
            updateHockeyList(data.room_number, true);

           //send to the client all the messages in the particular room that the user has joined
            socket.emit('roomMessages', JSON.stringify(chatMessages.nhl[data.room_number]));
        });

        //get the event that the user submitted a new message from the client
        socket.on('newMessage', function (data){
            if(!(chatMessages.nhl[data.room_number])){
                chatMessages.nhl[data.room_number] = [];
                chatMessages.nhl[data.room_number].push(data.message);
            } else {
                chatMessages.nhl[data.room_number].push(data.message);
            }
            //broadcast to all other users except the active user and pass it just to the users in the chat room
            //we emit back to the client and pass back the data that was sent to the client in a string
            socket.broadcast.to(data.room_number).emit('messageFeed', JSON.stringify(data));
        });

        //updateAll is asking if we want to forcefully update or not, pulls from the true in the joinnhlroom
        function updateHockeyList(room_number, updateAll){
            //gets us a list of all active users and their user pics, we passed this info to the socket when the 
            //join room event was triggered
            var getNhlUsers = io.of('/nhlmessages').clients(room_number);

            var nhlUsersList = [];

            for(var i in getNhlUsers){
                //our username and pic are coming from the variables we created when the joinnhlroom event triggered
                nhlUsersList.push({user: getNhlUsers[i].userName, userPic: getNhlUsers[i].userPic});
            }

            //emit the nhlusersList array back to the user who requested it, the user joining the chat
            socket.to(room_number).emit('updateNHLUsersList', JSON.stringify(nhlUsersList));

            //if updateAll is true, meaning a user has just joined and we are forcefully updating the list of users
            //for all users connected to a particular room.
            if(updateAll){
                socket.broadcast.to(room_number).emit('updateNHLUsersList', JSON.stringify(nhlUsersList));
            }
        }

        //listen for the updateList event emitted from the client and run the updateHockeyList function
        socket.on('updateNHLList', function (data){
            updateHockeyList(data.room_number);
        });

    });
};







