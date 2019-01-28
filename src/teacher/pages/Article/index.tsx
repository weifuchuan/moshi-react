import useTitle from "@/common/hooks/useTitle";
import { IAccount } from "@/common/models/Account";
import { ICourse } from "@/common/models/Course";
import Layout from "@/teacher/layouts/Layout";
import React, {
  FunctionComponent,
  useEffect,
  useState,
  useRef,
  useContext
} from "react";
import "./index.scss";
import { IArticle, ArticleComment } from "@/common/models/Article";
import {
  Skeleton,
  message,
  Input,
  Button,
  List,
  Popconfirm,
  Avatar
} from "antd";
import Panel from "@/common/components/Panel";
import RichEditor from "@/common/components/RichEditor";
import BraftEditor, { EditorState } from "braft-editor";
import { PopCommentEditor } from "@/common/components/CommentEditor";
import MarkdownDiv from "@/common/components/MarkdownDiv";
import DefaultAvatar from "@/common/components/DefaultAvatar";
import { fromNow } from "@/common/kit/functions";
import { Link } from "react-keeper";
import Expandable from "@/common/components/Expandable";
import { StoreContext } from "@/teacher/store";
import { observer } from "mobx-react-lite";
import ArticleModel from "@/common/models/Article";

interface Props {
  params: {
    id: string;
  };
}

const Article: FunctionComponent<Props> = ({ params }) => {
  const store = useContext(StoreContext);
  const articles = store.articles;
  const id = Number.parseInt(params.id);
  const article = articles.find(a => a.id === id)!; // TODO: article not exists in local

  useEffect(() => {
    (async () => {
      if (!article) {
        const article = await ArticleModel.fetch(id);
        store.articles.push(article);
      }
    })();
  }, []);

  useEffect(() => {
    if (article && article.comments.length === 0) {
      article.fetchComments();
    }
  }, [article]);

  const editor = useRef<BraftEditor>(null);

  useTitle(`${article ? article.title : "文章"} | 默识 - 作者端`);

  // const [content, setContent] = useState("");

  if (!article) {
    return <Skeleton active />;
  }

  const replies = article.comments
    .filter(c => !!c.replyTo)
    .reduce((map, c) => ((map[c.replyTo!] = c), map), {} as {
      [replyTo: number]: ArticleComment;
    });
  const comments = article.comments
    .filter(c => !!!c.replyTo)
    .sort((a, b) => {
      if (
        a.status === ArticleComment.STATUS.TOP &&
        b.status === ArticleComment.STATUS.ORDINARY
      ) {
        return -1;
      } else if (
        a.status === ArticleComment.STATUS.ORDINARY &&
        b.status === ArticleComment.STATUS.TOP
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

  return (
    <Layout>
      <div className="Article">
        <div>
          <Panel style={{ flexBasis: "70vw", height: "fit-content" }}>
            <div>
              <Input
                defaultValue={article.title}
                onChange={e => (article.title = e.target.value)}
                style={{ marginBottom: "1em" }}
              />
              <RichEditor
                defaultValue={BraftEditor.createEditorState(article.content)}
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
                    onOk={async content => {
                      await article.comment(store.me!, content);
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
                          onOk={async content => {
                            await article.comment(
                              store.me!,
                              content,
                              comment.id
                            );
                          }}
                        />,
                        <Button
                          className={"action"}
                          onClick={() => {
                            comment.updateStatus(
                              comment.status === ArticleComment.STATUS.ORDINARY
                                ? ArticleComment.STATUS.TOP
                                : ArticleComment.STATUS.ORDINARY
                            );
                          }}
                        >
                          {comment.status === ArticleComment.STATUS.ORDINARY
                            ? "置顶"
                            : "取消置顶"}
                        </Button>,
                        <Popconfirm
                          title="确认删除此评论?"
                          onConfirm={async () => {
                            try {
                              await article.removeComment(comment.id);
                              message.success("删除成功");
                            } catch (err) {
                              message.error(err);
                            }
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
                          onConfirm={async () => {
                            try {
                              await article.removeComment(comment.id);
                              message.success("删除成功");
                            } catch (err) {
                              message.error(err);
                            }
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

export default observer(Article);
