import { LOAD_USERS  } from "../actionTypes";

export const users = (state = [], action) => {
  console.log(action)
  switch (action.type) {
    case LOAD_USERS:
      return [...action.users];
    default:
      return state;
  }
};

