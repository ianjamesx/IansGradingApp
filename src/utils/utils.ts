

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
let id = (): number => {

    let possible: string = '0123456789';
    let i: number;
    let id: string = '';
    let max: number = 2147483647; //<-- max value for id
    let idlength: number = 8; //specify length of ids in the database

    for(i = 0; i < idlength; i++){
        id += possible.charAt(Math.floor(Math.random() * possible.length)); //get digit at random spot
    }
    let idn: number = Number(id);
    return idn;
};

//generate course key
let key = (): string => {

    let possible: string = '0123456789ABCDEFGHJKMNOPQRSTUVWXYZ';
    let key: string = '';
    let keylength: number = 8;
    let i: number;

    for(i = 0; i < keylength; i++){
       key += possible.charAt(Math.floor(Math.random() * possible.length)); //get digit at random spot
    }

    return key;

}

export {
    vals,
    keys,
    id,
    key
};

