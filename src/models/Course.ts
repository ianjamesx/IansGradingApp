import * as db from './modeldata/Course';
import verify = require('../utils/verify');       //validator wrapper
import { vals, keys } from '../utils/utils';      //some utils for restructuring data

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
enums for storing data in course
*/

enum Season {
    Spring,
    Summer,
    Fall,
    Winter
}

enum Department {
    COSC,
    MATH,
    INFO
}

/*
interfaces for returning data to other models/render
NOTE: in these interfaces, return enum data as strings as this will be final output to client
*/

//data for building links in sidebar
interface Linkdata {
    name: string;
    id: number;
}

//full data, for course cards, course page, etc
interface Coursedata {
    name: string;
    department: string;
    season: string;
    year: number;
    number: number;
    section: string;
    id: number;
    coursekey: string;
    instructor: string;
}

class Course {

    private name: string;
    private department: Department;

    private season: Season;
    private year: number;

    private number: number;
    private section: number;

    private id: number;
    private coursekey: string;
    private instructor: string;

    constructor(name?: string, department?: Department, season?: Season, year?: number, number?: number, section?: number, id?: number, coursekey?: string, instructor?: string){
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
    public loadCourseData(name?: string, department?: Department, season?: Season, year?: number, number?: number, section?: number, id?: number, coursekey?: string, instructor?: string){
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

    //attempt to load course data into this object from a key given
    public async loadCourseByKey(coursekey: string): Promise<string | void> {
        this.coursekey = coursekey;
        let result: DBResult = await db.loadFromKey(this);

        if(result.error)
            return result.error;

        this.loadCourseData(result.data);
    }

    //verify all user inputted fields
    private async verify(): Promise<any | null> {
        let errs: any = await verify.all({
            name: [this.name, 'title'],
            department: [this.department, 'department'],
            season: [this.department, 'season'],
            year: [this.year, 'year'],
            number: [this.number, 'number'],
            section: [this.section, 'number'],
          });
      
          return errs;
    }

    public async save(): Promise<Errors | void> {
        let errs: Errors = {};
        errs = await this.verify(); //first, see if we have any errors in user inputted data    
        if(errs)
            return errs;

        let dberr: string = await db.save(this); //save in db, return any db errors or null if no errs
        if(dberr)
            return { any: dberr };
    }

    /*
    for db interactions
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

    public getKey(): string {
        return this.coursekey;
    }

    public getID(): number {
        return this.id;
    }

    public onLoad(): any {
        return [keys(this.getColumns())];
    }

}

export {
    Course,
    DBResult
}