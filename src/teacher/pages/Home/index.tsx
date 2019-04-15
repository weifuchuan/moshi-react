import Panel from "@/common/components/Panel";
import useTitle from "@/common/hooks/useTitle";
import { IAccount } from "@/common/models/Account";
import { ICourse } from "@/common/models/Course";
import Layout from "@/teacher/layouts/Layout";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent } from "react";
import { Control } from "react-keeper";
import "./index.less";

const Home: FunctionComponent = () => {
  useTitle("默识 - 作者端");

  return (
    <Layout>
      <div className="Home">
        <div>
          <Panel className={"box"} onClick={() => Control.go("/course")}>
            <div>我的课程</div>
          </Panel>
          <Panel className={"box"} onClick={() => Control.go("/media")}>
            <div>我的媒体资源</div>
          </Panel>
        </div>
      </div>
    </Layout>
  );
};

export default observer(Home);
