import { Course } from '@/common/models/course';
import { AnyAction } from 'redux';
import { SET_COURSES } from './actionType';

export default function courses(crs: Course[] = [], action: AnyAction) {
  switch (action.type) {
    case SET_COURSES:
      return action.courses;
    default:
      break;
  }
  return crs;
}
