import { Course } from "@/common/models/course";
import {
  SET_COURSES,
  ADD_COURSE,
  FETCH_MY_COURSES,
  FETCH_COURSE,
  FETCH_COURSE_DETAIL,
  UPDATE_COURSE,
  MODIFY_COURSE
} from "./actionType";

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

export function fetchMyCourses() {
  return { type: FETCH_MY_COURSES };
}

export function fetchCourse(id: number) {
  return {
    type: FETCH_COURSE,
    id
  };
}

export function fetchCourseDetail(id: number, onEnd?: Function) {
  return {
    type: FETCH_COURSE_DETAIL,
    id,
    onEnd
  };
}

export function updateCourse(
  id: number,
  items: { [key: string]: number | string },
  onOk: () => void,
  onErr: (err: any) => void
) {
  return {
    type: UPDATE_COURSE,
    id,
    items,
    onOk,
    onErr
  };
}

export function modifyCourse(
  id: number,
  items: { [key: string]: number | string }
) {
  return {
    type: MODIFY_COURSE,
    id,
    items
  };
}
