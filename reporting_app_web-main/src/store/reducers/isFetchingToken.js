import { LOAD_FETCHING } from "../actionTypes";

export const fetching = (state = false , action) => {
    switch(action.type){
        case LOAD_FETCHING :
         return !state ;
        default :
         return state; 
    }
  }
