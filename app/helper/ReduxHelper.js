import configureStore from "../redux/configureStore";

export default ReduxHelper = {

    dispatchAction(action) {
        configureStore.dispatch(action);
    },

    getState() {
        return configureStore.getState();
    }
};