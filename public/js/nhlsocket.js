 $(function(){
        //sets the host variable depending on the environment that we are in
        var host = config;
        
        //a namespace called '/nhl' for segregating communications in the socket channel
        var socket = io.connect(host + '/nhl');

        //response to the connection event
        socket.on('connect', function (){
            console.log('connection established');
        });

        //listen for the server to send the event that the mlb room was updated with a new topic
        socket.on('nhlroomUpdate', function (data){
            //the data gets send back from the server as a string, we convert it back into an active array via JSON.parse so it can be looped over
            //stringifying the data on the server makes it easy to send it here via the socket connection
            var processnhlData = JSON.parse(data);
            //clear out the list of topics each time we add a new topic
            $('.nhlroomList').html('');
            //loop through the data everytime an mlbroomUpdate event is triggered
            for(var i = 0; i < processnhlData.length; i++){
                var addnhlTopic = '<a href="nhlroom/' + processnhlData[i].room_number + '"><li>' + processnhlData[i].room_name + '</li></a>';
                $('.nhlroomList').prepend(addnhlTopic);
            }
        });


        $(document).on('click', '#createnhlTopic', function (){
            //gets the value of the input field when the user clicks on createTopic
                var room_name = $('.newnhlRoom').val();
                if(room_name != ''){
                    //gives each room a random room number
                    var room_number = parseInt(Math.random() * 10000);
                    //creates a new event which we set the server to listen for, send back new room name and number
                    socket.emit('newnhlRoom', {room_name: room_name, room_number: room_number});
                    //clear the input field
                    $('.newnhlRoom').val('');
                }
            });
    });