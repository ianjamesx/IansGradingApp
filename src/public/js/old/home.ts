/// <reference path="../../../node_modules/@types/jquery/index.d.ts" />

interface Result {
    error: string | any;
    success: boolean;
}

let login = (email: string, password: string): void => {

    $.ajax('/login', {
        type: 'POST',
        contentType: 'json',
        data: {
            email: email,
            password: password
        },
        success: function(data: Result){

            if(data.error){
                alert(data.error);
            } else {
                location.href='/dashboard';
            }

        }

    });

};

let createaccount = (email: string, password: string, firstname: string, lastname: string, instructor: boolean): void => {

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
        success: function(data: Result){

            if(data.error){
                alert(data.error);
            } else {
                location.href='/dashboard';
            }

        }

    });

};

let contact = (message: string, email: string, name: string, university: string, subject: string): void => {

}

export {
    login,
    createaccount,
    contact
}