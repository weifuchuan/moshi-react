import BitKit from '@/common/kit/BitKit';
import { GET, POST_FORM, Ret } from '@/common/kit/req';
import { observable, runInAction } from 'mobx';

import { _ICourse } from './_db';
import { IArticle } from './Article';
import Issue, { IIssue } from './Issue';
import Article from '@/common/models/Article';

// export type ICourse = _ICourse;

export interface ICourse extends _ICourse {
  nickName?: string;
  avatar?: string;
}

export default class Course implements ICourse {
  @observable id: number = 0;
  @observable accountId: number = 0;
  @observable name: string = '';
  @observable shortIntro: string = '';
  @observable introduce: string = '';
  @observable introduceImage?: string | undefined;
  @observable note?: string | undefined;
  @observable createAt: number = 0;
  @observable publishAt?: number | undefined;
  @observable buyerCount: number = 0;
  @observable courseType: number = 0;
  @observable price?: number | undefined;
  @observable discountedPrice?: number | undefined;
  @observable offerTo?: number | undefined;
  @observable status: number = 0;
  @observable lectureCount: number = 0;

  @observable nickName?: string;
  @observable avatar?: string;

  // foreign
  // @observable issues: Issue[] = [];
  // @observable articles: Article[] = [];

  static from(i: ICourse) {
    const instance = new Course();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }

  async detailed() {
    const { articles, issues } = await Course.detail(this.id);
    // this.articles = articles;
    // this.issues = issues;
    return { articles, issues };
  }

  async update(items: Partial<ICourse>) {
    const resp = await POST_FORM('/course/update', { id: this.id, ...items });
    const ret = resp.data;
    if (ret.state == 'ok') {
      Object.assign(this, items);
      return;
    } else {
      throw ret.msg;
    }
  }

  /**
   * APIs
   */

  static async myCourses(): Promise<Course[]> {
    const resp = await GET<ICourse[]>('/course/myByTeacher');
    return resp.data.map(Course.from);
  }

  static async create(
    name: string,
    introduce: string,
    courseType: number,
    title: string,
    content: string
  ): Promise<Course> {
    const resp = await POST_FORM('/course/create', {
      name,
      introduce,
      courseType,
      title,
      content
    });
    const { courseId, courseCreateAt, accountId } = resp.data;
    return Course.from({
      id: courseId,
      createAt: courseCreateAt,
      status: Course.STATUS.INIT,
      name,
      shortIntro:'',
      introduce,
      courseType,
      buyerCount: 0,
      accountId,
      lectureCount:0
    });
  }

  static async fetchById(id: number) {
    // TODO
    // const resp = await GET("/course/")
  }

  static async detail(id: number) {
    const resp = await GET<{
      articles: IArticle[];
      issues: IIssue[];
    }>('/course/detail', { id });
    const { articles, issues } = resp.data;
    return observable({
      articles: articles.map(Article.from),
      issues: issues.map(Issue.from)
    });
  }

  static async update(id: number, items: { [key: string]: number | string }) {
    const resp = await POST_FORM('/course/update', { id, ...items });
    return resp.data;
  }

  /**
   * Constants
   */

  static readonly STATUS = Object.freeze({
    INIT: 0,
    LOCK: 1,
    PASSED: 1 << 1,
    PUBLISH: 1 << 2,
    isInit(course: ICourse) {
      return course.status === 0;
    },
    isLock(course: ICourse) {
      return BitKit.at(course.status, 0) === 1;
    },
    isPassed(course: ICourse) {
      return BitKit.at(course.status, 1) === 1;
    },
    isPublish(course: ICourse) {
      return BitKit.at(course.status, 2) === 1;
    }
  });

  static readonly TYPE = Object.freeze({
    COLUMN: 1,
    VIDEO: 2
  });
}
