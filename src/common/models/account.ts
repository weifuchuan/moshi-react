import { Model } from "../kit/type";
import { account } from "./db";
import { GET, Ret, POST_FORM } from "../kit/req";
import BitKit from "@/common/models/BitKit";

type Account = Model<account, { password: string }>;
export { Account };

export const AccountStatus = {
  STATUS_REG: 0,
  STATUS_LOCK: 1 << 0,
  STATUS_LEARNER: 1 << 1,
  STATUS_TEACHER: 1 << 2,
  STATUS_MANAGER: 1 << 3,
  isReg(account: Account) {
    return account.status === this.STATUS_REG;
  },
  isLock(account: Account) {
    return BitKit.at(account.status, 0) === 1;
  },
  isLearner(account: Account) {
    return BitKit.at(account.status, 1) === 1;
  },
  isTeacher(account: Account) {
    return BitKit.at(account.status, 2) === 1;
  },
  isManager(account: Account) {
    return BitKit.at(account.status, 3) === 1;
  }
};

export async function probeLoggedAccount(): Promise<Account> {
  const resp = await GET<Ret & { account: Account }>("/login/probe");
  if (resp.data.state === "ok") return resp.data.account;
  else throw resp.data.msg;
}

export async function login(
  email: string,
  password: string,
  captcha: string
): Promise<Account> {
  const resp = await POST_FORM<Ret & { account: Account }>("/login", {
    email,
    password,
    captcha
  });
  if (resp.data.state === "ok") return resp.data.account;
  else throw resp.data.msg;
}

export async function reg(
  email: string,
  nickName: string,
  password: string,
  captcha: string
): Promise<Account> {
  const resp = await POST_FORM<Ret & { account: Account }>("/reg", {
    email,
    nickName,
    password,
    captcha
  });
  if (resp.data.state === "ok") return resp.data.account;
  else throw resp.data.msg;
}

export async function activate(authcode: string) {
  const resp = await POST_FORM<Ret>("/reg/activate", {
    authcode
  });
  return resp.data;
}

export async function reSendActivateEmail() {
  const resp = await GET<Ret>("/reg/reSendActivateEmail");
  return resp.data;
}
