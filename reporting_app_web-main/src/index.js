import React from "react";
import ReactDOM from "react-dom";
import jwtDecode from "jwt-decode";
import Cookies from "universal-cookie";
import { message } from "antd";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./Main";
import { configureStore } from "./store";
import { setCurrentUser, userLogout } from "./store/actions/user_auth";
import { clearData } from "./store/actions/utils";
import "antd/dist/antd.css";
import "./index.css";

const store = configureStore();

const cookies = new Cookies();

if (cookies.get("reporting_access")) {
  // prevent someone from manually tampering with the key of jwtToken in localStorage
  try {
    store.dispatch(setCurrentUser(jwtDecode(cookies.get("reporting_access"))));
  } catch (e) {
    store
      .dispatch(userLogout({ data: { userId: localStorage.getItem("uuid") } }))
      .then((res) => {
        clearData(store.dispatch);
        store.dispatch(setCurrentUser({}));
        message.success(res.message);
      });
  }
} else {
  if (localStorage.getItem("uuid")) {
    store
      .dispatch(userLogout({ data: { userId: localStorage.getItem("uuid") } }))
      .then((res) => {
        store.dispatch(setCurrentUser({}));
        clearData(store.dispatch);
        message.success(res.message);
        localStorage.clear();
      });
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/" component={Main} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
