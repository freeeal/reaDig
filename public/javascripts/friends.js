// Copyright (c) 2013 Bootsnipp.com
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

$(function () {
    
    $('[data-toggle="tooltip"]').tooltip();
    
    $('#fullscreen').on('click', function(event) {
        event.preventDefault();
        window.parent.location = "http://bootsnipp.com/iframe/4l0k2";
    });
    $('a[href="#add-friend"]').on('click', function(event) {
        event.preventDefault();
        $('#addFriend').modal('show');
    })
    
    $('[data-command="toggle-search"]').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('hide-search');
        
        if ($(this).hasClass('hide-search')) {        
            $('.c-search').closest('.row').slideUp(100);
        }else{   
            $('.c-search').closest('.row').slideDown(100);
        }
    })
    
    $('#friend-list').searchable({
        searchField: '#friend-list-search',
        selector: 'li',
        childSelector: '.col-xs-12',
        show: function( elem ) {
            elem.slideDown(100);
        },
        hide: function( elem ) {
            elem.slideUp( 100 );
        }
    })

    // AJAX response to secure.js's request handler for search of friend
    $("#submit").click(function(){
        // alert('clicked');
        // console.log($("#friendName").val());
        //'data' is the stuff in the server response
        $.post("/friends").done(function(data) {
            console.log("this is " + data);
            if (data ==1) {
                window.location.href = "/friends";            
            } 
            else {
                   shakeModal(); 
            }
        });
    });

});



function shakeModal() {

    $('#addFriend .modal-dialog').addClass('shake');
    $('.error').addClass('alert alert-danger').html("user not found!");
    $('input#friendName[type="text"]').val('');

    setTimeout(function() { 
        $('#addFriend .modal-dialog').removeClass('shake'); 
    }, 1000); 

}