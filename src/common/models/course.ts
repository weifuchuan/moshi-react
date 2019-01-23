import { Model } from '../kit/type';
import { course } from './db';
import { GET } from '@/common/kit/req';

export type Course = Model<course, {}>;

export async function myCourses():Promise<Course[]>{
  const resp=await GET<Course[]>("/course/myByTeacher")
  return resp.data;
}