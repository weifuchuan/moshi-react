import { all, take, spawn, Effect, call, put } from "@redux-saga/core/effects";
import { FETCH_COURSE_DETAIL } from "./actionType";
import { CourseAPI } from "@/common/models/course";
import { addArticles } from "../articles/actions";

export default function* coursesSagas(): IterableIterator<Effect> {
  const sagas: (() => IterableIterator<Effect>)[] = [fetchDetail];
  yield all(
    sagas.map(
      saga =>
        function*(): IterableIterator<Effect> {
          while (true) {
            try {
              yield call(saga);
              break; // saga退出时退出
            } catch (error) {
              // saga异常时重启
              console.error(error);
            }
          }
        }
    )
  );
}

function* fetchDetail(): IterableIterator<Effect> {
  while (true) {
    const { id } = yield take(FETCH_COURSE_DETAIL);
    const { articles } = yield call(CourseAPI.detail, id);
    yield put(addArticles(articles));
  }
}
