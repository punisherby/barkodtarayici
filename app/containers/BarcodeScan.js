import React, {Component} from "react";
import {TouchableOpacity, Platform, NativeModules, View, Alert, Image, Text, Modal, Linking, BackHandler, AsyncStorage} from "react-native";
import Barcode from 'react-native-smart-barcode';
import {Icon, Button} from "react-native-elements";
import AppBaseContainer from "./AppBaseContainer";
import Torch from 'react-native-torch';
import Permissions from 'react-native-permissions';
import DateHelper from "../helper/DateHelper";

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
    lastBackPagePressedTime;

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

    componentWillMount() {
        if (Platform.OS == "android") {
            this.hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', this._blockBackPage.bind(this));
        }
    }

    componentWillUnmount() {
        if (Platform.OS == "android") {
            this.hardwareBackPressListener.remove();
        }
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
                        <View style={{paddingLeft: 15, paddingBottom: 15, paddingTop: 30}}>
                            <Text style={{fontWeight: "bold"}}>Barkod Tipi : </Text>
                            <Text style={{paddingRight: 15}}>{this.lastBarcodeData ? JSON.stringify(this.lastBarcodeData.data.type) : undefined}</Text>
                        </View>
                        <View style={{paddingLeft: 15, paddingBottom: 15}}>
                            <Text style={{fontWeight: "bold"}}>Barkod No / İçerik : </Text>
                            <Text style={{paddingRight: 15}}>{this.lastBarcodeData ? JSON.stringify(this.lastBarcodeData.data.code) : undefined}</Text>
                        </View>
                        <Icon
                            name='md-arrow-round-down'
                            type='ionicon'
                            size={22}
                            containerStyle={{marginBottom: 15}}
                            color="black"
                        />
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
                                    this.setState({cameraPhotoPermissionGranted: true});
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

        this._saveItemAsHistoryItem(e.nativeEvent);
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

    _blockBackPage() {
        let currentTime = DateHelper.getTimeInMilliSeconds();
        if (this.lastBackPagePressedTime) {
            if (currentTime - this.lastBackPagePressedTime < 500) {
                BackHandler.exitApp();
                return false;
            } else {
                this.lastBackPagePressedTime = currentTime;
                return true;
            }
        }
        this.lastBackPagePressedTime = currentTime;
        return true;
    }

    async _saveItemAsHistoryItem(barcodeItem) {
        let barcodeScanArray = [];
        let barcodeObj = {...barcodeItem.data, date : DateHelper.getCurrentDate()}

        try {
            const value = await AsyncStorage.getItem('barcodeScanHistory');
            if (value !== null){
                barcodeScanArray = JSON.parse(value);
            }
            barcodeScanArray.push(barcodeObj);

            try {
                await AsyncStorage.setItem('barcodeScanHistory' , JSON.stringify(barcodeScanArray));
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default (BarcodeScan);