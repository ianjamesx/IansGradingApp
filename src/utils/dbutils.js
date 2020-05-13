var { escape, format } = require('sqlstring'); //sanitization module

/*
format object into a query (mostly for insert/update statements)
also sanitize any data in the obj

UTILS ONLY PROVIDED FOR INSERT/UPDATE STATEMENTS

select statements are hard to do and sometimes inneficient when constructed automatically
*/

var insertformat = (data) => {

  if(Array.isArray(data)) return formatmultiple(data); //if we are dealing with an array, format it for multiple entries instead

  var i;
  var datastr = '(', columnstr = '(';
  for(i in data){
    columnstr += i;
    if(typeof data[i] === 'string'){
      datastr += (escape(data[i]));
    } else {
      datastr += (data[i]);
    }
    datastr += ', ';
    columnstr += ', ';
  }

  //remove last comma and space at end of string
  datastr = datastr.substring(0, datastr.length - 2);
  datastr += ')';
  columnstr = columnstr.substring(0, columnstr.length - 2);
  columnstr += ')';

  return {
    columns: columnstr,
    data: datastr
  };

};

var updateformat = (data) => {

  if(Array.isArray(data)) return formatmultiple(data); //if we are dealing with an array, format it for multiple entries instead

  var i;
  var str = '';
  for(i in data){
    str += i;
    str += ' = ';
    if(typeof data[i] === 'string'){
      str += (escape(data[i]));
    } else {
      str += (data[i]);
    }
    str += ', ';
  }

  //remove last comma and space at end of string
  str = str.substring(0, str.length - 2);
  return str;

};

/*
format array of objects into a single sql insert string
*/

var formatmultiple = (data) => {

  var i;
  var datastring = '';
  for(i = 0; i < data.length; i++){
    datastring += insertformat(data[i]) + ',';
  }
  datastring = datastring.substring(0, datastring.length - 1); //take off last comma
  return datastring;

};

var insert = async (table, data) => {

  var formatted = insertformat(data);
  var ins = 'INSERT INTO ' + table + ' ' + formatted.columns + ' VALUES ' + formatted.data + ';';
  var res = await query(ins);
  return res;

};

var update = async (table, data, condition) => {

  var updatedata = updateformat(data), updatecond = updateformat(condition);
  var upd = 'UPDATE ' + table + ' SET ' + formatted + ' WHERE ' + updatecond + ';';
  var res = await query(upd);
  return res;

};

module.exports = {
  format: format,
  insert: insert,
  update: update,
};
