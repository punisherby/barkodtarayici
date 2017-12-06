import {storageService, STORAGE_KEYS} from "../services/StorageService";

class ActionHelpers {

    createHttpAction(method) {
        return dispatch => {
            storageService.get(STORAGE_KEYS.AUTH_INFO)
                .then((authInfo) => {
                    if (method) {
                        method(dispatch, authInfo);
                    }
                });
        };
    }

    createHttpActionWithActionTypes(options) {

        if (options.actionTypes.request) {
            options.request = this.createHttpRequestActionType(options.actionTypes.request);
        }
        if (options.actionTypes.success) {
            options.success = this.createHttpSuccessActionType(options.actionTypes.success);
        }

        if (options.actionTypes.error) {
            options.error = this.createHttpErrorActionType(options.actionTypes.error);
        }

        return (dispatch, getState) => {
            let authInfos = {}; //TODO(tayfun) : dummy object 
            options.body(dispatch, options, authInfos, getState);
        };
    }

    createListenableHttpAction(options) {

        if (options.actionTypes.request) {
            options.request = this.createHttpRequestActionType(options.actionTypes.request);
        }
        if (options.actionTypes.success) {
            options.success = this.createHttpSuccessActionType(options.actionTypes.success);
        }
        if (options.actionTypes.error) {
            options.error = this.createHttpErrorActionType(options.actionTypes.error);
        }

        // NOTE : details for returing promise from actions
        // can be found here :  : https://medium.com/collaborne-engineering/returning-promises-from-redux-action-creators-3035f34fa74b
        return (dispatch, getState) => {
            return new Promise((resolve, reject) => {
                options.body(resolve, reject, options, dispatch, getState);
            });
        };
    }

    createHttpRequestActionType(type) {
        return (json) => {
            return {
                type: type,
                payload: json
            };
        };
    }

    createHttpSuccessActionType(type) {
        return (json) => {
            return {
                type: type,
                payload: json
            };
        }
    }

    createHttpErrorActionType(type) {
        return (error) => {
            return {
                type: type,
                payload: error
            }
        }
    }
}

const actionHelpers = new ActionHelpers();
export default actionHelpers;