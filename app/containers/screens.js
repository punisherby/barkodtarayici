import App from "./App";
import BarcodeScan from "./BarcodeScan"
import CameraPermissionError from "./CameraPermissionError"

export const SCREENS_MAP = {
    App: {
        name: 'barkod.App',
        screen: App
    },
    BarcodeScan: {
        name: 'barkod.BarcodeScan',
        screen: BarcodeScan
    },
    CameraPermissionError: {
        name: 'barkod.CameraPermissionError',
        screen: CameraPermissionError
    }
};