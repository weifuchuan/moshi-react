import { Model } from "../kit/type";
import { course } from "./db";
import { GET, POST_FORM, Ret } from "@/common/kit/req";
import BitKit from "@/common/models/BitKit";
import { Article } from "./article";

export type Course = Model<course, {}>;

export const CourseStatus = {
  STATUS_INIT: 0,
  STATUS_LOCK: 1,
  STATUS_PASSED: 1 << 1,
  STATUS_PUBLISH: 1 << 2,
  isInit(course: Course) {
    return course.status === 0;
  },
  isLock(course: Course) {
    return BitKit.at(course.status, 0) === 1;
  },
  isPassed(course: Course) {
    return BitKit.at(course.status, 1) === 1;
  },
  isPublish(course: Course) {
    return BitKit.at(course.status, 2) === 1;
  }
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

  static async create(
    name: string,
    introduce: string,
    courseType: number,
    title: string,
    content: string
  ): Promise<Ret> {
    const resp = await POST_FORM("/course/create", {
      name,
      introduce,
      courseType,
      title,
      content
    });
    return resp.data;
  }

  static async fetchById(id: number) {
    // TODO
    // const resp = await GET("/course/")
  }

  static async detail(id: number) {
    const resp = await GET<{
      articles: Article[];
    }>("/course/detail",{id});
    return resp.data;
  }
}
