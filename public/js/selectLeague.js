 $(document).ready(function (){
    //hide all these divs on the page initially
    $('.mlbDiv').hide();
    $('.nhlDiv').hide();
    $('.nbaDiv').hide();
    $('.nflDiv').hide();
    $('#directions').hide();
    $('#sportsFans').hide();
    //show each sport logo one after another from left to right
    $('#directions').fadeIn(1000, "linear");
    $('.mlbDiv').fadeIn(1000, "linear", function (){
        $('.nhlDiv').fadeIn(1000, "linear", function (){
                $('.nbaDiv').fadeIn(1000, "linear", function (){
                    $('.nflDiv').fadeIn(1000, "linear");
                });
        });
    });
    //show the directions for the page after everything else has appeared on the page
    $('#sportsFans').fadeIn(2000, "linear");
  });