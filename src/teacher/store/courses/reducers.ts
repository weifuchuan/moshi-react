import { Course } from '@/common/models/course';
import { AnyAction } from 'redux';

export default function courses(crs: Course[] = [], action: AnyAction) {
  return crs;
}
