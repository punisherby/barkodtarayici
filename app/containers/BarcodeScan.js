import React, {Component} from "react";
import {TouchableOpacity, Platform, NativeModules, View, Alert} from "react-native";
import Barcode from 'react-native-smart-barcode';
import Torch from 'react-native-torch';
import { Container, Header, Content, Button } from 'native-base';
import AppBaseContainer from "./AppBaseContainer";

export let rootNavigator = null;

class BarcodeScan extends AppBaseContainer {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarHidden : true,
        screenBackgroundImageName: "background-photo"
    };

    barcodeDetected = false;

    state = {
        reportDate: null,
        torchMode: "off"
    };

    constructor(props){
        super(props);
        this.setStyle(this.navigatorStyle);
        rootNavigator = this.props.navigator;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    _onBarCodeRead(e) {
        if (this.barcodeDetected === true) {
            return;
        }
        this.barcodeDetected = true;
        this._barCode.stopScan();

        Alert.alert(
            'Barcode Detected',
            e.nativeEvent.data.code,
            [
                {text: 'OK', onPress: () => this._resetBarcodeScan()},
            ],
            { cancelable: false }
        )
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
        let icon;

        if (this.state.torchMode === "on") {
            icon = require('../images/ic_flash_on_white.png');
        } else if (this.state.torchMode === "off") {
            icon = require('../images/ic_flash_off_white.png');
        }

        return icon;
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "blue"}}>
              <Barcode style={{flex: 0.6, backgroundColor: "white"}}
                       ref={ component => this._barCode = component }
                       scannerRectWidth={300}
                       onBarCodeRead={(data) => this._onBarCodeRead(data)}/>
            </View>
        );
    }


    _resetBarcodeScan() {
        //wait for 1 second between each barcode event
        setTimeout(() => {
            this.barcodeDetected = false;
            this._barCode.startScan()
        }, 1000);
    }
}

export default (BarcodeScan);