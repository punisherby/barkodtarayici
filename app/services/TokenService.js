//import { authFactory } from "../redux/modules/auth/authFactory";
import { ErrorStatusCode } from "../config/ErrorStatusCodes";
import { eventBusService, EVENT_TYPES } from "../services/EventBusService";
// import { clearProfile } from "../redux/modules/profile/profileActions";
// import { clearUser } from "../redux/join/joinActions";
// import { Actions } from "react-native-router-flux";
import { storageService, STORAGE_KEYS} from "../services/StorageService";

const refreshStatus = {
    INIT: "INIT",
    REFRESHING: "REFRESHING"
}

class TokenService {

    tryCount = 0;
    refreshStatus = refreshStatus.INIT;
    tokenErrorCodes = [ErrorStatusCode.AUTHORIZATION_TOKEN_HAS_EXPIRED_EXCEPTION, 
                        ErrorStatusCode.AUTHORIZATION_TOKEN_NOT_VALID_EXCEPTION];
    currentRefreshToken;

    // when user catch a token error, this function refresh token
    // If user set remember me to true, user shoudl resume without any interruption.
    refreshToken(uuid, refreshToken) {

        //Avoid for more than one request started with old token and do not call twice refresh token 
        if (this.currentRefreshToken && this.currentRefreshToken !== refreshToken) {
            return;
        }

        //Avoid for do not call refresh token api when before request started it.
        if (this.refreshStatus === refreshStatus.REFRESHING) {
            return;
        }

        this.refreshStatus = refreshStatus.REFRESHING;

        if (this.tryCount++ > 4) {
            this.redirectToLogin();
            return;
        }

        {/*authFactory.refreshToken({ uuid, token: refreshToken })
                   .then((res) => {
                       storageService.update(STORAGE_KEYS.AUTH_INFO, { token: res.token, refreshToken: res.refreshToken })
                                   .then(() => {
                                       this.refreshStatus = refreshStatus.INIT;
                                       this.currentRefreshToken = res.refreshToken;
                                   });
                   }).catch((err) => {
                       //If refresh token api call catch a token error, app should show login page.
                       if (this.isTokenError(err)) {
                           this.redirectToLogin();
                       }
                   })
        */}
    }

    //Provide process that redirec to login page with same click logout.
    redirectToLogin = () => {
        storageService.clear();
        eventBusService.sendMessageToBus(EVENT_TYPES.LOGOUT_SUCCESS);
        this.tryCount = 0;
        this.refreshStatus = refreshStatus.INIT;
    };

    //Check error data to considire is token errorç
    isTokenError = (error) => {
        if (error && this.tokenErrorCodes.indexOf(+error.errorCode) !== -1) {
            return true;
        } else {
            return false;
        }
    };
}

export let tokenService = new TokenService();