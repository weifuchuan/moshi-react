import { Course } from "@/common/models/course";
import { AnyAction } from "redux";
import { SET_COURSES, ADD_COURSE } from "./actionType";

export default function courses(crs: Course[] = [], action: AnyAction) {
  switch (action.type) {
    case SET_COURSES: 
      return action.courses;
    case ADD_COURSE:
      return [...crs, action.course];
    default:
      break;
  }
  return crs;
}
