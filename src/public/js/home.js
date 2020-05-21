var home = {
    login: function(email, password){

        $.ajax('/login', {
            type: 'POST',
            contentType: 'json',
            data: {
                email: email,
                password: password
            },
            success: function(data){
    
                if(data.error){
                    alert(data.error);
                } else {
                    location.href='/dashboard';
                }
    
            }
    
        });
    
    },

     accounteateaccount: function(email, password, firstname, lastname, instructor){

        $.ajax('/user/create', {
            type: 'POST',
            contentType: 'json',
            data: {
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname,
                instructor: instructor
            },
            success: function(data){
    
                if(data.error){
                    alert(data.error);
                } else {
                    location.href='/dashboard';
                }
    
            }
    
        });
    
    },

    contact: function(message, email, name, university, subject){

    }

};

/*
page start
*/
 
$(document).ready(function(){

    $('#login').click(function(){
        var email = $('#email').val();
        var password = $('#password').val();
        home.login(email, password);
    });

    $('#createaccount').click(function(){
        var email = $('#account_email').val();
        var password = $('#account_password').val();
        var confirmpass = $('#account_confirmpass').val();
        var firstname = $('#account_firstname').val();
        var lastname = $('#account_lastname').val();
        var instructor = $('#account_instructor').val();
        home.login(email, password, firstname, lastname, instructor);
    });

    $('#contact').click(function(){
        var message = $('#contact_message').val();
        var email = $('#contact_email').val();
        var name = $('#contact_name').val();
        var university = $('#contact_university').val();
        var subject = $('#contact_subject').val();
        home.contact(message, email, name, university, subject);
    });

});