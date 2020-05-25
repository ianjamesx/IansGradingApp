import * as db from './modeldata/Student';

import { User, DBResult } from './User';
import { Course } from './Course';

class Student extends User {

    //attempt to join course with certain course key
    //return string on error, void on success
    public async joinCourse(coursekey: string): Promise<string | void> {
        let course: Course = new Course;

        let keyerror: any = await course.loadCourseByKey(coursekey);
        if(keyerror)
            return keyerror;

        let joinerror: any = db.joinCourse(this.id, course.getID());
        if(joinerror)
            return joinerror;
        
    }
}

export {
    Student,
    DBResult
}