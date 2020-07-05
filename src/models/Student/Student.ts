import * as db from './queries';

import { User, DBResult } from '../User/User';

class Student extends User {

    //attempt to join course with certain course key
    //return string on error, void on success
    public async joinCourse(Course: any): Promise<string | void> {

        let keyerror: any = await Course.loadCourseByKey();
        if(keyerror)
            return keyerror;

        let joinerror: any = db.joinCourse(this.id, Course.getID());
        if(joinerror)
            return joinerror;
    }
}

export {
    Student,
    DBResult
}