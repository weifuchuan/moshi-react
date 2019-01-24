import { Model } from "../kit/type";
import { course } from "./db";
import { GET, POST_FORM, Ret } from "@/common/kit/req";

export type Course = Model<course, {}>;

export const CourseStatus = {
  STATUS_INIT: 0,
  STATUS_LOCK: 1,
  STATUS_PASSED: 1 << 1,
  STATUS_PUBLISH: 1 << 2
};

export const CourseType = {
  TYPE_COLUMN: 1,
  TYPE_VIDEO: 2
};

export class CourseAPI {
  static async myCourses(): Promise<Course[]> {
    const resp = await GET<Course[]>("/course/myByTeacher");
    return resp.data;
  }

  static async create(name: string, introduce: string, courseType: number, title: string, content: string): Promise<Ret> {
    const resp = await POST_FORM("/course/create", { name, introduce, courseType, title, content });
    return resp.data;
  }
}
