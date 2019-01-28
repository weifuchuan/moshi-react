import { take, call, put, Effect } from "@redux-saga/core/effects";
import { PROBE_LOGIN, LOGIN, REG } from "./actionTypes";
import { AccountAPI } from "@/common/models/account";
import { setMe } from "./actions";
import { combineSagas } from "@/common/kit/functions";

export default function* meSagas(): IterableIterator<Effect> {
  yield combineSagas([loginOrRegFlow]);
}

function* loginOrRegFlow(): IterableIterator<Effect> {
  const { onEnd } = yield take(PROBE_LOGIN);
  try {
    const account = yield call(AccountAPI.probeLoggedAccount);
    onEnd();
    yield put(setMe(account));
  } catch (error) {
    onEnd();
    console.error(error);
    while (true) {
      const action = yield take([LOGIN, REG]);
      try {
        let account;
        if (action.type === LOGIN) {
          const { email, password, captcha } = action;
          account = yield call(AccountAPI.login, email, password, captcha);
        } else {
          const { email, nickName, password, captcha } = action;
          account = yield call(
            AccountAPI.reg,
            email,
            nickName,
            password,
            captcha
          );
        }
        action.onOk(account);
        yield put(setMe(account));
        break; 
        // TODO: logout logic
      } catch (error) {
        action.onError(error);
      }
    }
  }
}
