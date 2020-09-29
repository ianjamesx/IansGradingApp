//import * as db from './queries';
import { vals, keys, tablekeys } from '../../utils/utils';      //some utils for restructuring data
import * as db from '../../db/dbquery';
import moment = require('moment');

import { Assignment } from './Assignment';

interface DBResult {
    error?: string;
    data?: any;
}

interface Score {
    total?: number;
    actual?: number;
    percent?: number;
}

interface TestCase {
    input: string;
    output: string;
    visible: boolean;
}

class CodeAssignment extends Assignment {

    private language: string;
    private class: string; //class, in this case, refers to name of the class for the program
    private testcases: TestCase[];

    constructor(data?: any){
        super(data);
        
        if(data) this.load(data)
    }

    public load(data: any): void{

        super.load(data);
        this.language = data.language;
        this.class = data.class;
        this.testcases = data.testcases; 
    }

    public async loadFromID(id: number): Promise<void> {

        await super.loadFromID(id);
        await this.loadTestCases();

        //load rest of the data
        let selectquery: string = db.format(`SELECT language, class FROM assignment WHERE id = ?`, [super.getID()]);
        let result: DBResult = await db.dbquery(selectquery);

        if(!result.error){
            this.language = result.data[0].language;
            this.class = result.data[0].class;
        }

    }

    public async loadTestCases(): Promise<void | string> {

        let selectquery: string = db.format(`SELECT input, output, visible FROM testcases WHERE assignment = ?`, [super.getID()]);
        
        let result: DBResult = await db.dbquery(selectquery);
        if(result.error) return result.error;

        //load results from db into this.testcases
        let i: number;
        for(i = 0; i < result.data.length; i++){
            let input: string = result.data[i].input;
            let output: string = result.data[i].output;
            let visible: boolean = result.data[i].visible ? true : false;
            
            this.testcases.push({
                input: input,
                output: output,
                visible: visible
            });
        }

    }

    public async saveTestCases(): Promise<void | string>{

        //have to turn array of objects into nested array of obj props (for compatability with SQLstring)
        let i: any;
        let casenest: any = [];
        for(i in this.testcases){
            let curr: any[] = vals(this.testcases[i]);
            curr.push(this.getID());
            casenest.push(curr);
        }

        let query = db.format(`INSERT INTO testcases (input, output, visible, assignment) VALUES ?`,  [casenest]);
        let result: DBResult = await db.dbquery(query);
        if(result.error) return result.error;

    }

    public async save(): Promise<void | any> {

        let errs: any = await super.save();
        if(errs) return errs;

        await this.saveTestCases();

        //save remaining data
        let query = db.format(`UPDATE assignment SET langauge = ?, class = ? WHERE id = ?` , [this.language, this.class, super.getID()]);
        
        let result: DBResult = await db.dbquery(query);
        if(result.error) return result.error;

    }
   
}

export {
    CodeAssignment
}