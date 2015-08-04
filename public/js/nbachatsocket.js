 $(function(){
        var host = config;
        var NBAmessages = io.connect(host + '/nbamessages');
        var roomNum = roomNumber;
        var userName = roomUserName;
        var userPic = roomUserPic;

       NBAmessages.on('connect', function (){
            console.log('sockets connected');
            NBAmessages.emit('joinnbaroom', {room_number:roomNum, userName:userName, userPic:userPic});
        });

        //listen for the keyup event on the textarea on the page, specifically for the key 13 which is the enter key
        //we also check to make sure the input field is not empty, we then emit back to the server
        //we get the values sent below when the page loads, they are stored in the variable above
        $(document).on('keyup', '.addMessage', function (e){
            if(e.which === 13 && $(this).val() != ''){
               NBAmessages.emit('newMessage', {
                    room_number: roomNum,
                    userName: userName,
                    userPic: userPic,
                    message: $(this).val()
                });
                //when enter is pressed we pass the userPic and the message the user typed in the function below
                updateNBAFeed(userPic, $(this).val());
                $(this).val('');
            }
        });

        //allows the user to click on the 'Add Message' button as well as press enter as we defined above
          $(document).on('click', '.submitMessage', function (){
            if($('.addMessage').val() != ''){
                NBAmessages.emit('newMessage', {
                    room_number: roomNum,
                    userName: userName,
                    userPic: userPic,
                    message: $('.addMessage').val()
                });
         //when 'Add Message' is clicked we pass the userPic and the message the user typed in the function below
                updateNBAFeed(userPic, $('.addMessage').val());
                $('.addMessage').val('');
            }
        });

        //listen for the event back from the server called messageFeed and start by parsing the string back into an object that was originally sent and then pass it into our updateFeed function 
        NBAmessages.on("messageFeed", function (data){
            var messages = JSON.parse(data);
            updateNBAFeed(messages.userPic, messages.message);
        });

        //listen for when a user joins the room and this will receive all of the messages added to the room previously
        NBAmessages.on('roomMessages', function (data){
            var messagesReceived = JSON.parse(data);
            if(messagesReceived){
               for (var i = 0; i < messagesReceived.length; i++){
                updateNBAFeed(userPic, messagesReceived[i]);
                }
            }
        });

        //instead of sending back to the server the message created by the user him or her self, we create
        //a local function to display it on his or her own screen
        function updateNBAFeed(userPic, message){
            var msgString =  '<li>';
                msgString +=  '<div class="addedMessage">';
                msgString +=    '<div class="pic"><img src="' + userPic + '"></div>';
                msgString +=    '<div class="nbamsg"><p>' + message + '</p></div>';
                msgString +=  '</div>';
                msgString +=  '</li>';

            $(msgString).hide().prependTo('.messages').slideDown();
        }

        //listen for the event from the server when it has updated the room list
        NBAmessages.on('updateNBAUsersList', function (data){
            var NBAUsersList = JSON.parse(data);
            $('.users').html('');
            for(var i = 0; i < NBAUsersList.length; i++){
                var NBAusers = '<li><img src="' + NBAUsersList[i].userPic + '"><h5>' + NBAUsersList[i].user + '</h5></li>';
                $(NBAusers).prependTo($('.users'));
            }
        });

        //update the user list of the chatroom every 15 seconds
        setInterval(function (){
            NBAmessages.emit('updateNBAList', {room_number: roomNum});
        }, 15000);
});