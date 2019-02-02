import Panel from "@/common/components/Panel";
import RichEditor from "@/common/components/RichEditor";
import useTitle from "@/common/hooks/useTitle";
import { select } from "@/common/kit/req";
import { ApplicationStatus, IApplication } from "@/common/models/Application";
import Course, { ICourse } from "@/common/models/Course";
import { StoreContext } from "@/teacher/store";
import { Button, Input, message, Select } from "antd";
import BraftEditor from "braft-editor";
import "github-markdown-css/github-markdown.css";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { Control } from "react-keeper";
import "./index.scss";

const Option = Select.Option;

interface Props {}

const ApplyCourse: FunctionComponent<Props> = ({}) => {
  useTitle("课程申请 | 默识 - 作者端");
  const store = useContext(StoreContext);
  const me = store.me!;
  const [course, setCourse] = useState<ICourse>({
    accountId: me.id,
    buyerCount: 0,
    name: "", // *
    courseType: Course.TYPE.COLUMN, // *
    createAt: 0,
    discountedPrice: 0,
    id: 0,
    introduce: "", // *
    introduceImage: "",
    note: "",
    offerTo: 0,
    price: 0,
    publishAt: 0,
    status: Course.STATUS.INIT
  });
  const [application, setApplication] = useState<IApplication>(({
    id: 0,
    accountId: me.id,
    category: 0,
    title: `${me.nickName} 申请创建课程《${course.name}》`,
    content: "",
    createAt: 0,
    status: ApplicationStatus.STATUS_COMMIT
  } as Partial<IApplication>) as IApplication);
  const [introduce, setIntroduce] = useState(
    BraftEditor.createEditorState(null)
  );
  const [content, setContent] = useState(BraftEditor.createEditorState(null));
  const [disabled, setDisabled] = useState(false);
  const [commiting, setCommiting] = useState(false);
  useEffect(() => {
    (async () => {
      const items = await select<{ key: string; value: string }>(
        "/select",
        "select `key`, `value` from preset_text_l where `key` = ? ",
        "course/application/template"
      );
      const template = items.find(
        item => item.key === "course/application/template"
      )!.value;
      setApplication({ ...application, content: template });
      setContent(BraftEditor.createEditorState(template));
    })();
  }, []);

  return (
    <Panel
      style={{
        flex: 1,
        marginLeft: "0",
        overflowY: "auto",
        overflowX: "hidden"
      }}
    >
      <div>
        <Input
          value={course.name}
          onInput={(e: any) => {
            setCourse({ ...course, name: e.target.value });
            setApplication({
              ...application,
              title: `${me.nickName} 申请创建课程《${e.target.value}》`
            });
          }}
          placeholder={"课程名称"}
          style={{ marginBottom: "1em" }}
        />
        <Select
          value={course.courseType}
          style={{ width: "100%", marginBottom: "1em" }}
          onChange={value => {
            setCourse({ ...course, courseType: value });
          }}
        >
          <Option value={1}>专栏课程</Option>
          <Option value={2}>视频课程</Option>
        </Select>
        <RichEditor
          placeholder={"课程简介"}
          value={introduce}
          onChange={x => setIntroduce(x)}
          style={{ marginBottom: "1em" }}
        />
        <Input
          value={application.title}
          onInput={(e: any) =>
            setApplication({ ...application, title: e.target.value })
          }
          disabled
          style={{ marginBottom: "1em" }}
        />
        <RichEditor
          value={content}
          onChange={x => setContent(x)}
          style={{ marginBottom: "1em" }}
        />
        <Button
          onClick={async () => {
            setCommiting(false);
            course.introduce = introduce.toHTML();
            application.content = content.toHTML();
            try {
              const course2 = await Course.create(
                course.name,
                course.introduce,
                course.courseType,
                application.title,
                application.content
              );
              message.success("提交成功");
              setDisabled(true);
              store.courses.push(Course.from(course2));
              Control.go(`/course/detail/${course2.id}`);
            } catch (err) {
              message.error(err);
            }
          }}
          loading={commiting}
          type={"primary"}
          disabled={disabled}
        >
          {application.id === 0 ? "提交" : "提交修改"}
        </Button>
      </div>
    </Panel>
  );
};

export default observer(ApplyCourse);
