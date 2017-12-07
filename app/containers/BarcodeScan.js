import React, {Component} from "react";
import {TouchableOpacity, Platform, NativeModules, View, Alert, Image, Text, Modal, Linking} from "react-native";
import Barcode from 'react-native-smart-barcode';
import {Icon, Button} from "react-native-elements";
import AppBaseContainer from "./AppBaseContainer";
import Torch from 'react-native-torch';
import Permissions from 'react-native-permissions';

export let rootNavigator = null;

class BarcodeScan extends AppBaseContainer {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarHidden : true,
        screenBackgroundImageName: "background-photo"
    };

    state = {
        cameraPhotoPermissionGranted : false,
        torchMode: "off",
        barcodeDetected : false
    };

    lastBarcodeData;

    constructor(props){
        super(props);
        this.setStyle(this.navigatorStyle);
        rootNavigator = this.props.navigator;
    }

    componentDidMount() {
        setTimeout(() => {
            this._checkPermission();
        }, 300);
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white", paddingTop: Platform.OS == "ios" ? 20 : 0}}>
                <View style={{flex: 0.1, backgroundColor: "#41bfeb", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <View style={{flex: 0.1, paddingLeft: 15, paddingRight: 10}}>
                        <TouchableOpacity onPress = {() => this.openDrawer()}>
                            <Icon
                                name='md-menu'
                                type='ionicon'
                                size={40}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 0.8}}>
                        <Text style={{marginTop: -5, textAlign: "center", fontFamily: "Verdana", fontSize: 18, fontWeight: "bold", color: "white"}}>Barkod ve QR Kod Okuyucu</Text>
                    </View>
                    <View style={{flex: 0.1}}>
                    </View>
                </View>

                <View style={{flex: 0.15, padding: 4, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                    <TouchableOpacity onPress={this.switchTorch.bind(this)} style={{height: 60, width: 80, borderColor: "black", borderWidth: 0.4, borderRadius: 8, marginRight: 10, padding: 2}}>
                        <Icon
                            name={this.flashIcon()}
                            type='material-community'
                            size={36}
                            color="#41bfeb"
                        />
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>{this.flashIconText()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pushToActiveScreenStack(this.getScreenMap().Settings.name)} style={{height: 60, width: 80, borderColor: "black", borderWidth: 0.4, borderRadius: 8, marginRight: 10, padding: 2}}>
                        <Icon
                            name="settings"
                            type='simple-line-icon'
                            size={36}
                            color="#41bfeb"
                        />
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>Ayarlar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pushToActiveScreenStack(this.getScreenMap().PreviousBarcodes.name)} style={{height: 60, width: 80, borderColor: "black", borderWidth: 0.4, borderRadius: 8, marginRight: 10, padding: 2}}>
                        <Icon
                            name="history"
                            type='material-community'
                            size={36}
                            color="#41bfeb"
                        />
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>Geçmiş</Text>
                    </TouchableOpacity>
                </View>
                {this.state.cameraPhotoPermissionGranted ? this._renderBarcodeScanner() : undefined}
                {this._renderBarcodeFoundModal()}
            </View>
        );
    }

    _renderBarcodeScanner() {
        return (
            <Barcode style={{flex: 0.75, backgroundColor: "transparent"}}
                     ref={ component => this._barCode = component }
                     scannerRectWidth={300}
                     barCodeTypes={[]}
                     onBarCodeRead={(data) => this._onBarCodeRead(data)}/>
        )
    }

    _renderBarcodeFoundModal() {
        return (
            <Modal
                offset={50}
                visible={this.state.barcodeDetected}
                transparent={true}
                onRequestClose={() => {
                }}
                animationType={'fade'}
                closeOnTouchOutside={false}>
                <View style={{backgroundColor: "#00000044", flex: 1, height: null}}>
                    <View style={{borderRadius: 2, marginHorizontal: 20, marginTop: 40, marginBottom: 40, padding: 10, backgroundColor: "white",}}>
                        <View style={{flexDirection: "row", padding: 15, paddingTop: 30}}>
                            <Text style={{fontWeight: "bold"}}>Barkod Tipi : </Text>
                            <Text>{this.lastBarcodeData ? JSON.stringify(this.lastBarcodeData.data.type) : undefined}</Text>
                        </View>
                        <View style={{flexDirection: "row", padding: 15, marginBottom: 25}}>
                            <Text style={{fontWeight: "bold"}}>Barkod No : </Text>
                            <Text>{this.lastBarcodeData ? JSON.stringify(this.lastBarcodeData.data.code) : undefined}</Text>
                        </View>
                        <Button
                            onPress={() => this._onGoogleSearchPressed(this.lastBarcodeData.data.code)}
                            buttonStyle={{marginBottom: 8}}
                            backgroundColor="#41bfeb"
                            borderRadius={4}
                            icon={{name: 'google', type: 'font-awesome'}}
                            title={'Google\'da Ara'} />

                        <Button
                            onPress={() => this._onGoogleProductSearchPressed(this.lastBarcodeData.data.code)}
                            buttonStyle={{marginBottom: 8}}
                            backgroundColor="#41bfeb"
                            borderRadius={4}
                            icon={{name: 'shopping-cart', type: 'font-awesome'}}
                            title={'Ürün Olarak Ara'} />

                        <Button
                            onPress={() => this._resetBarcodeScan()}
                            buttonStyle={{marginBottom: 20}}
                            backgroundColor="#41bfeb"
                            borderRadius={4}
                            icon={{name: 'close', type: 'font-awesome'}}
                            title={'Çıkış / Yeni Arama'} />
                    </View>
                </View>
            </Modal>
        )
    }

    _checkPermission() {
        Permissions.request('camera')
            .then(response => {
                if (response === "denied" || response === "restricted") {
                    this.pushToActiveScreenStack(this.getScreenMap().PermissionError.name)
                } else {
                    Permissions.request('photo')
                        .then(response2 => {
                            if (response2 === "denied" || response2 === "restricted") {
                                this.pushToActiveScreenStack(this.getScreenMap().PermissionError.name)
                            } else {
                                setTimeout(() => {
                                    this.setState({cameraPhotoPermissionGranted: true});
                                }, 200);
                            }
                        });
                }
            });
    }

    switchTorch() {
        if (this.state.torchMode === "on") {
            this.setState({torchMode: "off"});
            Platform.OS == "ios" ? Torch.switchState(false) : NativeModules.CaptureModule.stopFlash();
        } else if (this.state.torchMode === "off") {
            this.setState({torchMode: "on"});
            Platform.OS == "ios" ? Torch.switchState(true) : NativeModules.CaptureModule.startFlash();
        }
    }

    flashIcon() {
        if (this.state.torchMode === "on") {
            return "flashlight-off";
        } else if (this.state.torchMode === "off") {
            return "flashlight";
        }
    }

    flashIconText() {
        if (this.state.torchMode === "on") {
            return "Feneri Kpt";
        } else if (this.state.torchMode === "off") {
            return "Feneri Aç";
        }
    }

    _onBarCodeRead(e) {
        if (this.state.barcodeDetected === true) {
            return;
        }
        this.lastBarcodeData = e.nativeEvent;
        this.setState({barcodeDetected: true, torchMode: "off"});
        this._barCode.stopScan();
    }

    _resetBarcodeScan() {
        this.setState({barcodeDetected: false});

        setTimeout(() => {
            this._barCode.startScan()
        }, 500);
    }

    _onGoogleSearchPressed(searchString) {
        searchString = "https://www.google.com.tr/search?q=" + searchString;
        Linking.canOpenURL(searchString).then(supported => {
            console.log(searchString);
            if (supported){
                return Linking.openURL(searchString);
            }
        }).catch(err => {
            console.log(searchString);
            console.log(err);
        });
    }

    _onGoogleProductSearchPressed(searchString) {
        searchString = "https://www.google.com.tr/search?tbm=shop&q=" + searchString;
        Linking.canOpenURL(searchString).then(supported => {
            console.log(searchString);
            if (supported){
                return Linking.openURL(searchString);
            }
        }).catch(err => {
            console.log(searchString);
            console.log(err);
        });
    }
}

export default (BarcodeScan);