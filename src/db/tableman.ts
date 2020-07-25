import db = require('./dbconfig');
import { vals, keys } from '../utils/utils';
import { timers } from 'jquery';

/*
take array of objects
turn in to list of sql queries (strings) defining structure for a table
*/
let tableformat = (tables: any): string[] => {
    
    let queries: any = [];
    let i: string; //loop through tables
    let j: string; //loop through each table columns

    for(i in tables){
        let tablequery: string = `CREATE TABLE IF NOT EXISTS ` + i + `(`;
        for(j in tables[i]){
            if(typeof tables[i][j] != 'string'){ //if list of constraints, ignore the object property for each
                let l: number;
                for(l = 0; l < tables[i][j].length; l++){
                    tablequery += tables[i][j][l] + `, `;
                }
            } else {
                tablequery += j + ` ` + tables[i][j] + `, `;
            }
        }
        tablequery = tablequery.substring(0, tablequery.length - 2); //trim off last space/comma
        tablequery += `)`;
        queries.push(tablequery);
    }
    return queries;
};

/*
check all existing tables in database, make sure there are no conflicts
between existing tables and ones specificed in schema outline (provided by user)
*/
let tablecheck = async (tables: any): Promise<any> => {

    let conflicts: any = [];
    let i: any; //loop through tables
    let j: any; //loop through each table columns

    for(i in tables){

        //get schema
        let schema: any = await getTableSchema(i);
        if(!schema.length) continue;
        
        let table: any = tables[i];

        dbMatchOutline(schema, table, i);

        //iterate over schema, insure 

    }
    return conflicts;

};

let dbMatchOutline = (schema: any, tableoutline: any, tablename: string): any => {

    let i: any;

    //first, ensure all columns in db appear in schema outlined by user
    let indb: string[] = [];
    for(i = 0; i < schema.length; i++){
        let column: string = schema[i].Field;
        if(!tableoutline[column]){
            dbexcept('Column appears in DB, not in outline: DB Field:' + column + ' Table: ' + tablename);
        } else {
            indb.push(column);
        }
    }

    //by this point, indb should contain all members found in db
    //see if there are any not in indb but in table outline

    //get keys from tableoutline
    let columnkeys: string[] = keys(tableoutline);
    for(i = 0; i < columnkeys.length; i++){
        //make sure its not a constraint list
        if(typeof tableoutline[columnkeys[i]] == 'string'){
            if(!indb.includes(columnkeys[i])){
                dbexcept('Column appears in outline, not in DB: outline Field: ' + columnkeys[i] + ' Table: ' + tablename);
            }
        }
    }

};

let getTableSchema = async (table: string): Promise<any> => {

    let desc: string = 'describe ' + table;
    let output;
    try {
        output = await db.query(desc);
    } catch(err){
        if(err){
            console.log('Table ' + table + ' does not exist');
        }
        output = [];
    }
    return output;

};

let dbexcept = (err: string): any => {

    console.log(err);

};

/*
let init = async (): Promise<void> => {
    let tablearray: string[] = tableformat(tables);
    let i: number;
    for(i = 0; i < tablearray.length; i++){
        try {
            let res: any = await db.query(tablearray[i]);
        } catch(err){
            console.log(tablearray[i]);
            console.log("ERROR ON TABLE INSERT: " + err);
            console.log('------------------');
        }
    }

};

*/

export {
    tablecheck
}