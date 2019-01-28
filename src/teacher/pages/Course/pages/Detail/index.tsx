import Panel from "@/common/components/Panel";
import { formatTime } from "@/common/kit/functions";
import { IAccount } from "@/common/models/Account";
import Article, { IArticle } from "@/common/models/Article";
import Course, { ICourse, CourseStatus } from "@/common/models/Course";
import { Button, List, Skeleton, Tabs, Popconfirm, message } from "antd";
import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, Control } from "react-keeper";
import "./index.scss";
import RichEditor from "@/common/components/RichEditor";
import BraftEditor from "braft-editor";
import IssueList from "@/common/components/IssueList";
import { IIssue } from "@/common/models/Issue";
import useTitle from "@/common/hooks/useTitle";
import { StoreContext } from "@/teacher/store";
import { observer } from "mobx-react-lite";

const TabPane = Tabs.TabPane;

interface Props {
  params: {
    id: string;
  };
}

function Detail({ params }: Props) {
  const store = useContext(StoreContext);
  const courses = store.courses;
  const id = Number.parseInt(params.id.trim());
  const course = courses.find(c => c.id === id)!; // TODO: handle course not exists
  const issues = store.issues;
  const articles = store.articles;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (course) {
      course.detailed().then(({ issues, articles }) => {
        store.issues = issues;
        store.articles = articles;
        setLoading(false);
      });
    }
  }, [course]);

  const [introEditing, setIntroEditing] = useState(false);

  const introEditor = useRef<BraftEditor>(null);

  if (loading) {
    return (
      <Panel className={"Detail"}>
        <Skeleton active />
      </Panel>
    );
  }

  let status = null;
  if (!course) {
    status = "课程不存在";
  } else if (CourseStatus.isLock(course)) {
    status = (
      <span style={{ backgroundColor: "red", color: "white" }}>已锁定</span>
    );
  } else if (CourseStatus.isInit(course)) {
    status = (
      <span style={{ backgroundColor: "goldenrod", color: "white" }}>
        审核中
      </span>
    );
  } else if (CourseStatus.isPublish(course)) {
    // status = (
    //   <span style={{ backgroundColor: "darkorchid", color: "white" }}>
    //     已发布
    //   </span>
    // );
  } else if (CourseStatus.isPassed(course)) {
    // status = (
    //   <span style={{ backgroundColor: "green", color: "white" }}>已通过</span>
    // );
  }

  return (
    <Panel className={"Detail"}>
      {status}
      {course ? (
        <Tabs defaultActiveKey="1" onChange={key => {}} style={{ flex: 1 }}>
          <TabPane tab="文章" key="1">
            <List
              className={"TabPanelInner"}
              header={<Button>新增课程</Button>}
              itemLayout={"vertical"}
              dataSource={articles.filter(
                article => article.courseId === course!.id
              )}
              renderItem={(article: IArticle) => {
                return (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Link to={`/article/${article.id}`}>
                          {article.title}
                        </Link>
                      }
                      description={`状态：${
                        article.status === Article.STATUS.INIT
                          ? "编辑中"
                          : article.status === Article.STATUS.PUBLISH
                          ? "已发布"
                          : "已锁定"
                      }；创建于：${formatTime(article.createAt)}${
                        article.status === Article.STATUS.PUBLISH
                          ? `；发布于：${formatTime(article.publishAt!)}`
                          : ""
                      }`}
                    />
                  </List.Item>
                );
              }}
            />
          </TabPane>
          <TabPane tab="简介" key="2">
            <Popconfirm
              placement="bottomRight"
              title={introEditing ? "确定保存修改么？" : "建议使用全屏模式编辑"}
              onConfirm={async () => {
                if (introEditing) {
                  try {
                    await course.update({
                      introduce: introEditor.current!.getValue().toHTML()
                    });
                  } catch (err) {
                    message.error(err.toString());
                  }
                }
                setIntroEditing(!introEditing);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                shape="circle"
                icon={introEditing ? "save" : "edit"}
                title={introEditing ? "保存" : "编辑"}
                style={{ position: "absolute", top: "0.5em", right: "0.5em" }}
                // onClick={() => {

                // }}
              />
            </Popconfirm>

            <div style={{ overflow: "auto", height: "100%" }}>
              {introEditing ? (
                <RichEditor
                  defaultValue={BraftEditor.createEditorState(
                    course!.introduce
                  )}
                  editorRef={introEditor}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: course!.introduce }} />
              )}
            </div>
          </TabPane>
          <TabPane tab="Issues" key="3">
            <IssueList
              className={"TabPanelInner"}
              issues={issues}
              paginationProps={{}}
              linkTo={issue => `/issue/${issue.id}`}
            />
          </TabPane>
        </Tabs>
      ) : null}
    </Panel>
  );
}

export default observer(Detail);
