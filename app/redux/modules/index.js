import {combineReducers} from "redux";
import {globalReducer} from "./global/globalReducer";

export default combineReducers({
    global: globalReducer
});
