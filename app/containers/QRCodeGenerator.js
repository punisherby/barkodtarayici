import React, {Component} from "react";
import {TouchableOpacity, Platform, NativeModules, View, Alert, Image, Text, Modal, Linking, StyleSheet, TextInput, Dimensions, CameraRoll , ToastAndroid} from "react-native";
import {Icon, Button} from "react-native-elements";
import AppBaseContainer from "./AppBaseContainer";
import QRCode from 'react-native-qrcode-svg';
import RNFS from "react-native-fs"
import {socialShareService} from "../services/SocialShareService";

class QRCodeGenerator extends AppBaseContainer {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarHidden : true,
        screenBackgroundImageName: "background-photo"
    };

    state = {
        text: '',
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
                        <Text style={{marginTop: -5, textAlign: "center", fontFamily: "Verdana", fontSize: 18, fontWeight: "bold", color: "white"}}>QR Kod Oluştur</Text>
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
                    <View style={styles.container}>
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black", paddingBottom: 15}}>
                            Aşağıdaki alana bir yazı, websitesi adresi, gizli mesaj vb. girip kendi QR kodunuzu oluşturabilirsiniz.
                        </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => this.setState({text: text})}
                            value={this.state.text}
                            autoCapitalize="none"
                            placeholder=" Örn: http://www.facebook.com"
                            underlineColorAndroid="white"
                        />
                        <QRCode
                            getRef={(c) => (this.svg = c)}
                            value={this.state.text ? this.state.text : " "}
                            size={200}
                            color='black'/>
                    </View>
                </View>
            </View>
        );
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
            socialShareService.startNativeSharing(dataImage)
        })
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
        width: Dimensions.get('window').width < 400 ? 300 : 400,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        borderRadius: 5,
        padding: 5,
    }
});

export default (QRCodeGenerator);