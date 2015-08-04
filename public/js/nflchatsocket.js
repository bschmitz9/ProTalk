 $(function(){
    var host = config;
    var NFLmessages = io.connect(host + '/nflmessages');
    var roomNum = roomNumber;
    var userName = roomUserName;
    var userPic = roomUserPic;

   NFLmessages.on('connect', function (){
        console.log('sockets connected');
        NFLmessages.emit('joinnflroom', {room_number:roomNum, userName:userName, userPic:userPic});
    });

    //listen for the keyup event on the textarea on the page, specifically for the key 13 which is the enter key
    //we also check to make sure the input field is not empty, we then emit back to the server
    //we get the values sent below when the page loads, they are stored in the variable above
    $(document).on('keyup', '.addMessage', function (e){
        if(e.which === 13 && $(this).val() != ''){
           NFLmessages.emit('newMessage', {
                room_number: roomNum,
                userName: userName,
                userPic: userPic,
                message: $(this).val()
            });
            //when enter is pressed we pass the userPic and the message the user typed in the function below
            updateNFLFeed(userPic, $(this).val());
            $(this).val('');
        }
    });

    //allows the user to click on the 'Add Message' button as well as press enter as we defined above
      $(document).on('click', '.submitMessage', function (){
        if($('.addMessage').val() != ''){
            NFLmessages.emit('newMessage', {
                room_number: roomNum,
                userName: userName,
                userPic: userPic,
                message: $('.addMessage').val()
            });
     //when 'Add Message' is clicked we pass the userPic and the message the user typed in the function below
            updateNFLFeed(userPic, $('.addMessage').val());
            $('.addMessage').val('');
        }
    });

    //listen for the event back from the server called messageFeed and start by parsing the string back into an object that was originally sent and then pass it into our updateFeed function 
    NFLmessages.on("messageFeed", function (data){
        var messages = JSON.parse(data);
        updateNFLFeed(messages.userPic, messages.message);
    });

    //listen for when a user joins the room and this will receive all of the messages added to the room previously
    NFLmessages.on('roomMessages', function (data){
        var messagesReceived = JSON.parse(data);
        if(messagesReceived){
           for (var i = 0; i < messagesReceived.length; i++){
            updateNFLFeed(userPic, messagesReceived[i]);
            }
        }
    });

    //instead of sending back to the server the message created by the user him or her self, we create
    //a local function to display it on his or her own screen
    function updateNFLFeed(userPic, message){
        var msgString =  '<li>';
            msgString +=  '<div class="addedMessage">';
            msgString +=    '<div class="pic"><img src="' + userPic + '"></div>';
            msgString +=    '<div class="nflmsg"><p>' + message + '</p></div>';
            msgString +=  '</div>';
            msgString +=  '</li>';

        $(msgString).hide().prependTo('.messages').slideDown();
    }

    //listen for the event from the server when it has updated the room list
    NFLmessages.on('updateNFLUsersList', function (data){
        var NFLUsersList = JSON.parse(data);
        $('.users').html('');
        for(var i = 0; i < NFLUsersList.length; i++){
            var NFLusers = '<li><img src="' + NFLUsersList[i].userPic + '"><h5>' + NFLUsersList[i].user + '</h5></li>';
            $(NFLusers).prependTo($('.users'));
        }
    });

    //update the user list of the chatroom every 15 seconds
    setInterval(function (){
        NFLmessages.emit('updateNFLList', {room_number: roomNum});
    }, 15000);

});