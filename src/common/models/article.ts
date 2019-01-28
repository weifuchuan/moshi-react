import { Model } from "../kit/type";
import { IArticle } from "./db";
import { GET, Ret, POST_FORM } from "@/common/kit/req";

export type Article = IArticle;

export const ArticleStatus = {
  STATUS_INIT: 0,
  STATUS_LOCK: 1,
  STATUS_PUBLISH: 1 << 1
};

export class ArticleAPI {
  static async fetch(id: number) {
    const resp = await GET("/article/fetch", { id });
    const ret = resp.data;
    if (ret.state === "ok") {
      return ret;
    } else {
      throw ret.msg;
    }
  }

  static async comment(
    articleId: number,
    content: string,
    replyTo?: number
  ): Promise<Ret & { id: number; createAt: number }> {
    const resp = await POST_FORM("/article/comment", {
      articleId,
      content,
      replyTo
    });
    const ret = resp.data;
    if (ret.state === "ok") {
      return ret as any;
    } else {
      throw ret.msg;
    }
  }

  static async removeComment(articleId: number, commentId: number) {
    const resp = await GET("/article/removeComment", {
      articleId,
      commentId
    });
    const ret = resp.data;
    if (ret.state === "ok") {
      return;
    } else {
      throw ret.msg;
    }
  }
}
