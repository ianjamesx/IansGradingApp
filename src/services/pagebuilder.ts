//var render = require('../utils/render');
import { User } from '../models/User/User';
import { Student } from '../models/Student/Student';
import { Course } from '../models/Course/Course';
import { Request } from 'express';

import common = require('./pagebase');

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

  let assignments = [
    {
      name: 'lab1',
      open: 'Dec 10, 2020',
      close: 'Dec 15, 2020',
      id: 2012931,

    },
    {
      name: 'hw4',
      open: 'Sep 10, 2020',
      close: 'Sep 15, 2020',
      id: 20153931,

    },
  ];

  pagedata.title = 'Your Dashboard';
  pagedata.assignments = assignments;

  //load raw course objects and user objectfrom pagedata
  let courses: Course[] = common.loadCourses(pagedata.course);
  let user: User = new User(pagedata.user);

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
  pagedata.course = course.getColumns();
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

export {
  dashboard,
  createCourse,
  coursePage,
  joinCourse
};
