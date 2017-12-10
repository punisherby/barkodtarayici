import BarcodeScan from "./BarcodeScan";
import PermissionError from "./PermissionError";
import Drawer from "./drawer/Drawer";
import QRCodeGenerator from "./QRCodeGenerator";
import PreviousBarcodes from "./PreviousBarcodes";
import Settings from "./Settings";
import About from "./About";
import Contact from "./Contact";
import BarcodeGenerator from "./BarcodeGenerator";

export const SCREENS_MAP = {
    Drawer: {
        name: 'barkod.Drawer',
        screen: Drawer
    },
    BarcodeScan: {
        name: 'barkod.BarcodeScan',
        screen: BarcodeScan
    },
    QRCodeGenerator: {
        name: 'barkod.QRCodeGenerator',
        screen: QRCodeGenerator
    },
    BarcodeGenerator: {
        name: 'barkod.BarcodeGenerator',
        screen: BarcodeGenerator
    },
    PreviousBarcodes: {
        name: 'barkod.PreviousBarcodes',
        screen: PreviousBarcodes
    },
    Settings: {
        name: 'barkod.Settings',
        screen: Settings
    },
    About: {
        name: 'barkod.About',
        screen: About
    },
    Contact: {
        name: 'barkod.Contact',
        screen: Contact
    },
    PermissionError: {
        name: 'barkod.PermissionError',
        screen: PermissionError
    },

};