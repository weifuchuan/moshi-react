import { Effect } from "@redux-saga/types";
import { combineSagas } from "@/common/kit/functions";
import { take, call, put, select } from "@redux-saga/core/effects";
import { FETCH_ARTICLE, COMMENT_ARTICLE } from "./actionTypes";
import { ArticleAPI } from "@/common/models/article";
import { addArticles } from "./actions";
import { addArticleComments } from "../articleComments/actions";

export default function* articlesSagas(): IterableIterator<Effect> {
  yield combineSagas([fetchArticle, commentArticle]);
}

function* fetchArticle(): IterableIterator<Effect> {
  while (true) {
    const { id, onErr } = yield take(FETCH_ARTICLE);
    try {
      const ret = yield call(ArticleAPI.fetch, id);
      yield put(addArticles([ret.article]));
      yield put(addArticleComments(ret.comments));
    } catch (err) {
      onErr(err);
    }
  }
}

function* commentArticle(): IterableIterator<Effect> {
  while (true) {
    const { articleId, content, replyTo, onOk, onErr } = yield take(
      COMMENT_ARTICLE
    );
    try {
      const ret = yield call(ArticleAPI.comment, articleId, content, replyTo);
      const { me } = yield select();
      yield put(
        addArticleComments([
          {
            id: ret.id,
            createAt: ret.createAt,
            articleId,
            content,
            replyTo,
            status: 0,
            accountId: me.id,
            nickName: me.nickName,
            avatar: me.avatar,
            accountStatus: me.status,
            likeCount:0
          }
        ])
      );
      onOk && onOk();
    } catch (err) {
      onErr && onErr(err);
    }
  }
}
