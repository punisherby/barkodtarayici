/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {Icon, Button} from "react-native-elements";
import AppBaseContainer from "./AppBaseContainer";
import Permissions from 'react-native-permissions';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export let rootNavigator = null;

class App extends AppBaseContainer {

    barcodeScanFirstTimeClick;

    static navigatorStyle = {
        tabBarHidden: true,
        navBarHidden : true,
        screenBackgroundImageName: "background-photo"
    };

    constructor(props){
        super(props);
        this.setStyle(this.navigatorStyle);
        rootNavigator = this.props.navigator;
    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>

        <Button full onPress={() => this._checkPermission()}><Text> Primary </Text></Button>
      </View>
    );
  }

  _checkPermission() {
      Permissions.check('camera')
          .then(response => {
              if (response === "undetermined") {
                  this.barcodeScanFirstTimeClick = true;
              } else {
                  this.barcodeScanFirstTimeClick = false;
              }
              Permissions.request('camera')
                  .then(response => {
                      if (response === "denied" || response === "restricted") {
                          if (!this.barcodeScanFirstTimeClick) {
                              this.pushToActiveScreenStack(this.getScreenMap().PermissionError.name)
                          }
                      } else {
                          this.pushToActiveScreenStack(this.getScreenMap().BarcodeScan.name)
                      }
                  });
          })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


export default (App);