import Panel from "@/common/components/Panel";
import { formatTime } from "@/common/kit/functions";
import { Account } from "@/common/models/account";
import { Article, ArticleStatus } from "@/common/models/article";
import { Course, CourseStatus } from "@/common/models/course";
import { State } from "@/teacher/store/state_type";
import { Button, List, Skeleton, Tabs, Popconfirm, message } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { Link, Control } from "react-keeper";
import { connect } from "react-redux";
import {
  fetchCourseDetail,
  updateCourse
} from "@/teacher/store/courses/actions";
import "./index.scss";
import RichEditor from "@/common/components/RichEditor";
import BraftEditor from "braft-editor";
import IssueList from "@/common/components/IssueList";
import issues from "../../../../store/issues/reducers";
import { Issue } from "@/common/models/issue";

const TabPane = Tabs.TabPane;

interface Props {
  params: {
    id: string;
  };
  courses: Course[];
  me: Account;
  articles: Article[];
  issues: Issue[];
  fetchCourseDetail: typeof fetchCourseDetail;
  updateCourse: typeof updateCourse;
}

function Detail({
  params,
  courses,
  issues,
  me,
  articles,
  fetchCourseDetail,
  updateCourse
}: Props) {
  const id = Number.parseInt(params.id.trim());
  const course = courses.find(c => c.id === id)!; // TODO: handle course not exists
  issues = issues.filter(issue => issue.courseId === course.id);
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (course) {
      fetchCourseDetail(course.id, () => {
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
              renderItem={(article: Article) => {
                return (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Link to={`/article/${article.id}`}>
                          {article.title}
                        </Link>
                      }
                      description={`状态：${
                        article.status === ArticleStatus.STATUS_INIT
                          ? "编辑中"
                          : article.status === ArticleStatus.STATUS_PUBLISH
                          ? "已发布"
                          : "已锁定"
                      }；创建于：${formatTime(article.createAt)}${
                        article.status === ArticleStatus.STATUS_PUBLISH
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
              onConfirm={() => {
                if (introEditing) {
                  updateCourse(
                    course.id,
                    {
                      introduce: introEditor.current!.getValue().toHTML()
                    },
                    () => {},
                    (msg: string) => {
                      message.error(msg);
                    }
                  );
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
              paginationProps={{
              }}
              linkTo={issue => `/issue/${issue.id}`}
            />
          </TabPane>
        </Tabs>
      ) : null}
    </Panel>
  );
}

export default connect(
  (state: State) => ({
    courses: state.courses,
    me: state.me!,
    articles: state.articles,
    issues: state.issues
  }),
  { fetchCourseDetail, updateCourse }
)(Detail);
