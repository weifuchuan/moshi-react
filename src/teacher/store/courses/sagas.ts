import { all, take, spawn, Effect, call, put } from "@redux-saga/core/effects";
import {
  FETCH_COURSE_DETAIL,
  FETCH_MY_COURSES,
  UPDATE_COURSE
} from "./actionType";
import { CourseAPI, Course } from "@/common/models/course";
import { addArticles } from "../articles/actions";
import { setCourses, modifyCourse } from "./actions";
import { combineSagas } from "@/common/kit/functions";
import { Ret } from "@/common/kit/req";
import { addIssues } from "../issues/actions";

export default function* coursesSagas(): IterableIterator<Effect> {
  yield combineSagas([fetchDetail, fetchMyCourses, update]);
}

function* fetchMyCourses(): IterableIterator<Effect> {
  while (true) {
    yield take(FETCH_MY_COURSES);
    const courses: Course[] = yield call(CourseAPI.myCourses);
    yield put(setCourses(courses.filter(course => course)));
  }
}

function* fetchDetail(): IterableIterator<Effect> {
  while (true) {
    const { id, onEnd } = yield take(FETCH_COURSE_DETAIL);
    const { articles, issues } = yield call(CourseAPI.detail, id);
    yield put(addArticles(articles));
    yield put(addIssues(issues));
    onEnd && onEnd();
  }
}

function* update(): IterableIterator<Effect> {
  while (true) {
    const { id, items, onOk, onErr } = yield take(UPDATE_COURSE);
    const ret: Ret = yield call(CourseAPI.update, id, items);
    if (ret.state === "ok") {
      yield put(modifyCourse(id, items));
      onOk();
    } else {
      onErr(ret.msg);
    }
  }
}
