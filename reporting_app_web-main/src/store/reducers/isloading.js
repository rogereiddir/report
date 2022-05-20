import { IS_LOADING } from "../actionTypes";

export const loading = (state = false , action) => {
    switch(action.type){
        case IS_LOADING :
         return !state;
        default :
         return state; 
    }
  }
