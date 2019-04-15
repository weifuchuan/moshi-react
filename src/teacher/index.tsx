import * as ReactDOM from "react-dom";
import * as React from "react";
import App from "./App";
import "./index.less";
import store, { StoreContext } from "./store";
import EventEmitter from 'wolfy87-eventemitter';

(window as any).bus = new EventEmitter();

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById("root")
);
