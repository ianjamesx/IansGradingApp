//import * as db from './queries';
import verify = require('../../utils/verify');       //validator wrapper
import { vals, keys } from '../../utils/utils';      //some utils for restructuring data
import * as db from './queries';

import { User } from '../User/User';

interface DBResult {
    error?: string;
    data?: any;
}

interface Answer {
    answer: string;
    correct: number;
}

interface Errors {
    question?: string;
    hint?: string;
    answer?: string;
}

class Question {

    private question: string;
    private answers: Answer[];
    private hint: string;

    private author: number;
    private subject: string;
    private topic: string;
    private type: string;
    private ispublic: number;

    private id: number;

    constructor(question?: string, answers?: any[], author?: number, subject?: string, topic?: string, type?: string, ispublic?: number, id?: number){

        this.question = question;
        this.answers = answers;
        this.author = author;
        this.subject = subject;
        this.topic = topic;
        this.type = type;
        this.ispublic = ispublic;
        this.id = id;

    }

    public loadAssignmentData(question?: string, answers?: any[], author?: number, subject?: string, topic?: string, type?: string, ispublic?: number, id?: number): void {

        this.question = question;
        this.answers = answers;
        this.author = author;
        this.subject = subject;
        this.topic = topic;
        this.type = type;
        this.ispublic = ispublic;
        this.id = id;

    }

    public loadFromObject(q: any): void{
        this.loadAssignmentData(q.question, q.answers, q.author, q.subject, q.topic, q.type, q.ispublic, q.id);
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
            question: verify.custom(this.question, 'question')
        };
      
        return verify.anyerrors(errs);
    }

    private async generateID(): Promise<void> {
        this.id = await db.generateID();
    }

    public getID(): number {
        return this.id;
    }

    public getAnswers(): any {
        return this.answers;
    }

    public getColumns(): any {

        //dont return answers in column data
        //we'll return that in a seperate function to save

        return {
            question: this.question,
            hint: this.hint,
            author: this.author,
            subject: this.subject,
            topic: this.topic,
            type: this.type,
            ispublic: this.ispublic,
            id: this.id
        }
    }

    public async dataView(): Promise<any> {

        //get instructors first, last name from id
        let author: User = new User;
        await author.loadFromID(this.author);
        let authorname: string = author.getFN() + ' ' + author.getLN();

        return {

        }

    }
    

}

export {
    Question,
    DBResult
}