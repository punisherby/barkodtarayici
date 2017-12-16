import React, {Component} from "react";
import {View, Image, Alert, Text, StatusBar, StyleSheet, TouchableOpacity, Linking, ScrollView, ImageBackground, Platform} from "react-native";
import AppBaseContainer from "../AppBaseContainer";
import {Icon, Button, List, ListItem} from "react-native-elements";
import {rootNavigator} from "../BarcodeScan";
import QREventCodeGenerator from "../qrcode/QREventCodeGenerator";

const list = [
    {
        title: 'Barkod, QR Kod Okuyucu',
        icon: 'barcode-scan',
        iconType: 'material-community',
    },
    {
        title: 'QR Kod İşlemleri',
        icon: 'qrcode',
        iconType: 'material-community',
    },
    {
        title: 'Barkod Oluştur',
        icon: 'barcode',
        iconType: 'material-community',
    },
    {
        title: 'Geçmiş',
        icon: 'history',
        iconType: 'material-community',
    },
    {
        title: 'Favorilerim',
        icon: 'history',
        iconType: 'material-community',
    },
    {
        title: 'Ayarlar',
        icon: 'settings',
        iconType: 'simple-line-icon',
    }
]

const subMenu = [
        {
            list: [
                {
                    title: 'Alışveriş (Çok Yakında...)',
                    icon: 'ios-shirt-outline',
                    iconType: 'ionicon',
                },
                {
                    title: 'Alışveriş (Çok Yakında...)',
                    icon: 'ios-shirt-outline',
                    iconType: 'ionicon',
                },
                {
                    title: 'Alışveriş (Çok Yakında...)',
                    icon: 'ios-shirt-outline',
                    iconType: 'ionicon',
                }
            ]},
        {
            list: [
                {
                    title: 'QR Kod Oluştur',
                    icon: 'qrcode',
                    iconType: 'material-community',
                },
                {
                    title: 'QR Etkinlik Kodu Oluştur',
                    icon: 'event-available',
                    iconType: 'material-icons',
                },
                {
                    title: 'QR Wifi Kodu Oluştur (Yakında...)',
                    icon: 'wifi',
                    iconType: 'font-awesome',
                }
            ]},
    ]

/* Component ==================================================================== */
class Drawer extends AppBaseContainer {

    state = {
        topLevelMenuId: 0,
        subMenuHeaderText: ""
    }

    render() {
        return(
            <View style={{flex: 1, opacity:0.95, width:null, height:null, backgroundColor: "white", marginTop: Platform.OS == "ios" ? 20 : 0}}>
                {this.state.topLevelMenuId == 0 ? this._renderMenu() : this._renderSubMenu()}
            </View>
        )
    };

    _renderSubMenu() {
        return (
            <View style={{flex: 1, opacity:0.95, width:null, height:null, backgroundColor: "white"}}>
                <View style={{flex: 0.1, backgroundColor: "#41bfeb", alignItems: "center", justifyContent: "center", flexDirection:"row"}}>
                    <Icon
                        containerStyle={{flex: 0.2, alignItems: "flex-start", justifyContent: "center", paddingLeft: 12}}
                        name="ios-arrow-back-outline"
                        type='ionicon'
                        size={36}
                        color="white"
                        onPress={() => this.setState({topLevelMenuId: 0, subMenuHeaderText: ""})}
                    />
                    <Text style={{flex:0.6, textAlign: "center", fontFamily: "Verdana", fontSize: 20, fontWeight: "bold", color: "white"}}>{this.state.subMenuHeaderText}</Text>
                    <View style={{flex: 0.2}}></View>
                </View>
                <View style={{flex: 0.9}}>
                    <List containerStyle={{marginBottom: 0}}>
                        {
                            subMenu[1].list.map((item, i) => (
                                <ListItem
                                    key={i}
                                    title={item.title}
                                    titleStyle={{fontWeight: "bold", fontSize: 16}}
                                    leftIcon={{name: item.icon, type: item.iconType, style: {fontSize: 30}}}
                                    onPress={() => this._subMenuPageRedirectionResolver(i+1)}
                                />
                            ))
                        }
                    </List>
                </View>
            </View>
        );
    }

