import React, {Component} from "react";
import {View, Image, Alert, Text, StatusBar, StyleSheet, TouchableOpacity, Linking, ScrollView, ImageBackground, Platform} from "react-native";
import AppBaseContainer from "../AppBaseContainer";
import {Icon, Button, List, ListItem} from "react-native-elements";
import {rootNavigator} from "../BarcodeScan";

const list = [
    {
        title: 'Barkod, QR Kod Okuyucu',
        icon: 'barcode-scan',
        iconType: 'material-community',
    },
    {
        title: 'QR Kod Oluştur',
        icon: 'qrcode',
        iconType: 'material-community',
    },
    {
        title: 'Barkod Oluştur',
        icon: 'barcode',
        iconType: 'material-community',
    },
    {
        title: 'Geçmiş Barkodlarım',
        icon: 'history',
        iconType: 'material-community',
    },
    {
        title: 'Ayarlar',
        icon: 'settings',
        iconType: 'simple-line-icon',
    },
    {
        title: 'Hakkında',
        icon: 'information-outline',
        iconType: 'material-community',
    },
    {
        title: 'İletişim',
        icon: 'contact-mail',
        iconType: 'material-community',
    }
]

/* Component ==================================================================== */
class Drawer extends AppBaseContainer {

    render() {

        return (
            <View style={{flex: 1, opacity:0.95, width:null, height:null, backgroundColor: "white", marginTop: Platform.OS == "ios" ? 20 : 0}}>
                <View style={{flex: 0.1, backgroundColor: "#41bfeb", justifyContent: "center"}}>
                    <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 20, fontWeight: "bold", color: "white"}}>Hızlı Menü</Text>
                </View>
                <View style={{flex: 0.9}}>
                    <List containerStyle={{marginBottom: 0}}>
                        {
                            list.map((item, i) => (
                                <ListItem
                                    key={i}
                                    title={item.title}
                                    titleStyle={{fontWeight: "bold", fontSize: 16}}
                                    leftIcon={{name: item.icon, type: item.iconType, style: {fontSize: 30}}}
                                    onPress={() => this._routeScreenByRootNavigator(this._pageRedirectionResolver(i+1))}
                                />
                            ))
                        }
                    </List>
                </View>
            </View>)
    };

    _pageRedirectionResolver(num) {
        switch (num) {
            case 1:
                return this.getScreenMap().BarcodeScan.name;
                break;
            case 2:
                return this.getScreenMap().QRCodeGenerator.name;
                break;
            case 3:
                return this.getScreenMap().BarcodeGenerator.name;
                break;
            case 4:
                return this.getScreenMap().PreviousBarcodes.name;
                break;
            case 5:
                return this.getScreenMap().Settings.name;
                break;
            case 6:
                return this.getScreenMap().About.name;
                break;
            case 7:
                return this.getScreenMap().Contact.name;
                break;
            default:
                break;
        }
    }

    _routeScreenByRootNavigator(screenName, props=null) {
        rootNavigator.toggleDrawer({
            side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
            animated: true, // does the toggle have transition animation or does it happen immediately (optional)
            to: 'close' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
        });
        rootNavigator.push({
            screen: screenName,
            passProps: {
                navProps : props
            }
        });
    }
}

/* Export Component ==================================================================== */
export default (Drawer);
