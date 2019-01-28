import Panel from "@/common/components/Panel";
import useTitle from "@/common/hooks/useTitle";
import { Account } from "@/common/models/account";
import { Course, CourseStatus } from "@/common/models/course";
import Layout from "@/teacher/layouts/Layout";
import { fetchMyCourses } from "@/teacher/store/courses/actions";
import { State } from "@/teacher/store/state_type";
import { Button } from "antd";
import React, { FunctionComponent, useEffect } from "react";
import { Control } from "react-keeper";
import { connect } from "react-redux";
import CourseItem from "./CourseItem";
import "./index.scss";

interface Props {
  me: Account;
  courses: Course[];
  fetchMyCourses: typeof fetchMyCourses;
}

const Course: FunctionComponent<Props> = ({
  me,
  courses,
  children,
  fetchMyCourses
}) => {
  useTitle("课程管理 | 默识 - 作者端");

  useEffect(() => {
    fetchMyCourses(); 
  }, []);

  return (
    <Layout>
      <div className="Course">
        <div>
          <Panel style={{ overflow: "auto" }}>
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
    fetchMyCourses
  }
)(Course);
