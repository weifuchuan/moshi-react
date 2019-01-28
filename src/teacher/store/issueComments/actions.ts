import { ArticleComment } from "@/common/models/article_comment";
import {
  UPDATE_COMMENT_STATUS,
  UPDATE_COMMENT_STATUS_LOCAL,
  REQUEST_COMMNET_ISSUE,
  REQUEST_ISSUE_COMMENT_PAGINATE
} from "./actionsTypes";
import {
  ADD_ISSUE_COMMENTS,
  REMOVE_COMMENT,
  DELETE_COMMENT
} from "./actionsTypes";
import { IssueComment } from "@/common/models/issue";

export function addIssueComments(comments: IssueComment[]) {
  return {
    type: ADD_ISSUE_COMMENTS,
    comments
  };
}

export function removeIssueComment(
  commentId: number,
  issueId: number,
  onOk?: () => void,
  onErr?: (err: any) => void
) {
  return {
    type: REMOVE_COMMENT,
    commentId,
    issueId,
    onOk,
    onErr
  };
}

export function deleteIssueComment(id: number) {
  return {
    type: DELETE_COMMENT,
    id
  };
}

export function updateIssueCommentStatus(
  id: number,
  status: number,
  issueId: number
) {
  return { type: UPDATE_COMMENT_STATUS, id, status, issueId };
}

export function updateCommentStatusLocal(id: number, status: number) {
  return { type: UPDATE_COMMENT_STATUS_LOCAL, id, status };
}

export function commentIssue(issueId: number, content: string) {
  return { type: REQUEST_COMMNET_ISSUE, issueId, content };
}


export function issueCommentPage(issueId:number,pageNumber:number, onOk:()=>void){
  return {
    type:REQUEST_ISSUE_COMMENT_PAGINATE,
    pageNumber,onOk,issueId
  }
}