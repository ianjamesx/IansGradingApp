"use strict";
/// <reference path="../../../node_modules/@types/jquery/index.d.ts" />
exports.__esModule = true;
var login = function (email, password) {
    $.ajax('/login', {
        type: 'POST',
        contentType: 'json',
        data: {
            email: email,
            password: password
        },
        success: function (data) {
            if (data.error) {
            }
            else {
                location.href = '/dashboard';
            }
        }
    });
};
exports.login = login;
var createaccount = function (email, password, firstname, lastname, instructor) {
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
        success: function (data) {
            if (data.error) {
            }
            else {
                location.href = '/dashboard';
            }
        }
    });
};
exports.createaccount = createaccount;
var contact = function (message, email, name, university, subject) {
};
exports.contact = contact;
