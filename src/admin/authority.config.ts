import { Filter, RouteProps, Control } from "react-keeper";
import store, { Store } from "./store";
import Account from "@/common/models/Account";
import repeat from "@/common/kit/functions/repeat";

interface AuthorityConfig {
  [key: string]: Filter;
}

const config: AuthorityConfig = {
  hasLogin: buildFilter(async (store, props) => {
    await new Promise(resolve => {
      repeat(() => {
        if (store.probeLoginStatus !== "end") {
          return false;
        }
        resolve();
        return true;
      });
    });
    return !!store.me;
  }, "/login"),
  notLogin: buildFilter(async (store, props) => {
    await new Promise(resolve => {
      repeat(() => {
        if (store.probeLoginStatus !== "end") {
          return false;
        }
        resolve();
        return true;
      });
    });
    return !!!store.me;
  }, "/home"),
  isManager: buildFilter(
    async (store, props) => {
      if (store.me && Account.STATUS.isManager(store.me)) {
        return true;
      }
      return false;
    },
    store => {
      if (store.me) {
        alert("你不是管理员！");
      } else {
        Control.go("/login");
      }
    }
  ),
  toHome: buildFilter(async () => {
    return false;
  }, "/home")
};

export default config;

function buildFilter(
  auth: (store: Store, routeProps: RouteProps) => Promise<boolean>,
  failRedirectToOrOnFail?:
    | string
    | ((store: Store, routeProps: RouteProps) => void)
): Filter {
  return async (cb, props) => {
    let ok = false;
    try {
      ok = await auth(store, props);
    } catch (err) {
      console.error(err);
      ok = false;
    }
    if (ok) {
      cb();
    } else {
      if (typeof failRedirectToOrOnFail === "string") {
        Control.go(failRedirectToOrOnFail);
      } else if (typeof failRedirectToOrOnFail === "function") {
        failRedirectToOrOnFail(store, props);
      }
    }
  };
}
