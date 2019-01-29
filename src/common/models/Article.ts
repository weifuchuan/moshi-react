import { _IArticle } from "./_db";
import { GET, Ret, POST_FORM, select } from "@/common/kit/req";
import { observable } from "mobx";
import { _IArticleComment } from "./_db";
import Account from "@/common/models/Account";

export type IArticle = _IArticle;

export type IArticleComment = _IArticleComment & {
  nickName: string;
  avatar: string;
  likeCount: number;
};

export default class Article implements IArticle {
  @observable id: number = 0;
  @observable courseId: number = 0;
  @observable title: string = "";
  @observable content: string = "";
  @observable publishAt?: number | undefined;
  @observable createAt: number = 0;
  @observable status: number = 0;
  @observable audioId?: number | undefined;

  // foreign
  @observable comments: ArticleComment[] = [];

  async fetchComments() {
    const comments = await select<IArticleComment>(
      "/select/teacher",
      `
        select ac.*, u.avatar, u.nickName 
        from article_comment_t ac, account_t u
        where ac.articleId = ? and ac.accountId = u.id 
      `,
      this.id
    );
    this.comments = observable(comments.map(ArticleComment.from));
  }

  async comment(me: Account, content: string, replyTo?: number) {
    const ret = await Article.comment(this.id, content,replyTo);
    if (ret.state === "ok") {
      const comment = {
        id: ret.id,
        createAt: ret.createAt,
        articleId: this.id,
        content,
        replyTo,
        status: 0,
        accountId: me.id,
        nickName: me.nickName,
        avatar: me.avatar,
        accountStatus: me.status,
        likeCount: 0
      };
      this.comments.push(ArticleComment.from(comment));
    } else {
      throw ret.msg;
    }
  }

  static from(i: IArticle) {
    const instance = new Article();
    Object.assign(instance, i);
    return instance;
  }

  /**
   * APIs
   */

  static async fetch(id: number): Promise<Article> {
    const resp = await GET("/article/fetch", { id });
    const ret = resp.data;
    if (ret.state === "ok") {
      const article = Article.from(ret.article);
      const comments = ret.comments.map(ArticleComment.from);
      article.comments = observable(comments);
      return article;
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

  async removeComment(commentId: number) {
    const resp = await GET("/article/removeComment", {
      articleId: this.id,
      commentId
    });
    const ret = resp.data;
    if (ret.state === "ok") {
      const i = this.comments.findIndex(comment => comment.id === commentId);
      if (i !== -1) {
        this.comments.splice(i, 1);
      }
      return;
    } else {
      throw ret.msg;
    }
  }

  /**
   * Constants
   */

  static readonly STATUS = Object.freeze({
    INIT: 0,
    LOCK: 1,
    PUBLISH: 1 << 1
  });
}

export class ArticleComment implements IArticleComment {
  @observable id: number = 0;
  @observable articleId: number = 0;
  @observable accountId: number = 0;
  @observable content: string = "";
  @observable createAt: number = 0;
  @observable status: number = 0;
  @observable replyTo?: number | undefined;
  @observable nickName: string = "";
  @observable avatar: string = "";
  @observable accountStatus: number = 0;
  @observable likeCount: number = 0;

  static from(i: IArticleComment) {
    const instance = new ArticleComment();
    Object.assign(instance, i);
    return instance;
  }

  /**
   * APIs
   */

  async updateStatus(status: number) {
    const resp = await GET("/article/updateCommentStatus", {
      commentId: this.id,
      status,
      articleId: this.articleId
    });
    const ret = resp.data;
    if (ret.state === "ok") {
      this.status = status;
      return;
    } else {
      throw ret.msg;
    }
  }

  /**
   * Constants
   */

  static readonly STATUS = Object.freeze({
    ORDINARY: 0,
    TOP: 1
  });
}