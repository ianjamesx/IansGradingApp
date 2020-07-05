
import { query, unknownerr, loginerr, errorsave } from './dbconfig';
import { id, vals, keys } from '../utils/utils';
import { format, escape } from 'sqlstring';

/*

templates for any db quieries that are common for all models
e.g. save, load, generateid

*/

/*
this interface will be used for all db queries
with some exceptions for, say, generateID functions
*/

interface DBResult {
    error?: string;
    data?: any;
}

/*
load single record from database
correlating to the object passed in, by ID

get what to load based on object's getColumns function
load based on ID
*/

let load = async (obj: any, table: string): Promise<DBResult> => {

    let result: DBResult = {};
    let loadquery = format(`SELECT ?? FROM ${table} WHERE id = ?`, [keys(obj.getColumns()), obj.getID()]);
    
    try {
        result.data = await query(loadquery);
        result.data = result.data[0];
    } catch(err){
        errorsave(err);
        result.error = unknownerr;
    }

    return result;

};

/*
save object passed in's data in database
either update or insert depending if it is there already

if updating, get all column data through getColumns(), set to match objects ID
if we're inserting, get keys and vals from columns for insert query
*/

let save = async (obj: any, table: string): Promise<DBResult> => {

    let result: DBResult = {};

    let existsquery: string = format(`SELECT id FROM ${table} WHERE id = ?`, [obj.getID()]);
    let exists: any[] = await query(existsquery);
    let savequery: string;

    if(exists.length > 0)
        savequery = format(`UPDATE ${table} SET ?? WHERE id = ?`, [obj.getColumns(), obj.id]);
     else 
        savequery = format(`INSERT INTO ${table} (??) VALUES (?)`, [keys(obj.getColumns()), vals(obj.getColumns())]);

    //run, return errors if any are encountered
    try {
        result.data = await query(savequery);
    } catch(err){
        errorsave(err);
        result.error = err;
    }

    return result;
};

/*
generate unique ID from ID function found in utils
keep trying until we obtain an ID thats unique
*/
let generateID = async (table: string): Promise<number> => {

    let userid: number;
    let valid: boolean = false;

    while(!valid){
        userid = id();
        let idsearch: string = format(`SELECT id FROM ${table} WHERE id = ?`, userid);
        let results: any[] = await query(idsearch); //search for this ID
        if(results.length == 0) valid = true; //if no results, we have a valid unique ID
    }

    return userid;

};

/*
export everything from db module as well so models only need this file
*/
export {
    query,
    errorsave,
    unknownerr,
    loginerr,
    format,
    escape,

    DBResult,
    load,
    save,
    generateID
}