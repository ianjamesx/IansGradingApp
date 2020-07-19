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
        instructor: `int`,
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

    course_categories: {
        name: `varchar(30)`,
        points: `int`,
        course: `int`,
        CONSTRAINTS: [
            `FOREIGN KEY (course) REFERENCES courses(id)`
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
        author: `int`,
        name: `varchar(30)`,
        open: `varchar(15)`,
        close: `varchar(15)`,
        cutoff: `varchar(15)`,
        questionpoints: `int`,
        attempts: `int`,
        randomize: `bit`,
        latepenalty: `int`,
        category: `varchar(30)`,
        prompt: `text`,
        active: `int`,
        course: `int`,
        CONSTRAINTS: [
            `FOREIGN KEY (author) REFERENCES users(id)`,
            `FOREIGN KEY (category) REFERENCES course_categories(name)`,
            `FOREIGN KEY (course) REFERENCES course(id)`
        ]

    },

    /*
    question tables
    */

    questions: {
        id: `int NOT NULL PRIMARY KEY`,
        type: `varchar(20)`,
        author: `int`,
        question: `text`,
        hint: `varchar(200)`,
        subject: `varchar(20)`,
        topic: `varchar(20)`,
        public: `bit`,
        CONSTRAINTS: [
            `FOREIGN KEY (type) REFERENCES question_types(type)`,
            `FOREIGN KEY (author) REFERENCES users(id)`,
            `FOREIGN KEY (subject) REFERENCES question_subjects(subject)`,
            `FOREIGN KEY (topic) REFERENCES question_topics(topic)`
        ]
    },

    answers: {
        id: `int NOT NULL PRIMARY KEY`,
        correct: `bit`,
        ans: `varchar(200)`,
        question: `int`,
        CONSTRAINTS: [
            `FOREIGN KEY (question) REFERENCES questions(id)`
        ]
    },

    //junction table between assignments and questions
    assignmentquestions: {
        question: `int`,
        assignment: `int`,
        CONSTRAINTS: [
            `FOREIGN KEY (question) REFERENCES questions(id)`,
            `FOREIGN KEY (assignment) REFERENCES assignment(id)`
        ]
    },

    question_types: {
        type: `varchar(20) NOT NULL PRIMARY KEY`
    },

    question_subjects: {
        subject: `varchar(20) NOT NULL PRIMARY KEY`
    },

    question_topics: {
        topic: `varchar(20) NOT NULL PRIMARY KEY`
    },

    /*
    code questions/labs
    */

    programs: {

        id: `int NOT NULL PRIMARY KEY`,
        type: `varchar(20)`,
        author: `int`,
        question: `text`,
        hint: `varchar(200)`,
        subject: `varchar(20)`,
        topic: `varchar(20)`,
        public: `bit`,

    },

    testcases: {
        assignment: `int`,
        visible: `bit`,
        input: `varchar(100)`,
        output: `varchar(100)`
    },

    programfiles: {
        language: `varchar(20)`,
        filename: `varchar(40)`,
        sourcecode: `text`,
        assignment: `int`,
        question: `int`,
        author: `int`,
        CONSTRAINTS: [
            `FOREIGN KEY (language) REFERENCES languages(name)`,
            `FOREIGN KEY (assignment) REFERENCES assignments(id)`,
            `FOREIGN KEY (question) REFERENCES questions(id)`,
            `FOREIGN KEY (author) REFERENCES users(id)`,
        ]
    },

    languages: {
        name: `varchar(20) NOT NULL PRIMARY KEY`
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
            console.log(tablearray[i]);
            console.log("ERROR ON TABLE INSERT: " + err);
            console.log('------------------');
        }
    }

};

export {
    init
}
