import { Effect } from "@redux-saga/types";
import { combineSagas, repeatSaga } from "@/common/kit/functions";
import { take, all, call, select, put } from '@redux-saga/core/effects';
import { ENTER_ISSUE_PAGE } from "./actionTypes";
import { IssueAPI, Issue, IssueComment } from "@/common/models/issue";
import { addIssues } from './actions';
import { addIssueComments } from '../issueComments/actions';

export default function* issuesSagas(): IterableIterator<Effect> {
  yield combineSagas([enterIssuePage]);
}

function* enterIssuePage(): IterableIterator<Effect> {
  yield* repeatSaga(function*() {
    const { id } = yield take(ENTER_ISSUE_PAGE);
    const [issue, comments]: [Issue, IssueComment[]] = yield all([
      call(IssueAPI.fetchIssue, id),
      call(IssueAPI.page, id, 1, 10)
    ]);
    yield put(addIssues([issue]))
    yield put(addIssueComments(comments)); 
  });
}
