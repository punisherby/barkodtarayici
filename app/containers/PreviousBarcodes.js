import React, {Component} from "react";
import {TouchableOpacity, Platform, NativeModules, View, Alert, Image, Text, Modal, Linking, AsyncStorage, FlatList, ActivityIndicator} from "react-native";
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
        isBarcodeScanHistoryRecieved: false,
        isBarcodeClicked: false,
        lastBarcodeData: null,
    }

    constructor(props){
        super(props);
        this.setStyle(this.navigatorStyle);
    }

    async componentDidMount() {
        try {
            const value = await AsyncStorage.getItem('barcodeScanHistory');
            if (value !== null){
                this.setState({barcodeScanHistory: JSON.parse(value).reverse(), isBarcodeScanHistoryRecieved: true});
            } else {
                this.setState({isBarcodeScanHistoryRecieved: true});
            }
        } catch (error) {
            console.log(error);
            this.setState({isBarcodeScanHistoryRecieved: true});
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

                <View style={{flex: 0.15, padding: 4, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                    <TouchableOpacity onPress={() => this.pushToActiveScreenStack(this.getScreenMap().BarcodeScan.name)} style={{height: 60, width: 80, borderColor: "black", borderWidth: 0.4, borderRadius: 8, marginRight: 10, padding: 2}}>
                        <Icon
                            name="barcode-scan"
                            type='material-community'
                            size={36}
                            color="#41bfeb"
                        />
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>Barkod Tara</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._deletePreviousBarcodesConfirmation()} style={{height: 60, width: 80, borderColor: "black", borderWidth: 0.4, borderRadius: 8, marginRight: 10, padding: 2}}>
                        <Icon
                            name="delete-forever"
                            type='material-community'
                            size={36}
                            color="#41bfeb"
                        />
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>Geçmişi Sil</Text>
                    </TouchableOpacity>
                </View>
                {!this.state.isBarcodeScanHistoryRecieved ? this._renderSpinner() : (this.state.barcodeScanHistory.length > 0 ? this._renderPreviousBarcodeList() : this._renderNoBarcodeFound())}
                {this._renderBarcodeFoundModal()}
            </View>
        );
    }

    _renderPreviousBarcodeList() {
        return (
            <View style={{flex: 0.75}}>
                <List>
                    <FlatList
                        data={this.state.barcodeScanHistory}
                        renderItem={({ item, i }) => (
                            <ListItem
                                key={item.date}
                                title={DateHelper.dateToFullDateTimeString(item.date)}
                                titleStyle={{fontFamily: "Verdana", fontSize: 14, fontWeight: "400", color: "black"}}
                                subtitle={item.code}
                                leftIcon={{name: this.isQRCode(item.type) ? "qrcode" : "barcode-scan", type: "material-community", color: "#41bfeb", style: {fontSize: 30}}}
                                onPress={() => this.setState({isBarcodeClicked: true, lastBarcodeData: item})}
                                rightIcon={{name: "search", type: "font-awesome", style: {fontSize: 20}}}
                            />
                        )}
                    />
                </List>
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

    _renderNoBarcodeFound() {
        return (
            <View style={{flex: 0.75, justifyContent: "center"}}>
                <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 16, color: "black"}}>
                    Barkod tarayıcıda geçmişe ait kaydınız yoktur.
                </Text>
            </View>
        )
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

    _deletePreviousBarcodesConfirmation() {
        Alert.alert(
            'Uyarı',
            'Geçmişe ait arama verileriniz silinecektir. Kabul ediyor musunuz?',
            [
                {text: 'İptal', onPress: () => this, style: 'cancel'},
                {text: 'OK', onPress: () => this._deletePreviousBarcodes()},
            ],
            { cancelable: false }
        )
    }

    async _deletePreviousBarcodes() {
        try {
            await AsyncStorage.removeItem('barcodeScanHistory')
            this.setState({barcodeScanHistory: [], lastBarcodeData: null });
        } catch (error) {
            console.log(error);
        }
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