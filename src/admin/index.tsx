import * as ReactDOM from "react-dom";
import * as React from "react";
import App from "./App";
import store from "./store";
import "./index.scss";
import { StoreContext } from "./store/index";

ReactDOM.render(
  (
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  ) as any,
  document.getElementById("root")
);
