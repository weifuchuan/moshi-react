import {Account, AccountStatus } from "@/common/models/account";
import { Action, AnyAction } from "redux";
import { SET_ME, ACTIVATE } from "./actionTypes";

let initMe: Account | null = null;
if (__DEV__) {
  // initMe = ({
  //   id: 0,
  //   nickName: "fuchuan",
  //   avatar:
  //     "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
  //   email: "fuchuan.wei@hotmail.com",
  //   status: 1,
  //   createAt: Date.now()
  // } as Partial<Account>) as Account;
}

export default function me(I: Account | null = initMe, action: AnyAction) {
  switch (action.type) {
    case SET_ME:
      return action.account;
    case ACTIVATE:
      if (I) {
        // TODO
        // I.status = AccountStatus.STATUS_OK;
      }
      return;
    default:
      break;
  }
  return I;
}
