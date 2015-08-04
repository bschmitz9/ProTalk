 $(function(){
        //sets the host variable depending on the environment that we are in
        var host = config;
        
        //a namespace called '/nfl' for segregating communications in the socket channel
        var socket = io.connect(host + '/nfl');

        //response to the connection event
        socket.on('connect', function (){
            console.log('connection established');
        });

        //listen for the server to send the event that the nfl room was updated with a new topic
        socket.on('nflroomUpdate', function (data){
            //the data gets send back from the server as a string, we convert it back into an active array via JSON.parse so it can be looped over
            //stringifying the data on the server makes it easy to send it here via the socket connection
            var processnflData = JSON.parse(data);
            //clear out the list of topics each time we add a new topic
            $('.nflroomList').html('');
            //loop through the data everytime an nflroomUpdate event is triggered
            for(var i = 0; i < processnflData.length; i++){
                var addnflTopic = '<a href="nflroom/' + processnflData[i].room_number + '"><li>' + processnflData[i].room_name + '</li></a>';
                $('.nflroomList').prepend(addnflTopic);
            }
        });


        $(document).on('click', '#createnflTopic', function (){
            //gets the value of the input field when the user clicks on createTopic
                var room_name = $('.newnflRoom').val();
                if(room_name != ''){
                    //gives each room a random room number
                    var room_number = parseInt(Math.random() * 10000);
                    //creates a new event which we set the server to listen for, send back new room name and number
                    socket.emit('newnflRoom', {room_name: room_name, room_number: room_number});
                    //clear the input field
                    $('.newnflRoom').val('');
                }
            });
    });