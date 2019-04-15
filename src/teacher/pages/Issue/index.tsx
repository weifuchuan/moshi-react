import useTitle from "@/common/hooks/useTitle";
import { IAccount } from "@/common/models/Account";
import Layout from "@/teacher/layouts/Layout";
import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext
} from "react";
import "./index.less";
import { ICourse } from "@/common/models/Course";
import Panel from "@/common/components/Panel";
import { Tree, Button, Skeleton } from "antd";
import { Control } from "react-keeper";
import { IIssue, IIssueComment, IssueComment } from "@/common/models/Issue";
import IssuePanel from "@/common/components/IssuePanel";
import { select } from "@/common/kit/req";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/teacher/store";
import IssueModel from "@/common/models/Issue";

const { TreeNode } = Tree;

interface Props {
  params: { id: string };
}

const Issue: FunctionComponent<Props> = ({ params, children }) => {
  useTitle("IIssue | 默识 - 作者端");

  const store = useContext(StoreContext);

  const me = store.me!;
  const issues = store.issues;

  const id = Number.parseInt(params.id);
  const issue = issues.find(issue => issue.id === id)!;

  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    (async () => {
      if (!issue) {
        const issue = await IssueModel.fetchIssue(id);
        store.issues.push(issue);
        setTotalCount(await issue.getTotalCommentCount())
      } else if (issue.comments.length === 0) {
        issue.getPage(1);
        setTotalCount(await issue.getTotalCommentCount());
      }
    })();
  }, []);

  if (!issue) {
    return <Skeleton active />;
  }

  return (
    <Layout>
      <div className="Issue">
        <div>
          <IssuePanel
            me={me}
            issue={issue}
            comments={issue.comments.slice()}
            onClickNewIssue={() => {}}
            onClickAccount={account => {}}
            totalCount={totalCount}
            onComment={async content => {
              await issue.comment(content, me);
            }}
            onChangePage={pageNumber => {
              issue.getPage(pageNumber);
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default observer(Issue);
