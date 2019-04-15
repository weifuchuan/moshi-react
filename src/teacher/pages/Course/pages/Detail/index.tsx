import IssueList from "@/common/components/IssueList";
import Panel from "@/common/components/Panel";
import RichEditor from "@/common/components/RichEditor";
import { formatTime } from "@/common/kit/functions/moments";
import Article, { IArticle } from "@/common/models/Article";
import Course from "@/common/models/Course";
import { StoreContext } from "@/teacher/store";
import {
  Button,
  List,
  message,
  Popconfirm,
  Skeleton,
  Tabs,
  Collapse
} from "antd";
import BraftEditor from "braft-editor";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, Control } from "react-keeper";
import "./index.less";

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
  const sections = store.sections; 

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
  } else if (Course.STATUS.isLock(course)) {
    status = (
      <span style={{ backgroundColor: "red", color: "white" }}>已锁定</span>
    );
  } else if (Course.STATUS.isInit(course)) {
    status = (
      <span style={{ backgroundColor: "goldenrod", color: "white" }}>
        审核中
      </span>
    );
  } else if (Course.STATUS.isPublish(course)) {
    // status = (
    //   <span style={{ backgroundColor: "darkorchid", color: "white" }}>
    //     已发布
    //   </span>
    // );
  } else if (Course.STATUS.isPassed(course)) {
    // status = (
    //   <span style={{ backgroundColor: "green", color: "white" }}>已通过</span>
    // );
  }

  return (
    <Panel className={"Detail"}>
      {status}
      {course ? (
        <Tabs defaultActiveKey="1" onChange={key => {}} style={{ flex: 1 }}>
          {course.courseType === Course.TYPE.COLUMN ? (
            <TabPane tab="文章" key="1">
              <List
                className={"TabPanelInner"}
                header={
                  <Button
                    onClick={() =>
                      Control.go("/article/create", { courseId: course.id })
                    }
                  >
                    新增文章
                  </Button>
                }
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
          ) : (
            <TabPane tab="视频" key="1">
              <Collapse bordered={false} defaultActiveKey={["1"]}>
                <Collapse.Panel header="This is panel header 1" key="1">
                  ss
                </Collapse.Panel>
                <Collapse.Panel header="This is panel header 2" key="2">
                  aaaaaaaaa
                </Collapse.Panel>
                <Collapse.Panel header="This is panel header 3" key="3">
                  xxxxxxxxxxxxxxxx
                </Collapse.Panel>
              </Collapse>
            </TabPane>
          )}
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
