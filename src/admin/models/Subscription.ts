import { _ISubscription } from '@/common/models/_db';
import { observable, runInAction } from 'mobx';

export interface ISubscription extends _ISubscription{
  nickName:string;
  refName:string
}

export default class Subscription implements ISubscription {
  @observable id: string = '';
  @observable accountId: number = 0;
  @observable refId: number = 0;
  @observable subscribeType: 'course' = 'course';
  @observable createAt: number = 0;
  @observable cost: number = 0;
  @observable payWay: number=0;
  @observable status: number = 0;

  @observable nickName:string=''; 
  @observable refName:string='';
 
  static from(i: ISubscription) {
    const instance = new Subscription();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }

}
