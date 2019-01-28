import { IIssue, IIssueComment } from "./db";
import { GET, select } from "../kit/req";
import { POST_FORM } from "@/common/kit/req";

export type Issue = IIssue & {
  nickName: string;
  avatar: string;
  commentCount: number;
};

export type IssueComment = IIssueComment & {
  nickName: string;
  avatar: string;
};

export const IssueStatus = {
  STATUS_OPEN: 0,
  STATUS_CLOSE: 1
};

export class IssueAPI {
  static async fetch(courseId: number): Promise<Issue[]> {
    const resp = await GET<Issue[]>("/issue/fetch", { courseId });
    return resp.data;
  }

  static async fetchIssue(id: number) {
    const ret = await select<Issue>(
      "/select",
      `
        SELECT i.*, a.nickName, a.avatar
        FROM issue_l i, account_l a 
        WHERE i.id = ? && i.accountId = a.id
      `,
      id
    );
    if (ret.length > 0) return ret[0];
    else throw "issue not exists";
  }

  static async page(issueId: number, pageNumber: number, pageSize: number) {
    const offset = pageSize * (pageNumber - 1);
    const ret = await select<IssueComment>(
      "/select",
      `
        select ic.*, a.nickName, a.avatar
        from issue_comment_l ic, issue_l i, account_l a
        where i.id = ? and i.id = ic.issueId and ic.accountId = a.id 
        limit ?, ?
      `,
      issueId,
      offset,
      pageSize
    );
    return ret;
  }

  static async comment(
    issueId: number,
    content: string
  ): Promise<{ id: number; createAt: number }> {
    const resp = await POST_FORM("/issue/comment", { issueId, content });
    const ret = resp.data;
    if (ret.state === "ok") {
      return {
        id: ret.id,
        createAt: ret.createAt
      };
    }else{
      throw ret.msg; 
    }
  }
}
