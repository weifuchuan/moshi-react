import { ArticleComment } from "@/common/models/article_comment";
import { AnyAction } from "redux";
import {
  ADD_ISSUE_COMMENTS as ADD_ISSUE_COMMENTS,
  DELETE_COMMENT,
  UPDATE_COMMENT_STATUS_LOCAL
} from "./actionsTypes";
import { IssueComment } from '@/common/models/issue';

export function issueComments(
  ics: IssueComment[] = [],
  action: AnyAction
) {
  switch (action.type) {
    case ADD_ISSUE_COMMENTS:
      const cs = [];
      for (let c of action.comments) {
        let ok = true;
        for (let c2 of ics) {
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
      return [...ics, ...cs];
    case DELETE_COMMENT:
      let i = ics.findIndex(c => c.id === action.id);
      if (i === -1) return ics;
      else return ics.splice(i, 1), [...ics];
    case UPDATE_COMMENT_STATUS_LOCAL:
      i = ics.findIndex(c => c.id === action.id);
      if (i === -1) return ics;
      else return (ics[i].status = action.status), [...ics];
  }
  return ics;
}
