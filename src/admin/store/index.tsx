import iterToList from '@/common/kit/functions/iterToList';
import patchToModelArray from '@/common/kit/functions/patchToModelArray';
import { GET, select } from '@/common/kit/req';
import Account, { IAccount } from '@/common/models/Account';
import {
  AccountRole,
  Permission,
  Role,
  RolePermission
} from '@/common/models/admin';
import { ICourse } from '@/common/models/Course';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';
import { computed, observable, runInAction } from 'mobx';
import { Observer } from 'mobx-react-lite';
import React, { FunctionComponent, ReactElement } from 'react';
import EventEmitter from 'wolfy87-eventemitter';
import ApplicationAdmin, {
  IApplicationAdmin
} from '../models/ApplicationAdmin';
import ArticleAdmin, { IArticleAdmin } from '../models/ArticleAdmin';
import CourseAdmin from '../models/CourseAdmin';
import IssueAdmin from '../models/IssueAdmin';
import { IIssueAdmin } from '../models/IssueAdmin';
import Subscription, { ISubscription } from '../models/Subscription';

export interface PageRet<Model> {
  totalRow: number;
  pageNumber: number;
  firstPage: boolean;
  lastPage: boolean;
  totalPage: number;
  pageSize: number;
  list: Model[];
}

export class Store extends EventEmitter {
  probeLoginStatus: 'start' | 'doing' | 'end' = 'start';

  @observable me?: Account | null = null;

  @observable accountPages: Map<number, IAccount[]> = new Map();

  @computed
  get accounts(): IAccount[] {
    return uniqBy(
      flatMap(iterToList(this.accountPages.entries()).map((x) => x[1])),
      (x) => x.id
    ).sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      } else if (a.id === b.id) {
        return 0;
      } else {
        return 1;
      }
    });
  }

  async pageAccounts(pageNumber: number = 1): Promise<PageRet<IAccount>> {
    const resp = await GET<PageRet<IAccount>>('/admin/account/page', {
      pageNumber,
      pageCount: 10
    });
    resp.data = observable(resp.data);
    this.accountPages.set(pageNumber, resp.data.list);
    return resp.data;
  }

  @observable roles: Role[] = [];
  @observable permissions: Permission[] = [];
  @observable accountRoles: AccountRole[] = [];
  @observable rolePermissions: RolePermission[] = [];

  async fetchAllPermissionAndRoleData() {
    [
      this.roles,
      this.permissions,
      this.accountRoles,
      this.rolePermissions
    ] = await Promise.all([
      Role.fetch(),
      Permission.fetch(),
      AccountRole.fetch(),
      RolePermission.fetch()
    ]);
  }

  async syncPermission() {
    const resp = await GET('/admin/permission/sync');
    const ret = resp.data;
    if (ret.state === 'ok') {
      this.permissions = await Permission.fetch();
      return ret.msg;
    } else {
      throw ret.msg;
    }
  }

  @observable unpassedApplications: ApplicationAdmin[] = [];
  @observable passedApplications: ApplicationAdmin[] = [];
  @observable failApplications: ApplicationAdmin[] = [];

  async fetchUnpassedApplication() {
    const apps = await select<IApplicationAdmin>(
      '/select/manager',
      `
        select a.*, u.nickName, u.avatar
        from application_m a, account_m u
        where a.status = ? and a.accountId = u.id
      `,
      ApplicationAdmin.STATUS.COMMIT
    );
    this.unpassedApplications.splice(
      0,
      this.unpassedApplications.length,
      ...apps.map(ApplicationAdmin.from)
    );
  }

  async fetchPassedApplication() {
    const apps = await select<IApplicationAdmin>(
      '/select/manager',
      `
        select a.*, u.nickName, u.avatar
        from application_m a, account_m u
        where a.status = ? and a.accountId = u.id
      `,
      ApplicationAdmin.STATUS.PASSED
    );
    this.passedApplications.splice(
      0,
      this.passedApplications.length,
      ...apps.map(ApplicationAdmin.from)
    );
  }

  async fetchFailApplication() {
    const apps = await select<IApplicationAdmin>(
      '/select/manager',
      `
        select a.*, u.nickName, u.avatar
        from application_m a, account_m u
        where a.status = ? and a.accountId = u.id
      `,
      ApplicationAdmin.STATUS.FAIL
    );
    this.failApplications.splice(
      0,
      this.failApplications.length,
      ...apps.map(ApplicationAdmin.from)
    );
  }

  @observable columnCourses: CourseAdmin[] = [];
  @observable articles: ArticleAdmin[] = [];

  async fetchColumnCourses() {
    const courses = await select<ICourse>(
      '/select/manager',
      `
        select c.*, a.nickName, a.avatar 
        from course_m c, account_m a
        where c.courseType = ? and c.accountId = a.id
      `,
      CourseAdmin.TYPE.COLUMN
    );
    this.columnCourses.splice(
      0,
      this.columnCourses.length,
      ...courses.map(CourseAdmin.from)
    );
  }

  async fetchArticle(courseId: number) {
    const articles = await select<IArticleAdmin>(
      '/select/manager',
      `
        select a.*, u.nickName, u.avatar, c.name courseName
        from article_m a, course_m c, account_m u
        where a.courseId = ? and a.courseId = c.id and u.id = c.accountId
      `,
      courseId
    );
    runInAction(() => {
      patchToModelArray(articles.map(ArticleAdmin.from), store.articles);
    });
  }

  @observable videoCourses: CourseAdmin[] = [];

  async fetchVideoCourses() {
    const courses = await select<ICourse>(
      '/select/manager',
      `
        select c.*, a.nickName, a.avatar 
        from course_m c, account_m a
        where c.courseType = ? and c.accountId = a.id
      `,
      CourseAdmin.TYPE.VIDEO
    );
    this.videoCourses.splice(
      0,
      this.videoCourses.length,
      ...courses.map(CourseAdmin.from)
    );
  }

  @observable issues: IssueAdmin[] = [];

  async fetchIssues(courseId: number) {
    const issues = await select<IIssueAdmin>(
      '/select/manager',
      `
        select i.*, a.nickName, a.avatar
        from issue_m i, account_m a
        where i.courseId = ? and issue.accountId = a.id
      `,
      courseId
    );
    patchToModelArray(this.issues, issues.map(IssueAdmin.from));
  }

  @observable subscriptionPages: Map<number, Subscription[]> = new Map();

  // TODO
  async pageSubscription(page: number) {
    const list = await select<ISubscription>(
      '/select/manager',
      `
        select s.*, a.nickName, c.name refName
        from account_m a, subscription_m s, course_m c
        where s.accountId = a.id and s.type = ? and s.courseId = c.id 
        limit ?, 10 
      `,
      'course',
      page
    );
    this.subscriptionPages.set(page, observable(list.map(Subscription.from)));
  }

  async probeLogin() {
    this.probeLoginStatus = 'doing';
    try {
      const account = await Account.probeLoggedAccount();
      this.me = account;
    } catch (err) {}
    this.probeLoginStatus = 'end';
  }
}

const store = new Store();

export default store;

export const StoreContext = React.createContext(store);

export const StoreContextObserver: FunctionComponent<{
  buildChildren: (store: Store) => ReactElement<any>;
}> = ({ buildChildren }) => (
  <StoreContext.Consumer>
    {(store) => <Observer>{() => buildChildren(store)}</Observer>}
  </StoreContext.Consumer>
);

if (__DEV__) {
  (window as any).store = store;
}
