import * as db from './queries';
import verify = require('../../utils/verify');       //validator wrapper
import { vals, keys } from '../../utils/utils';      //some utils for restructuring data

//user input errors when making this class
interface Errors {
  name?: string;
  year?: string;
  number?: string;
  section?: string;
  any?: string;
}

interface DBResult {
  error?: string;
  data?: any;
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

    private instructor: any;

    constructor(name?: string, department?: string, season?: string, year?: number, number?: number, section?: number, instructor?: any, id?: number, coursekey?: string){
        this.name = name;
        this.department = department;
        this.season = season;
        this.year = year;
        this.number = number;
        this.section = section;
        this.id = id;
        this.coursekey = coursekey;
        this.instructor = instructor;
    }

    //load data after loaded from database
    public loadCourseData(name?: string, department?: string, season?: string, year?: number, number?: number, section?: number, id?: number, coursekey?: string, instructor?: any){
        this.name = name;
        this.department = department;
        this.season = season;
        this.year = year;
        this.number = number;
        this.section = section;
        this.id = id;
        this.coursekey = coursekey;
        this.instructor = instructor;
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

        let result: DBResult = await db.loadFromKey(this);

        if(result.error)
            return result.error;

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
        let deptartments: any = [];
        let dbres: DBResult = await db.getAllDepartments();

        if(dbres.error) return dbres.error;
        let deptdata: any = dbres.data;

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
        this.coursekey = await db.generateKey();
    }

    private async generateID(): Promise<void> {
        this.id = await db.generateID();
    }

    //verify all user inputted fields
    //dont verify data that is selected from a drop down menu, as user cannot enter incorrect data
    private async verify(): Promise<any | null> {
        let errs: any = await verify.all({
            name:    [this.name, 'coursetitle'],
            year:    [this.year, 'courseyear'],
            number:  [this.number, 'coursenumber'],
            section: [this.section, 'coursesection'],
          });
      
          return errs;
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
    }

    /*
    adding connection to course in junction table
    */
    public async joinCourse(userID: number): Promise<string | void> {

        let dberr: DBResult = await db.joinCourse(this.getID(), userID);
        if(dberr.error){
            return dberr.error;
        }

    }

    /*
    for retrieving data on students
    */

    //get all students (users, so instructors included) for this course
    //db search returns column data for all users in junction table
    public async getStudents(Student: any): Promise<string | any> {
        let dbres: DBResult = await db.getAllStudents(this, Student);
        if(dbres.error)
            return dbres.error;

        return dbres.data;
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
            instructor: this.instructor.getID()
        };
    
    }

    public async dataView(): Promise<any> {

        return {
            name: this.name,
            department: this.department,
            season: this.season,
            year: this.year,
            number: this.number,
            section: this.formatSection(),
            id: this.id,
            coursekey: this.coursekey,
            instructor: (this.instructor.getFN() + this.instructor.getLN())
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

/*
also export user subclasses for query builder
*/
export {
    Course,
    DBResult
}