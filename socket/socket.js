module.exports = function(io, mlbRooms, nhlRooms, nbaRooms, nflRooms, chatMessages){

//===================================MLB SELECT TOPIC===============================================================

    //accept the connection on the server side
    //pass in socket to the callback so we have a reference to each connected user
    var mlbChat = io.of('/mlb').on('connection', function (socket){
        console.log('socket connected');

        //this keeps our list of topics on the screen with a page refresh
        socket.emit('mlbroomUpdate', JSON.stringify(mlbRooms));

        socket.on('newmlbRoom', function (data){
            mlbRooms.push(data);
            //broadcast to all users an event of 'mlbroomUpdate' in the mlb room, 
            //convert the array into a string before sending to the client
            socket.broadcast.emit('mlbroomUpdate', JSON.stringify(mlbRooms));
            //need to broadcast back to the topic creator here as this does not happen above
            socket.emit('mlbroomUpdate', JSON.stringify(mlbRooms));
        });
    });


//=====================================NBA SELECT TOPIC======================================================

    var nbaChat = io.of('/nba').on('connection', function (socket){
        console.log('socket connected');
        //this keeps our list of topics on the screen with a page refresh
        socket.emit('nbaroomUpdate', JSON.stringify(nbaRooms));

        socket.on('newnbaRoom', function (data){
            nbaRooms.push(data);
            //broadcast to all users an event of 'mlbroomUpdate' in the mlb room, 
            //convert the array into a string before sending to the client
            socket.broadcast.emit('nbaroomUpdate', JSON.stringify(nbaRooms));
             //need to broadcast back to the topic creator here as this does not happen above
            socket.emit('nbaroomUpdate', JSON.stringify(nbaRooms));
        });
    });


//=========================================NFL SELECT TOPIC=======================================================

    var nflChat = io.of('/nfl').on('connection', function (socket){
        console.log('socket connected');
        //this keeps our list of topics on the screen with a page refresh
        socket.emit('nflroomUpdate', JSON.stringify(nflRooms));

        socket.on('newnflRoom', function (data){
            nflRooms.push(data);
            //broadcast to all users an event of 'mlbroomUpdate' in the mlb room, 
            //convert the array into a string before sending to the client
            socket.broadcast.emit('nflroomUpdate', JSON.stringify(nflRooms));
             //need to broadcast back to the topic creator here as this does not happen above
            socket.emit('nflroomUpdate', JSON.stringify(nflRooms));
        });
    });

//=========================================NHL SELECT TOPIC============================================================

    var nhlChat = io.of('/nhl').on('connection', function (socket){
        console.log('socket connected');
        //this keeps our list of topics on the screen with a page refresh
        socket.emit('nhlroomUpdate', JSON.stringify(nhlRooms));

        socket.on('newnhlRoom', function (data){
            nhlRooms.push(data);
            //broadcast to all users an event of 'mlbroomUpdate' in the mlb room, 
            //convert the array into a string before sending to the client
            socket.broadcast.emit('nhlroomUpdate', JSON.stringify(nhlRooms));
             //need to broadcast back to the topic creator here as this does not happen above
            socket.emit('nhlroomUpdate', JSON.stringify(nhlRooms));
        });
    });
};