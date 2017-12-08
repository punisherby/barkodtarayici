import React, {Component} from "react";
import {TouchableOpacity, Platform, NativeModules, View, Alert, Image, Text, Modal, Linking, AsyncStorage} from "react-native";
import {Icon, Button} from "react-native-elements";
import AppBaseContainer from "./AppBaseContainer";

class PreviousBarcodes extends AppBaseContainer {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarHidden : true,
        screenBackgroundImageName: "background-photo"
    };

    state = {
        barcodeScanHistory: null
    }

    constructor(props){
        super(props);
        this.setStyle(this.navigatorStyle);
    }

    async componentDidMount() {
        try {
            const value = await AsyncStorage.getItem('barcodeScanHistory');
            console.log(value);
            if (value !== null){
                console.log(value);
                this.setState({barcodeScanHistory: value});
            }
        } catch (error) {
            console.log(error);
        }
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
                        <Text style={{marginTop: -5, textAlign: "center", fontFamily: "Verdana", fontSize: 18, fontWeight: "bold", color: "white"}}>Geçmiş Barkodlarım</Text>
                    </View>
                    <View style={{flex: 0.1}}>
                    </View>
                </View>

                <View style={{flex: 0.9, padding: 4, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                    <Text>{this.state.barcodeScanHistory ? this.state.barcodeScanHistory : "No barcode Could Found"}</Text>
                </View>
            </View>
        );
    }
}

export default (PreviousBarcodes);