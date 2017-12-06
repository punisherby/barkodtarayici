import ActionHelpers from "../../../helper/ActionHelpers";
import {globalFactory} from "./globalFactory";

export const GET_INVITATION_CODE_SUCCESS = "GET_INVITATION_CODE_SUCCESS";
export const NETWORK_STATUS_CHANGED = "NETWORK_STATUS_CHANGED";

export const getUser = () => {

    return dispatch => {
        return new Promise((resolve, reject) => {
            storageService.get(STORAGE_KEYS.AUTH_INFO).then((authInfo) => {
                return globalFactory.getUser(authInfo)
                    .then((res) => {
                        dispatch(getUserSuccess(res));
                        resolve(res);
                    }).catch((err) => {
                        console.log("Get user failed.");
                        reject(err);
                    });
            });
        });
    };
};


export function onNetworkStateChange(value) {
    return {
        type: NETWORK_STATUS_CHANGED,
        payload: value
    };
}