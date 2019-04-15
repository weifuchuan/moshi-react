import * as React from "react";
import { HashRouter, Route } from "react-keeper";
import "./App.less";
import { message } from "antd";

const Router = HashRouter;

message.success("ddd");

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className={"container"}>
          <Route
            path={"/>"}
            loadComponent={cb =>
              import("@/learner/pages/Home").then(C => cb(C.default))
            }
          />
        </div>
      </Router>
    );
  }
}

export default App;
