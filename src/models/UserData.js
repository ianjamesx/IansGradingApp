/*
operations for storing user data in SQL db
*/

var { escape, format, query } = require('../db/db');

/*
save user data
determine if they already exist, then determine whether to update or insert
*/

var load = async (user) => {

    var select = `SELECT ?? FROM users WHERE ?`;
    loginquery = format(select, [user.loadonlogin(), user.logincredentials()]);
    return await query(loginquery);

};

var save = async (user) => {
    var existsquery = format(`SELECT id FROM users WHERE id = ?`, [user.id]);
    var result = await db.query(usercheck), savequery;
    if(result.length > 0)
        savequery = format(`UPDATE users SET ?? WHERE id = ?`, user.getupdate()); //there is a user in the db with this email, update that user
     else 
        savequery = format(`INSERT INTO users (??) VALUES (?)`, user.getinsert()); //no user in db with this id, insert new one
    
    return await query(savequery); //return res from sql client
};

var getcourses_min = async (userid) => {
    var course = new Course;
    var select = `SELECT ?? FROM course WHERE id IN (
                 SELECT course FROM user_course WHERE user = ?`;
    var coursequery = format(query, [course.getcolumns_min(), userid]);
};

var getcourse_full = async (userid) => {
    var course = new Course;
    var select = `SELECT ?? FROM course WHERE id IN (
                 SELECT course FROM user_course WHERE user = ?`;
    var coursequery = format(query, [course.getcolumns_full(), userid]);
};