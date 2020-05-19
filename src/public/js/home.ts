
let login = (email: string, password: string) => {

    $("#submit").click(function(){

        $.ajax({
            url: '/login',
            type: 'POST',
            data: {
                email: email,
            password: password
            },

            datatype: 'json',
            success: function(data){
                if(data.success)
                    location.href='/dashboard';
                else 
                    alert("OH NO!");

            }

        });

    });

}