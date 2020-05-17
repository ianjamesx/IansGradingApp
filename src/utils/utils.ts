

//only get values from an object, put in array
let vals = (obj: any): any[] => {
    var i, arr = [];
    for(i in obj){
        arr.push(obj[i]);
    }
    return arr;
};

//only get keys from an object, put in array
let keys = (obj: any): any[] => {
    var i, arr = [];
    for(i in obj){
        arr.push(i);
    }
    return arr;
};

//generate an id for database record
let id = (idlength: number): number => {
    let possible: string = '0123456789';
    let i: number;
    let id: string = '';
    for(i = 0; i < idlength; i++){
        id += possible.charAt(Math.floor(Math.random() * possible.length)); //get digit at random spot
    }
    return Number(id); //cast to number to store as an int in db
};

export {
    vals,
    keys,
    id
};

