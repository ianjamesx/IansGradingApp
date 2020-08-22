//import * as db from './queries';
import verify = require('../../utils/verify');       //validator wrapper
import { vals, keys } from '../../utils/utils';      //some utils for restructuring data
import * as db from './queries';
import moment = require('moment');

import { User } from '../User/User';

interface DBResult {
    error?: string;
    data?: any;
}

interface Errors {
    name?: string;
    prompt?: string;
    attempts?: string;
    latepenalty?: string;
    points?: string;
    dates?: string;
}

class Assignment {

    //name, category, ids of author/course
    private name: string;
    private author: number;
    private course: number;
    private category: string; //category (e.g. lab, hw)
    private active: number;
    private prompt: string; //prompt for assignment (e.g 'this test is...')
    private type: string;
    
    private attempts: number;
    private randomize: number;
    private latepenalty: number;
    private points: number;

    //dates for assignment
    private open: string;
    private close: string;
    private cutoff: string;

    private id: number;

    constructor(name?: string, author?: number, course?: number, prompt?: string, attempts?: number, randomize?: number, latepenalty?: number, points?: number, open?: string, close?: string, cutoff?: string, active?: number, category?: string, type?: string, id?: number){

        this.name = name;
        this.author = author;
        this.course = course;
        this.prompt = prompt;
        
        this.attempts = attempts;
        this.randomize = randomize;
        this.latepenalty = latepenalty;
        this.points = points;

        this.open = open;
        this.close = close;
        this.cutoff = cutoff;

        this.active = active;
        this.category = category;
        this.type = type;

        this.id = id;
    }

    public loadAssignmentData(name?: string, author?: number, course?: number, prompt?: string, attempts?: number, randomize?: number, latepenalty?: number, points?: number, open?: string, close?: string, cutoff?: string, active?: number, category?: string, type?: string, id?: number): void {

        this.name = name;
        this.author = author;
        this.course = course;
        this.category = category;
        this.type = type;
        this.prompt = prompt;
        
        this.attempts = attempts;
        this.randomize = randomize;
        this.latepenalty = latepenalty;
        this.points = points;

        this.open = open;
        this.close = close;
        this.cutoff = cutoff;

        this.active = active;
        this.category = category;

        this.id = id;
    }

    public loadFromObject(a: any): void{
        this.loadAssignmentData(a.name, a.author, a.course, a.prompt, a.attempts, a.randomize, a.latepenalty, a.points, a.open, a.close, a.cutoff, a.active, a.category, a.type, a.id);
    }

    public async loadFromID(ID: number): Promise<string | void> {
        this.id = ID;
        let result: DBResult = await db.load(this);

        if(result.error)
            return result.error;

        this.loadFromObject(result.data);
    }

    public async save(): Promise<any | void> {
        let errs: Errors = {};
        errs = await this.verify();   
        if(errs)
            return errs;

        if(!this.id)
            await this.generateID();

        let dberr: DBResult = await db.save(this);
        if(dberr.error)
            return { any: dberr.error };
    }

    private async verify(): Promise<any | null> {

        let errs: Errors = {
            name: verify.title(this.name),
            attempts: verify.range(this.attempts, 0, 9999),
            points: verify.range(this.points, 0, 9999),
            latepenalty: verify.range(this.latepenalty, 0, this.points),
            dates: verify.dateorder([this.open, this.close, this.cutoff], ['opening', 'closing', 'cutoff'])
        };
      
        return verify.anyerrors(errs);

    }

    private async generateID(): Promise<void> {
        this.id = await db.generateID();
    }

    public getID(): number {
        return this.id;
    }

    //determine if this assignment is coming up this week
    public isUpcoming(): boolean {
        let weeklater: any = new Date(this.close);
        let msinday: number = 86400000; //around this many ms in one day
        let weekms: number = weeklater.getTime() + (msinday * 7); //get ms date one week ahead

        let closedate: any = new Date(this.close);
        if(weekms > closedate.getTime() && Date.now() < closedate.getTime()){ //if date is within a week, and hasent closed yet
            return true;
        }
        return false;
    }

    public getColumns(): any{
        
        return {
            name: this.name,
            author: this.author,
            course: this.course,
            category: this.category,
            type: this.type,
            active: this.active,
            prompt: this.prompt,
            attempts: this.attempts,
            randomize: this.randomize,
            latepenalty: this.latepenalty,
            points: this.points,
            open: this.open,
            close: this.close,
            cutoff: this.cutoff,
            id: this.id
        };
    }

    public async dataView(): Promise<any> {

        //get instructors first, last name from id
        let author: User = new User;
        await author.loadFromID(this.author);
        let authorname: string = author.getFN() + ' ' + author.getLN();

        return {
            name: this.name,
            author: authorname,
            course: this.course,
            category: this.category,
            type: this.type,
            active: this.active,
            prompt: this.prompt,
            attempts: this.attempts,
            randomize: this.randomize,
            latepenalty: this.latepenalty,
            points: this.points,
            open: moment(this.open).format("dddd, MMMM Do YYYY, h:mm a"),
            close: moment(this.close).format("dddd, MMMM Do YYYY, h:mm a"),
            cutoff: moment(this.cutoff).format("dddd, MMMM Do YYYY, h:mm a"),
            id: this.id
        };

    }

}

export {
    Assignment,
    DBResult
}