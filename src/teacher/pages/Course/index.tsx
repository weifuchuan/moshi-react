import useTitle from "@/common/hooks/useTitle";
import { Account } from "@/common/models/account";
import Layout from "@/teacher/layouts/Layout";
import { State } from "@/teacher/store/state_type";
import React, { FunctionComponent, useEffect } from "react";
import { connect } from "react-redux";
import "./index.scss";
import { Course, CourseAPI, CourseStatus } from "@/common/models/course";
import Panel from "@/common/components/Panel";
import { Tree, Button } from "antd";
import { AntTreeNode } from "antd/lib/tree";
import { Control } from "react-keeper";
import { setCourses } from "@/teacher/store/courses/actions";
import CourseItem from "./CourseItem";
import { course } from "../../../common/models/db";

const { TreeNode } = Tree;

interface Props {
  me: Account;
  courses: Course[];
  setCourses: typeof setCourses;
}

const Course: FunctionComponent<Props> = ({
  me,
  courses,
  children,
  setCourses
}) => {
  useTitle("课程管理 | 默识 - 作者端");

  useEffect(() => {
    (async () => {
      const courses1 = await CourseAPI.myCourses();
      setCourses(courses1);
    })();
  }, []);

  return (
    <Layout>
      <div className="Course">
        <div>
          <Panel style={{overflow:"auto"}} >
            <Button
              type="primary"
              onClick={() => {
                Control.go("/course/apply");
              }}
              disabled={
                courses.length !== 0 &&
                courses.findIndex(
                  course => course.status === CourseStatus.STATUS_INIT
                ) !== -1
              }
            >
              申请添加课程
            </Button>
            {courses.map(course => {
              return (
                <CourseItem
                  key={course.id.toString()}
                  course={course}
                  onClick={() => Control.go(`/course/detail/${course.id}`)}
                />
              );
            })}
          </Panel>
          {children}
        </div>
      </div>
    </Layout>
  );
};

export default connect(
  (state: State) => ({
    me: state.me!,
    courses: state.courses
  }),
  {
    setCourses
  }
)(Course);
