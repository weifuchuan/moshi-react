import { repeat } from "@/common/kit/functions";
import { Control, Filter } from "react-keeper";
import { Account, AccountStatus } from "@/common/models/account";
import { message, notification } from "antd";

export const buildLoggedFilter: (_this: {
  probingStatus: "start" | "doing" | "end";
  props: { logged: boolean };
}) => Filter = _this =>
  async (cb, props) => {
    repeat(() => {
      if (_this.probingStatus === "end") {
        if (_this.props.logged) {
          cb();
        } else {
          if (Control.path.match(/^\/login/)) Control.go("/login");
          else Control.go(`/login?returnUrl=${Control.path}`);
        }
        return true;
      }
      return false;
    });
  };

export const buildUnloggedFilter: (_this: {
  probingStatus: "start" | "doing" | "end";
  props: { logged: boolean };
}) => Filter = _this =>
  async (cb, props) => {
    repeat(() => {
      if (_this.probingStatus === "end") {
        if (!_this.props.logged) {
          cb();
        } else {
          Control.go("/");
        }
        return true;
      }
      return false;
    });
  };

export const buildLockFilter: (_this: {
  props: { me: Account | null };
}) => Filter = _this =>
  async (cb, props) => {
    if (_this.props.me && AccountStatus.isLock(_this.props.me)) {
      cb();
    }
  };

export const buildUnlockFilter: (_this: {
  props: { me: Account | null };
}) => Filter = _this =>
  async (cb, props) => {
    if (_this.props.me && !AccountStatus.isLock(_this.props.me)) {
      cb();
    } else {
      notification.error({
        message: "您的账号已被锁定",
        description: "锁定账号无法进行任何操作",
        duration: null
      });
    }
  };

export const buildActivatedFilter: (_this: {
  props: { me: Account | null };
}) => Filter = _this =>
  async (cb, props) => {
    if (_this.props.me && !AccountStatus.isReg(_this.props.me)) {
      cb();
    } else {
      message.warn("账号未激活");
      Control.go("/activate");
    }
  };

export const buildUnactivatedFilter: (_this: {
  props: { me: Account | null };
}) => Filter = _this =>
  async (cb, props) => {
    if (_this.props.me && AccountStatus.isReg(_this.props.me)) {
      cb();
    } else {
      message.warn("账号已激活");
      Control.go("/");
    }
  };

export const buildRoleFilter: (
  _this: {
    props: { me: Account | null };
  },
  judge: (account: Account) => boolean,
  failCallback: () => void
) => Filter = (_this, judge, failCallback) =>
  async (cb, props) => {
    if (_this.props.me && judge(_this.props.me)) {
      cb();
    } else {
      failCallback();
    }
  };
