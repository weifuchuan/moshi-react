import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSagas from './rootSagas';
import me from './me/reducers';
import { State } from './state_type';
import courses from './courses/reducers';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers<State>({ me, courses }),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSagas);

export default store;
