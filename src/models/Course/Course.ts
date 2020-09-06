import * as db from '../../db/dbquery';
import verify = require('../../utils/verify');       //validator wrapper
import { vals, keys, key } from '../../utils/utils';      //some utils for restructuring data
import { DBResult } from '../../interfaces';

import { User } from '../User/User';

//user input errors when making this class
interface Errors {
  name?: string;
  year?: string;
  number?: string;
  section?: string;
  any?: string;
}

interface Department {
    name?: string;
    abbreviation?: string;
}

interface CourseCategory {
    name?: string;
    points?: number;
}

/*
not using regular enum interface TS provides as we want this to work on JS based client as well
using traditional JS based enum logic so client can pass in string correlating to object key
*/

let Season: any = {
    Spring: 'Spring',
    Summer: 'Summer',
    Fall: 'Fall',
    Winter: 'Winter'
};

class Course {

    private name: string;
    private department: string;

    private season: string;
    private year: number;

    private number: number;
    private section: number;

    private id: number;
    private coursekey: string;
    private instructor: number;
    private categories: any;

    public table: string = `courses`;

    constructor(name?: string, department?: string, season?: string, year?: number, number?: number, section?: number, instructor?: number, categories?: any, id?: number, coursekey?: string){
        this.name = name;
        this.department = department;
        this.season = season;
        this.year = year;
        this.number = number;
        this.section = section;
        this.id = id;
        this.coursekey = coursekey;
        this.instructor = instructor;
        this.categories = categories;
    }

    //load data after loaded from database
    public loadCourseData(name?: string, department?: string, season?: string, year?: number, number?: number, section?: number, id?: number, coursekey?: string, instructor?: number, categories?: any){
        this.name = name;
        this.department = department;
        this.season = season;
        this.year = year;
        this.number = number;
        this.section = section;
        this.id = id;
        this.coursekey = coursekey;
        this.instructor = instructor;
        this.categories = categories
    }

    //load data into this object from another object (e.g. anonymous object from database)
    public loadFromObject(c: any): void {
        this.loadCourseData(c.name, c.department, c.season, c.year, c.number, c.section, c.id, c.coursekey, c.instructor);
    }

    //attempt to load course data into this object from a key given
    public async loadCourseByKey(key?: string): Promise<string | void> {

        //optionally pass in course key if not already set
        if(!this.coursekey)
            this.coursekey = key;

        let loadquery = db.format(`SELECT ?? FROM courses WHERE coursekey = ?`, [keys(this.getColumns()), this.getKey()]);
        let result: DBResult = await db.dbquery(loadquery);

        //return any errors
        if(result.data.length == 0 || result.error) return db.unknownerr;
        
        //load to object if successful
        result.data = result.data[0];
        this.loadFromObject(result.data);
    }

    //can also load course by ID
    public async loadCourseByID(ID: number): Promise<string | void> {
        this.id = ID;
        let result: DBResult = await db.load(this);

        if(result.error)
            return result.error;

        this.loadFromObject(result.data);
    }

    //get all departments available
    //run db query to get departments, turn into an enum style object
    public async getDepartments(): Promise<any> {

        let loadquery = `SELECT abbreviation, name FROM departments`;
        let result: DBResult = await db.dbquery(loadquery);

        //on err return empty array
        if(result.error) return [];

        let deptdata: any = result.data;
        let deptartments: Department[] = [];

        //get abbreviation and name for each department to feed into array
        let i: number;
        for(i = 0; i < deptdata.length; i++){
            let abbreviation: string = deptdata[i].abbreviation;
            let name: string = deptdata[i].name;
            
            deptartments.push({
                abbreviation: abbreviation,
                name: name
            });
        }

        return deptartments;
    }
    
    public async getCategories(): Promise<any> {

        let loadquery = db.format(`SELECT name, points FROM course_categories WHERE course = ?`, [this.getID()]);
        let result: DBResult = await db.dbquery(loadquery);

        if(result.error) return [];
        let catdata: any = result.data;
        let categories: CourseCategory[] = [];

        //get abbreviation and name for each department to feed into array
        let i: number;
        for(i = 0; i < catdata.length; i++){
            let name: string = catdata[i].name;
            let points: number = catdata[i].points;
            
            categories.push({
                name: name,
                points: points
            });
        }

        return categories;
    }

    public async saveCategories(): Promise<void | string> {

        //see if any categories were listed, if none, then dont save
        if(vals(this.categories).length == 0){
            return;
        }

        let i: any;
        let categorynest: any = [];
        for(i in this.categories){

            let curr: any[] = vals(this.categories[i]);
            curr.push(this.getID()); //also push id of course

            categorynest.push(curr);
        }

        let savequery = db.format(`INSERT INTO course_categories (name, points, course) VALUES ?`, [categorynest]);
        let result: DBResult = await db.dbquery(savequery);
        if(result.error) return result.error;
    }

