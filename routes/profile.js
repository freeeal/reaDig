//--------------------------------------------PROFILE PAGE--------------------------------------------------------------------------------------------

$(document).ready(function() {
    var $btnSets = $('#responsive'),
    $btnLinks = $btnSets.find('a');
 
    $btnLinks.click(function(e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.user-menu>div.user-menu-content").removeClass("active");
        $("div.user-menu>div.user-menu-content").eq(index).addClass("active");
    });
});

$( document ).ready(function() {
    $("[rel='tooltip']").tooltip();    
 
    $('.view').hover(
        function(){
            $(this).find('.caption').slideDown(250); //.fadeIn(250)
        },
        function(){
            $(this).find('.caption').slideUp(250); //.fadeOut(205)
        }
    ); 
});


// var main = function() {
//   $('.navbar-brand').click(function() {
//     $('.dropdown-menu').toggle();
//   });
// }

// $(document).ready(main); // this command waits for the HTML doc to run completely before running the main fn.

// var main = function() {
//   $(".like-button").click(function() {
//     $(this).toggleClass("active");
//   });
// };


// $('.social li').click(function() {     // command selects each share button?
//   $(this).toggleClass('active');       // $(*this) refers to the HTML element that was clicked on.
// });                                    // .click() method attaches an event handler to '.social li' class