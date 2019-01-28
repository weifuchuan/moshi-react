import meSagas from "./me/sagas";
import { spawn, call, all } from "@redux-saga/core/effects";
import coursesSagas from "./courses/sagas";
import articlesSagas from "./articles/sagas";
import issuesSagas from "./issues/sagas";
import articleCommentsSagas from "./articleComments/sagas";
import issueCommentsSagas from './issueComments/sagas';

export default function* rootSagas(): IterableIterator<any> {
  const sagas = [
    meSagas,
    coursesSagas,
    articlesSagas,
    issuesSagas,
    articleCommentsSagas,
    issueCommentsSagas
  ];

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
