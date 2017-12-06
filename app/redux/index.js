/**
 * Combine All Reducers
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import combinedReducers from "./modules/";

// Combine all
const appReducer = combinedReducers;

// Setup root reducer
const rootReducer = (state, action) => {
    const newState = (action.type === 'RESET') ? undefined : state;
    return appReducer(newState, action);
};

export default rootReducer;
