import { PopCommentEditor } from "@/common/components/CommentEditor";
import DefaultAvatar from "@/common/components/DefaultAvatar";
import Expandable from "@/common/components/Expandable";
import MarkdownDiv from "@/common/components/MarkdownDiv";
import Panel from "@/common/components/Panel";
import RichEditor from "@/common/components/RichEditor";
import useTitle from "@/common/hooks/useTitle";
import { fromNow, formatTime } from "@/common/kit/functions/moments";
import ArticleModel, { ArticleComment } from "@/common/models/Article";
import Audio from "@/common/models/Audio";
import Layout from "@/teacher/layouts/Layout";
import { StoreContext } from "@/teacher/store";
import {
  Button,
  Input,
  List,
  message,
  Popconfirm,
  Select,
  Skeleton
} from "antd";
import BraftEditor from "braft-editor";
import { observer, useObservable } from "mobx-react-lite";
import React, { FunctionComponent, useContext, useEffect, useRef } from "react";
import { Link, Control } from "react-keeper";
import "./index.scss";

interface Props {
  params: {
    id: string;
  };
}

const Article: FunctionComponent<Props> = ({ params }) => {
  const store = useContext(StoreContext);
  const articles = store.articles;
  const id = params.id === "create" ? 0 : Number.parseInt(params.id);
  const article: ArticleModel | undefined =
    id === 0
      ? ArticleModel.from({
          id,
          courseId: Control.state.courseId,
          title: "",
          content: "",
          createAt: 0,
          status: 0,
          audioId: 0,
          contentType:"html"
        })
      : articles.find(a => a.id === id)!;
  const audios = store.audios;

  const audioId = useObservable({ value: article ? article.audioId : 0 });

  const titleInput = useRef<Input>(null);
  const editor = useRef<BraftEditor>(null);

  useEffect(() => {
    (async () => {
      if (!article) {
        const article = await ArticleModel.fetch(id);
        audioId.value=article.audioId; 
        store.articles.push(article);
      }
    })();
    (async () => {
      if (audios.length === 0) {
        const audios = await Audio.myUploaded();
        store.audios = audios;
      }
    })();
  }, []);

  useEffect(() => {
    if (id !== 0 && article && article.comments.length === 0) {
      article.fetchComments();
    }
  }, [article]);

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
                ref={titleInput}
                style={{ marginBottom: "1em" }}
              />
              <div style={{ width: "100%", marginBottom: "1em" }}>
                请选择此文章的录音文件：<Link to={"/media"}>去上传</Link>
                <Select
                  defaultValue={article.audioId}
                  onChange={id => (audioId.value = id)}
                  style={{ width: "100%" }}
                >
                  <Select.Option key={"0"} title={"无"} value={0}>
                    无
                  </Select.Option>
                  {audios.map(audio => {
                    return (
                      <Select.Option
                        key={audio.id.toString()}
                        title={
                          audio.name +
                          " / " +
                          audio.recorder +
                          " / " +
                          formatTime(audio.uploadAt)
                        }
                        value={audio.id}
                      >
                        {audio.name +
                          " / " +
                          audio.recorder +
                          " / " +
                          formatTime(audio.uploadAt)}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
              <RichEditor
                defaultValue={BraftEditor.createEditorState(article.content)}
                style={{ marginBottom: "1em", height: "auto" }}
                editorRef={editor}
              />
              <Button
                type="primary"
                onClick={async () => {
                  article.title = titleInput.current!.input.value;
                  article.content = editor.current!.getValue().toHTML();
                  article.audioId = audioId.value;
                  if (article.id === 0) {
                    try {
                      await ArticleModel.create(
                        article.title,
                        article.content,
                        article.courseId,
                        article.audioId
                      );
                      Control.go(`/course/detail/${Control.state.courseId}`);
                    } catch (err) {
                      message.error(err);
                    }
                  } else {
                    try {
                      await article.update();
                      message.success("更新成功");
                    } catch (err) {
                      message.error(err);
                    }
                  }
                }}
              >
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
                    buttonProps={{
                      children: "评论",
                      type: "primary",
                      disabled: id === 0
                    }}
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
