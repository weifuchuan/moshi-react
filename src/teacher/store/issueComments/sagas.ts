import { Effect } from "@redux-saga/types";
import { combineSagas, repeatSaga } from "@/common/kit/functions";
import {
  REMOVE_COMMENT,
  UPDATE_COMMENT_STATUS,
  REQUEST_COMMNET_ISSUE,
  REQUEST_ISSUE_COMMENT_PAGINATE
} from "./actionsTypes";
import { take, call, put, select } from "@redux-saga/core/effects";
import { ArticleAPI } from "@/common/models/article";
import {
  deleteIssueComment,
  updateCommentStatusLocal,
  addIssueComments
} from "./actions";
import { ArticleCommentAPI } from "@/common/models/article_comment";
import { IssueAPI } from '../../../common/models/issue';
import { State } from "../state_type";

export default function* issueCommentsSagas(): IterableIterator<Effect> {
  yield combineSagas([removeComment, updateCommentStatus,requestCommentIssue,issueCommentPage]);
}

function* removeComment(): IterableIterator<Effect> {
  yield* repeatSaga(function*() {
    // TODO
    const { commentId, articleId, onOk, onErr } = yield take(REMOVE_COMMENT);
    try {
      yield call(ArticleAPI.removeComment, articleId, commentId);
      yield put(deleteIssueComment(commentId));
      onOk && onOk();
    } catch (err) {
      onErr && onErr(err);
    }
  });
}

function* updateCommentStatus() {
  yield* repeatSaga(function*() {
    // TODO
    const { id, status, articleId } = yield take(UPDATE_COMMENT_STATUS);
    try {
      yield call(ArticleCommentAPI.updateStatus, id, status, articleId);
      yield put(updateCommentStatusLocal(id, status));
    } catch (err) {
      console.error(err);
    }
  });
}

function* requestCommentIssue() {
  yield* repeatSaga(function*() {
    const { issueId, content } = yield take(REQUEST_COMMNET_ISSUE);
    const { id, createAt } = yield call(IssueAPI.comment, issueId, content);
    const { me }: State = yield select();
    yield put(
      addIssueComments([
        {
          id,
          createAt,
          issueId,
          content,
          status: 0,
          accountId: me!.id,
          nickName: me!.nickName,
          avatar: me!.avatar
        }
      ])
    );
  });
}

function*issueCommentPage(){
  yield*repeatSaga(function*(){
    const {issueId,pageNumber,onOk}=yield take(REQUEST_ISSUE_COMMENT_PAGINATE)
    const comments=yield call(IssueAPI.page, issueId,pageNumber,10); 
    yield put(addIssueComments(comments))
    onOk();
  })
}