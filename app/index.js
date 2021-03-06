import {Navigation} from "react-native-navigation";
import {Provider} from "react-redux";
import {registerScreens} from "./containers";
import {initializeServices} from "./services/ServiceInitializer";
//import {EVENT_TYPES, eventBusService} from "./services/EventBusService";
import {SCREENS_MAP} from "./containers/screens";
import store from "@redux/createStore";

registerScreens(store, Provider);

export const startApp = () => {

    initializeServices();
    //eventBusService.sendMessageToBus(EVENT_TYPES.APP_WILL_START);

    Navigation.startSingleScreenApp({
        screen: {
            screen: SCREENS_MAP.BarcodeScan.name
        },
        drawer: {
            left: {
                screen: SCREENS_MAP.Drawer.name
            },
            style: {
                drawerShadow: 'NO',
                leftDrawerWidth: 87
            },
            disableOpenGesture: true
        },
        appStyle: {
            orientation: 'portrait',
        },
        animationType: 'fade',
    });
}

