import { User } from '../models/User/User';
import { Course } from '../models/Course/Course';
import { Assignment } from '../models/Assignment/Assignment';
import { Request } from 'express';
import { views } from '../utils/utils';

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
    courses[i] = new Course(coursedata[i]);
  }

  return courses;
};

/*
get all assignments that are due soon
for a specific user
*/
let upcomingAssignments = async (user: User) => {

  //get all assignments this user has coming up
  let assignmentdata: any = await user.getAllAssignments();
  if(assignmentdata.error){
    return assignmentdata.error;
  }

  let assign = assignmentdata.data;
  let i: number;

  let upcoming: any[] = [];

  for(i = 0; i < assign.length; i++){
    let assignment: Assignment = new Assignment(assign[i]);

    if(assignment.isUpcoming()){
      upcoming.push(assignment);
    }
  }

  //sort assignments by due date
  upcoming.sort(function(a, b) {
    let c: number = (new Date(a.getDueDate())).getTime();
    let d: number = (new Date(b.getDueDate())).getTime();
    return c-d;
  });

  //just return assignment views
  upcoming = await (views(upcoming));

  return upcoming;

}


export {
    pagebase,
    loadCourses,
    upcomingAssignments
}