    //store section number as int in database, turn into 3 char string when showing to client
    //for example, section number 1 --> 001, section 34 --> 034
    private formatSection(): string {
        let sect: string = '';
        sect += this.section;

        if(sect.length < 3){
            let i: number;
            for(let i = sect.length; i < 3; i++){
                sect = '0' + sect;
            }
        }

        return sect;
    }

    private async generateKey(): Promise<void> {

        let coursekey: string;
        let valid: boolean = false;

        while(!valid){
            //get new key, see if it exists for another course
            coursekey = key();
            let keysearch: string = db.format(`SELECT coursekey FROM courses WHERE coursekey = ?`, coursekey);

            let results: DBResult = await db.dbquery(keysearch);
            if(results.data.length == 0) valid = true;
        }

        this.coursekey = coursekey;
    }

    private async generateID(): Promise<void> {
        this.id = await db.generateID(`courses`);
    }

    //verify all user inputted fields
    //dont verify data that is selected from a drop down menu, as user cannot enter incorrect data
    private async verify(): Promise<any | null> {

        let errs: Errors = {
            name: verify.title(this.name),
            year: verify.year(this.year),
            number: verify.range(this.number, 100, 9999),
            section: verify.range(this.section, 0, 999)
        };
      
        return verify.anyerrors(errs);
    }

    //verify data and save in database, return any uesr input errors if any occurred
    //if course does not have an ID or key, generate them
    public async save(): Promise<Errors | void> {
        let errs: Errors = {};
        errs = await this.verify();   
        if(errs)
            return errs;

        if(!this.id)
            await this.generateID();

        if(!this.coursekey)
            await this.generateKey();

        console.log(this);

        let dberr: DBResult = await db.save(this);
        if(dberr.error)
            return { any: dberr.error };

        //save categories as well
        let caterr: any = await this.saveCategories();
        if(caterr){
            return { any: caterr }
        }

    }

    /*
    adding connection to course in junction table
    */

    public async userInCourse(userID: number): Promise<boolean> {

        //get users connection to course through junction table
        let connquery = db.format(`SELECT * FROM usercourse WHERE user = ? AND course = ?`, [userID, this.getID()]);
        let results: DBResult = await db.dbquery(connquery);

        if(results.data.length == 0){
            return false;
        } else {
            return true;
        }

    }

    public async joinCourse(userID: number, role: string): Promise<string | void> {

        let result: DBResult = {};

        //see if user is already in course
        let incourse: boolean = await this.userInCourse(userID);
        if(incourse){
            return `user already in course`;
        }

        //add users connection to course through junction table
        let connquery = db.format(`INSERT INTO usercourse (user, course, type) VALUES (?, ?, ?)`, [userID, this.getID(), role]);
        let results: DBResult = await db.dbquery(connquery);

        if(result.error) return result.error;

    }

    //get all students/instructor/TAs for this course
    //db search returns column data for all users in junction table
    public async getEnrollees(): Promise<string | any> {

        let enrollee: User = new User();

        //get type and all user data for enrollees in this course
        let queryunformatted = `SELECT type, ?? FROM usercourse, users 
                    WHERE usercourse.course = ? AND users.id = usercourse.user`;

        let loadquery = db.format(queryunformatted, [keys(enrollee.getColumns()), this.getID()]);

        let results: DBResult = await db.dbquery(loadquery);
        if(results.error) return results.error;

        return results.data;
    }
    
    /*
    for db/end user interactions
    */

    public getColumns(): any {

        return {
            name: this.name,
            department: this.department,
            season: this.season,
            year: this.year,
            number: this.number,
            section: this.section,
            id: this.id,
            coursekey: this.coursekey,
            instructor: this.instructor
        };
    
    }

    public async dataView(): Promise<any> {

        //get instructors first, last name from id
        let inst: User = new User;
        await inst.loadFromID(this.instructor);
        let instructorname: string = inst.getFN() + ' ' + inst.getLN();

        let categories: any[] = await this.getCategories();
        
        return {
            name: this.name,
            department: this.department,
            season: this.season,
            year: this.year,
            number: this.number,
            section: this.formatSection(),
            id: this.id,
            coursekey: this.coursekey,
            instructor: instructorname,
            categories: categories
        };

    }

    public getKey(): string {
        return this.coursekey;
    }

    public getID(): number {
        return this.id;
    }

    //stricly only end-user interaction

    public getCourseTitle(): string {
        let title: string = this.department + ' ' + this.number + ': ' + this.name;
        return title;
    }

}

export {
    Course
}