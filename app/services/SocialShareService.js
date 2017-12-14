import {Platform} from "react-native";
import Share from "react-native-share";
import {captureRef} from "react-native-view-shot";

class SocialShareService {

    isActiveProcessExists = false;

    ssIOSDefaultOptions = {
        format: "png",
        //quality: 0.95,
        result: "tmpfile",
        snapshotContentContainer: false
    };

    ssAndroidDefaultOptions = {
        format: "png",
        //quality: 0.95,
        result: "data-uri",
        snapshotContentContainer: false
    };

    ssWithRefDefaultOptions = {
        format: "png",
        result: "base64",
        snapshotContentContainer: false
    };

    startNativeSharing(data, messageText) {
        if (this.isActiveProcessExists) {
            return;
        }

        this.isActiveProcessExists = true;

        let shareOptions = this.createSharingOptions(data, messageText);
        Share.open(shareOptions)
            .catch((err) => {

            })

        this.isActiveProcessExists = false;
    }

    startNativeSharingWithRef(screenViewRef, messageText) {
        if (this.isActiveProcessExists) {
            return;
        }
        this.isActiveProcessExists = true;

        this.takeScreenCapture(screenViewRef).then(
            uri => {
                let shareOptions = this.createSharingOptionsWithRef(uri, messageText);
                Share.open(shareOptions)
                    .catch((err) => {
                        // err && console.log(err);
                    })
            },
            error => {
                console.error("Oops, snapshot failed", error);
                this.isActiveProcessExists = false;
            }
        );

        this.isActiveProcessExists = false;

    }

    createSharingOptions(imageData, messageText) {
        const shareMessage = messageText;
        return {
            title: "Barkod Tarayıcı",
            message: shareMessage,
            url: imageData
        };
    }

    createSharingOptionsWithRef(uri, messageText) {
        const shareMessage = messageText;
        return {
            title: "Barkod Tarayıcı",
            message: shareMessage,
            url: Platform.OS == "ios" ? "file:/" + uri : uri,
        };
    }

    takeScreenCapture(viewRef) {
        let shareOptions = Platform.OS === "ios" ? this.ssIOSDefaultOptions : this.ssAndroidDefaultOptions;
        return captureRef(viewRef, shareOptions);
    }

    takeScreenCaptureInBase64(viewRef) {
        let shareOptions = this.ssWithRefDefaultOptions;
        return captureRef(viewRef, shareOptions);
    }
}

export let socialShareService = new SocialShareService();