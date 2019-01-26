import { Account } from "@/common/models/account";
import { SET_ME, ACTIVATE, PROBE_LOGIN, LOGIN, REG } from "./actionTypes";
import { AnyAction } from "redux";

export function probeLogin(onEnd: Function): AnyAction {
  return {
    type: PROBE_LOGIN,
    onEnd
  };
}

export function login(
  email: string,
  password: string,
  captcha: string,
  onOk: (account: Account) => void,
  onError: (msg: string) => void
): AnyAction {
  return {
    type: LOGIN,
    email,
    password,
    captcha,
    onOk, 
    onError
  };
}

export function reg(
  email: string,
  nickName: string,
  password: string,
  captcha: string,
  onOk: (account: Account) => void,
  onError: (msg: string) => void
): AnyAction {
  return {
    type: REG,
    email,
    nickName,
    password,
    captcha,
    onOk, 
    onError
  };
}

export function setMe(account: Account | null): AnyAction {
  return {
    type: SET_ME,
    account
  };
}

export function activate(): AnyAction {
  return {
    type: ACTIVATE
  };
}
