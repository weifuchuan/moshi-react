import * as ReactDOM from "react-dom";
import * as React from "react";
import App from "./App";
import store from "./store";
import "./index.less";
import { StoreContext } from "./store/index";
import EventEmitter from 'wolfy87-eventemitter';
import { Im } from "@/common/kit/im";

new Im();

(window as any).bus = new EventEmitter();

ReactDOM.render(
  (
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  ) as any,
  document.getElementById("root")
);

if(__DEV__){
  (window as any).mobx = require("mobx"); 
}