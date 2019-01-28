import useTitle from "@/common/hooks/useTitle";
import { Account } from "@/common/models/account";
import { Course } from "@/common/models/course";
import Layout from "@/teacher/layouts/Layout";
import { State } from "@/teacher/store/state_type";
import React, { FunctionComponent, useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import "./index.scss";
import { Article } from "@/common/models/article";
import {
  Skeleton,
  message,
  Input,
  Button,
  List,
  Popconfirm,
  Avatar
} from "antd";
import { fetchArticle, commentArticle } from "@/teacher/store/articles/actions";
import Panel from "@/common/components/Panel";
import { ArticleComment } from "@/common/models/article_comment";
import RichEditor from "@/common/components/RichEditor";
import BraftEditor, { EditorState } from "braft-editor";
import { PopCommentEditor } from "@/common/components/CommentEditor";
import { ArticleCommentStatus } from "@/common/models/article_comment";
import MarkdownDiv from "@/common/components/MarkdownDiv";
import DefaultAvatar from "@/common/components/DefaultAvatar";
import { fromNow } from "@/common/kit/functions";
import { Link } from "react-keeper";
import {
  removeComment,
  updateCommentStatus
} from "@/teacher/store/articleComments/actions";
import Expandable from "@/common/components/Expandable";

interface Props {
  params: {
    id: string;
  };
  me: Account;
  courses: Course[];
  articles: Article[];
  fetchArticle: typeof fetchArticle;
  commentArticle: typeof commentArticle;
  articleComments: ArticleComment[];
  removeComment: typeof removeComment;
  updateCommentStatus: typeof updateCommentStatus;
}

const Article: FunctionComponent<Props> = ({
  params,
  me,
  courses,
  articles,
  children,
  fetchArticle,
  articleComments,
  commentArticle,
  removeComment,
  updateCommentStatus
}) => {
  const id = Number.parseInt(params.id);
  const article = articles.find(a => a.id === id);
  const replies = articleComments
    .filter(c => c.articleId === id && !!c.replyTo)
    .reduce((map, c) => ((map[c.replyTo!] = c), map), {} as {
      [replyTo: number]: ArticleComment;
    });
  const comments = articleComments
    .filter(c => c.articleId === id && !!!c.replyTo)
    .sort((a, b) => {
      if (
        a.status === ArticleCommentStatus.STATUS_TOP &&
        b.status === ArticleCommentStatus.STATUS_ORDINARY
      ) {
        return -1;
      } else if (
        a.status === ArticleCommentStatus.STATUS_ORDINARY &&
        b.status === ArticleCommentStatus.STATUS_TOP
      ) {
        return 1;
      }
      if (a.createAt > b.createAt) {
        return -1;
      } else if (a.createAt === b.createAt) {
        return 0;
      } else {
        return 1;
      }
    });
  for (let i = comments.length - 1; i > -1; i--) {
    const c = comments[i];
    if (replies[c.id]) {
      comments.splice(i + 1, 0, replies[c.id]);
    }
  }
  const [art, setArt] = useState({
    id,
    title: "",
    content: ""
  } as Article);
  const [assigned, setAssigned] = useState(false);
  useEffect(() => {
    fetchArticle(id, msg => message.error(msg));
  }, []);
  const editor = useRef<BraftEditor>(null);

  useTitle(`${article ? article.title : "文章"} | 默识 - 作者端`);

  // const [content, setContent] = useState("");

  if (!article) {
    return <Skeleton active />;
  } else {
    if (!assigned) {
      Object.assign(art, article);
      setAssigned(true);
    }
  }

  return (
    <Layout>
      <div className="Article">
        <div>
          <Panel style={{ flexBasis: "70vw", height: "fit-content" }}>
            <div>
              <Input
                defaultValue={art.title}
                onChange={e => setArt({ ...art, title: e.target.value })}
                style={{ marginBottom: "1em" }}
              />
              <RichEditor
                defaultValue={BraftEditor.createEditorState(art.content)}
                style={{ marginBottom: "1em", height: "auto" }}
                editorRef={editor}
              />
              <Button type="primary" onClick={() => {}}>
                保存
              </Button>
            </div>
          </Panel>
          <Panel
            style={{ flexBasis: "30vw", marginLeft: "0", overflowY: "auto" }}
          >
            <List
              bordered={true}
              header={
                <div>
                  <PopCommentEditor
                    buttonProps={{ children: "评论", type: "primary" }}
                    initContent={""}
                    onOk={content => {
                      commentArticle(article.id, content);
                    }}
                  />
                </div>
              }
              renderItem={(comment: ArticleComment) => {
                if (!comment.replyTo)
                  return (
                    <List.Item
                      actions={[
                        <PopCommentEditor
                          buttonProps={{
                            className: "action",
                            children: "回复"
                          }}
                          okText={"回复"}
                          initContent={""}
                          onOk={content => {
                            commentArticle(article.id, content, comment.id);
                          }}
                        />,
                        <Button
                          className={"action"}
                          onClick={() => {
                            updateCommentStatus(
                              comment.id,
                              comment.status ===
                                ArticleCommentStatus.STATUS_ORDINARY
                                ? ArticleCommentStatus.STATUS_TOP
                                : ArticleCommentStatus.STATUS_ORDINARY,
                              article.id
                            );
                          }}
                        >
                          {comment.status ===
                          ArticleCommentStatus.STATUS_ORDINARY
                            ? "置顶"
                            : "取消置顶"}
                        </Button>,
                        <Popconfirm
                          title="确认删除此评论?"
                          onConfirm={() => {
                            removeComment(
                              comment.id,
                              article.id,
                              () => message.success("删除成功"),
                              message.error
                            );
                          }}
                          onCancel={() => {}}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button className={"action"}>删除</Button>
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <DefaultAvatar size={48} avatar={comment.avatar} />
                        }
                        title={
                          <Link to={`/account/${comment.accountId}`}>
                            {comment.nickName}
                          </Link>
                        }
                        description={`${fromNow(comment.createAt)}`}
                      />
                      {comment.content.length < 150 ? (
                        <MarkdownDiv md={comment.content} />
                      ) : (
                        <Expandable height={160}>
                          <MarkdownDiv md={comment.content} />
                        </Expandable>
                      )}
                    </List.Item>
                  );
                else
                  return (
                    <List.Item
                      style={{ backgroundColor: "#f0f3ef" }}
                      actions={[
                        <Popconfirm
                          title="确认删除此评论?"
                          onConfirm={() => {
                            removeComment(
                              comment.id,
                              article.id,
                              () => message.success("删除成功"),
                              message.error
                            );
                          }}
                          onCancel={() => {}}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button className={"action"}>删除</Button>
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        title={`回复于 ${fromNow(comment.createAt)}`}
                      />
                      {comment.content.length < 150 ? (
                        <MarkdownDiv md={comment.content} />
                      ) : (
                        <Expandable height={160}>
                          <MarkdownDiv
                            md={comment.content}
                            style={{ backgroundColor: "#fff" }}
                          />
                        </Expandable>
                      )}
                    </List.Item>
                  );
              }}
              dataSource={comments}
              itemLayout={"vertical"}
            />
          </Panel>
        </div>
      </div>
    </Layout>
  );
};

export default connect(
  (state: State) => ({
    me: state.me!,
    courses: state.courses,
    articles: state.articles,
    articleComments: state.articleComments
  }),
  {
    fetchArticle,
    commentArticle,
    removeComment,
    updateCommentStatus
  }
)(Article);
