import React, { useRef } from "react";
import "./index.scss";
import { IIssue, IIssueComment } from "@/common/models/Issue";
import { Button, Icon, List } from "antd";
import { fromNow } from "@/common/kit/functions";
import CommentItem from "./CommentItem";
import { IAccount } from "@/common/models/Account";
import { CommentEditor } from "../CommentEditor";
import DefaultAvatar from "../DefaultAvatar";
import ReactDOM from "react-dom";

interface Props {
  me: IAccount;
  issue: IIssue;
  comments: IIssueComment[];
  totalCount: number;
  onClickNewIssue: () => void;
  onClickAccount: (id: number) => void;
  onComment: (content: string) => Promise<void>;
  onChangePage: (pageNumber: number) => void;
}

export default function IssuePanel({
  me,
  issue,
  comments,
  totalCount,
  onClickNewIssue,
  onClickAccount,
  onComment,
  onChangePage
}: Props) {
  const editor = useRef<CommentEditor>(null);

  return (
    <div className={"IssuePanel"}>
      <div className={"Title"}>
        <div>
          <div>
            <span className={"TitleText"}>{issue.title}</span>
          </div>
          <div>
            <Button
              type="primary"
              onClick={onClickNewIssue}
              style={{ backgroundColor: "#28a745" }}
            >
              New Issue
            </Button>
          </div>
        </div>
        <div>
          <span
            style={{ display: "flex", alignItems: "center", color: "#586069" }}
          >
            <div className={"State"}>
              <Icon type="exclamation-circle" />
              Open
            </div>
            <span style={{ marginLeft: "1em" }}>
              {issue.nickName} 打开此issue于 {fromNow(issue.openAt)} ·{" "}
              {comments.length - 1} 条评论
            </span>
          </span>
        </div>
      </div>
      <div className="DiscussionBucket">
        <div className={"Timeline"}>
          <List
            dataSource={comments}
            renderItem={(comment: IIssueComment) => (
              <List.Item>
                <CommentItem
                  comment={comment}
                  onClickAccount={onClickAccount}
                  onQuoteReply={c => {
                    editor.current!.setContent(
                      c.content
                        .split("\n")
                        .map(l => "> " + l)
                        .reduce((prev, curr) => prev + "\n" + curr, "")
                        .slice(1) + "\n\n"
                    );
                    window.scrollTo({ top: window.innerHeight });
                  }}
                  refToNewIssue={c => null}
                />
              </List.Item>
            )}
            {...(totalCount <= 10
              ? {}
              : {
                  pagination: {
                    total: totalCount,
                    pageSize: 10,
                    onChange: onChangePage
                  }
                })}
          />
        </div>
        <div className="Sidebar" />
      </div>
      <div className={"NewComment"}>
        <DefaultAvatar avatar={me.avatar} size={44} />
        <CommentEditor
          ref={editor}
          onComment={async content => {
            await onComment(content);
            editor.current!.setContent("");
          }}
        />
      </div>
    </div>
  );
}
