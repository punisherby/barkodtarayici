import Rx from 'rxjs/Rx';

export const EVENT_TYPES = {
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
    APP_LAUNCHED: "APP_LAUNCHED",
    APP_WILL_START: "APP_WILL_START",
    APP_WILL_STOP: "APP_WILL_STOP",
    APP_WILL_RESUME : "APP_WILL_RESUME",
    APP_INITIALIZATION : "APP_INITIALIZATION",
    HTTP_REQUEST_STARTED: "HTTP_REQUEST_STARTED",
    HTTP_RESPONSE_HEADER_RECEIVED : "HTTP_RESPONSE_HEADER_RECEIVED",
    HTTP_REQUEST_COMPLETED: "HTTP_REQUEST_COMPLETED",
    EXTERNAL_ROUTE_RECEIVED : "EXTERNAL_ROUTE_RECEIVED",
    NAVIGATION_ROUTE_CHANGED : "NAVIGATION_ROUTE_CHANGED",
    NOTIFICATION_REMOTE_RECEIVED: "NOTIFICATION_REMOTE_RECEIVED",
    NOTIFICATION_INITIAL_RECEIVED : "NOTIFICATION_INITIAL_RECEIVED",
    NOTIFICATION_REGISTER_EVENT: "NOTIFICATION_REGISTER_EVENT",
    NETWORK_OFFLINE_BUTTON_CLICKED: "NETWORK_OFFLINE_BUTTON_CLICKED",
    HTTP_REQUEST_RETURNED_ERROR : "HTTP_REQUEST_RETURNED_ERROR"
};

class EventBusService {

    eventBusSubject;

    constructor() {
        this.initializeObserver();
    }

    initializeObserver() {
        this.eventBusSubject = new Rx.Subject();
    }

    sendMessageToBus(type, data) {
        this.eventBusSubject.next({
            type: type,
            data: data
        });
    }

    addListener(eventType, func) {
        return this.eventBusSubject.subscribe((message) => {
            if (message.type === eventType) {
                if (func) {
                    func(message);
                }
            }
        });
    }
}

export let eventBusService = new EventBusService();