import {EnvironmentConfiguration} from "../config";
import {AlertExcludeErrorStatusCode, ErrorStatusCode} from "../config/ErrorStatusCodes";
import {EVENT_TYPES, eventBusService} from "./EventBusService";
import {tokenService} from "../services/TokenService";
import {STORAGE_KEYS, storageService} from "../services/StorageService";
import fetch from 'react-native-fetch-polyfill';

export class CustomHttpService {


    // Provide keep promise resolve and reject and recall with same resolve and reject
    // Redux actions not be completed when lose started promise.
    fetch = (requestCustomOptions, requestResolveFunction, requestRejectFunction) => {
        return new Promise((resolve, reject) => {

            //Avoid for lose previous api call's resolve and reject functions.
            if (requestResolveFunction) {
                resolve = requestResolveFunction;
            }
            if (requestRejectFunction) {
                reject = requestRejectFunction;
            }

            this.fetchFromApi(requestCustomOptions)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {

                if (err && err.message === ErrorStatusCode.TIMEOUT_EXCEPTION && requestCustomOptions.queueIsOffline) {
                    if (requestCustomOptions.timeoutTriedCount) {
                        requestCustomOptions.timeoutTriedCount++;
                    } else {
                        requestCustomOptions.timeoutTriedCount = 1;
                    }

                    setTimeout(() => {
                        if (requestCustomOptions.timeoutTriedCount > 3) {
                            reject();
                        } else {
                            return this.fetch(requestCustomOptions, resolve, reject);
                        }
                    }, 3000);
                    
                } else if (tokenService.isTokenError(err)) {
                    //Avoid for rel call refresh token api call. its checking own error logic.
                    if (requestCustomOptions.isExludedFromRefreshToken) {
                        reject(err);
                    } else {
                        //Call api call that rejected for token error. After token will be updated in local storage.
                        if (requestCustomOptions.triedCount) {
                            requestCustomOptions.triedCount++;
                        } else {
                            requestCustomOptions.triedCount = 1;
                        }

                        setTimeout(() => {
                            if (requestCustomOptions.triedCount > 3) {
                                reject();
                            } else {
                                return this.fetch(requestCustomOptions, resolve, reject);
                            }
                        }, 3000);
                    }
                } else {
                    reject(err);
                }
            })
        });
    };

    //Provide fetch data from ava server.
    //You should use fetch, not this. 
    fetchFromApi(requestCustomOptions) {
        return new Promise((resolve, reject) => {
            storageService.get(STORAGE_KEYS.AUTH_INFO)
                .then((authInfo) => {
                    let doRequest = true;
                    let logResponse = true;
                    let logRequest = true;
                    let informEventBus = true;

                    // if we do not want to log request or response we need to
                    // set sub-keys of loggingOption map
                    if (typeof requestCustomOptions.loggingOption !== "undefined") {
                        logResponse = requestCustomOptions.loggingOption.logResponse;
                        logRequest = requestCustomOptions.loggingOption.logRequest;
                    }

                    // informEventBus is a value to prevent infinite-loop
                    // that customHttpService is also used by logService itself
                    // so that logging its own request creates an infinite-loop..
                    if (typeof requestCustomOptions.informEventBus !== "undefined") {
                        informEventBus = requestCustomOptions.informEventBus;
                    }

                    if (!authInfo && requestCustomOptions.requiresAuth) {
                        doRequest = false;
                    }

                    if (doRequest) {

                        let requestOptions = {
                            method: requestCustomOptions.method,
                            headers: {}
                        };

                        requestOptions.headers["Accept"] = "application/json";
                        if (requestOptions.body && requestCustomOptions.body.imagePost) {
                            requestOptions.headers["Content-Type"] = requestCustomOptions.headers["Content-type"];
                        } else {
                            requestOptions.headers["Content-Type"] = "application/json";
                        }

                        let url = EnvironmentConfiguration.API_URL;
                        // set url value by using resolvePath method if it is passed
                        // from options..
                        if (requestCustomOptions.resolvePath) {
                            url += requestCustomOptions.resolvePath(authInfo);
                        } else {
                            url += requestCustomOptions.path;
                        }

                        if (requestCustomOptions.body) {
                            requestOptions.body = JSON.stringify(requestCustomOptions.body);
                        }

                        if (requestCustomOptions.requiresAuth) {
                            requestOptions.headers["Authorization"] = authInfo.token;
                        }

                        if (informEventBus) {
                            eventBusService.sendMessageToBus(EVENT_TYPES.HTTP_REQUEST_STARTED, {
                                url,
                                body: requestOptions.body,
                                logRequest
                            });
                        }

                        fetch(url, {...requestOptions, timeout: EnvironmentConfiguration.TIMEOUT_MS})
                            .then(res => {
                                eventBusService.sendMessageToBus(EVENT_TYPES.HTTP_RESPONSE_HEADER_RECEIVED, {res});

                                // this check is required for API's DELETE operations that returns HTTP 204 with
                                // "text/plain;charset=UTF-8" content-type
                                let headerContentType = res.headers.get("content-type");
                                if (headerContentType) {
                                    if (headerContentType.match(/application\/json/)) {
                                        return res.json();
                                    }
                                }

                                return res;
                            })
                            .then((res) => {
                                if (informEventBus) {
                                    eventBusService.sendMessageToBus(EVENT_TYPES.HTTP_REQUEST_COMPLETED, {
                                        res,
                                        url,
                                        logResponse
                                    });
                                }
                                if (res.errorCode || res.status == ErrorStatusCode.NOT_FOUND) {
                                    if (tokenService.isTokenError(res)) {
                                        if (authInfo.rememberMe) {
                                            tokenService.refreshToken(authInfo.uuid, authInfo.refreshToken);
                                            reject(res);
                                        } else {
                                            reject(res);
                                            tokenService.redirectToLogin();
                                        }
                                    } else {
                                        eventBusService.sendMessageToBus(EVENT_TYPES.HTTP_REQUEST_RETURNED_ERROR, {res});
                                        reject(res);
                                    }
                                } else {
                                    resolve(res);
                                }
                                if (__DEV__) {
                                    console.log(res);
                                }
                            })
                            .catch((err) => {
                                reject(err);
                                if (__DEV__) {
                                    console.log(err);
                                }
                            });

                    } else {
                        reject();
                    }
                }).catch((err) => {
                reject(err);
            });
        });
    }

    xmlHttpRequest(options) {
        return new Promise(function (resolve, reject) {

            let logResponse = typeof options.logResponse != "undefined" ? options.logResponse : true;
            let xhr = new XMLHttpRequest();
            
            xhr.timeout = EnvironmentConfiguration.TIMEOUT_MS;
            xhr.open(options.method, options.url);

            xhr.addEventListener("timeout", function(e) {
                reject("timeout");
            });

            xhr.onload = function () {
                eventBusService.sendMessageToBus(EVENT_TYPES.HTTP_REQUEST_COMPLETED, {
                    res: xhr,
                    url: options.url,
                    logResponse: logResponse
                });
                if (__DEV__) {
                    console.log(xhr);
                }
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr);
                } else {
                    reject(xhr);
                }
            };

            xhr.onerror = function () {
                eventBusService.sendMessageToBus(EVENT_TYPES.HTTP_REQUEST_COMPLETED, {
                    res: xhr,
                    url: options.url,
                    logResponse: logResponse
                });
                if (__DEV__) {
                    console.log(xhr);
                }
                reject(xhr);
            };

            if (options.headers) {
                Object.keys(options.headers).forEach(function (key) {
                    xhr.setRequestHeader(key, options.headers[key]);
                });
            }

            if (options.params) {
                xhr.send(options.params);
            } else {
                xhr.send();
            }
        });
    }
}

export let customHttpService = new CustomHttpService();