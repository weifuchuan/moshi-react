import * as React from 'react';
import { HashRouter, Route, Filter, Control } from 'react-keeper';
import './App.scss';
import { probeLoggedAccount } from '@/common/models/account';
import { connect } from 'react-redux';
import { State } from './store/state_type';
import { setMe } from './store/me/actions';
import Account from '@/common/models/account';
import { repeat } from '@/common/kit/funcs';
import NavBar from './components/NavBar';
import qs from 'qs';

const Router = HashRouter;

class App extends React.Component<{
	logged: boolean;
	setMe: (account: Account) => void;
}> {
	probingStatus: 'start' | 'doing' | 'end' = 'start';

	render() {
		return (
			<Router>
				<div className={'container'}>
					<Route
						path={'/>'}
						loadComponent={(cb) => import('./pages/Home').then((C) => cb(C.default))}
						enterFilter={[ this.loggedFilter ]}
					/>
					<Route
						path={'/login>'}
						loadComponent={(cb) => import('./pages/Login').then((C) => cb(C.default))}
						enterFilter={[ this.unloggedFilter ]}
					/>
					<Route
						path={'/reg>'}
						loadComponent={(cb) => import('./pages/Reg').then((C) => cb(C.default))}
						enterFilter={[ this.unloggedFilter ]}
					/>
				</div>
			</Router>
		);
	}

	private loggedFilter: Filter = async (cb, props) => {
		repeat(() => {
			if (this.probingStatus === 'end') {
				if (this.props.logged) {
					cb();
				} else {
					if (Control.path.startsWith('/login')) Control.go('/login');
					else Control.go(`/login?returnUrl=${Control.path}`);
				}
				return true;
			}
			return false;
		});
	};

	private unloggedFilter: Filter = async (cb, props) => {
		repeat(() => {
			if (this.probingStatus === 'end') {
				if (!this.props.logged) {
					cb();
				}
				return true;
			}
			return false;
		});
	};

	componentDidMount() {
		(async () => {
			if (this.probingStatus === 'start') {
				this.probingStatus = 'doing';
				try {
					const account = await probeLoggedAccount();
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
			logged: state.me ? true : false
		};
	},
	{ setMe }
)(App);

export default ConnectedApp;
