 $(function(){
        //sets the host variable depending on the environment that we are in
        var host = config;
        
        //a namespace called '/nba' for segregating communications in the socket channel
        var socket = io.connect(host + '/nba');
        

        //response to the connection event
        socket.on('connect', function (){
            console.log('connection established');
        });

        //listen for the server to send the event that the nba room was updated with a new topic
        socket.on('nbaroomUpdate', function (data){
            //the data gets send back from the server as a string, we convert it back into an active array via JSON.parse so it can be looped over
            //stringifying the data on the server makes it easy to send it here via the socket connection
            var processnbaData = JSON.parse(data);
            //clear out the list of topics each time we add a new topic
            $('.nbaroomList').html('');
            //loop through the data everytime an nbaroomUpdate event is triggered
            for(var i = 0; i < processnbaData.length; i++){
                var addnbaTopic = '<a href="nbaroom/' + processnbaData[i].room_number + '"><li>' + processnbaData[i].room_name + '</li></a>';
                $('.nbaroomList').prepend(addnbaTopic);
            }
        });


        $(document).on('click', '#createnbaTopic', function (){
            //gets the value of the input field when the user clicks on createTopic
                var room_name = $('.newnbaRoom').val();
                if(room_name != ''){
                    //gives each room a random room number
                    var room_number = parseInt(Math.random() * 10000);
                    //creates a new event which we set the server to listen for, send back new room name and number
                    socket.emit('newnbaRoom', {room_name: room_name, room_number: room_number});
                    //clear the input field
                    $('.newnbaRoom').val('');
                }
            });
    });
