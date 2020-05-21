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

    createaccount: function(email, password, firstname, lastname, instructor){

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