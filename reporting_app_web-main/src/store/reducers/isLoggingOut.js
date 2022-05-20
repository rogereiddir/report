import { LOGGING_OUT } from "../actionTypes";

export const loggingout = (state = false , action) => {
    switch(action.type){
        case LOGGING_OUT :
         return !state ;
        default :
         return state; 
    }
  }
