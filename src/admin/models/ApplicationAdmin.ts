import Application from '@/common/models/Application';
import { observable, runInAction } from 'mobx';
import IApplication from '@/common/models/Application';
import { POST_FORM } from '@/common/kit/req';

export interface IApplicationAdmin extends IApplication {
  nickName: string;
  avatar: string;
}

export default class ApplicationAdmin extends Application
  implements IApplicationAdmin {
  constructor() {
    super();
  }

  @observable nickName = '';
  @observable avatar = '';

  async pass(reply: string) {
    const resp = await POST_FORM('/admin/apply/pass', { reply, id: this.id });
    const ret = resp.data;
    if (ret.state === 'ok') {
      this.reply = reply;
    } else {
      throw ret.msg;
    }
  }

  async reject(reply: string) {
    const resp = await POST_FORM('/admin/apply/reject', { reply, id: this.id });
    const ret = resp.data;
    if (ret.state === 'ok') {
      this.reply = reply;
    } else {
      throw ret.msg;
    }
  }

  static from(i: IApplicationAdmin) {
    const instance = new ApplicationAdmin();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }
}
