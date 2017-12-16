import React, {Component} from "react";
import {TouchableOpacity, Platform, NativeModules, View, Alert, Image, Text, Modal, Linking} from "react-native";
import {Icon, Button} from "react-native-elements";
import AppBaseContainer from "./AppBaseContainer";
import * as Animatable from 'react-native-animatable';

class About extends AppBaseContainer {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarHidden : true,
        screenBackgroundImageName: "background-photo"
    };

    constructor(props){
        super(props);
        this.setStyle(this.navigatorStyle);
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
                        <Text style={{marginTop: -5, textAlign: "center", fontFamily: "Verdana", fontSize: 18, fontWeight: "bold", color: "white"}}>Hakkında</Text>
                    </View>
                    <View style={{flex: 0.1}}>
                    </View>
                </View>

                <View style={{flex: 0.2, padding: 10, flexDirection: "column", alignItems: "center", justifyContent: "flex-end"}}>
                    <Icon
                        name='information-outline'
                        type='material-community'
                        size={50}
                        color="#41bfeb"
                    />
                    <Text style={{paddingTop: 10, textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>
                        Version 1.9
                    </Text>
                </View>

                <View style={{flex: 0.7, padding: 10, flexDirection: "column", alignItems: "center", justifyContent: "flex-start"}}>
                    <Animatable.Text style={{fontFamily: "Verdana", fontSize: 18, fontWeight: "bold", color: "#41bfeb"}} animation="flipInX" delay={300} duration={1000} iterationCount={1} direction="alternate">Barkod Tarayıcı</Animatable.Text>
                    <Text style={{paddingTop: 20, textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>
                        Bu uygulama her türlü Barkod ve QR kod okuyabilmekte olan güçlü bir algoritmik görüntü işleme teknolojisine sahiptir.
                    </Text>
                    <Text style={{paddingTop: 30, textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>
                        Hata bildirimi ve şu özellik de olsaydı çok iyi olurdu tarzında geri bildirimlerinizi İletişim bölümünden iletin :)
                    </Text>
                </View>
            </View>
        );
    }
}

export default (About);