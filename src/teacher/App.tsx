import {
  buildActivatedFilter,
  buildLockFilter,
  buildLoggedFilter,
  buildRoleFilter,
  buildUnactivatedFilter,
  buildUnlockFilter,
  buildUnloggedFilter
} from '@/common/kit/filters';
import { Account, AccountStatus, AccountAPI } from '@/common/models/account';
import { message } from 'antd';
import * as React from 'react';
import { Control, HashRouter, Route } from 'react-keeper';
import { connect } from 'react-redux';
import './App.scss';
import { setMe } from './store/me/actions';
import { State } from './store/state_type';

const Router = HashRouter;

class App extends React.Component<{
  logged: boolean;
  setMe: (account: Account) => void;
  me: Account | null;
}> {
  probingStatus: 'start' | 'doing' | 'end' = 'start';

  render() {
    return (
      <Router>
        <div className={'container'}>
          <Route
            path={'/>'}
            loadComponent={(cb) =>
              import('./pages/Home').then((C) => cb(C.default))}
            enterFilter={[
              /* 已登录，已激活，未锁定，是课程作者 */
              this.loggedFilter,
              this.activatedFilter,
              this.unlockFilter,
              this.isTeacherFilter
            ]}
          />
          <Route
            path={'/course'}
            loadComponent={(cb) =>
              import('./pages/Course').then((C) => cb(C.default))}
            enterFilter={[
              /* 已登录，已激活，未锁定，是课程作者 */
              this.loggedFilter,
              this.activatedFilter,
              this.unlockFilter,
              this.isTeacherFilter
            ]}
          >
            <Route
              path={'/apply'}
              loadComponent={(cb) =>
                import('./pages/Course/pages/ApplyCourse').then((C) =>
                  cb(C.default)
                )}
            />
          </Route>
          <Route
            path={'/login>'}
            loadComponent={(cb) =>
              import('./pages/Login').then((C) => cb(C.default))}
            enterFilter={[ this.unloggedFilter ]}
          />
          <Route
            path={'/reg>'}
            loadComponent={(cb) =>
              import('./pages/Reg').then((C) => cb(C.default))}
            enterFilter={[ this.unloggedFilter ]}
          />
          <Route
            path={'/activate>'}
            loadComponent={(cb) =>
              import('./pages/Activate').then((C) => cb(C.default))}
            enterFilter={[
              this.loggedFilter,
              this.unactivatedFilter,
              this.unlockFilter
            ]}
          />
          <Route
            path={'/apply>'}
            loadComponent={(cb) =>
              import('./pages/Apply').then((C) => cb(C.default))}
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
      message.error('无教师权限');
      Control.go('/apply');
    }
  );

  private isNotTeacherFilter = buildRoleFilter(
    this,
    (account) => !AccountStatus.isTeacher(account),
    () => {
      message.info('已有教师权限');
      Control.go('/');
    }
  );

  componentDidMount() {
    document.getElementById('preloading')!.parentElement!.removeChild(
      document.getElementById('preloading')!
    );
    (async () => {
      if (this.probingStatus === 'start') {
        this.probingStatus = 'doing';
        try {
          const account = await AccountAPI.probeLoggedAccount();
          this.props.setMe(account);
        } catch (err) {}
        this.probingStatus = 'end';
      }
    })();
  }
}

const ConnectedApp = connect(
  (state: State) => {
    return {
      logged: !!state.me,
      me: state.me
    };
  },
  { setMe }
)(App);

export default ConnectedApp;
