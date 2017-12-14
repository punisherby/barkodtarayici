import React, {Component} from "react";
import {TouchableOpacity, Platform, NativeModules, View, Alert, Image, Text, Modal, Linking, BackHandler, AsyncStorage, Clipboard, ActivityIndicator} from "react-native";
import Barcode from 'react-native-smart-barcode';
import {Icon, Button} from "react-native-elements";
import AppBaseContainer from "./AppBaseContainer";
import Torch from 'react-native-torch';
import Permissions from 'react-native-permissions';
import DateHelper from "../helper/DateHelper";
import {optionsService} from "../services/OptionsService";
import {socialShareService} from "../services/SocialShareService";
import {dropDownAlertService} from "../services/DropDownAlertService";

export let rootNavigator = null;

class BarcodeScan extends AppBaseContainer {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarHidden : true,
        screenBackgroundImageName: "background-photo"
    };

    state = {
        shouldCameraShow: false,
        cameraPhotoPermissionGranted : false,
        torchMode: "off",
        barcodeDetected : false,
        barcodeDetectedEvent: false,
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
            if (this.state.barcodeDetected || this.state.barcodeDetectedEvent) {
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
        this.setState({shouldCameraShow: false});
        clearInterval(this.cameraKeepOfflineInterval);

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
                    <View style={{flex: 0.1, alignItems: "center", paddingRight: 10}}>
                        <Icon
                            name="info-circle"
                            type='font-awesome'
                            size={30}
                            containerStyle={{backgroundColor: "transparent", width: 36, height: 36}}
                            underlayColor="transparent"
                            color="white"
                            onPress={() =>this.dropdown.alertWithType('info', dropDownAlertService.barcodeScanInfoHeaderText, dropDownAlertService.barcodeScanInfoText)}
                        />
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
                {this.state.shouldCameraShow && this.state.cameraPhotoPermissionGranted ? this._renderBarcodeScanner() : this._renderSpinner()}
                {this.state.barcodeDetected ? this._renderBarcodeFoundModal() : undefined}
                {this.state.barcodeDetectedEvent ? this._renderBarcodeFoundEventModal() : undefined}
                {dropDownAlertService.renderDropDownElement(this, 11, 5000)}
            </View>
        );
    }

    _renderBarcodeScanner() {
        return (
            <View style={{flex: 0.75, backgroundColor: "transparent"}}>
                <View style={{paddingRight: 10, paddingLeft: 10, marginBottom: -30, zIndex: 10, alignItems: "center"}}>
                    <Text style={{fontFamily: "Verdana", fontSize: 12, color: "#bfbfbf", textAlign: "center"}}>
                        Barkod veya QR kodu okutmak için{"\n"}orta çerçeveyi görüntüye odaklayın
                    </Text>
                </View>
                <Barcode style={{flex: 1, backgroundColor: "transparent"}}
                     ref={ component => this._barCode = component }
                     scannerRectWidth={300}
                     barCodeTypes={["AZTEC", "CODABAR", "CODE_39", "CODE_93", "CODE_128", "DATA_MATRIX", "EAN_8", "EAN_13", "ITF", "MAXICODE", "PDF_417", "QR_CODE", "RSS_14", "RSS_EXPANDED", "UPC_A", "UPC_E", "UPC_EAN_EXTENSION"]}
                     scannerRectCornerColor="#42f4c5"
                     onBarCodeRead={(data) => this._onBarCodeRead(data)}/>
            </View>
        )
    }

    _renderSpinner() {
        return (
            <View style={{flex: 0.75, justifyContent: "center"}}>
                <ActivityIndicator color="#41bfeb" size="large"/>
            </View>
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

    _renderBarcodeFoundEventModal() {
        let activity = (this.lastBarcodeData.data.code).replace("BEGIN:VEVENT" + "\r\n", "").replace("\r\n" + "END:VEVENT", "").split("\r\n");
        let title = activity[0].replace("SUMMARY:", "");
        let location = activity[1].replace("LOCATION:", "");
        let desc = activity[2].replace("DESCRIPTION:", "")
        let startDate = activity[3].replace("DTSTART:", "");
        let endDate = activity[4].replace("DTEND:", "");

        return (
            <Modal
                offset={50}
                visible={this.state.barcodeDetectedEvent}
                transparent={true}
                onRequestClose={() => {
                }}
                animationType={'fade'}
                closeOnTouchOutside={false}>
                <View style={{backgroundColor: "#00000044", flex: 1, height: null}}>
                    <View style={{borderRadius: 2, marginHorizontal: 20, marginTop: 40, marginBottom: 40, padding: 10, backgroundColor: "white",}}>
                        <View collapsable={false} ref={(ref) => this.screenViewRef = ref} style={{backgroundColor: "#41bfeb", paddingBottom: 10, borderRadius: 6}}>
                            <Icon
                                name='event-available'
                                type='material-icons'
                                size={36}
                                containerStyle={{marginBottom: 15, paddingTop: 10}}
                                color="black"
                            />
                            <View style={{paddingLeft: 15, paddingBottom: 5}}>
                                <Text style={{fontWeight: "bold"}}>Etkinlik Adı : </Text>
                                <Text style={{paddingRight: 15}}>{title}</Text>
                            </View>
                            <View style={{paddingLeft: 15, paddingBottom: 5}}>
                                <Text style={{fontWeight: "bold"}}>Açıklama : </Text>
                                <Text style={{paddingRight: 15}}>{desc}</Text>
                            </View>
                            <View style={{paddingLeft: 15, paddingBottom: 5}}>
                                <Text style={{fontWeight: "bold"}}>Lokasyon : </Text>
                                <Text style={{paddingRight: 15}}>{location}</Text>
                            </View>
                            <View style={{paddingLeft: 15, paddingBottom: 5}}>
                                <Text style={{fontWeight: "bold"}}>Başlangıç : </Text>
                                <Text style={{paddingRight: 15}}>{startDate}</Text>
                            </View>
                            <View style={{paddingLeft: 15, paddingBottom: 5}}>
                                <Text style={{fontWeight: "bold"}}>Bitiş : </Text>
                                <Text style={{paddingRight: 15}}>{endDate}</Text>
                            </View>
                        </View>
                        <Icon
                            name='md-arrow-round-down'
                            type='ionicon'
                            size={22}
                            containerStyle={{marginBottom: 15}}
                            color="black"
                        />

                        <Button
                            onPress={() => this._onEventSharePressed(this.lastBarcodeData.data.code)}
                            buttonStyle={{marginBottom: 8}}
                            backgroundColor="#41bfeb"
                            borderRadius={4}
                            icon={{name: 'share', type: 'font-awesome'}}
                            title={'Etkinliği Paylaş'} />

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
                                    this.setState({cameraPhotoPermissionGranted: true, shouldCameraShow: true});
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
        if (this.state.barcodeDetected || this.state.barcodeDetectedEvent) {
            return;
        }
        this.lastBarcodeData = e.nativeEvent;
        this._barCode.stopScan();

        let ifQRType = this._detectIfQRCodeType(this.lastBarcodeData.data);

        if (ifQRType) {
            if (ifQRType == "url") {
                this.setState({barcodeDetected: true, torchMode: "off"});
                this._openQRCodeURL(this.lastBarcodeData.data);
            } else if (ifQRType == "event") {
                this.setState({barcodeDetectedEvent: true, torchMode: "off"});
            }
            else {
                this.setState({barcodeDetected: true, torchMode: "off"});
            }
        } else {
            this.setState({barcodeDetected: true, torchMode: "off"});
        }

        console.log ("ifQRType", ifQRType);

        if(optionsService.getSingleOption(0)){
            Clipboard.setString(this.lastBarcodeData.data.code);
        }

        this._saveItemAsHistoryItem(this.lastBarcodeData);
    }

    _resetBarcodeScan() {
        this.setState({barcodeDetected: false, barcodeDetectedEvent: false});

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

    _onEventSharePressed() {
        socialShareService.startNativeSharingWithRef(this.screenViewRef, "Bu Etkinlik, Barkod Tarayıcı ile oluşturulmuştur. Android uygulaması: https://play.google.com/store/apps/details?id=com.barkodtarayici");
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

    _openQRCodeURL(data) {
        if (!optionsService.getSingleOption(1)) {
            return false;
        }

        let potentialUrl = data.code.toLowerCase();

        if (!(potentialUrl.indexOf("http") == 0 || potentialUrl.indexOf("https") == 0 || potentialUrl.indexOf("ftp") == 0)){
            potentialUrl = "http://" + potentialUrl;
        }

        Linking.canOpenURL(potentialUrl).then(supported => {
            if (supported){
                return Linking.openURL(potentialUrl);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    _detectIfQRCodeType(data) {
        const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/g;

        if (data.type.toLowerCase().indexOf("qr") == -1) {
            return null;
        }
        let code = data.code;

        if(urlRegex.test(code.toLowerCase())) {
            return "url";
        } else if (code.indexOf("BEGIN:VEVENT") > -1 && code.indexOf("END:VEVENT") > -1 ) {
            return "event";
        }
        else {
            return "qr";
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