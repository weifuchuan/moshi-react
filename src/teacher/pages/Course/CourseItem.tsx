import Course, { ICourse } from "@/common/models/Course";
import React from "react";
import "./CourseItem.less";

interface Props {
  course: ICourse;
  onClick: () => void;
}

export default function CourseItem({ course, onClick }: Props) {
  let status = null;
  if (Course.STATUS.isLock(course)) {
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
    status = (
      <span style={{ backgroundColor: "darkorchid", color: "white" }}>
        已发布
      </span>
    );
  } else if (Course.STATUS.isPassed(course)) {
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
