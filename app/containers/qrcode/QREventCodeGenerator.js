import React, {Component} from "react";
import {TouchableOpacity, Platform, NativeModules, View, Alert, Image, Text, Modal, Linking, StyleSheet, TextInput, Dimensions, CameraRoll , ToastAndroid, ScrollView} from "react-native";
import {Icon, Button} from "react-native-elements";
import AppBaseContainer from "../AppBaseContainer";
import QRCode from 'react-native-qrcode-svg';
import RNFS from "react-native-fs"
import {socialShareService} from "../../services/SocialShareService";
import {dropDownAlertService} from "../../services/DropDownAlertService";
import _ from "lodash";
import DateHelper from "../../helper/DateHelper";

class QREventCodeGenerator extends AppBaseContainer {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarHidden : true,
        screenBackgroundImageName: "background-photo"
    };

    state = {
        eventTitle: '',
        eventDesc: '',
        eventLocation: '',
        startTime: '',
        endTime: '',
        qrCodeText: ''
    };

    constructor(props){
        super(props);
        this.setStyle(this.navigatorStyle);
        this.onChangeStartTextDelayed = _.debounce((text) => this._onDateStartTextStringChange(text), 1500);
        this.onChangeEndTextDelayed = _.debounce((text) => this._onDateEndTextStringChange(text), 1500);
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
                        <Text style={{marginTop: -5, textAlign: "center", fontFamily: "Verdana", fontSize: 18, fontWeight: "bold", color: "white"}}>QR Etkinlik Kodu Oluştur</Text>
                    </View>
                    <View style={{flex: 0.1, alignItems: "center", paddingRight: 10}}>
                        <Icon
                            name="info-circle"
                            type='font-awesome'
                            size={30}
                            containerStyle={{backgroundColor: "transparent", width: 36, height: 36}}
                            underlayColor="transparent"
                            color="white"
                            onPress={() => this.dropdown.alertWithType('info', dropDownAlertService.QREventGeneratorInfoHeaderText, dropDownAlertService.QREventGeneratorInfoText)}
                        />
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
                    <TouchableOpacity onPress={() => this.saveQrToDisk()} style={{height: 60, width: 80, borderColor: "black", borderWidth: 0.4, borderRadius: 8, marginRight: 10, padding: 2}}>
                        <Icon
                            name="download"
                            type='font-awesome'
                            size={36}
                            color="#41bfeb"
                        />
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>Kaydet</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flex: 0.70, padding: 4, flexDirection: "column", alignItems: "center"}}>
                    <ScrollView style={styles.container} scrollEnabled pagingEnabled>
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => {this.state.eventTitle  = text ; this.setState({qrCodeText: this._qrEventTextBuilder()})}}
                                value={this.state.eventTitle}
                                autoCapitalize="none"
                                placeholder="Etkinlik İsmi"
                                underlineColorAndroid="white"
                            />
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => {this.state.eventDesc  = text ; this.setState({qrCodeText: this._qrEventTextBuilder()})}}
                                value={this.state.eventDesc}
                                autoCapitalize="none"
                                placeholder="Açıklama"
                                underlineColorAndroid="white"
                            />
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => {this.state.eventLocation  = text ; this.setState({qrCodeText: this._qrEventTextBuilder()})}}
                                value={this.state.eventLocation}
                                autoCapitalize="none"
                                placeholder="Lokasyon"
                                underlineColorAndroid="white"
                            />
                            <TextInput
                                style={styles.input}
                                onChangeText={this.onChangeStartTextDelayed}
                                autoCapitalize="none"
                                placeholder="Başln. Tarih Saat (GG/AA/YYYY Saat:Dakika)"
                                underlineColorAndroid="white"
                            />
                            <TextInput
                                style={[styles.input, {marginBottom: 15}]}
                                onChangeText={this.onChangeEndTextDelayed}
                                autoCapitalize="none"
                                placeholder="Bitiş Tarih Saat (GG/AA/YYYY Saat:Dakika)"
                                underlineColorAndroid="white"
                            />
                            <QRCode
                                getRef={(c) => (this.svg = c)}
                                value={this.state.qrCodeText ? this.state.qrCodeText : " "}
                                size={200}
                                color='black'/>
                        </View>
                    </ScrollView>
                </View>
                {dropDownAlertService.renderDropDownElement(this, 4, 5000)}
            </View>
        );
    }

    _onDateStartTextStringChange(text) {
        if (!DateHelper.isValidDateTime(text)) {
            this.dropdown.alertWithType('warn', dropDownAlertService.QREventGeneratorTimeFormatErrorHeaderText, dropDownAlertService.QREventGeneratorTimeFormatErrorText)
        } else {
            this.state.startTime  = text ;
        }
    }

    _onDateEndTextStringChange(text) {
        if (!DateHelper.isValidDateTime(text)) {
            this.dropdown.alertWithType('warn', dropDownAlertService.QREventGeneratorTimeFormatErrorHeaderText, dropDownAlertService.QREventGeneratorTimeFormatErrorText)
        } else {
            this.state.endTime  = text ;
            this.setState({qrCodeText: this._qrEventTextBuilder()});
        }
    }

    _qrEventTextBuilder() {
        return "BEGIN:VEVENT" + "\r\n" + "SUMMARY:" + this.state.eventTitle
            + "\r\n" + "LOCATION:" + this.state.eventLocation
            + "\r\n" + "DESCRIPTION:" + this.state.eventDesc
            + "\r\n" + "DTSTART:" + this.state.startTime
            + "\r\n" + "DTEND:" + this.state.endTime
            + "\r\n" + "END:VEVENT";

    }

    saveQrToDisk() {
        this.svg.toDataURL((data) => {
            RNFS.writeFile(RNFS.CachesDirectoryPath+"/qrcode_.png", data, 'base64')
                .then((success) => {
                    return CameraRoll.saveToCameraRoll(RNFS.CachesDirectoryPath+"/qrcode_.png", 'photo')
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
        let dataImage = "data:image/png;base64,";
        this.svg.toDataURL((data) => {
            dataImage += data;
            socialShareService.startNativeSharing(dataImage, "Bu Etkinlik QR Kodu Barkod Tarayıcı ile oluşturulmuştur. İçeriğini öğrenmek için Android uygulaması: https://play.google.com/store/apps/details?id=com.barkodtarayici")
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    input: {
        width: Dimensions.get('window').width < 400 ? 300 : 400,
        height: 30,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 5,
        borderRadius: 5,
        padding: 5,
    }
});

export default (QREventCodeGenerator);