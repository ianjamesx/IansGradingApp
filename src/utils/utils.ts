
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

let tablekeys = (obj: any, letter: string): any[] => {
    let objkeys = keys(obj);

    let i: number;
    for(i = 0; i < objkeys.length; i++){
        objkeys[i] = letter + '.' + objkeys[i];
    }

    return objkeys;
}

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

    let possible: string = '0123456789BCDFGHJKMNPQRSTVWXZ';
    let key: string = '';
    let keylength: number = 8;
    let i: number;

    for(i = 0; i < keylength; i++){
       key += possible.charAt(Math.floor(Math.random() * possible.length)); //get digit at random spot
    }

    return key;

};

//turn an array of objects into an array of views (e.g. just the actual data view for rendering the object)
let views = async (objs: any[]): Promise<any[]> => {
    let i: number;
    let objviews: any[] = [];
    for(i = 0; i < objs.length; i++){
        objviews.push(await objs[i].dataView());
    }
    return objviews;
};

//given two arrays of obejcts, merge two objects from seperate arrays if the id is the same
let mergeOnId = (arr1: any[], arr2: any[]): any[] => {
    let i: number, j: number;
    for(i = 0; i < arr1.length; i++){
        for(j = 0; j < arr2.length; j++){
            if(arr1[i].id == arr2[j].id){
                arr1[i] = Object.assign(arr1[i], arr2[j]);
            }
        }
    }

    return arr1;
}

export {
    vals,
    keys,
    tablekeys,
    id,
    key,
    views,
    mergeOnId
};

