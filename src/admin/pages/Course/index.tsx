import React, { FunctionComponent, useContext } from "react";
import "./index.less";  

const Course: FunctionComponent = ({ children }) => {
  return (
    <div className={"Course"}>
      course{children}
    </div>
  );
};

export default (Course);
