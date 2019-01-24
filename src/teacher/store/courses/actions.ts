import { Course } from '@/common/models/course'; 
import { SET_COURSES } from './actionType';

export function setCourses(courses:Course[]){
  return {
    type:SET_COURSES, 
    courses
  }
}