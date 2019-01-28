import { Article } from "@/common/models/article";
import { ADD_ARTICLES, FETCH_ARTICLE, COMMENT_ARTICLE } from "./actionTypes";

export function addArticles(articles: Article[]) {
  return { type: ADD_ARTICLES, articles };
}

export function fetchArticle(id: number, onErr: (msg: string) => void) {
  return { type: FETCH_ARTICLE, id, onErr };
}

export function commentArticle(
  articleId: number,
  content: string,
  replyTo?: number,
  onOk?: () => void,
  onErr?: (err: string) => void
) {
  return {
    type: COMMENT_ARTICLE,
    articleId,
    content,
    replyTo,
    onOk,
    onErr
  };
}
