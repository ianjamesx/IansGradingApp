var home = {
    login: function(email, password){

        $.ajax('/api/user/login', {
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                email: email,
                password: password
            }),
            success: function(data){

                if(data.error){
                    var err = Components.error({
                        message: data.error
                    });
                    $('#loginerror').html(err);
                } else if(data.success){
                    location.href='/dashboard';
                }

            }

        });

    },

    accountcreate: function(email, password, firstname, lastname, instructor){

        $.ajax('/api/user/create', {
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname,
                instructor: instructor
            }),
            success: function(data){
                if(data.error){
                    console.log(data.error);
                    $('#account_email_error').text(data.error.email);
                    $('#account_firstname_error').text(data.error.firstname);
                    $('#account_lastname_error').text(data.error.lastname);
                    $('#account_password_error').text(data.error.password);
                    $('#account_any_error').text(data.error.any);
                } else if(data.success){
                    location.href='/dashboard';
                }

            }

        });

    },

    contact: function(message, email, name, university, subject){

    }

};


//page start

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
        home.accountcreate(email, password, firstname, lastname, instructor);
    });

    $('#contact').click(function(){
        var message = $('#contact_message').val();
        var email = $('#contact_email').val();
        var name = $('#contact_name').val();
        var university = $('#contact_university').val();
        var subject = $('#contact_subject').val();
        home.contact(message, email, name, university, subject);
    });

    //if they press enter on the login form, assume they want to login
    $('#password').keypress(function (e) {
        var key = e.which;
        if(key == 13){
           $('#login').click();
           return false;  
        }
    });
    $('#email').keypress(function (e) {
        var key = e.which;
        if(key == 13){
           $('#login').click();
           return false;  
        }
    });

});
