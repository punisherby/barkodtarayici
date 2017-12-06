import {
    GET_INVITATION_CODE_SUCCESS,
} from "./globalActions";

const initialGlobalState = {

};

//************************ REDUCER ************************************
export const globalReducer = (state = initialGlobalState, action) => {

    let newState = state;
    let responseData = action.payload;

    switch (action.type) {
        case GET_INVITATION_CODE_SUCCESS:
            newState = {
                ...state,
                referralCode: action.payload.referralCode
            };
            return newState;
        default:
            return state;
    }
};
