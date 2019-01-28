import React, { useState } from "react";
import "./index.scss";
import { Issue, IssueStatus } from "@/common/models/issue";
import { List, Button, Avatar } from "antd";
import { PaginationProps } from "antd/lib/pagination";
import { Link, Control } from "react-keeper";
import { fromNow } from "@/common/kit/functions";

interface Props {
  issues: Issue[];
  paginationProps: PaginationProps;
  linkTo: (issue: Issue) => string;
  className?: string;
}

export default function IssueList({
  issues,
  paginationProps,
  linkTo,
  className
}: Props) {
  const [status, setStatus] = useState(IssueStatus.STATUS_OPEN);

  return (
    <List
      className={className}
      bordered={true}
      header={
        <div>
          <Button
            type={status === IssueStatus.STATUS_OPEN ? "primary" : "default"}
            onClick={() => setStatus(IssueStatus.STATUS_OPEN)}
          >
            {
              issues.filter(issue => issue.status === IssueStatus.STATUS_OPEN)
                .length
            }{" "}
            Open
          </Button>
          <Button
            style={{ marginLeft: "1em" }}
            type={status === IssueStatus.STATUS_CLOSE ? "primary" : "default"}
            onClick={() => setStatus(IssueStatus.STATUS_CLOSE)}
          >
            {
              issues.filter(issue => issue.status === IssueStatus.STATUS_CLOSE)
                .length
            }{" "}
            Close
          </Button>
        </div>
      }
      dataSource={issues.filter(issue => issue.status === status)}
      renderItem={(issue: Issue) => {
        return (
          <List.Item
            actions={
              issue.commentCount > 1
                ? [
                    <Button
                      icon={"message"}
                      size="small"
                      onClick={() => Control.go(linkTo(issue))}
                    >
                      {issue.commentCount}
                    </Button>
                  ]
                : []
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={
                    issue.status === IssueStatus.STATUS_OPEN
                      ? "exclamation-circle"
                      : "issues-close"
                  }
                  style={{
                    color:
                      issue.status === IssueStatus.STATUS_OPEN
                        ? "#2cbe4e"
                        : "#cb2431",
                    backgroundColor: "#fff"
                  }}
                />
              }
              title={<Link to={linkTo(issue)}>{issue.title}</Link>}
              description={
                issue.status === IssueStatus.STATUS_OPEN ? (
                  <React.Fragment>
                    <span>#{issue.id} 由 </span>
                    <Link to={``}>{issue.nickName}</Link>
                    <span> 创建于 {fromNow(issue.openAt)}</span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span>#{issue.id} 由 </span>
                    <Link to={``}>{issue.nickName}</Link>
                    <span> 关闭于 {fromNow(issue.closeAt!)}</span>
                  </React.Fragment>
                )
              }
            />
          </List.Item>
        );
      }}
      pagination={paginationProps}
    />
  );
}
