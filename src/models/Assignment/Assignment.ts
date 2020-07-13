//import * as db from './queries';
import verify = require('../../utils/verify');       //validator wrapper
import { vals, keys } from '../../utils/utils';      //some utils for restructuring data
import * as db from './queries';

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
    questioncount?: string;
    points?: string;
    dates?: string;
  }

class Assignment {

    //name, category, etc
    private name: string;
    private author: number; //id of author
    private category: string; //category (e.g. lab, hw)
    private prompt: string; //prompt for assignment (e.g 'this test is...')
    
    private attempts: number;
    private randomize: number;
    private latepenalty: number;
    private questioncount: number;
    private points: number;

    //dates, will be sent to server in ms (Date.now() on client)
    private open: number;
    private close: number;
    private cutoff: number;

    private id: number;

    constructor(name?: string, author?: number, category?: string, prompt?: string, attempts?: number, randomize?: number, latepenalty?: number, questioncount?: number, points?: number, open?: number, close?: number, cutoff?: number){

        this.name = name;
        this.author = author;
        this.category = category;
        this.prompt = prompt;
        
        this.attempts = attempts;
        this.randomize = randomize;
        this.latepenalty = latepenalty;
        this.questioncount = questioncount;
        this.points = points;

        this.open = open;
        this.close = close;
        this.cutoff = cutoff;
    }

    public loadAssignmentData(name?: string, author?: number, category?: string, prompt?: string, attempts?: number, randomize?: number, latepenalty?: number, questioncount?: number, points?: number, open?: number, close?: number, cutoff?: number): void {

        this.name = name;
        this.author = author;
        this.category = category;
        this.prompt = prompt;
        
        this.attempts = attempts;
        this.randomize = randomize;
        this.latepenalty = latepenalty;
        this.questioncount = questioncount;
        this.points = points;

        this.open = open;
        this.close = close;
        this.cutoff = cutoff;
    }

    public loadFromObject(a: any): void{
        this.loadAssignmentData(a.name, a.author, a.category, a.prompt, a.attempts, a.randomize, a.latepenalty, a.questioncount, a.points, a.open, a.close, a.cutoff);
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
            questioncount: verify.range(this.questioncount, 0, 9999),
            points: verify.range(this.points, 0, 9999),
            latepenalty: verify.range(this.latepenalty, 0, this.points),

        };
      
        return verify.anyerrors(errs);

    }

    private async generateID(): Promise<void> {
        this.id = await db.generateID();
    }

    public getColumns(): any{
        
        return {
            name: this.name,
            author: this.author,
            category: this.category,
            prompt: this.prompt,
            attempts: this.attempts,
            randomize: this.randomize,
            latepenalty: this.latepenalty,
            points: this.points,
            open: this.open,
            close: this.close,
            cutoff: this.cutoff

        }
    }

    public async dataView(): Promise<any> {

        //get instructors first, last name from id
        let author: User = new User;
        await author.loadFromID(this.author);
        let authorname: string = author.getFN() + ' ' + author.getLN();

        return {
            name: this.name,
            author: this.author,
            category: this.category,
            prompt: this.prompt,
            attempts: this.attempts,
            randomize: this.randomize,
            latepenalty: this.latepenalty,
            questioncount: this.questioncount,
            points: this.points,
            open: this.open,
            close: this.close,
            cutoff: this.cutoff

        }

    }

}

export {
    Assignment,
    DBResult
}