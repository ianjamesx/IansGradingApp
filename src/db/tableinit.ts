import db = require('./db');

/*
all database table declarations
*/

let tables: any = {
    users: {
        email: `varchar(50)`,
        password: `varchar(256)`,
        firstname: `varchar(30)`,
        lastname: `varchar(30)`,
        id: `int NOT NULL PRIMARY KEY`
    },

    courses: {
        name: `varchar(30)`,
        department: `char(4) FOREIGN KEY departments(abbreviation)`,
        season: `enum('Spring', 'Summer', 'Fall', 'Winter')`,
        year: `int`,
        number: `int`,
        section: `int`,
        id: `int NOT NULL PRIMARY KEY`,
        coursekey: `varchar(12)`,
        instructor: `varchar(30)`,
    },

    usercourse: { //junction table for users and courses
        user: `int FOREIGN KEY users(id)`,
        course: `int FOREIGN KEY courses(id)`,
    },

    departments: { //all departments a course can belong to
        name: `varchar(20)`,
        abbreviation: `char(4) NOT NULL PRIMARY KEY`
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
