//var render = require('../utils/render');
import { User } from '../models/User/User';
import { Student } from '../models/Student/Student';
import { Course } from '../models/Course/Course';
import { Assignment } from '../models/Assignment/Assignment';

import { Request } from 'express';

import common = require('./pagebase');
import { Question } from '../models/Question/Question';

/*
page builder

gets all data needed for templating engine, sends object of that data back
to router, router renders it with expressjs

functions only need request as we retrieve all data from users session
some also need an ID (e.g. for course page, the id of the course)
*/

let dashboard = async (req: Request) => {
  
  let pagedata = await common.pagebase(req);
  if(pagedata.error) return { error: pagedata.error };

  pagedata.title = 'Your Dashboard';

  //load raw course objects and user objectfrom pagedata
  let courses: Course[] = common.loadCourses(pagedata.course);

  //reload user from column data
  let user: User = new User();
  user.loadtouser(pagedata.user);

  //load upcoming assignments
  pagedata.assignments = await common.upcomingAssignments(user);

  return pagedata;

};

let createCourse = async (req: Request) => {

  //page base
  let pagedata = await common.pagebase(req);
  if(pagedata.error) return { error: pagedata.error };

  //get departments to populate list to choose from
  let course: Course = new Course;
  pagedata.departments = await course.getDepartments();
  
  pagedata.title = 'Create New Course';

  return pagedata;

};

let coursePage = async (req: Request) => {

  //page base
  let pagedata = await common.pagebase(req);
  if(pagedata.error) return { error: pagedata.error };

  //get course id from request params
  let id: number = Number(req.params.id);

  //load course from ID given
  let course: Course = new Course;
  await course.loadCourseByID(id);
  
  //after course loads, get course data, title
  pagedata.course = await course.dataView();
  pagedata.title = course.getCourseTitle();

  //if instructor, get all students
  if(pagedata.instructor){
    let student: Student = new Student();
    pagedata.students = await course.getStudents(student);
  }
  
  return pagedata;

};

let joinCourse = async(req: Request) => {

  let pagedata = await common.pagebase(req);
  if(pagedata.error) return { error: pagedata.error };
  pagedata.title = 'Join Course';
  return pagedata;

};

let createAssignment = async (req: Request) => {

  let pagedata = await common.pagebase(req);
  if(pagedata.error) return { error: pagedata.error };
  pagedata.title = 'Create Assignment';
  return pagedata;

};

let editAssignment = async (req: Request) => {

  let pagedata = await common.pagebase(req);
  if(pagedata.error) return { error: pagedata.error };
  pagedata.title = 'Choose Assignment Questions';
  return pagedata;

};

let chooseQuestions = async (req: Request) => {

  let pagedata = await common.pagebase(req);
  if(pagedata.error) return { error: pagedata.error };
  
  pagedata.title = 'Choose Questions';

  //get assignment id from request params
  let id: number = Number(req.params.id);

  let assignment: Assignment = new Assignment();
  await assignment.loadFromID(id);

  //get all questions made by this instructor (by user id)
  let userquestions: Question[] = await Question.allQuestionsBy(pagedata.user.id);
  pagedata.questions = userquestions;

  pagedata.assignment = await assignment.dataView();

  return pagedata;

};

let createQuestion = async (req: Request) => {

  let pagedata = await common.pagebase(req);
  if(pagedata.error) return { error: pagedata.error };
  pagedata.title = 'Create Questions';
  return pagedata;

};

/*
export all page functions
*/
export {
  dashboard,
  createCourse,
  coursePage,
  joinCourse,
  createAssignment,
  chooseQuestions,
  createQuestion,
  editAssignment
};
