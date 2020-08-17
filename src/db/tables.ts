
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
        open: `varchar(20)`,
        close: `varchar(20)`,
        cutoff: `varchar(20)`,
        points: `int`,
        type: `int`,
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
    
    //SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_NAME = 'assignments';
    
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
        public: `int`,
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
            `FOREIGN KEY (assignment) REFERENCES assignments(id)`
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

export {
    tables
}
