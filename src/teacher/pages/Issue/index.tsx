import useTitle from "@/common/hooks/useTitle";
import { Account } from "@/common/models/account";
import Layout from "@/teacher/layouts/Layout";
import { State } from "@/teacher/store/state_type";
import React, { FunctionComponent, useEffect, useState } from "react";
import { connect } from "react-redux";
import "./index.scss";
import { Course } from "@/common/models/course";
import Panel from "@/common/components/Panel";
import { Tree, Button, Skeleton } from "antd";
import { Control } from "react-keeper";
import { Issue, IssueComment } from "@/common/models/issue";
import IssuePanel from "@/common/components/IssuePanel";
import { enterIssuePage } from "@/teacher/store/issues/actions";
import { select } from "@/common/kit/req";
import {
  commentIssue,
  issueCommentPage
} from "@/teacher/store/issueComments/actions";

const { TreeNode } = Tree;

interface Props {
  params: { id: string };
  me: Account;
  courses: Course[];
  issues: Issue[];
  issueComments: IssueComment[];
  enterIssuePage: typeof enterIssuePage;
  commentIssue: typeof commentIssue;
  issueCommentPage: typeof issueCommentPage;
}

const Issue: FunctionComponent<Props> = ({
  params,
  me,
  courses,
  issues,
  issueComments,
  children,
  enterIssuePage,
  commentIssue,
  issueCommentPage
}) => {
  useTitle("Issue | 默识 - 作者端");

  const id = Number.parseInt(params.id);
  const issue = issues.find(issue => issue.id === id)!;

  const [totalCount, setTotalCount] = useState(0);

  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    enterIssuePage(id);

    (async () => {
      const [{ count }] = await select<{ count: number }>(
        "/select",
        "select count(*) count from issue_comment_l where issueId = ?",
        id
      );
      setTotalCount(count);
    })();
  }, []);

  if (!issue) {
    return <Skeleton active />;
  }

  const comments = issueComments
    .filter(c => (c.issueId = issue.id))
    .sort((a, b) => {
      if (a.createAt < b.createAt) {
        return -1;
      } else if (a.createAt === b.createAt) {
        return 0;
      } else {
        return 1;
      }
    })
    .slice((pageNumber - 1) * 10, pageNumber * 10);

  return (
    <Layout>
      <div className="Issue">
        <div>
          <IssuePanel
            me={me}
            issue={issue}
            comments={comments}
            onClickNewIssue={() => {}}
            onClickAccount={account => {}}
            totalCount={totalCount}
            onComment={content => {
              commentIssue(issue.id, content);
            }}
            onChangePage={pageNumber => {
              if (pageNumber * 10 < comments.length) {
                setPageNumber(pageNumber);
              } else {
                issueCommentPage(issue.id, pageNumber, () =>
                  setPageNumber(pageNumber)
                );
              }
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default connect(
  (state: State) => ({
    me: state.me!,
    courses: state.courses,
    issues: state.issues,
    issueComments: state.issueComments
  }),
  {
    enterIssuePage,
    commentIssue,
    issueCommentPage
  }
)(Issue);
