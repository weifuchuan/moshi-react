import EventEmitter from 'wolfy87-eventemitter';
import React from 'react';
import { observable, computed } from 'mobx';
import Account, { IAccount } from '@/common/models/Account';
import { GET, select } from '@/common/kit/req';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';
import {
  Role,
  Permission,
  AccountRole,
  RolePermission
} from '@/common/models/admin';
import iterToList from '@/common/kit/functions/iterToList';
import Application from '@/common/models/Application';
import ApplicationAdmin, {
  IApplicationAdmin
} from '../models/ApplicationAdmin';

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

if (__DEV__) {
  (window as any).store = store;
}
