import React, {Component} from "react";
import {View, Image, Alert, Text, StatusBar, StyleSheet, TouchableOpacity, Linking, ScrollView, ImageBackground} from "react-native";
import AppBaseContainer from "../AppBaseContainer";

/* Component ==================================================================== */
class Drawer extends AppBaseContainer {

    render() {

        return (
            <View>
                <ScrollView style={{paddingLeft:50, marginTop: 20, marginBottom: 10}}>
                    <View style={{marginTop:40, backgroundColor:"transparent"}}>
                        <Text>test test</Text>
                    </View>
                </ScrollView>
            </View>)
    };
}

/* Export Component ==================================================================== */
export default (Drawer);
