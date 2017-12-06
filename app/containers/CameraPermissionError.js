import React, {Component} from "react";
import {Button} from "native-base";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ImageBackground
} from 'react-native';
import AppBaseContainer from "./AppBaseContainer";

class CameraPermissionError extends AppBaseContainer {

    render() {
        return (
            <ImageBackground source={require("../images/gradient-background.png")} style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text style={[styles.contentValue, styles.textWithPadding]}>
                        BARKOD TARAYICI KULLANABILMENIZ İÇİN KAMERA İZNİ GEREKMEKTEDİR.
                    </Text>
                    <Text style={[styles.contentValue, styles.textWithPadding]}>
                        Allow access to your camera to start taking photos with AVA.
                    </Text>
                </View>
            </ImageBackground>
        )
    }
}

const styles = {
    container: {
        flex: 1,
        width: null,
        height: null,
        backgroundColor: "transparent"
    },
    contentContainer: {
        alignItems: "center",
        justifyContent: 'center',
        marginRight: 50,
        marginLeft: 50,
        flex:0.5
    },
    textWithPadding: {
        paddingTop: 30,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start"
    },
    contentValue: {
        color: "white",
        fontSize: 20
    },
    headerCloseIcon: {
        alignSelf: "flex-end",
        justifyContent: "flex-start",
        marginRight: 15,
        marginTop: 15,
        flex:0.1
    },
    footerContainer: {
        flex: 0.4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraButton: {
        width: 72,
        height: 72,
        borderWidth: 6,
        borderRadius: 40,
        backgroundColor: "transparent",
        borderColor: 'white',
        marginTop: 30,
    },
    cameraButtonIcon: {
        paddingLeft: 4.5
    },
    logWeightButton: {
        alignSelf: "center",
        marginTop: 40
    }
};

export default (CameraPermissionError);