    _renderMenu() {
        return (
            <View style={{flex: 1, opacity:0.95, width:null, height:null, backgroundColor: "white"}}>
                <View style={{flex: 0.1, backgroundColor: "#46d0ff", alignItems: "center", justifyContent: "center", flexDirection:"row"}}>
                    <Image
                        style={{flex:0.2, width: 50, height: 50, resizeMode: 'contain'}}
                        source={require('../../images/app_logo.png')}
                    />
                    <Text style={{flex:0.6, textAlign: "center", fontFamily: "Verdana", fontSize: 20, fontWeight: "bold", color: "white"}}>Hızlı Menü</Text>
                    <View style={{flex: 0.2}}></View>
                </View>
                <View style={{flex: 0.80}}>
                    <List containerStyle={{marginBottom: 0}}>
                        {
                            list.map((item, i) => (
                                <ListItem
                                    key={i}
                                    title={item.title}
                                    titleStyle={{fontWeight: "bold", fontSize: 16}}
                                    leftIcon={{name: item.icon, type: item.iconType, style: {fontSize: 30}}}
                                    onPress={() => this._pageRedirectionResolver(i+1)}
                                />
                            ))
                        }
                    </List>
                </View>
                <View style={{flex: 0.1, flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingBottom: 2}}>
                    <TouchableOpacity onPress={() => this._routeScreenByRootNavigator(this.getScreenMap().Invite.name)}>
                        <Icon
                            name="share"
                            type='font-awesome'
                            size={32}
                            color="#41bfeb"
                        />
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 14, color: "#41bfeb"}}>Davet Et</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._routeScreenByRootNavigator(this.getScreenMap().About.name)}>
                        <Icon
                            name="information-outline"
                            type='material-community'
                            size={32}
                            color="#41bfeb"
                        />
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 14, color: "#41bfeb"}}>Hakkımızda</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._routeScreenByRootNavigator(this.getScreenMap().Contact.name)}>
                        <Icon
                        name="contact-mail"
                        type='material-community'
                        size={32}
                        color="#41bfeb"
                    />
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 14, color: "#41bfeb"}}>İletişim</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _pageRedirectionResolver(num) {
        switch (num) {
            case 1:
                if (Platform.OS == "android") {
                    this.closeDrawer();
                    this.startNewScreenStack(this.getScreenMap().BarcodeScan.name);
                } else {
                    this._routeScreenByRootNavigator(this.getScreenMap().BarcodeScan.name);
                }
                break;
            case 2:
                this.setState({topLevelMenuId: 2, subMenuHeaderText: "QR Kod İşlemleri"})
                break;
            case 3:
                this._routeScreenByRootNavigator(this.getScreenMap().BarcodeGenerator.name);
                break;
            case 4:
                this._routeScreenByRootNavigator(this.getScreenMap().PreviousBarcodes.name)
                break;
            case 5:
                this._routeScreenByRootNavigator(this.getScreenMap().MyFavourites.name)
                break;
            case 6:
                this._routeScreenByRootNavigator(this.getScreenMap().Settings.name)
                break;
            default:
                break;
        }
    }

    _subMenuPageRedirectionResolver(num) {
        switch (this.state.topLevelMenuId) {
            case 2:
                switch (num) {
                    case 1:
                        this._routeScreenByRootNavigator(this.getScreenMap().QRCodeGenerator.name);
                        break;
                    case 2:
                        this._routeScreenByRootNavigator(this.getScreenMap().QREventCodeGenerator.name);
                        break;
                    case 3:
                        this._routeScreenByRootNavigator(this.getScreenMap().QRWifiCodeGenerator.name);
                        break;
                    default:
                        break;
                }
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
