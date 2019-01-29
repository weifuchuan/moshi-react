import Panel from "@/common/components/Panel";
import useTitle from "@/common/hooks/useTitle";
import CourseModel from "@/common/models/Course";
import Layout from "@/teacher/layouts/Layout";
import { StoreContext } from "@/teacher/store";
import { Button } from "antd";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useContext, useEffect } from "react";
import { Control } from "react-keeper";
import CourseItem from "./CourseItem";
import "./index.scss";

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
                courses.findIndex(course =>
                  CourseModel.STATUS.isInit(course)
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
