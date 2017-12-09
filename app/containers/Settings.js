import React, {Component} from "react";
import {TouchableOpacity, Platform, NativeModules, View, Alert, Image, Text, Modal, Linking, AsyncStorage, Clipboard} from "react-native";
import {Icon, Button, CheckBox, Divider} from "react-native-elements";
import AppBaseContainer from "./AppBaseContainer";
import {optionsService} from "../services/OptionsService";

class Settings extends AppBaseContainer {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarHidden : true,
        screenBackgroundImageName: "background-photo"
    };

    state = {
        options: []
    }

    constructor(props){
        super(props);
        this.setStyle(this.navigatorStyle);
    }

    componentDidMount() {
        optionsService.getOptions()
            .then((result) => {
                this.setState({options: result});
            })
    }

    componentWillMount() {
        this.state.options = optionsService.getDefaultOptions();
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
                        <Text style={{marginTop: -5, textAlign: "center", fontFamily: "Verdana", fontSize: 18, fontWeight: "bold", color: "white"}}>Ayarlar</Text>
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
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>Barkod Oku</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._defaultSettingsConfirmation()} style={{height: 60, width: 80, borderColor: "black", borderWidth: 0.4, borderRadius: 8, marginRight: 10, padding: 2}}>
                        <Icon
                            name="power-settings"
                            type='material-community'
                            size={36}
                            color="#41bfeb"
                        />
                        <Text style={{textAlign: "center", fontFamily: "Verdana", fontSize: 12, color: "black"}}>Varsayılan</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <Divider style={{ backgroundColor: '#41bfeb', height: 5, opacity: 0.2}} />
                </View>

                <View style={{flex: 0.75, padding: 4, flexDirection: "column"}}>
                    <CheckBox
                        containerStyle={{width: null, borderRadius: 8}}
                        iconLeft
                        title='Panoya otomatik kopyala'
                        iconType='material-community'
                        checkedIcon='checkbox-marked-circle'
                        uncheckedIcon='checkbox-blank-circle-outline'
                        checkedColor='#41bfeb'
                        uncheckedColor='#41bfeb'
                        checked={this.state.options[0]}
                        onPress={() => this._setNewOptions(0)}
                    />
                    <CheckBox
                        containerStyle={{width: null, borderRadius: 8}}
                        iconLeft
                        title='El feneri hep açık kalsın'
                        iconType='material-community'
                        checkedIcon='checkbox-marked-circle'
                        uncheckedIcon='checkbox-blank-circle-outline'
                        checkedColor='#41bfeb'
                        uncheckedColor='#41bfeb'
                        checked={this.state.options[1]}
                        onPress={() => this._setNewOptions(1)}
                    />
                    <CheckBox
                        containerStyle={{width: null, borderRadius: 8}}
                        iconLeft
                        title='Link içeren QR kodlarını tarayıcıda otomatik aç'
                        iconType='material-community'
                        checkedIcon='checkbox-marked-circle'
                        uncheckedIcon='checkbox-blank-circle-outline'
                        checkedColor='#41bfeb'
                        uncheckedColor='#41bfeb'
                        checked={this.state.options[2]}
                        onPress={() => this._setNewOptions(2)}
                    />
                    <CheckBox
                        containerStyle={{width: null, borderRadius: 8}}
                        iconLeft
                        title='Geçmiş listesi tut'
                        iconType='material-community'
                        checkedIcon='checkbox-marked-circle'
                        uncheckedIcon='checkbox-blank-circle-outline'
                        checkedColor='#41bfeb'
                        uncheckedColor='#41bfeb'
                        checked={this.state.options[3]}
                        onPress={() => this._setNewOptions(3)}
                    />
                </View>
            </View>
        );
    }

    _setNewOptions(optionNumber){
        optionsService.setOptions(optionNumber)
            .then((result) => {
                this.setState({options: result});
            })
    }

    _defaultSettingsConfirmation() {
        Alert.alert(
            'Uyarı',
            'Varsayılan uygulama ayarlarına dönülecektir. Kabul ediyor musunuz?',
            [
                {text: 'İptal', onPress: () => this, style: 'cancel'},
                {text: 'OK', onPress: () => this._defaultSettings()},
            ],
            { cancelable: false }
        )
    }

    _defaultSettings() {
        optionsService.resetToDefaultOptions()
            .then((result) => {
                this.setState({options: result});
            })
    }
}

export default (Settings);