import BarcodeScan from "./BarcodeScan";
import PermissionError from "./PermissionError";
import Drawer from "./drawer/Drawer";
import QRCodeGenerator from "./qrcode/QRCodeGenerator";
import PreviousBarcodes from "./PreviousBarcodes";
import Settings from "./Settings";
import About from "./About";
import Contact from "./Contact";
import Invite from "./Invite";
import BarcodeGenerator from "./BarcodeGenerator";
import QREventCodeGenerator from "./qrcode/QREventCodeGenerator";
import QRWifiCodeGenerator from "./qrcode/QRWifiCodeGenerator";
import MyFavourites from "./MyFavourites";

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
    MyFavourites: {
        name: 'barkod.MyFavourites',
        screen: MyFavourites
    },
    Settings: {
        name: 'barkod.Settings',
        screen: Settings
    },
    Invite: {
        name: 'barkod.Invite',
        screen: Invite
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
    QREventCodeGenerator: {
        name: 'barkod.QREventCodeGenerator',
        screen: QREventCodeGenerator
    },
    QRWifiCodeGenerator: {
        name: 'barkod.QRWifiCodeGenerator',
        screen: QRWifiCodeGenerator
    },

};