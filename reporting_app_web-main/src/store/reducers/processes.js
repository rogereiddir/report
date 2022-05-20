import { LOAD_PROCESSES } from "../actionTypes";

export const processes = (state = [], action) => {
  switch (action.type) {
    case LOAD_PROCESSES:
      return [...action.processes];
    default:
      return state;
  }
};


