import React, {Component} from "react";
import {TouchableOpacity, Platform, NativeModules, View, Alert, Image, Text, Modal, Linking, BackHandler, AsyncStorage, Clipboard} from "react-native";
import Barcode from 'react-native-smart-barcode';
import {Icon, Button} from "react-native-elements";
import AppBaseContainer from "./AppBaseContainer";
import Torch from 'react-native-torch';
import Permissions from 'react-native-permissions';
import DateHelper from "../helper/DateHelper";
import {optionsService} from "../services/OptionsService";
import {socialShareService} from "../services/SocialShareService";

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
        barcodeDetected : false,
        cameraKeepOfflineInterval: null,
        scannedBarcodeImage: null
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
        }, 200);

        this.cameraKeepOfflineInterval = setInterval(() => {
            if (this.state.barcodeDetected) {
                this._barCode.stopScan();
            }
        }, 1 * 1000);
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

        clearInterval(this.cameraKeepOfflineInterval);
    }

    componentWillReceiveProps(props) {
        console.log("hey heyhey", props);
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
                     scannerRectCornerColor="#42f4c5"
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
                        <Image style={{height: 250, width: 200}} source={{uri: 'data:image/png;base64, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABvFBMVEUAAAAA//8AnuwAnOsAneoAm+oAm+oAm+oAm+oAm+kAnuwAmf8An+0AqtUAku0AnesAm+oAm+oAnesAqv8An+oAnuoAneoAnOkAmOoAm+oAm+oAn98AnOoAm+oAm+oAmuoAm+oAmekAnOsAm+sAmeYAnusAm+oAnOoAme0AnOoAnesAp+0Av/8Am+oAm+sAmuoAn+oAm+oAnOoAgP8Am+sAm+oAmuoAm+oAmusAmucAnOwAm+oAmusAm+oAm+oAm+kAmusAougAnOsAmukAn+wAm+sAnesAmeoAnekAmewAm+oAnOkAl+cAm+oAm+oAmukAn+sAmukAn+0Am+oAmOoAmesAm+oAm+oAm+kAme4AmesAm+oAjuMAmusAmuwAm+kAm+oAmuoAsesAm+0Am+oAneoAm+wAmusAm+oAm+oAm+gAnewAm+oAle0Am+oAm+oAmeYAmeoAmukAoOcAmuoAm+oAm+wAmuoAneoAnOkAgP8Am+oAm+oAn+8An+wAmusAnuwAs+YAmegAm+oAm+oAm+oAmuwAm+oAm+kAnesAmuoAmukAm+sAnukAnusAm+oAmuoAnOsAmukAqv9m+G5fAAAAlHRSTlMAAUSj3/v625IuNwVVBg6Z//J1Axhft5ol9ZEIrP7P8eIjZJcKdOU+RoO0HQTjtblK3VUCM/dg/a8rXesm9vSkTAtnaJ/gom5GKGNdINz4U1hRRdc+gPDm+R5L0wnQnUXzVg04uoVSW6HuIZGFHd7WFDxHK7P8eIbFsQRhrhBQtJAKN0prnKLvjBowjn8igenQfkQGdD8A7wAAAXRJREFUSMdjYBgFo2AUDCXAyMTMwsrGzsEJ5nBx41HKw4smwMfPKgAGgkLCIqJi4nj0SkhKoRotLSMAA7Jy8gIKing0KwkIKKsgC6gKIAM1dREN3Jo1gSq0tBF8HV1kvax6+moG+DULGBoZw/gmAqjA1Ay/s4HA3MISyrdC1WtthC9ebGwhquzsHRxBfCdUzc74Y9UFrtDVzd3D0wtVszd+zT6+KKr9UDX749UbEBgULIAbhODVHCoQFo5bb0QkXs1RAvhAtDFezTGx+DTHEchD8Ql4NCcSyoGJYTj1siQRzL/JKeY4NKcSzvxp6RmSWPVmZhHWnI3L1TlEFDu5edj15hcQU2gVqmHTa1pEXJFXXFKKqbmM2ALTuLC8Ak1vZRXRxa1xtS6q3ppaYrXG1NWjai1taCRCG6dJU3NLqy+ak10DGImx07LNFCOk2js6iXVyVzcLai7s6SWlbnIs6rOIbi8ViOifIDNx0uTRynoUjIIRAgALIFStaR5YjgAAAABJRU5ErkJggg=="'}} />
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
                    setTimeout(() => {
                        this.pushToActiveScreenStack(this.getScreenMap().PermissionError.name);
                    }, 200);
                } else {
                    Permissions.request('photo')
                        .then(response2 => {
                            if (response2 === "denied" || response2 === "restricted") {
                                setTimeout(() => {
                                    this.pushToActiveScreenStack(this.getScreenMap().PermissionError.name);
                                }, 200);
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

    checkTorchSettingsAndEnable(){
        if(optionsService.getSingleOption(1)){
            this.state.torchMode = "on";
            Platform.OS == "ios" ? Torch.switchState(true) : NativeModules.CaptureModule.startFlash();
        }
    }

    _onBarCodeRead(e) {
        if (this.state.barcodeDetected === true) {
            return;
        }
        this.lastBarcodeData = e.nativeEvent;
        this._barCode.stopScan();
        this.setState({barcodeDetected: true, torchMode: "off"});

        this.getScannedImageAsBase64();

        if(optionsService.getSingleOption(0)){
            Clipboard.setString(e.nativeEvent.data.code);
        }

        this._saveItemAsHistoryItem(e.nativeEvent);

        this._openURLIfQRCodeContainsValidURL(e.nativeEvent.data);
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

    _openURLIfQRCodeContainsValidURL(data) {
        if (!optionsService.getSingleOption(1)) {
            return;
        }

        if (data.type.toLowerCase().indexOf("qr") == -1) {
            return;
        }

        let urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/g;


        let potentialUrl = data.code.toLowerCase();

        if (urlRegex.test(potentialUrl)) {
            if (!(potentialUrl.indexOf("http") == 0 || potentialUrl.indexOf("https") == 0 || potentialUrl.indexOf("ftp") == 0)){
                potentialUrl = "http://" + potentialUrl;
            }

            Linking.canOpenURL(potentialUrl).then(supported => {
                console.log(potentialUrl);
                if (supported){
                    return Linking.openURL(potentialUrl);
                }
            }).catch(err => {
                console.log(potentialUrl);
                console.log(err);
            });
        }
    }

    async _saveItemAsHistoryItem(barcodeItem) {
        if(!optionsService.getSingleOption(2)){
            return;
        }

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

    async snapshotResize (srcData, width, height) {
        let imageObj = new Image(),
            canvas   = document.createElement("canvas"),
            ctx      = canvas.getContext('2d'),
            xStart   = 0,
            yStart   = 0,
            aspectRadio,
            newWidth,
            newHeight;

        imageObj.src  = srcData;
        canvas.width  = width;
        canvas.height = height;

        aspectRadio = imageObj.height / imageObj.width;

        if(imageObj.height < imageObj.width) {
            //horizontal
            aspectRadio = imageObj.width / imageObj.height;
            newHeight   = height,
                newWidth    = aspectRadio * height;
            xStart      = -(newWidth - width) / 2;
        } else {
            //vertical
            newWidth  = width,
                newHeight = aspectRadio * width;
            yStart    = -(newHeight - height) / 2;
        }

        await ctx.drawImage(imageObj, xStart, yStart, newWidth, newHeight);

        return canvas.toDataURL("image/png", 0.75);
    }

    getScannedImageAsBase64(){
        socialShareService.takeScreenCaptureInBase64(this._barCode)
            .then((data) => {
                this.snapshotResize(data, 150, 150)
                    .then((dataImage) => {
                        this.setState({scannedBarcodeImage: dataImage})
                    });
            })
    }
}

export default (BarcodeScan);