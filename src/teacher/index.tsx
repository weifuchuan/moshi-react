import * as ReactDOM from "react-dom";
import * as React from "react";
import App from "./App";
import "./index.scss";
import store, { StoreContext } from "./store";

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById("root")
);
