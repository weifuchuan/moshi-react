import Course, { ICourse } from '@/common/models/Course';
import { POST_FORM } from '@/common/kit/req';
import { runInAction } from 'mobx';


export default class CourseAdmin extends Course{
  constructor(){
    super();
  }
  
  async update(items: Partial<ICourse>) {
    const resp = await POST_FORM('/admin/course/update', { id: this.id, ...items });
    const ret = resp.data;
    if (ret.state == 'ok') {
      Object.assign(this, items);
      return;
    } else {
      throw ret.msg;
    }
  }

  
  static from(i: ICourse) {
    const instance = new CourseAdmin();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }

}