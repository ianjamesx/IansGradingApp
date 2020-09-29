import { assignment } from "../services/pagebuilder";

let fs = require('fs');
let path = require('path');

const util = require('util');
const mkdir = util.promisify(fs.mkdir);

//set dir of all files to be stored within our project dir
let rootdir: string = path.join(__dirname, '../../uploads');

let addAssignmentDir = async (assignmentID: number, studentIDs: number[]): Promise<void | string> => {

    try {

        let assignpath: string = path.join(rootdir, ('/' + assignmentID));
        await mkdir(assignpath);

        let i: number;
        for(i = 0; i < studentIDs.length; i++){
            let currStudentpath: string = path.join(assignpath, ('/' + studentIDs[i]));
            await mkdir(currStudentpath);
        }

    } catch (err){
        return 'An Error Occured Saving Assignment';
    }

};
/*
let getStudentsCode = async (assignmentID: number, studentID: number): Promise<string> => {

}
*/
export {
    addAssignmentDir
}