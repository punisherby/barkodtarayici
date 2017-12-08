import React, {Component} from "react";
import {Icon, Button} from "react-native-elements";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    BackHandler
} from 'react-native';
import AppBaseContainer from "./AppBaseContainer";
import OpenSettings from 'react-native-open-settings';

const permissionEnablementText = Platform.OS == "ios"
    ? "Yukarıdaki Buton yardımı ile uygulama ayarlarınıza giderek, uygulama için gerekli Kamera ve Fotoğraf Galerisi yetkisine izin vermeniz gerekmektedir."
    : "Yukarıdaki Buton yardımı ile uygulama ayarlarınıza giderek, izinler sekmesinden uygulama için gerekli Kamera ve Depolama yetkisine izin vermeniz gerekmektedir.";

class PermissionError extends AppBaseContainer {

    componentWillMount() {
        if (Platform.OS == "android") {

            this.hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', function() {
                this.pushToActiveScreenStack(this.getScreenMap().BarcodeScan.name);
                return;
            });
        }
    }

    componentWillUnmount() {
        if (Platform.OS == "android") {
            this.hardwareBackPressListener.remove();
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#41bfeb"}}>
                <View style={{flex: 1, justifyContent: "center", alignItems:"center", padding: 10}}>
                    <View style={{flex: 0.3, justifyContent: "flex-start"}}>
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 18, fontWeight: "bold", color: "white"}}>
                            YETKİ HATASI, İZNİNİZ GEREKLİ
                        </Text>
                    </View>
                    <View style={{flex: 0.7, justifyContent: "flex-start"}}>
                        <Button
                            onPress={() => OpenSettings.openSettings()}
                            buttonStyle={{marginBottom: 8}}
                            backgroundColor="#EB1245"
                            borderRadius={4}
                            icon={{name: 'settings', type: 'simple-line-icon'}}
                            title={'UYGULAMA İZİN AYARLARI'} />
                        <Text style={{paddingTop: 15, textAlign: "center", fontFamily: "Verdana", fontSize: 18, fontWeight: "bold", color: "white"}}>
                            {permissionEnablementText}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default (PermissionError);