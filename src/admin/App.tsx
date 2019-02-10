import * as React from "react";
import { HashRouter, Route } from "react-keeper";
import "./App.scss";
import routes from "./router.config";
import { StoreContext } from "./store/index";
import MarkdownEditor from '@/common/components/MarkdownEditor'; 

const Router = HashRouter;

class App extends React.Component {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  render() {
    return (
      <Router>
        <div className={"container"}>
          {routes}
          <Route miss component={() => <div>404</div>} />
          <Route path={"/md"} component={()=><div style={{padding:"5em"}}  ><MarkdownEditor /></div>} ></Route>
        </div>
      </Router>
    );
  }

  componentDidMount() {
    this.context.probeLogin();
    document
      .getElementById("preloading")!
      .parentElement!.removeChild(document.getElementById("preloading")!);
  }
}

export default App;
