import {
  buildActivatedFilter,
  buildLockFilter,
  buildLoggedFilter,
  buildRoleFilter,
  buildUnactivatedFilter,
  buildUnlockFilter,
  buildUnloggedFilter
} from "@/common/kit/filters";
import Account, {
  IAccount,
  AccountStatus,
  AccountAPI
} from "@/common/models/Account";
import { message } from "antd";
import * as React from "react";
import { Control, HashRouter, Route } from "react-keeper";
import "./App.scss";
import LoadingRoute from "@/common/components/LoadingRoute";
import { CourseStatus, ICourse } from "@/common/models/Course";
import store from "./store";
import { computed } from "mobx";

const Router = HashRouter;

class App extends React.Component<{}> {
  probingStatus: "start" | "doing" | "end" = "start";
  @computed get logged() {
    return !!store.me;
  }

  render() {
    return (
      <Router>
        <div className={"container"}>
          <LoadingRoute
            path={"/>"}
            imported={import("./pages/Home")}
            enterFilter={[
              /* 已登录，已激活，未锁定，是课程作者 */
              this.loggedFilter,
              this.activatedFilter,
              this.unlockFilter,
              this.isTeacherFilter
            ]}
          />
          <LoadingRoute
            path={"/course"}
            imported={import("./pages/Course")}
            enterFilter={[
              /* 已登录，已激活，未锁定，是课程作者 */
              this.loggedFilter,
              this.activatedFilter,
              this.unlockFilter,
              this.isTeacherFilter
            ]}
          >
            <LoadingRoute
              path={"/apply"}
              imported={import("./pages/Course/pages/ApplyCourse")}
              enterFilter={[
                cb => {
                  const { courses } = store;
                  if (
                    courses.length !== 0 &&
                    courses.findIndex(
                      (course: ICourse) =>
                        course.status === CourseStatus.STATUS_INIT
                    ) !== -1
                  ) {
                    message.warn("您尚有申请未通过的课程");
                    Control.go("/course");
                  }
                  cb();
                }
              ]}
            />
            <LoadingRoute
              path={"/detail/:id"}
              imported={import("./pages/Course/pages/Detail")}
            />
            <LoadingRoute
              path={"/edit-intro/:id"}
              imported={import("./pages/Course/pages/EditIntro")}
            />
          </LoadingRoute>
          <LoadingRoute
            path={"/article/:id>"}
            imported={import("./pages/Article")}
            enterFilter={[
              /* 已登录，已激活，未锁定，是课程作者 */
              this.loggedFilter,
              this.activatedFilter,
              this.unlockFilter,
              this.isTeacherFilter
            ]}
          />
          <LoadingRoute
            path={"/issue/:id>"}
            imported={import("./pages/Issue")}
            enterFilter={[
              /* 已登录，已激活，未锁定，是课程作者 */
              this.loggedFilter,
              this.activatedFilter,
              this.unlockFilter,
              this.isTeacherFilter
            ]}
          />
          <LoadingRoute
            path={"/login>"}
            imported={import("./pages/Login")}
            enterFilter={[this.unloggedFilter]}
          />
          <LoadingRoute
            path={"/reg>"}
            imported={import("./pages/Reg")}
            enterFilter={[this.unloggedFilter]}
          />
          <LoadingRoute
            path={"/activate>"}
            imported={import("./pages/Activate")}
            enterFilter={[
              this.loggedFilter,
              this.unactivatedFilter,
              this.unlockFilter
            ]}
          />
          <LoadingRoute
            path={"/apply>"}
            imported={import("./pages/Apply")}
            enterFilter={[
              this.loggedFilter,
              this.activatedFilter,
              this.unlockFilter,
              this.isNotTeacherFilter
            ]}
          />
          <Route miss component={() => <h1>404</h1>} />
        </div>
      </Router>
    );
  }

  private loggedFilter = buildLoggedFilter(this);

  private unloggedFilter = buildUnloggedFilter(this);

  private lockFilter = buildLockFilter({ props: store });

  private unlockFilter = buildUnlockFilter({ props: store });

  private activatedFilter = buildActivatedFilter({ props: store });

  private unactivatedFilter = buildUnactivatedFilter({ props: store });

  private isTeacherFilter = buildRoleFilter(
    { props: store },
    AccountStatus.isTeacher,
    () => {
      message.error("无教师权限");
      Control.go("/apply");
    }
  );

  private isNotTeacherFilter = buildRoleFilter(
    { props: store },
    account => !AccountStatus.isTeacher(account),
    () => {
      message.info("已有教师权限");
      Control.go("/");
    }
  );

  componentDidMount() {
    document
      .getElementById("preloading")!
      .parentElement!.removeChild(document.getElementById("preloading")!);
    (async () => {
      if (this.probingStatus === "start") {
        this.probingStatus = "doing";
        try {
          const account = await Account.probeLoggedAccount();
          store.me = account;
        } catch (err) {}
        this.probingStatus = "end";
      }
    })();
  }
}

export default App;
