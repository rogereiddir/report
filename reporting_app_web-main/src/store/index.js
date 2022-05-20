import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from "./reducers";
import thunkMiddleware from 'redux-thunk'

export function configureStore (initialState = {}) {
  return createStore(
    rootReducer,
    initialState,
    process.env.NODE_ENV === 'development' ? composeWithDevTools(applyMiddleware(thunkMiddleware)) : applyMiddleware(thunkMiddleware)
  )
}
