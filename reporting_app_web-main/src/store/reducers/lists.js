import { LOAD_LISTS } from "../actionTypes";

export const lists = (state = [], action) => {
  switch (action.type) {
    case LOAD_LISTS:
      return [...action.lists];
    default:
      return state;
  }
};


