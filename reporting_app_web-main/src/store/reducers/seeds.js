import { LOAD_SEEDS } from "../actionTypes";

export const seeds = (state = [], action) => {
  switch (action.type) {
    case LOAD_SEEDS:
      return [...action.seeds];
    default:
      return state;
  }
};








