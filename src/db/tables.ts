
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

    usertypes: {
        name: `varchar(20) NOT NULL PRIMARY KEY`,
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
        textbook: `varchar(50)`,
        instructor: `int`,
        CONSTRAINTS: [
            `FOREIGN KEY (department) REFERENCES departments(abbreviation)`,
            `FOREIGN KEY (instructor) REFERENCES users(id)`
        ]
    },

    course_categories: {
        name: `varchar(30) NOT NULL PRIMARY KEY`,
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
        type: `varchar(20)`,
        CONSTRAINTS: [
            `FOREIGN KEY (user) REFERENCES users(id)`,
            `FOREIGN KEY (course) REFERENCES courses(id)`,
            `FOREIGN KEY (type) REFERENCES usertypes(name)`
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
        type: `varchar(30)`,
        attempts: `int`,
        randomize: `int`,
        latepenalty: `int`,
        category: `varchar(30)`,
        prompt: `text`,
        course: `int`,
        language: `varchar(20)`,
        class: `varchar(30)`,
        CONSTRAINTS: [
            `FOREIGN KEY (author) REFERENCES users(id)`,
            //`FOREIGN KEY (category) REFERENCES course_categories(name)`,
            `FOREIGN KEY (course) REFERENCES courses(id)`
        ]

    },
    
    /*
    question tables
    */

    questions: {
        id: `int NOT NULL PRIMARY KEY`,
        type: `varchar(20)`,
        author: `int`,
        body: `text`,
        hint: `varchar(200)`,
        public: `int`,
        chapter: `int`,
        section: `int`,
        CONSTRAINTS: [
            `FOREIGN KEY (type) REFERENCES question_types(type)`,
            `FOREIGN KEY (author) REFERENCES users(id)`,
            `FOREIGN KEY (subject) REFERENCES question_subjects(subject)`,
            `FOREIGN KEY (topic) REFERENCES question_topics(topic)`
        ]
    },
    answers: {
        id: `int NOT NULL PRIMARY KEY`,
        correct: `int`,
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

    //keep tracks of question score for each on assignment
    assignmentprogress: {
        assignment: `int`,
        question: `int`,
        user: `int`,
        correct: `int`,
        attempts: `int`,
        late: `int`,
        timestamp: `varchar(20)`
    },

    //types of questions (e.g multiple choice, fill in blank)
    question_types: {
        type: `varchar(20) NOT NULL PRIMARY KEY`
    },


    /*
    info for textbooks, used for keeping track of questions belonging to certain classes/topics
    */
    textbooks: {
        name: `varchar(50) NOT NULL PRIMARY KEY`,
        chapters: `int`,
    },

    chapters: {
        textbook: `varchar(50)`,
        number: `int`,
        sections: `int`,
        name: `varchar(30)`
    },

    /*
    code questions/labs
    */
    testcases: {
        assignment: `int`,
        visible: `int`,
        input: `varchar(100)`,
        output: `varchar(100)`
    },

    programfiles: {
        filename: `varchar(40)`,
        sourcecode: `mediumtext`,
        timestamp: `varchar(20)`,
        assignment: `int`,
        question: `int`,
        author: `int`,
        CONSTRAINTS: [
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
