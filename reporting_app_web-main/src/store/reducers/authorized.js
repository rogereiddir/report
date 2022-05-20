import { LOAD_IPS } from "../actionTypes";

export const ips = (state = [], action) => {
  switch (action.type) {
    case LOAD_IPS:
      return [...action.ips];
    default:
      return state;
  }
};


