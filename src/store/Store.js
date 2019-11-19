import { createStore } from "redux";
import rootReducer from "../reducers/rootReducer";
import { applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

const middleWares = [thunk];

const store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(...middleWares),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
