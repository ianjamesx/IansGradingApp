function updateuser(email, fn, ln){

    $.ajax('api/user/update', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email: email,
            fn: fn,
            ln: ln
        }),
        success: function(data){

            if(data.error){
                var err = Components.error({
                    message: 'Could not update'
                });
                $('#searcherror').html(err);
            } else {

            }

        }

    });

}

function updatepassword(id){

    $.ajax('api/user/updatepassword', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            id: id
        }),
        success: function(data){

            if(data.error){

            } else {
                
            }

        }

    });

}

//page start

$(document).ready(function(){

    $('#search').click(function(){
        var email = $('#email').val();
        var fn = $('#firstname').val();
        var ln = $('#lastname').val();
        updateuser(email, fn, ln);
    });

});
