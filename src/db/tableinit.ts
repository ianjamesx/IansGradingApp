import db = require('./dbconfig');

/*
all database table declarations
*/

let tables: any = {
    
    /*
    user course tables
    */

    users: {
        email: `varchar(50)`,
        password: `varchar(256)`,
        firstname: `varchar(30)`,
        lastname: `varchar(30)`,
        instructor: `bit`,
        id: `int NOT NULL PRIMARY KEY`
    },

    courses: {
        name: `varchar(30)`,
        department: `char(4)`,
        season: `enum('Spring', 'Summer', 'Fall', 'Winter')`,
        year: `int`,
        number: `int`,
        section: `int`,
        id: `int NOT NULL PRIMARY KEY`,
        coursekey: `varchar(12)`,
        instructor: `varchar(30)`,
        CONSTRAINTS: [
            `FOREIGN KEY (department) REFERENCES departments(abbreviation)`
        ]
    },

    //junction table for users and courses
    usercourse: {
        user: `int`,
        course: `int`,
        CONSTRAINTS: [
            `FOREIGN KEY (user) REFERENCES users(id)`,
            `FOREIGN KEY (course) REFERENCES courses(id)`
        ]
    },

    //all departments a course can belong to
    departments: {
        name: `varchar(20)`,
        abbreviation: `char(4) NOT NULL PRIMARY KEY`
    },

    /*
    assignment tables
    */

    assignments: {
        id: `int NOT NULL PRIMARY KEY`,
        course: `int`,
        author: `int`,
        name: `varchar(30)`,
        open: `varchar(15)`,
        close: `varchar(15)`,
        cutoff: `varchar(15)`,
        questionpoints: `int`,
        attempts: `int`,
        randomize: `bit`,
        questions: `text`,
        latepenalty: `int`,
        category: `int`,
        prompt: `text`,
        CONSTRAINTS: [
            `FOREIGN KEY (course) REFERENCES course(id)`,
            `FOREIGN KEY (author) REFERENCES users(id)`,
        ]

    },

    assignment_categories: {
        id: `int NOT NULL PRIMARY KEY`,
        course: `int`,
        name: `varchar(20)`,
        percent: `int`,
        CONSTRAINTS: [
            `FOREIGN KEY (course) REFERENCES course(id)`
        ]
    },

    /*
    question tables
    */

    questions: {
        id: `int NOT NULL PRIMARY KEY`,
        type: `int`,
        authorID: `int`,
        question: `text`,
        hint: `varchar(200)`,
        subject: `int`,
        topic: `int`,
        public: `bit`
    },

    answers: {
        id: `int NOT NULL PRIMARY KEY`,
        correct: `bit`,
        ans: `varchar(200)`,
        question: `int`,
        CONSTRAINTS: [
            `FOREIGN KEY (question) REFERENCES questions(id)`
        ]
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
