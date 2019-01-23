import {Account} from "@/common/models/account";
import { SET_ME, ACTIVATE } from "./actionTypes";
import { AnyAction } from "redux";

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