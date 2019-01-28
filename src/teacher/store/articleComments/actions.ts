import { ArticleComment } from "@/common/models/article_comment";
import {
  UPDATE_COMMENT_STATUS,
  UPDATE_COMMENT_STATUS_LOCAL
} from "./actionsTypes";
import {
  ADD_ARTICLE_COMMENTS,
  REMOVE_COMMENT,
  DELETE_COMMENT
} from "./actionsTypes";

export function addArticleComments(comments: ArticleComment[]) {
  return {
    type: ADD_ARTICLE_COMMENTS,
    comments
  };
}

export function removeComment(
  commentId: number,
  articleId: number,
  onOk?: () => void,
  onErr?: (err: any) => void
) {
  return {
    type: REMOVE_COMMENT,
    commentId,
    articleId,
    onOk,
    onErr
  };
}

export function deleteComment(id: number) {
  return {
    type: DELETE_COMMENT,
    id
  };
}

export function updateCommentStatus(
  id: number,
  status: number,
  articleId: number
) {
  return { type: UPDATE_COMMENT_STATUS, id, status, articleId };
}

export function updateCommentStatusLocal(id: number, status: number) {
  return { type: UPDATE_COMMENT_STATUS_LOCAL, id, status };
}
