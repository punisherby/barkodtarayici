import React, {Component} from "react";
import {TouchableOpacity, Platform, NativeModules, View, Alert, Image, Text, Modal, Linking, StyleSheet, TextInput, Dimensions, CameraRoll , ToastAndroid, Picker} from "react-native";
import {Icon, Button} from "react-native-elements";
import AppBaseContainer from "./AppBaseContainer";
import QRCode from 'react-native-qrcode-svg';
import RNFS from "react-native-fs"
import {socialShareService} from "../services/SocialShareService";
import Barcode from 'react-native-barcode-builder';
import { Dropdown } from 'react-native-material-dropdown';

class BarcodeGenerator extends AppBaseContainer {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarHidden : true,
        screenBackgroundImageName: "background-photo"
    };

    screenViewRef;

    state = {
        text: '',
        type: 'CODE128',
        error: false
    };

    constructor(props){
        super(props);
        this.setStyle(this.navigatorStyle);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {

        let data = [
            {
                value: 'CODE128',
            },
            {
                value: 'EAN13',
            },
            {
                value: 'EAN8',
            },
            {
                value: 'UPC',
            },
            {
                value: 'CODE39',
            },
            {
                value: 'ITF',
            },
            {
                value: 'ITF14',
            },
            {
                value: 'MSI',
            },
            {
                value: 'pharmacode',
            },
            {
                value: 'codabar',
            }
        ];

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
                        <Text style={{marginTop: -5, textAlign: "center", fontFamily: "Verdana", fontSize: 18, fontWeight: "bold", color: "white"}}>Barkod Oluştur</Text>
                    </View>
                    <View style={{flex: 0.1}}>
                    </View>
                </View>

                <View style={{flex: 0.15, padding: 4, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                    <TouchableOpacity onPress={() => this.share()} style={{height: 60, width: 80, borderColor: "black", borderWidth: 0.4, borderRadius: 8, marginRight: 10, padding: 2}}>
                        <Icon
                            name="share"
                            type='font-awesome'
                            size={36}
                            color="#41bfeb"
                        />
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>Paylaş</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.saveBarcodeToDisk()} style={{height: 60, width: 80, borderColor: "black", borderWidth: 0.4, borderRadius: 8, marginRight: 10, padding: 2}}>
                        <Icon
                            name="download"
                            type='font-awesome'
                            size={36}
                            color="#41bfeb"
                        />
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>Kaydet</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flex: 0.7, padding: 4, flexDirection: "column", alignItems: "center"}}>
                    <View style={{flex: 0.6, flexDirection: "column", alignItems: "flex-start", justifyContent: "center", paddingLeft: 10}}>
                        <Text style={{fontFamily: "Verdana", fontSize: 12, color: "grey", paddingBottom: 4}}>
                            Barkod
                        </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => { this.state.error= false; this.setState({text: text})}}
                            value={this.state.text}
                            autoCapitalize="none"
                            placeholder=" Örn: 123456"
                            underlineColorAndroid="white"
                        />
                        <Dropdown
                            label='Barkod tipi seçin'
                            labelFontSize={13}
                            data={data}
                            containerStyle={styles.pickerInput}
                            value={this.state.type}
                            onChangeText={(value) => this._onTypeSelected(value)}
                        />
                    </View>
                    <View style={{flex: 0.4, width: Dimensions.get('window').width < 400 ? 280 : 380, alignItems: "center", paddingLeft: 10}}>
                        {!this.state.error ?
                            <View style={{flexDirection:'column'}}>
                                <View style={{alignItems: "flex-start"}}>
                                    <Text style={{fontFamily: "Verdana", fontSize: 12, color: "grey"}}>
                                        Barkodunuz
                                    </Text>
                                </View>
                                <View style={{width: Dimensions.get('window').width < 400 ? 280 : 380, paddingTop: 10}}>
                                    <View collapsable={false} ref={(ref) => this.screenViewRef = ref} style={{backgroundColor: "white"}}>
                                        <Barcode value={this.state.text ? this.state.text : " "} format={this.state.type} width={1.2} onError={() => this.setState({error: true})} flat/>
                                        <Text style={{textAlign: "center", color: "black", fontSize: 11, marginTop: -10, paddingBottom: 10}}>{this.state.text ? this.state.text : " "}</Text>
                                    </View>
                                </View>
                            </View>
                                :
                            <View style={{flex: 1}}>
                                <Icon
                                    name="warning"
                                    type='font-awesome'
                                    size={36}
                                    color="red"
                                />
                                <Text style={{textAlign: "center", color: "black", fontSize: 11}}>Barkod Tipi ve Barkod uyumlu değil.</Text>
                                <Text style={{textAlign: "center", color: "black", fontSize: 11}}>Barkod tipi ya da Barkod'u değiştirip tekrar deneyin.</Text>
                            </View>
                        }
                    </View>
                </View>
            </View>
        );
    }

    _onTypeSelected(value) {
        this.state.error= false;
        this.setState({type: value});
    }

    saveBarcodeToDisk() {
        socialShareService.takeScreenCaptureInBase64(this.screenViewRef)
            .then((data) => {
                RNFS.writeFile(RNFS.CachesDirectoryPath+"/barcode_.png", data, 'base64')
                    .then((success) => {
                        return CameraRoll.saveToCameraRoll(RNFS.CachesDirectoryPath+"/barcode_.png", 'photo')
                    })
                    .then(() => {
                        if (Platform.OS == "ios") {

                        }else {
                            ToastAndroid.show('QR Kod fotoğraf kütüphanenize kayıt edildi!', ToastAndroid.SHORT)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
        })
    }

    share() {
        socialShareService.startNativeSharingWithRef(this.screenViewRef);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        width: Dimensions.get('window').width < 400 ? 280 : 380,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    pickerInput: {
        width: Dimensions.get('window').width < 400 ? 280 : 380,
        borderColor: 'gray',
        paddingTop: 20
    }
});

export default (BarcodeGenerator);