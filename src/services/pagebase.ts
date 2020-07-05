import { User } from '../models/User/User';
import { Course } from '../models/Course/Course';
import { Request } from 'express';

/*
data needed for all pages, to build sidebar, notifications, etc
also pass reuse option, if so, will return raw objects rather than readable/output data
if user has to do more operations besides that of building essential content
*/

let pagebase = async (req: Request): Promise<any> => {
  
  //load user
  let user: User = new User();
  let error: any = await user.sessionLoad(req.session);
  if(error) return { error: error };

  //load courses
  let coursedata: any = await user.getAllCourses();
  if(coursedata.error) return { error: coursedata.error };
  let courses: any[] = coursedata.data;

  return {
      user: user.getColumns(),
      courses: courses,
      instructor: user.isInstructor()
  };

};

//load course objects based off array of data loaded from db
let loadCourses = (coursedata: any[]): Course[] => {
  let i: number;
  let courses: Course[] = [];

  for(i = 0; i < courses.length; i++){
    courses[i] = new Course;
    courses[i].loadFromObject(coursedata[i]);
  }

  return courses;
};

export {
    pagebase,
    loadCourses
}