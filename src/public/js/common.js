var common = {

    /*
    generate temp id if needed for certain appendable feature
    */
    id: function(){
        var possible = '0123456789';
        var i;
        var id = '';
        var idlength = 8; //specify length of ids in the database

        for(i = 0; i < idlength; i++){
            id += possible.charAt(Math.floor(Math.random() * possible.length)); //get digit at random spot
        }

        return id;
    },

    /*
    append an error to a div if some unknown error occurs
    */
    unknownerr: function(div){
        var err = Components.error({
            message: 'An unknown error occured, we are looking into it, try again later'
        });
        $('#' + div).append(err);
    },

    /*
    get time in ms from date string
    */
    getMS: function(datestring){
        var date = new Date(datestring);
        var ms = date.getTime();
        return ms;
    },

    /*
    get values of object
    */

    values: function(obj){
        var i;
        var arr = [];
        for(i in obj){
            arr.push(obj[i]);
        }

        return arr;
    },

    getURLID: function(){
        var url = window.location.href;
        return url.substring(url.lastIndexOf('/') + 1);
    }
};