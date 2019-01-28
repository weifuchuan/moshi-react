import { ArticleComment } from "@/common/models/article_comment";
import { AnyAction } from "redux";
import {
  ADD_ARTICLE_COMMENTS,
  DELETE_COMMENT,
  UPDATE_COMMENT_STATUS_LOCAL
} from "./actionsTypes";

export function articleComments(
  comments: ArticleComment[] = [],
  action: AnyAction
) {
  switch (action.type) {
    case ADD_ARTICLE_COMMENTS:
      const cs = [];
      for (let c of action.comments) {
        let ok = true;
        for (let c2 of comments) {
          if (c2.id === c) {
            Object.assign(c2, c);
            ok = false;
            break;
          }
        }
        if (ok) {
          cs.push(c);
        }
      }
      return [...comments, ...cs];
    case DELETE_COMMENT:
      let i = comments.findIndex(c => c.id === action.id);
      if (i === -1) return comments;
      else return comments.splice(i, 1), [...comments];
    case UPDATE_COMMENT_STATUS_LOCAL:
      i = comments.findIndex(c => c.id === action.id);
      if (i === -1) return comments;
      else return (comments[i].status = action.status), [...comments];
  }
  return comments;
}
