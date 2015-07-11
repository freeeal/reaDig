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
    $('#findFriend').click(function(event) {
        
        event.preventDefault();
        var friendName = $("#friendName").val();
   
        $.post("/friends", {friendName : friendName}, function (data) {
            if (data.success == true) {
                window.location.href = "/friends";            
            } 
            else {
                shakeModal(); 
            }
        });
    });

    // accept friend request GET request (send data to router), res.send back success
    $('#acceptFriend').click(function(event) {

        event.preventDefault();
        var pendingFriend = $("#pendingFriend").val();
   
        $.post("/friends", {pendingFriend: pendingFriend}, function (data) {
            if (data.success == true) {
                window.location.href = "/friends";            
            } 
            else {
                console.log("something went wrong");
            }
        });
    });

});



function shakeModal() {

    $('#addFriend .modal-dialog').addClass('shake');
    $('.error').addClass('alert alert-danger').html("user not found! try again.");
    $('input#friendName[type="text"]').val('');

    setTimeout(function() { 
        $('#addFriend .modal-dialog').removeClass('shake'); 
    }, 1000); 

    setTimeout(function() {
        $('.error').removeClass('alert alert-danger').html("");
    }, 3000);

}

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};