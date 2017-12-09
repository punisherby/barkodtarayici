import React, {Component} from "react";
import {TouchableOpacity, Platform, NativeModules, View, Alert, Image, Text, Modal, Linking, AsyncStorage, FlatList} from "react-native";
import {Icon, Button, List, ListItem} from "react-native-elements";
import AppBaseContainer from "./AppBaseContainer";
import DateHelper from "../helper/DateHelper";

class PreviousBarcodes extends AppBaseContainer {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarHidden : true,
        screenBackgroundImageName: "background-photo"
    };

    state = {
        barcodeScanHistory: [],
        isBarcodeClicked: false,
        lastBarcodeData: null
    }

    constructor(props){
        super(props);
        this.setStyle(this.navigatorStyle);
    }

    async componentDidMount() {
        try {
            const value = await AsyncStorage.getItem('barcodeScanHistory');
            if (value !== null){
                this.setState({barcodeScanHistory: JSON.parse(value).reverse()});
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

                <View style={{flex: 0.9}}>
                    <List>
                        <FlatList
                            data={this.state.barcodeScanHistory}
                            renderItem={({ item, i }) => (
                                <ListItem
                                    key={item.date}
                                    title={DateHelper.dateToFullDateTimeString(item.date)}
                                    subtitle={item.code}
                                    leftIcon={{name: this.isQRCode(item.type) ? "qrcode" : "barcode-scan", type: "material-community", color: "#41bfeb", style: {fontSize: 30}}}
                                    onPress={() => this.setState({isBarcodeClicked: true, lastBarcodeData: item})}
                                />
                            )}
                        />
                    </List>
                </View>
                {this._renderBarcodeFoundModal()}
            </View>
        );
    }

    _renderBarcodeFoundModal() {
        return (
            <Modal
                offset={50}
                visible={this.state.isBarcodeClicked}
                transparent={true}
                onRequestClose={() => {
                }}
                animationType={'fade'}
                closeOnTouchOutside={false}>
                <View style={{backgroundColor: "#00000044", flex: 1, height: null}}>
                    <View style={{borderRadius: 2, marginHorizontal: 20, marginTop: 40, marginBottom: 40, padding: 10, backgroundColor: "white",}}>
                        <View style={{paddingLeft: 15, paddingBottom: 15, paddingTop: 30}}>
                            <Text style={{fontWeight: "bold"}}>Barkod Tipi : </Text>
                            <Text style={{paddingRight: 15}}>{this.state.lastBarcodeData ? this.state.lastBarcodeData.type : undefined}</Text>
                        </View>
                        <View style={{paddingLeft: 15, paddingBottom: 15}}>
                            <Text style={{fontWeight: "bold"}}>Barkod No / İçerik : </Text>
                            <Text style={{paddingRight: 15}}>{this.state.lastBarcodeData ? this.state.lastBarcodeData.code : undefined}</Text>
                        </View>
                        <Icon
                            name='md-arrow-round-down'
                            type='ionicon'
                            size={22}
                            containerStyle={{marginBottom: 15}}
                            color="black"
                        />
                        <Button
                            onPress={() => this._onGoogleSearchPressed(this.state.lastBarcodeData.code)}
                            buttonStyle={{marginBottom: 8}}
                            backgroundColor="#41bfeb"
                            borderRadius={4}
                            icon={{name: 'google', type: 'font-awesome'}}
                            title={'Google\'da Ara'} />

                        <Button
                            onPress={() => this._onGoogleProductSearchPressed(this.state.lastBarcodeData.code)}
                            buttonStyle={{marginBottom: 8}}
                            backgroundColor="#41bfeb"
                            borderRadius={4}
                            icon={{name: 'shopping-cart', type: 'font-awesome'}}
                            title={'Ürün Olarak Ara'} />

                        <Button
                            onPress={() => this.closeModal()}
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

    isQRCode(type) {
        if(type.toLowerCase().indexOf("qr") > -1){
            return true;
        }
        return false;
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

    closeModal() {
        this.setState({isBarcodeClicked: false});
    }
}

export default (PreviousBarcodes);