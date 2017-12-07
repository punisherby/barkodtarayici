import App from "./App";
import BarcodeScan from "./BarcodeScan";
import PermissionError from "./PermissionError";
import Drawer from "./drawer/Drawer";

export const SCREENS_MAP = {
    App: {
        name: 'barkod.App',
        screen: App
    },
    BarcodeScan: {
        name: 'barkod.BarcodeScan',
        screen: BarcodeScan
    },
    PermissionError: {
        name: 'barkod.PermissionError',
        screen: PermissionError
    },
    Drawer: {
        name: 'barkod.Drawer',
        screen: Drawer
    }
};