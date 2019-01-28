import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSagas from "./rootSagas";
import me from "./me/reducers";
import { State } from "./state_type";
import courses from "./courses/reducers";
import articles from './articles/reducers';
import issues from './issues/reducers';
import { articleComments } from './articleComments/reducers';
import { issueComments } from './issueComments/reducers';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers<State>({ me, courses, articles,issues,articleComments,issueComments }),
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSagas);

export default store;
