import React, {Component} from "react";
import {
    TouchableOpacity, Platform, NativeModules, View, Alert, Image, Text, Modal, Linking, TextInput,
    Dimensions
} from "react-native";
import {Icon, Button} from "react-native-elements";
import AppBaseContainer from "./AppBaseContainer";
import * as Animatable from 'react-native-animatable';
import {socialShareService} from "../services/SocialShareService";

class Contact extends AppBaseContainer {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarHidden : true,
        screenBackgroundImageName: "background-photo"
    };

    state = {
        inviteText : ''
    }

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
                        <Text style={{marginTop: -5, textAlign: "center", fontFamily: "Verdana", fontSize: 18, fontWeight: "bold", color: "white"}}>Arkadaşını Davet Et</Text>
                    </View>
                    <View style={{flex: 0.1}}>
                    </View>
                </View>

                <View style={{flex: 0.2, padding: 10, flexDirection: "column", alignItems: "center", justifyContent: "flex-end"}}>
                    <Icon
                        name="share"
                        type='font-awesome'
                        size={36}
                        color="#41bfeb"
                    />
                    <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>
                        Bu uygulamayı beğendiysen arkadaşlarınla paylaşabilirsin :)
                    </Text>
                </View>
                <View style={{flex: 0.7, padding: 10, flexDirection: "column", alignItems: "center", justifyContent: "flex-start"}}>
                    <Animatable.Text style={{fontFamily: "Verdana", fontSize: 18, fontWeight: "bold", color: "#41bfeb"}} animation="flipInX" delay={300} duration={1000} iterationCount={1} direction="alternate">Arkadaşını Davet Et</Animatable.Text>
                    <Text style={{paddingTop: 20, paddingBottom: 4, textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>
                        Mesajınız (opsiyonel):
                    </Text>
                    <TextInput
                        style={{width: Dimensions.get('window').width < 400 ? 280 : 380, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({inviteText: text})}
                        multiline={true}
                        editable = {true}
                        numberOfLines={4}
                        underlineColorAndroid="white"
                    />
                    <View style={{height: 20}}></View>
                    <Button
                        onPress={() => this.share()}
                        backgroundColor="#41bfeb"
                        borderRadius={4}
                        icon={{name: 'share', type: 'font-awesome'}}
                        title={'Davet Et'} />
                </View>
            </View>
        );
    }

    share() {
        socialShareService.startNativeSharingTextOnly("Barkod Tarayıcı uygulamasına arkadaşın seni de davet etti. Android uygulaması: https://play.google.com/store/apps/details?id=com.barkodtarayici", this.state.inviteText);
    }
}

export default (Contact);