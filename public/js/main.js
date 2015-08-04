 $(document).ready(function (){
/*hide all elements on the page upon view load*/
    $('#site-intro').hide();
    $('#real-time').hide();
    $('.site-info1').hide();
    $('.site-info2').hide();
    $('.site-info3').hide();
    $('.facebook-signin').hide();

    /*show each element on the page in order as follows*/
    $('#site-intro').fadeIn(3000, "linear", function (){
        $('.site-info1').fadeIn(1000, "linear", function (){
            $('.site-info2').fadeIn(1000, "linear", function (){
                $('.site-info3').fadeIn(1000, "linear", function (){
                    $('#real-time').fadeIn(1000, "linear", function (){
                            $('.facebook-signin').show();
                    });
                });
            });
        });
    });
});