import Panel from "@/common/components/Panel";
import useTitle from "@/common/hooks/useTitle";
import { IAccount } from "@/common/models/Account";
import CourseModel, { CourseStatus } from "@/common/models/Course";
import Layout from "@/teacher/layouts/Layout";
import { Button } from "antd";
import React, { FunctionComponent, useEffect, useContext } from "react";
import { Control } from "react-keeper";
import CourseItem from "./CourseItem";
import "./index.scss";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/teacher/store";

interface Props {}

const Course: FunctionComponent<Props> = ({ children }) => {
  useTitle("课程管理 | 默识 - 作者端");

  const store = useContext(StoreContext);

  const courses = store.courses;

  useEffect(() => {
    (async () => {
      store.courses = await CourseModel.myCourses();
    })();
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

export default observer(Course);
