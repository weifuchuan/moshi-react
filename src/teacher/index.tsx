import * as ReactDOM from 'react-dom';
import * as React from 'react';
import App from './App';
import store from './store';
import './index.scss';
import { Provider } from 'react-redux';

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
