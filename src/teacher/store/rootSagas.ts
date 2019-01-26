import meSagas from "./me/sagas";
import { spawn, call, all } from "@redux-saga/core/effects";
import coursesSagas from "./courses/sagas";

export default function* rootSagas(): IterableIterator<any> { 
  const sagas = [meSagas, coursesSagas];

  yield all(
    sagas.map(saga =>
      spawn(function*() {
        while (true) {
          try { 
            yield call(saga);
            break;
          } catch (e) {
            console.log(e);
          }
        }
      })
    )
  );
}
