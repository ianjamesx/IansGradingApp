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
    private filename: string;
    private testcases: TestCase[];

    constructor(data?: any){
        if(data) super(data);
    }

    public async saveTestCases(testcases: TestCase[]){

        let query = `INSERT INTO testcases (assignment, visible, input, output) VALUES `;

    }
   
}

export {
    CodeAssignment
}