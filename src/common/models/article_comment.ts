import { IArticleComment } from "./db";
import { GET } from "@/common/kit/req";

export type ArticleComment = IArticleComment & {
  nickName: string;
  avatar: string;
  accountStatus: number;
  likeCount: number;
};

export const ArticleCommentStatus = {
  STATUS_ORDINARY: 0,
  STATUS_TOP: 1
};

export class ArticleCommentAPI {
  static async updateStatus(
    commentId: number,
    status: number,
    articleId: number
  ) {
    const resp = await GET("/article/updateCommentStatus", {
      commentId,
      status,
      articleId
    });
    const ret = resp.data;
    if (ret.state === "ok") {
      return;
    } else {
      throw ret.msg;
    }
  }
}
