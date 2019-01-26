import React from "react";
import { Course } from "@/common/models/course";
import "./CourseItem.scss";
import { CourseStatus } from "@/common/models/course";

interface Props {
  course: Course;
  onClick: () => void;
}

export default function CourseItem({ course, onClick }: Props) {
  let status = null;
  if (CourseStatus.isLock(course)) {
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
    <div className={"CourseItem"} onClick={onClick}>
      {status}
      <span style={{ marginLeft: "1em" }}>{course.name}</span>
    </div>
  );
}
