import { IIssue } from '@/common/models/Issue';
import Issue from '@/common/models/Issue';
import { observable, runInAction } from 'mobx';
import { select } from '@/common/kit/req';

export interface IIssueAdmin extends IIssue {}

export default class IssueAdmin extends Issue implements IIssueAdmin {
  constructor() {
    super();
  }

  static from(i: IIssueAdmin) {
    const instance = new IssueAdmin();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }
}
