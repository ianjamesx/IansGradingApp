var vals = (obj) => {
    var i, arr = [];
    for(i in obj){
        arr.push(obj[i]);
    }
    return arr;
};

var keys = (obj) => {
    var i, arr = [];
    for(i in obj){
        arr.push(i);
    }
    return arr;
};

module.exports = {
    vals: vals,
    keys: keys
};

