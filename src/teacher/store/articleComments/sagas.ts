import { Effect } from "@redux-saga/types";
import { combineSagas, repeatSaga } from "@/common/kit/functions";
import { REMOVE_COMMENT, UPDATE_COMMENT_STATUS } from "./actionsTypes";
import { take, call, put } from "@redux-saga/core/effects";
import { ArticleAPI } from "@/common/models/article";
import { deleteComment, updateCommentStatusLocal } from "./actions";
import { ArticleCommentAPI } from "@/common/models/article_comment";

export default function* articleCommentsSagas(): IterableIterator<Effect> {
  yield combineSagas([removeComment, updateCommentStatus]);
}

function* removeComment(): IterableIterator<Effect> {
  yield* repeatSaga(function*() {
    const { commentId, articleId, onOk, onErr } = yield take(REMOVE_COMMENT);
    try {
      yield call(ArticleAPI.removeComment, articleId, commentId);
      yield put(deleteComment(commentId));
      onOk && onOk();
    } catch (err) {
      onErr && onErr(err);
    }
  }); 
}

function* updateCommentStatus() {
  yield* repeatSaga(function*() {
    const { id, status, articleId } = yield take(UPDATE_COMMENT_STATUS);
    try {
      yield call(ArticleCommentAPI.updateStatus, id, status, articleId);
      yield put(updateCommentStatusLocal(id, status));
    } catch (err) {
      console.error(err);
    }
  });
}
