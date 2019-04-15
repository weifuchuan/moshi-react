import React from "react"; 
import { Store } from "@/learner/store";
import { observable } from "mobx";
import "./index.less";
import RegPanel from "@/common/components/RegPanel";
import LoginPanel from "@/common/components/LoginPanel";

interface Props {
  store: Store;
}
 
export default class Home extends React.Component<Props> {
  @observable loading = false;

  render() {
    return (
      <div className="HomeContainer">
       
      </div>
    );
  }
}
