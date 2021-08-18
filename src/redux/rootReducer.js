import {combineReducers} from "redux";
import {postReducer} from "./PostReducer";

export const rootReducer = combineReducers({
  post: postReducer
})