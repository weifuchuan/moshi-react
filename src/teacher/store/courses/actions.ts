import { Course } from "@/common/models/course";
import { SET_COURSES, ADD_COURSE } from "./actionType";

export function setCourses(courses: Course[]) {
  return {
    type: SET_COURSES,
    courses
  };
}

export function addCourse(course: Course) {
  return {
    type: ADD_COURSE,
    course
  };
}

export function fetchCourse(id:number){
  return {
    type: ADD_COURSE,
    id 
  };
}

export function fetchCourseDetail(id:number){
  return {
    type: ADD_COURSE,
    id 
  };
}