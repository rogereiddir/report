import { LOAD_TEAMS } from "../actionTypes";

export const teams = (state = [], action) => {
  switch (action.type) {
    case LOAD_TEAMS:
      return [...action.teams];
    default:
      return state;
  }
};


