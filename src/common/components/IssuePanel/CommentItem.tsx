import React, { useState } from "react";
import "./CommentItem.less";
import { IIssueComment } from "@/common/models/Issue";
import DefaultAvatar from "../DefaultAvatar";
import { fromNow } from "@/common/kit/functions/moments";
import MarkdownDiv from "../MarkdownDiv";
import { Popover, Icon } from "antd";

interface Props {
  comment: IIssueComment;
  onClickAccount: (id: number) => void;
  onQuoteReply: (comment: IIssueComment) => void;
  refToNewIssue: (comment: IIssueComment) => void;
}

export default function CommentItem({
  comment,
  onClickAccount,
  onQuoteReply,
  refToNewIssue
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={"CommentItem"}>
      <DefaultAvatar avatar={comment.avatar} size={44} />
      <div>
        <div>
          <div>
            <a onClick={() => onClickAccount(comment.accountId)}>
              {comment.nickName}
            </a>
            <span> 评论于 {fromNow(comment.createAt)}</span>
          </div>
          <div>
            <span> </span>
            <Popover
              trigger="click"
              placement="bottomRight"
              visible={open}
              onVisibleChange={v => setOpen(v)}
              content={
                <div className={"ContentPopover"}>
                  <div onClick={() => (onQuoteReply(comment), setOpen(false))}>
                    引用回复
                  </div>
                  <div onClick={() => (refToNewIssue(comment), setOpen(false))}>
                    引用到新的Issue
                  </div>
                </div>
              }
            >
              <Icon
                type="dash"
                style={{ cursor: "pointer" }}
                onClick={() => setOpen(true)}
              />
            </Popover>
          </div>
        </div>
        <div>
          <MarkdownDiv md={comment.content} />
        </div>
      </div>
    </div>
  );
}
