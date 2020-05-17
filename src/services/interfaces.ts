/*
interfaces for communicating pagebuilder with EJS
data needed to build each page on the site

*/

//need interface definitions from each of the models
import { userdata } from '../models/User';
import { coursedata, coursedata_min } from '../models/Course';
import { assignmentdata, assignmentdata_min } from '../models/Assignment';

/*
allpages - data needed in basically every page on the site
used to build sidebar, top banner, footer, etc
same to assume every page needs this data
*/
interface allpages {
    user: userdata;
    courses: coursedata_min[];
}

interface homepage {
    assignments: assignmentdata_min[];
}

interface coursepage {
    course: coursedata;
    assignments: assignmentdata_min[];
}

interface assignmentpage {
    assignment: assignmentdata;
}

export { allpages, homepage, coursepage, assignmentpage };