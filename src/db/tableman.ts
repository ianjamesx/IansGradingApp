import db = require('./dbconfig');
import { vals, keys } from '../utils/utils';
import { timers } from 'jquery';

const readline = require("readline-sync");

/*
enum for issues with outline-db connection
*/

enum Issue {
    notInDB,        //column appears in DB, not in outline
    notInOutline,   //column appears in outline, not in DB
}

interface Exception {
    issue: Issue;
    message: string;
    table: string;
    column: string;
    columninfo?: string;
}

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

        await dbMatchOutline(schema, table, i);

        //iterate over schema, insure 

    }
    return conflicts;

};

let dbMatchOutline = async (schema: any, tableoutline: any, tablename: string): Promise<any> => {

    let i: any;

    //first, ensure all columns in db appear in schema outlined by user
    let indb: string[] = [];
    for(i = 0; i < schema.length; i++){
        let column: string = schema[i].Field;
        if(!tableoutline[column]){

            await dbexcept({
                issue: Issue.notInOutline,
                table: tablename,
                column: column,
                message: 'Column appears in DB, not in outline) column: ' + column + ', table: ' + tablename
            });

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

                await dbexcept({
                    issue: Issue.notInDB,
                    table: tablename,
                    column: columnkeys[i],
                    columninfo: tableoutline[columnkeys[i]],
                    message: 'Column appears in outline, not in DB) column: ' + columnkeys[i] + ', table: ' + tablename
                });

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

let dbexcept = async (except: Exception): Promise<any> => {

    console.log(except.message);
    var response = readline.question("Would you like to force fix? (y/n): ");

    //if response is y, fix issue
    if(response == 'y'){
        switch(except.issue){
            case Issue.notInDB:

                let addcolumn: string = `ALTER TABLE ${except.table} ADD ${except.column}  ${except.columninfo}`;
                try {
                    let output = await db.query(addcolumn);
                } catch(err){
                    console.log(`ERR: ${err}`);
                }
            
            break;
            case Issue.notInOutline:

                try {

                    let dropcolumn: string = `ALTER TABLE ${except.table} DROP COLUMN ${except.column}`;
                    let output = await db.query(dropcolumn);

                } catch(err){

                    //err usually caused by constraint
                    if(err.code == 'ER_FK_COLUMN_CANNOT_DROP'){

                        //get name of foreign key constraint from error message
                        let straint: any = (err.sqlMessage.split(' '));
                        straint = straint[straint.length-1];

                        //take single quotes out of constraint name
                        straint = straint.replace("'", "");
                        straint = straint.replace("'", "");

                        let dropstraint: string =  `ALTER TABLE ${except.table} DROP FOREIGN KEY ${straint};`
                        let dropcolumn: string = `ALTER TABLE ${except.table} DROP COLUMN ${except.column}`;

                        try {
                            let constraintdrop = await db.query(dropstraint);
                            let columndrop = await db.query(dropcolumn);
                        } catch(err){
                            console.log(`ERR: ${err}`);
                        }


                    }
                
                }
            
            break;

        }

        console.log('done');
    } else {
        console.log('skipped');
    }

};

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

let init = async (tables): Promise<void> => {
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

    tablecheck(tables);

};

export {
    init
}