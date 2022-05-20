import { combineReducers } from "redux";
import { processes } from "./processes";
import { lists } from "./lists";
import { seeds } from "./seeds";
import { ips } from "./authorized";
import { teams } from "./teams";
import { users } from "./users";
import { loading } from "./isloading";
import { fetching } from "./isFetchingToken";
import { loggingout } from "./isLoggingOut"
import { user } from "./auth";

const rootReducer = combineReducers({
  processes,
  users,
  lists,
  seeds,
  ips,
  teams,
  loading,
  fetching,
  loggingout,
  userAuth:user
});

export default rootReducer;
