import React from "react";
import { observer, inject } from "mobx-react";
import { Store } from "@/learner/store";
import { observable } from "mobx";
import "./index.scss";
import RegPanel from "@/common/components/RegPanel";
import LoginPanel from "@/common/components/LoginPanel";

interface Props {
  store: Store;
}

@inject("store")
@observer
export default class Home extends React.Component<Props> {
  @observable loading = false;

  render() {
    return (
      <div className="HomeContainer">
        <LoginPanel
          getCaptcha={() => Promise.resolve("https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg")}
          onLogin={() => {}}
          toReg={() => {}}
        />
      </div>
    );
  }
}
