import React from "react";
import { connect } from "react-redux";
import Panel from "@/common/components/Panel";
import { State } from "@/teacher/store/state_type";
import { Course, CourseStatus } from "@/common/models/course";
import { Account } from "@/common/models/account";
import { Tabs, List, Button } from "antd";
import './index.scss'

const TabPane = Tabs.TabPane;

interface Props {
  params: {
    id: string;
  };
  courses: Course[];
  me: Account;
}

function Detail({ params, courses, me }: Props) {
  const id = Number.parseInt(params.id.trim());
  const course = courses.find(c => c.id === id);
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
    status = (
      <span style={{ backgroundColor: "darkorchid", color: "white" }}>
        已发布
      </span>
    );
  } else if (CourseStatus.isPassed(course)) {
    status = (
      <span style={{ backgroundColor: "green", color: "white" }}>已通过</span>
    );
  }
  return (
    <Panel className={"Detail"}>
      {status}
      <Tabs defaultActiveKey="1" onChange={key => {}} style={{flex:1}} >
        <TabPane tab="文章" key="1">
          <List 
            header={<Button  >新增课程</Button>}
            itemLayout={"vertical"}
            renderItem={()=>null}
          />
        </TabPane>
        <TabPane tab="简介" key="2">
          Content of Tab Pane 2
        </TabPane> 
      </Tabs>
    </Panel>
  );
}

export default connect((state: State) => ({
  courses: state.courses,
  me: state.me!
}))(Detail);
