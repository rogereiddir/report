import { dataProvider } from "../../api/index";
import {SET_CURRENT_USER} from '../actionTypes'


export const user_signin= (params) => {
  return () => {
    return dataProvider("AUTH", "auth/users/login", params)
  };
};

export const user_signup= (params) => {
  return () => {
    return dataProvider("AUTH", "auth/users/register", params)
  };
};

export function userLogout(params) {
  return () => {
    return dataProvider("LOGOUT", "auth/users/logout", params)
  };
}

export function refreshToken(params) {
  return () => {
    return dataProvider("REFRESHING_TOKEN", "auth/users/refreshToken", params)
  };
}

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  };
}