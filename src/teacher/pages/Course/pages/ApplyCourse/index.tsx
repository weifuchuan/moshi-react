import React, { useEffect, useMemo, useState, FunctionComponent } from "react";
import "./index.scss";
import Layout from "@/teacher/layouts/Layout";
import useTitle from "@/common/hooks/useTitle";
import { packToClassComponent, markdownToHtml } from "@/common/kit/functions";
import { GET, Ret, select } from "@/common/kit/req";
import { Account } from "@/common/models/account";
import { connect } from "react-redux";
import { State } from "@/teacher/store/state_type";
import { Skeleton, Input, Alert, Button, message, Select } from "antd";
import Panel from "@/common/components/Panel";
import "github-markdown-css/github-markdown.css";
import {
  Application,
  ApplicationStatus,
  ApplicationAPI
} from "@/common/models/application";
import Editor from "for-editor";
import { ApplicationCategory } from "@/common/models/application";
import {
  Course,
  CourseAPI,
  CourseStatus,
  CourseType
} from "@/common/models/course";

const Option = Select.Option;

interface Props {
  me: Account;
}

const ApplyCourse: FunctionComponent<Props> = ({ me }) => {
  useTitle("课程申请 | 默识 - 作者端");
  const [course, setCourse] = useState<Course>({
    accountId: me.id,
    buyerCount: 0,
    name: "", // *
    courseType: CourseType.TYPE_COLUMN, // *
    createAt: 0,
    discountedPrice: 0,
    id: 0,
    introduce: "", // *
    introduceImage: "",
    note: "",
    offerTo: 0,
    price: 0,
    publishAt: 0,
    status: CourseStatus.STATUS_INIT
  });
  const [application, setApplication] = useState<Application>(({
    id: 0,
    accountId: me.id,
    category: 0,
    title: `${me.nickName} 申请创建课程《${course.name}》`,
    content: "",
    createAt: 0,
    status: ApplicationStatus.STATUS_COMMIT
  } as Partial<Application>) as Application);
  const [disabled, setDisabled] = useState(false);
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
    })();
  }, []);

  return (
    <Panel style={{ flex: 1, marginLeft: "0", overflow: "auto" }}>
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
        <Editor
          placeholder={"课程简介"}
          value={course.introduce}
          onChange={value => setCourse({ ...course, introduce: value })}
          onSave={value => setCourse({ ...course, introduce: value })}
          height="400px"
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
        <Editor
          value={application.content}
          onChange={value => setApplication({ ...application, content: value })}
          onSave={value => setApplication({ ...application, content: value })}
          height="400px"
          style={{ marginBottom: "1em" }}
        />
        <Button
          onClick={async () => {
            const ret = await CourseAPI.create(
              course.name,
              course.introduce,
              course.courseType,
              application.title,
              application.content
            );
            if (ret.state === "ok") {
              message.success("提交成功");
              setDisabled(true);
            } else {
              message.error(ret.msg);
            }
          }}
          type={"primary"}
          disabled={disabled}
        >
          {application.id === 0 ? "提交" : "提交修改"}
        </Button>
      </div>
    </Panel>
  );
};

export default connect((state: State) => ({ me: state.me! }))(ApplyCourse);
