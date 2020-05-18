import db = require('./db');

let tables: any = {
    users: {
        email: `varchar(50)`,
        password: `varchar(256)`,
        firstname: `varchar(30)`,
        lastname: `varchar(30)`,
        id: `int NOT NULL PRIMARY KEY,`
    }
};

let tableformat = (tables: any): string[] => {
    
    let queries: any = [];
    let i: string; //loop through tables
    let j: string; //loop through each table columns

    for(i in tables){
        let tablequery: string = `CREATE TABLE IF NOT EXISTS ` + i + `(`;
        for(j in tables[i]){
            tablequery += j + ` ` + tables[i][j] + `, `;
        }
        tablequery = tablequery.substring(0, tablequery.length - 3); //trim off last space/comma
        tablequery += `)`;
        queries.push(tablequery);
    }
    return queries;
};

let init = async (): Promise<void> => {
    let tablearray: string[] = tableformat(tables);
    let i: number;
    for(i = 0; i < tablearray.length; i++){
        try {
            let res: any = await db.query(tablearray[i]);
        } catch(err){
            console.log("ERROR ON TABLE INSERT: " + err);
        }
    }
};

export {
    init
}
