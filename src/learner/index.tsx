import * as ReactDOM from "react-dom";
import * as React from "react";
import App from "./App"; 
import store from "./store";
import "./index.less";
import EventEmitter from 'wolfy87-eventemitter';

(window as any).bus = new EventEmitter();

ReactDOM.render(
  ( 
      <App /> 
  ) as any,
  document.getElementById('root')
);
