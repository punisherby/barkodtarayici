import {
    Navigation
} from 'react-native-navigation';

import {SCREENS_MAP} from "./screens";

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
    for (let screenKey in SCREENS_MAP) {
        if (SCREENS_MAP.hasOwnProperty(screenKey)) {
            let screenConfig = SCREENS_MAP[screenKey];
            Navigation.registerComponent(screenConfig.name, () => screenConfig.screen, store, Provider);
        }
    }
}