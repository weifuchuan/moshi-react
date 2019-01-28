import { Course } from "@/common/models/course";
import { AnyAction } from "redux";
import { SET_COURSES, ADD_COURSE, MODIFY_COURSE } from "./actionType";

export default function courses(crs: Course[] = [], action: AnyAction) {
  switch (action.type) {
    case SET_COURSES:
      return action.courses;
    case ADD_COURSE:
      return [...crs, action.course];
    case MODIFY_COURSE:
      const { id, items } = action;
      const i = crs.findIndex(c => c.id === id);
      if (i === -1) return crs;
      Object.assign(crs[i], items);
      return [...crs];
    default:
      break;
  }
  return crs;
}
