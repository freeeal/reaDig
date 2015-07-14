// Character Count
$(function(){ 

    $('#characterLeft').text('250 characters left');
    $('#aboutMe-area').keydown(function () {
        var max = 250;
        var len = $(this).val().length;
        if (len >= max) {
            $('#characterLeft').text('too many characters!');
            $('#btnSubmit').addClass('disabled');
            $('#characterLeft').addClass('red');            
        } 
        else {
            var ch = max - len;
            $('#characterLeft').text(ch + ' characters left');
            $('#btnSubmit').removeClass('disabled');
            $('#characterLeft').removeClass('red');            
        }
    }); 

});