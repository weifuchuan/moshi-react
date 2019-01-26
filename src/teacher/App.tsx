import {
  buildActivatedFilter,
  buildLockFilter,
  buildLoggedFilter,
  buildRoleFilter,
  buildUnactivatedFilter,
  buildUnlockFilter,
  buildUnloggedFilter
} from "@/common/kit/filters";
import { Account, AccountStatus, AccountAPI } from "@/common/models/account";
import { message } from "antd";
import * as React from "react";
import { Control, HashRouter, Route } from "react-keeper";
import { connect } from "react-redux";
import "./App.scss";
import { setMe, probeLogin } from "./store/me/actions";
import { State } from "./store/state_type";
import LoadingRoute from "@/common/components/LoadingRoute";
import { CourseStatus, Course } from "@/common/models/course";

const Router = HashRouter;

class App extends React.Component<{
  logged: boolean;
  probeLogin: typeof probeLogin;
  me: Account | null;
  courses: Course[];
}> {
  probingStatus: "start" | "doing" | "end" = "start";

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
                  const { courses } = this.props;
                  if (
                    courses.length !== 0 &&
                    courses.findIndex(
                      (course: Course) =>
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
          </LoadingRoute>
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

  private lockFilter = buildLockFilter(this);

  private unlockFilter = buildUnlockFilter(this);

  private activatedFilter = buildActivatedFilter(this);

  private unactivatedFilter = buildUnactivatedFilter(this);

  private isTeacherFilter = buildRoleFilter(
    this,
    AccountStatus.isTeacher,
    () => {
      message.error("无教师权限");
      Control.go("/apply");
    }
  );

  private isNotTeacherFilter = buildRoleFilter(
    this,
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
        this.props.probeLogin(() => (this.probingStatus = "end"));
        // try {
        //   const account = await AccountAPI.probeLoggedAccount();
        //   this.props.setMe(account);
        // } catch (err) {}
        // this.probingStatus = "end";
      }
    })();
  }
}

const ConnectedApp = connect(
  (state: State) => {
    return {
      logged: !!state.me,
      me: state.me,
      courses: state.courses
    };
  },
  { probeLogin }
)(App);

export default ConnectedApp;
